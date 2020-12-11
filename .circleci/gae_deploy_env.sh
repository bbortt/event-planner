#!/usr/bin/env bash
# Licensed under the terms of the Apache 2.0 License:
# https://github.com/bbortt/event-planner/blob/canary/LICENSE
#
# Deploy event-planner go Google App Engine. Environment based (`canary` or `release`).
# Usage: `./gae_deploy_env.sh <environment> <build-number>`
#
# Requires the following environment variables:
#   $GAE_PROJECT_ID The GAE project id.

gcloud app deploy app-$1.yml --version=$2 --image-url=gcr.io/$GAE_PROJECT_ID/event-planner:$2 --quiet
