#!/usr/bin/env sh
#
# Apply Hasura migrations and metadata.

set -e

cd hasura
npx hasura migrate apply --database-name=default --envfile=../.env.local --skip-update-check
npx hasura metadata apply --envfile=../.env.local --skip-update-check
