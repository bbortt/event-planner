#!/usr/bin/env bash
# Licensed under the terms of the Apache 2.0 License:
# https://github.com/bbortt/event-planner/blob/canary/LICENSE
#
# Build Docker Hub images.
# Usage: `./docker_build.sh <version>`

set -ex

docker build gateway --no-cache --build-arg JAR_FILE=gateway-$1.jar -t bbortt/event-planner-gateway:$1 &
docker build backend --no-cache --build-arg JAR_FILE=backend-$1.jar -t bbortt/event-planner-backend:$1 &
docker build services/user --no-cache --build-arg JAR_FILE=user-$1.jar -t bbortt/event-planner-services-user:$1 &
docker build frontend --no-cache -t bbortt/event-planner-frontend:$1
