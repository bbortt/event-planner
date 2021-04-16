#!/usr/bin/env bash
# Licensed under the terms of the Apache 2.0 License:
# https://github.com/bbortt/event-planner/blob/canary/LICENSE
#
# Publish Docker Hub images.
# Usage: `./docker_publish.sh <version>`

set -ex

docker push bbortt/event-planner-gateway:$1 &
docker push bbortt/event-planner-backend:$1 &
docker push bbortt/event-planner-services-user:$1 &
docker push bbortt/event-planner-frontend:$1
