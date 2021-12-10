#!/usr/bin/env sh
#
# This scripts executes init.sql which makes sure the uuid-ossp extension is enabled.

PGPASSWORD=$PGPOOL_POSTGRES_PASSWORD psql \
  -U $PGPOOL_POSTGRES_USERNAME \
  -d event_planner \
  -h pg-cluster.${K8S_NAMESPACE}.svc.cluster.local \
  -a \
  -f "/docker-entrypoint-initdb.d/init.sql"
