#!/usr/bin/env bash
# Licensed under the terms of the Apache 2.0 License:
# https://github.com/bbortt/event-planner/blob/canary/LICENSE
#
# Docker image entrypoint. Prepares environment secrets and launches the application.
# Usage: `./entrypoint <executable-jar>`
#
# Requires the following environment variables:
#   $APPL_ENV    The execution environment.

envsubst < secrets.env.tpl > secrets.$APPL_ENV.tpl
secrethub run --template secrets.$APPL_ENV.tpl -- \
    java -jar $1
