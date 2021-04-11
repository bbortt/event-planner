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

# Gateway Docker image
cd gateway && \
docker build . --no-cache --build-arg JAR_FILE=gateway-$version.jar -t ep_gateway:$version && \
 cd ..

# Backend Docker image
cd backend && \
 docker build . --no-cache --build-arg JAR_FILE=backend-$version.jar -t ep_backend:$version && \
 cd ..

# Service User Docker image
cd services/users && \
 docker build . --no-cache --build-arg JAR_FILE=user-$version.jar -t ep_service_user:$version && \
 cd ../..

# Frontend Docker image
cd frontend && \
 docker build . --no-cache -t ep_frontend:$version && \
 cd ..
