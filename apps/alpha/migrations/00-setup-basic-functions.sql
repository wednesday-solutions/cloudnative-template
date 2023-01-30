-- Function trigger for update timestamp
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

-- Load `uuid-ossp` into Database
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Load `citext` into Database
CREATE EXTENTION IF NOT EXISTS citext;

-- Create a default schema to use for tenants
CREATE SCHEMA main;
