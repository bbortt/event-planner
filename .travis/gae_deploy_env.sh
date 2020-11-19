#!/usr/bin/env bash
# Licensed under the terms of the Apache 2.0 License:
# https://github.com/bbortt/event-planner/blob/canary/LICENSE
#
# Deploy event-planner go Google App Engine. Environment based (`canary` or `release`).
# Usage: `./gae_deploy_env.sh <environment> <project-name> <docker-tag>`

gcloud config set project $2
gcloud app deploy app-$1.yml --version=$3 --image-url=gcr.io/$2/event-planner:$3
