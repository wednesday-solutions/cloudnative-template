import type { TenantMigration } from '../../migrate';

export const up: TenantMigration = async ({ context }) => {
  const { sequelize } = context;

  // Create users table for the provided tenant
  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS "users" (
      id SERIAL PRIMARY KEY,
      public_uuid uuid DEFAULT uuid_generate_v4(),
      name VARCHAR NOT NULL CHECK (name <> ''),
      email CITEXT UNIQUE NOT NULL CHECK (email <> ''),
      password VARCHAR NOT NULL CHECK (password <> ''),
      belongs_to_tenant INTEGER NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz
    );
  `.trim());

  // Create an index on public uuid of the user for faster searches
  await sequelize.query(`
    CREATE INDEX users_public_uuid_idx ON "users" (public_uuid);
  `.trim());

  await sequelize.query(`
    COMMENT ON TABLE "users" IS 'The table users will maintain all the users and will be in a tenants schema.';
  `.trim());

  // Trigger for updated_at will automatically update the timestamp when needed
  await sequelize.query(`
    CREATE TRIGGER set_updated_at BEFORE UPDATE ON "users"
FOR EACH ROW EXECUTE PROCEDURE trigger_set_update_at_timestamp();
  `.trim());
};

export const down: TenantMigration = async ({ context }) => {
  const { sequelize } = context;

  await sequelize.query(`DROP TABLE IF EXISTS "users";`);
};
