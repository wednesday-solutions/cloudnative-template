-- Tenants table is responsible for maintaining tenants in the database
CREATE TABLE IF NOT EXISTS "main"."tenants" (
  id serial PRIMARY KEY,
  public_uuid uuid DEFAULT uuid_generate_v4(),
  tenant_access_key VARCHAR(32) UNIQUE NOT NULL CHECK (tenant_access_key <> ''),
  name VARCHAR NOT NULL CHECK (name <> ''),
  email CITEXT UNIQUE NOT NULL CHECK (email <> ''),
  company_name VARCHAR NOT NULL CHECK (company_name <> ''),
  password VARCHAR NOT NULL CHECK (password <> ''),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz
);

CREATE INDEX tenants_publid_idx ON "main"."tenants" (public_uuid);

-- Setup RLS for Tenants
ALTER TABLE "main"."tenants" ENABLE ROW LEVEL SECURITY;

-- Policies for Tenant
CREATE POLICY  tenant_isolation_policy ON "main"."tenants"
USING (id::TEXT = current_user);

-- Comments on tables
-- You can fetch these by doing the following
-- ```sql
-- SELECT obj_description('public.table_name'::regclass)
-- FROM pg_class
-- WHERE relkind = 'r';
-- ```
-- Or use `\dt+` in `psql` cli
COMMENT ON TABLE "main"."tenants" IS 'The table `tenants` will maintain all the tenants in the system. `users` table will reference we will follow a denormalized approach so as to decrease the usage of `tenant.id`.';

-- In case of any update made to the row update the `updated_at` timestamp
CREATE TRIGGER set_updated_at BEFORE UPDATE ON "main"."tenants"
  FOR EACH ROW EXECUTE PROCEDURE trigger_set_update_at_timestamp();
