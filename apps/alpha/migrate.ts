import fs from 'node:fs';
import path from 'node:path';
import { Sequelize, QueryTypes } from 'sequelize';
import { Umzug, SequelizeStorage } from 'umzug';

/**
 * An enum of migration types we support
 *
 * @property 'MAIN:SETUP'
 * @property 'MAIN:UP'
 * @property 'MAIN:DOWN'
 * @property 'MAIN:PURGE'
 * @property 'TENANT:UP'
 * @property 'TENANT:DOWN'
 * @property 'TENANT:PURGE'
 * @property 'SEED:UP'
 * @property 'SEED:DOWN'
 */
export enum MigrationTypes {
  'MAIN:SETUP' = 'MAIN:SETUP',
  'MAIN:UP' = 'MAIN:UP',
  'MAIN:DOWN' = 'MAIN:DOWN',
  'MAIN:PURGE' = 'MAIN:PURGE',
  'TENANT:UP' = 'TENANT:UP',
  'TENANT:DOWN' = 'TENANT:DOWN',
  'TENANT:PURGE' = 'TENANT:PURGE',
  'SEED:UP' = 'SEED:UP',
  'SEED:DOWN' = 'SEED:DOWN',
}

const command = process.argv[2];
const tenantAccessKey = process.argv[3] ?? undefined;

const sequelize = getMainDBInstance();

/**
 * Migrator will be used to look for `migrations` dir and run them one by one.
 * Will use the `SequelizeMeta` table to track the migrations.
 */
const mainMigrator = new Umzug({
  migrations: {
    glob: ['./migrations/main/*.sql', { cwd: __dirname }],
    resolve(params) {
      const downPath = path.join(
        path.dirname(params.path!),
        'down',
        path.basename(params.path!),
      );

      return {
        name: params.name,
        path: params.path,
        up: async () => params.context.query(fs.readFileSync(params.path!).toString()),
        down: async () => params.context.query(fs.readFileSync(downPath).toString()),
      };
    },
  },
  storage: new SequelizeStorage({ sequelize, modelName: 'SequelizeMeta', schema: 'public' }),
  context: sequelize,
  logger: console,
});

/**
 * Migrator will be used to look for `migrations` dir and run them one by one.
 * Will use the `SequelizeMeta` table to track the migrations.
 */
const tenantMigrator = new Umzug({
  migrations: {
    glob: ['./migrations/tenanted/*.ts', { cwd: __dirname }],
  },
  storage: new SequelizeStorage({ sequelize, modelName: 'TenantMigrationsMeta', schema: tenantAccessKey }),
  context: { sequelize, tenantAccessKey },
  logger: console,
});

/**
 * Seeder will be used to look for `seeders` dir and run them one by one.
 * Will use the `SeedersMeta` table to track the seeders.
 */
const seeder = new Umzug({
  migrations: {
    glob: ['./seeders/*.ts', { cwd: __dirname }],
  },
  storage: new SequelizeStorage({ sequelize, modelName: 'SeedersMeta' }),
  context: sequelize,
  logger: console,
});

/**
 * Check and verifies integrity of the tenant with two steps:
 * - Check if a tenantAccessKey was provided
 * - If provided verify if such tenantAccessKey exists in the DB and is associated with a tenant
 */
async function checkTenant() {
  if (!tenantAccessKey) {
    throw new Error(`An argument for 'tenantAccessKey' was expected but received ${tenantAccessKey}, did you forgot to pass an tenantAccessKey?
    Following is how to use tenantMigrator:
    Example: pnpm migrate:main:up tenantAccessKey`);
  }

  // Verify with database
  const result = await sequelize.query(`
    SELECT
      "id",
      "tenant_access_key" AS "tenantAccessKey",
      "name",
      "company_name" AS "companyName"
    FROM "main"."tenants"
    WHERE "main"."tenants"."tenant_access_key" = '${tenantAccessKey}';
  `.trim(), { type: QueryTypes.SELECT });

  if (result.length === 0) {
    throw new Error(`The tenant with tenant access key ${tenantAccessKey} was not found!`);
  }
}

export type Seeder = typeof seeder._types.migration;
export type TenantMigration = typeof tenantMigrator._types.migration;
export type MenantMigration = typeof mainMigrator._types.migration;

/**
 * The main entry point handles migrations for both tenant and main table,
 * also is utilized for seeding.
 */
async function migrate() {
  /**
   * Main table ops, deals with the main table that maintains all the
   * tenants that we have.
   */
  if (command === MigrationTypes['MAIN:SETUP']) {
    await createMainDatabase();
  }

  if (command === MigrationTypes['MAIN:UP']) {
    await mainMigrator.up();
  }

  if (command === MigrationTypes['MAIN:DOWN']) {
    await mainMigrator.down();
  }

  if (command === MigrationTypes['MAIN:PURGE']) {
    await mainMigrator.down({ to: 0 });
  }

  /**
   * Tenant ops, deals with tenant migrations, we could have several tenants
   * therefore a tenant id is expected.
   */
  if (command === MigrationTypes['TENANT:UP']) {
    await checkTenant();
    await tenantMigrator.up();
  }

  if (command === MigrationTypes['TENANT:DOWN']) {
    await checkTenant();
    await tenantMigrator.down();
  }

  if (command === MigrationTypes['TENANT:PURGE']) {
    await checkTenant();
    await tenantMigrator.down({ to: 0 });
  }
}

void migrate().then(() => {
  console.info(
    `Successfully ${command.startsWith('seed') ? 'seeded' : 'migrated'}!`,
  );
}).catch(error => {
  if (typeof error?.original?.message === 'string' && error.original.message.includes('database "main" does not exist')) {
    throw new Error('Database \'main\' does not exist in your DB instance! Did you forget to run setup script?');
  }

  throw error;
});

/**
 * Creates a database called `main` for storing metadata for tenants
 *
 * @returns zero is successfull
 */
async function createMainDatabase() {
  console.info(`This will connect to database 'template1' and create a new database called which is utilized for metadata.
Do note that the database 'template1' only exists in 'Postgres' therefore this is not compatible with any other DBMS, except PG.\n`);

  const instance = new Sequelize({
    dialect: 'postgres',
    database: 'template1',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    password: process.env.DB_PASSWORD,
    username: process.env.DB_USERNAME,
  });

  await instance.query('CREATE DATABASE "main";');
  await instance.close();

  console.info(`\nSeems like there were no errors however we still recommend that you should check your database if a new database called 'main' was created!
You can also test this by doing 'MIGRATE:MAIN:UP' if it fails it probably means that there was not main db!\n`);

  return 0;
}

/**
 * Get a sequelize instance connected to main DB don't use this
 * inside the application everything defined here should be used only
 * in the migrators!
 *
 * @returns sequelize instance connected to `main` database
 */
function getMainDBInstance() {
  if (!process.env.DB_DATABASE) {
    throw new Error(`Expected 'DB_DATABASE' to be defined but got ${process.env.DB_DATABASE}`);
  }

  if (!process.env.DB_HOST) {
    throw new Error(`Expected 'DB_HOST' to be defined but got ${process.env.DB_HOST}`);
  }

  if (!process.env.DB_PASSWORD) {
    throw new Error(`Expected 'DB_PASSWORD' to be defined but got ${process.env.DB_PASSWORD}`);
  }

  if (!process.env.DB_USERNAME) {
    throw new Error(`Expected 'DB_USERNAME' to be defined but got ${process.env.DB_USERNAME}`);
  }

  if (!process.env.DB_PORT) {
    throw new Error(`Expected 'DB_PORT' to be defined but got ${process.env.DB_PORT}`);
  }

  return new Sequelize({
    dialect: 'postgres',
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    password: process.env.DB_PASSWORD,
    username: process.env.DB_USERNAME,
  });
}
