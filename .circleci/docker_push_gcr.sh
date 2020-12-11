#!/usr/bin/env bash
# Licensed under the terms of the Apache 2.0 License:
# https://github.com/bbortt/event-planner/blob/canary/LICENSE
#
# Push built Docker image to grc.io.
# Usage: `./docker_push_gcr.sh <docker-tag>`
#
# Requires the following environment variables:
#   $GAE_PROJECT_ID The GAE project id.

gcloud auth configure-docker --quiet
docker push gcr.io/$GAE_PROJECT_ID/event-planner:$1
