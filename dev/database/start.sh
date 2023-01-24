#!/usr/bin/env bash
set -Eeuxo pipefall # https://vaneyckt.io/posts/safer_bash_scripts_with_set_euxo_pipefail/
cd -P -- "$(dirname -- "${BASH_SOURCE[0]}")" # https://stackoverflow.com/a/17744637

docker compose -p integration-tests-fastify-postgres down --remove-orphans
docker compose -p integration-tests-fastify-postgres up -d

../wait-until-healthy.sh integration-tests-fastify-postgres

ts-node ../check-connection.ts

docker exec integration-tests-fastify-postgres \
  bash -c "export PGPASSWORD=fastify_postgres_template && psql -h 0.0.0.0 -p 5432 -U fastify_postgres_template fastify_postgres_template -c 'CREATE EXTENSION IF NOT EXISTS btree_gist; CREATE EXTENSION IF NOT EXISTS hstore; CREATE EXTENSION IF NOT EXISTS citext;'"
