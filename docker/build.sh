#!/usr/bin/env bash
#
# !! DEVELOPMENT / SAMPLE SCRIPT !!
# Fully build application inclusive Docker images. Invoke from within root container.

set -ex

version=local

# Gradle build
./gradlew clean build -Pprod -Pversion=$version

# Gateway Docker image
cd gateway && \
docker build . --build-arg JAR_FILE=gateway-$version.jar -t event-planner_gateway:$version && \
 cd ..

# Backend Docker image
cd backend && \
 docker build . --build-arg JAR_FILE=backend-$version.jar -t event-planner_backend:$version && \
 cd ..

# Service User Docker image
cd services/users && \
 docker build . --build-arg JAR_FILE=user-$version.jar -t event-planner-service_user:$version && \
 cd ../..

# Frontend Docker image
cd frontend && \
 docker build . -t event-planner_frontend:$version && \
 cd ..
