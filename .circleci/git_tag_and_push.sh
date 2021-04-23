#!/usr/bin/env bash
# Licensed under the terms of the Apache 2.0 License:
# https://github.com/bbortt/event-planner/blob/canary/LICENSE
#
# Tag and push image from Circle CI build.
#
# Usage: `./tag_and_push <build-number>`
#
# Requires the following environment variables:
#   $GITHUB_TOKEN    The GitHub authentication token.

git config --local user.name "Circle CI"
git config --local user.email "builds@circle-ci.com"

export CIRCLE_TAG=circle_$1
git tag $CIRCLE_TAG
git push --quiet https://$GITHUB_TOKEN@github.com/bbortt/event-planner.git $CIRCLE_TAG
