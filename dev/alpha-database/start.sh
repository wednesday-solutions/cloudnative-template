#!/usr/bin/env bash
set -Eeuxo pipefail # https://vaneyckt.io/posts/safer_bash_scripts_with_set_euxo_pipefail/
cd -P -- "$(dirname -- "${BASH_SOURCE[0]}")" # https://stackoverflow.com/a/17744637

docker compose -p integration-tests-fastify-postgres down --remove-orphans
docker compose -p integration-tests-fastify-postgres up -d

for _ in {1..50}
do
  state=$(docker inspect -f '{{ .State.Health.Status }}' 'integration-tests-fastify-postgres' 2>&1)
  return_code=$?
  if [ ${return_code} -eq 0 ] && [ "$state" == "healthy" ]; then
    echo "integration-tests-fastify-postgres is healthy!"
    break
  fi
  sleep 0.4
done

ts-node ../check-connection.ts
ts-node ../../apps/alpha/migrate-to-latest.ts
