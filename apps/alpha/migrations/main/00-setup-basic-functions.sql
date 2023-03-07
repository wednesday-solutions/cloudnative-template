-- Create a schema for extensions
CREATE SCHEMA IF NOT EXISTS extensions;

-- Expose everything in extensions schema to everyone
-- for private functions use tenants own schema
GRANT USAGE ON SCHEMA extensions TO public;
GRANT EXECUTE ON ALL functions IN SCHEMA extensions TO public;

-- Any future extensions
ALTER DEFAULT privileges IN SCHEMA extensions
  GRANT EXECUTE ON functions TO public;

ALTER DEFAULT privileges IN SCHEMA extensions
  GRANT USAGE ON types TO public;

-- Function trigger for update timestamp
CREATE OR REPLACE FUNCTION extensions.trigger_set_update_at_timestamp()
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

-- Load `uuid-ossp` into Database
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;

-- Load `citext` into Database
CREATE EXTENSION IF NOT EXISTS "citext" WITH SCHEMA extensions;

SET search_path = extensions;
