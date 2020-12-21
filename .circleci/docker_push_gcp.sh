#!/usr/bin/env bash
# Licensed under the terms of the Apache 2.0 License:
# https://github.com/bbortt/event-planner/blob/canary/LICENSE
#
# Push prebuilt Docker image to grc.io.
# Usage: `./docker_push_gcr.sh <image-name>`

gcloud auth configure-docker --quiet
docker push $1
