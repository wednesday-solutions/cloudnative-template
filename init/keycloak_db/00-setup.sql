--  init/db/00-setup.sql
--  Creating user and database for Keycloak
CREATE USER keycloak WITH PASSWORD 'password';
CREATE DATABASE keycloak_db;
GRANT ALL PRIVILEGES ON DATABASE keycloak_db TO keycloak;
