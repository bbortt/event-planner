#!/usr/bin/env sh
#
# User Hasura metadata API (entrypoint). Requires $HASURA_COMMAND env var.

cd workspace/hasura || exit
npx hasura metadata $HASURA_COMMAND --envfile=../.env.local --skip-update-check
