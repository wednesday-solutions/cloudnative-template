import Queue from 'bull';
import { SequelizeStorage, Umzug } from 'umzug';
import { MainDBInstance, SequelizeInstance } from '../db/index';
import { getTenantDBConnection } from '../db/tenancy/tenant-db-connection';

/**
 * Provisions database for tenant, any other feature we might add which are to be
 * provisioned for a newly registered tenant should go here!
 *
 * @param options - metadata about tenant
 */
export async function provisionTenantsBackend(options: GenerateTenantOptions) {
  const { name, companyName, password, tenantsAccessKey } = options;

  const tenantJob = new Queue<GenerateTenantOptions>(
    `tenant-queue:provisioning-database-for-${companyName}-ts-${Date.now()}`,
    {
      redis: {
        host: process.env.REDIS_HOST,
        password: process.env.REDIS_PASSWORD,
        port: process.env.REDIS_PORT,
      },
    },
  );
  await tenantJob.add({ name, companyName, password, tenantsAccessKey });

  void tenantJob.process(async job => {
    try {
      const mainDatabase = MainDBInstance.getInstance().connection.instance;
      const { data } = job;

      const tenantAsAdmin = new SequelizeInstance(
        data.tenantsAccessKey,
        process.env.DB_USERNAME!,
        process.env.DB_PASSWORD!,
      ).instance;

      /** **************************************************************************
       * Create Database and required initial groups
       ************************************************************************** */
      // Create a new database
      await mainDatabase.query(`CREATE DATABASE "${data.tenantsAccessKey}";`);

      // Create groups
      await tenantAsAdmin.query('CREATE ROLE viewer;');
      await tenantAsAdmin.query('CREATE ROLE editor;');
      await tenantAsAdmin.query('CREATE ROLE admin;');

      /** **************************************************************************
       * Revoke all access only allow "viewer", "editor", and "admin" (s) to connect
       ************************************************************************** */
      await tenantAsAdmin.query(
        `REVOKE ALL ON DATABASE "${data.tenantsAccessKey}" FROM public;`,
      );

      // Grant Connect Access
      await tenantAsAdmin.query(
        `GRANT CONNECT ON DATABASE "${data.tenantsAccessKey}" TO viewer;`,
      );
      await tenantAsAdmin.query(
        `GRANT CONNECT ON DATABASE "${data.tenantsAccessKey}" TO editor;`,
      );
      await tenantAsAdmin.query(
        `GRANT CONNECT ON DATABASE "${data.tenantsAccessKey}" TO admin;`,
      );

      // Assign predefined roles (PG Specific)
      await tenantAsAdmin.query(`GRANT USAGE ON SCHEMA public TO viewer;`);
      await tenantAsAdmin.query(`GRANT USAGE, CREATE ON SCHEMA public TO editor;`);
      await tenantAsAdmin.query(`GRANT USAGE, CREATE ON SCHEMA public TO admin;`);

      await tenantAsAdmin.query(`GRANT ALL ON ALL TABLES IN SCHEMA public TO viewer;`);
      await tenantAsAdmin.query(`GRANT ALL ON ALL TABLES IN SCHEMA public TO editor;`);
      await tenantAsAdmin.query(`GRANT ALL ON ALL TABLES IN SCHEMA public TO admin;`);

      await tenantAsAdmin.query(`GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO viewer;`);
      await tenantAsAdmin.query(`GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO editor;`);
      await tenantAsAdmin.query(`GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO admin;`);

      /** **************************************************************************
       * Start creating and assigning privileges to tenant specific roles
       ************************************************************************** */
      // Create a role for the tenant's admin
      await tenantAsAdmin.query(
        `CREATE ROLE "${data.name}" WITH ENCRYPTED PASSWORD '${data.password}';`,
      );

      // Provide Login permissions, this makes this a user instead of a group
      await tenantAsAdmin.query(`ALTER ROLE "${data.name}" WITH LOGIN;`);

      //  ADMIN Specific
      await tenantAsAdmin.query(`ALTER DEFAULT PRIVILEGES FOR ROLE ${data.name} IN SCHEMA public
GRANT ALL ON TABLES TO admin;`);

      await tenantAsAdmin.query(`ALTER DEFAULT PRIVILEGES FOR ROLE ${data.name} IN SCHEMA public
GRANT ALL ON SEQUENCES TO admin;`);

      // Load `uuid-ossp` into Database
      await tenantAsAdmin.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

      // Load `citext` into Database
      await tenantAsAdmin.query(`CREATE EXTENSION IF NOT EXISTS citext;`);

      // Assign groups
      await tenantAsAdmin.query(`GRANT "admin" TO "${data.name}";`);

      await tenantAsAdmin.close();
      const tenantSequelizeInstance = await getTenantDBConnection(
        data.tenantsAccessKey,
        data.name,
        data.password,
      );
      const tenantMigrator = new Umzug({
        migrations: {
          glob: ['../../migrations/tenanted/*.ts', { cwd: __dirname }],
        },
        storage: new SequelizeStorage({
          sequelize: tenantSequelizeInstance.instance,
          modelName: 'TenantMigrationsMeta',
        }),
        context: { sequelize: tenantSequelizeInstance.instance, tenantsAccessKey },
        logger: console,
      });

      await tenantMigrator.up();
    } catch (error) {
      console.error(error);
    }
  });
}

interface GenerateTenantOptions {
  /**
   * Name to be used for as admin user for this tenant
   */
  name: string;

  /**
   * Company name of this tenant
   */
  companyName: string;

  /**
   * Password of the tenant
   */
  password: Password;

  tenantsAccessKey: SensitiveString;
}
