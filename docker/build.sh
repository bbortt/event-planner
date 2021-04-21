#!/usr/bin/env bash
#
# !! DEVELOPMENT / SAMPLE SCRIPT !!
# Fully build application inclusive Docker images. Invoke from within root container.

set -ex

# Buildtime Variables
export version=local

# Gradle build
./gradlew build \
    -Pprod \
    -Pversion=$version

# Docker build
docker build gateway --no-cache --build-arg JAR_FILE=gateway-$version.jar -t bbortt/event-planner-gateway:$version
docker build backend --no-cache --build-arg JAR_FILE=backend-$version.jar -t bbortt/event-planner-backend:$version
docker build services/user --no-cache --build-arg JAR_FILE=user-$version.jar -t bbortt/event-planner-services-user:$version
docker build frontend --no-cache -t bbortt/event-planner-frontend:$version
