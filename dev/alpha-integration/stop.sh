#!/usr/bin/env bash
set -Eeuxo pipefail # https://vaneyckt.io/posts/safer_bash_scripts_with_set_euxo_pipefail/
cd -P -- "$(dirname -- "${BASH_SOURCE[0]}")" # https://stackoverflow.com/a/17744637

docker compose -f ./docker-compose.yml down --remove-orphans -v

echo "Local latest supported Postgres instance with postgis stopped (if it was running)."
