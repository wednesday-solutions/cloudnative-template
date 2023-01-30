-- Tenants table is responsible for maintaining tenants in the database
CREATE TABLE IF NOT EXISTS main.tenants (
  id serial PRIMARY KEY,
  public_uuid uuid DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  email CITEXT UNIQUE NOT NULL,
  company_name VARCHAR NOT NULL,
  password VARCHAR NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz
);

CREATE INDEX tenants_public_uuid_idx ON main.tenants (public_uuid);

-- Users table is responsible for maintaining all the users in table and assigning them their tenants
CREATE TABLE IF NOT EXISTS main.users (
  id serial PRIMARY KEY,
  public_uuid uuid DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  email CITEXT UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  belongs_to_tenant serial NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz,

  CONSTRAINT users_belongs_to_tenant_fk FOREIGN KEY (belongs_to_tenant) REFERENCES main.tenants (id)
);

CREATE INDEX users_public_uuid_idx ON main.users (public_uuid);
CREATE INDEX users_belongs_to_tenant_idx ON main.users (belongs_to_tenant);

-- Comments on tables
-- You can fetch these by doing the following
-- ```sql
-- SELECT obj_description('public.table_name'::regclass)
-- FROM pg_class
-- WHERE relkind = 'r';
-- ```
-- Or use `\dt+` in `psql` cli
COMMENT ON TABLE main.tenants IS 'The table `tenants` will maintain all the tenants in the system. `users` table will reference we will follow a denormalized approach so as to decrease the usage of `tenant.id`.';
COMMENT ON TABLE main.users IS 'The table `users` will maintain all the users and link them to their belonging tenant.';

-- In case of any update made to the row update the `updated_at` timestamp
CREATE TRIGGER set_updated_at BEFORE UPDATE ON main.tenants
  FOR EACH ROW EXECUTE PROCEDURE trigger_set_update_at_timestamp();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON main.users
  FOR EACH ROW EXECUTE PROCEDURE trigger_set_update_at_timestamp();
