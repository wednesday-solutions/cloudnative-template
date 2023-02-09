import type { TenantMigration } from '../../migrate';

export const up: TenantMigration = async ({ context }) => {
  const { sequelize, tenantAccessKey } = context;

  await sequelize.query(`
    SET search_path = ${tenantAccessKey}, extensions;
  `.trim());

  // Function trigger for update timestamp
  await sequelize.query(`
    CREATE OR REPLACE FUNCTION trigger_set_update_at_timestamp()
    RETURNS TRIGGER AS $trigger_set_update_at_timestamp$
      BEGIN
        IF row(NEW.*) IS DISTINCT FROM row(OLD.*) THEN
          NEW.updated_at = now();
          RETURN NEW;
        ELSE
          RETURN OLD;
        END IF;
      END;
    $trigger_set_update_at_timestamp$ LANGUAGE plpgsql;
  `.trim());

  // Load `uuid-ossp` into Database
  await sequelize.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

  // Load `citext` into Database
  await sequelize.query(`CREATE EXTENSION IF NOT EXISTS citext;`);
};

export const down: TenantMigration = async ({ context }) => {
  const { sequelize } = context;

  await sequelize.query(`DROP FUNCTION IF EXISTS trigger_set_update_at_timestamp;`);
};