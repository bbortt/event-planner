#!/usr/bin/env bash
# Licensed under the terms of the Apache 2.0 License:
# https://github.com/bbortt/event-planner/blob/canary/LICENSE
#
# Publish and deploy event-planner. Environment based (`canary` or `release`).
# Usage: `./deploy_env.sh <environment> <project-name> <docker-tag>`

./docker_push_gcr.sh $2 $3
./gae_deploy_env.sh $1 $2 $3
