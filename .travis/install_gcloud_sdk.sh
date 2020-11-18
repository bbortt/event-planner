#!/usr/bin/env bash
# Licensed under the terms of the Apache 2.0 License:
# https://github.com/bbortt/event-planner/blob/canary/LICENSE
#
# Install Google Cloud SDK if not present in $HOME. $HOME is set to /home/travis on Linux,
# /Users/travis on MacOS, and /c/Users/travis on Windows.
# For more information visit: https://docs.travis-ci.com/user/environment-variables/

if [ ! -d ${HOME}/google-cloud-sdk ]; then
 curl https://sdk.cloud.google.com | bash;
fi
