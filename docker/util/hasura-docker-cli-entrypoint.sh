#!/usr/bin/env sh
#
# User Hasura metadata API (entrypoint). Requires $HASURA_COMMAND env var.

set -e

cd hasura
npx hasura metadata $HASURA_COMMAND --envfile=../.env.local --skip-update-check
