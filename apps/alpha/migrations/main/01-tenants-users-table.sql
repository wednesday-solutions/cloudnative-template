-- Tenants table is responsible for maintaining tenants in the database
CREATE TABLE IF NOT EXISTS "tenants" (
  id serial PRIMARY KEY,
  public_uuid uuid DEFAULT uuid_generate_v4(),
  tenant_access_key VARCHAR(32) UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  email CITEXT UNIQUE NOT NULL,
  company_name CITEXT NOT NULL,
  password VARCHAR NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz,

  -- Check constraints
  CONSTRAINT valid_tenant_access_key CHECK (LENGTH(tenant_access_key) = 32),
  CONSTRAINT name_not_empty CHECK (name <> ''),
  CONSTRAINT email_not_empty CHECK (email <> ''),
  CONSTRAINT company_name_not_empty CHECK (company_name <> ''),
  CONSTRAINT password_not_empty CHECK (password <> '')
);

-- Setup indexes
CREATE INDEX tenants_public_uuid_idx ON "tenants" (public_uuid);
CREATE INDEX tenant_access_key_idx ON "tenants" (tenant_access_key);

-- Setup RLS for Tenants
ALTER TABLE "tenants" ENABLE ROW LEVEL SECURITY;

-- Policies for Tenant
CREATE POLICY  tenant_isolation_policy ON "tenants"
USING (id::TEXT = current_user);

-- Comments on tables
-- You can fetch these by doing the following
-- ```sql
-- SELECT obj_description('public.table_name'::regclass)
-- FROM pg_class
-- WHERE relkind = 'r';
-- ```
-- Or use `\dt+` in `psql` cli
COMMENT ON TABLE "tenants" IS 'The table `tenants` will maintain all the tenants in the system. `users` table will reference we will follow a denormalized approach so as to decrease the usage of `tenant.id`.';

-- In case of any update made to the row update the `updated_at` timestamp
CREATE TRIGGER set_updated_at BEFORE UPDATE ON "tenants"
  FOR EACH ROW EXECUTE PROCEDURE trigger_set_update_at_timestamp();
