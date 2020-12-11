#!/usr/bin/env bash
# Licensed under the terms of the Apache 2.0 License:
# https://github.com/bbortt/event-planner/blob/canary/LICENSE
#
# Install and configure Google Cloud SDK if not present in `$ ~/`.
# The configuration is based on the git branch and the corresponding gae.tar.
#
# Usage: `./install_gcloud_sdk <environment>`
#
# Requires the following environment variables:
#   $GAE_TAR_KEY    The key to decrypt the gae.tar.
#   $GAE_TAR_SALT   The salt to decrypt the gae.tar.
#   $GAE_PROJECT_ID The GAE project id.

openssl enc -aes-256-cbc -d -base64 -k $GAE_TAR_KEY -S $GAE_TAR_SALT -iv "D142327B0FF7E582D5658EB38EDB3234" -iter 10000 -in gae-$1.tar.enc -out gae.tar
tar xvf gae.tar

if [ ! -d ~/google-cloud-sdk ]; then
 curl https://sdk.cloud.google.com | bash;
fi

gcloud auth activate-service-account --key-file circle-ci-service-account.key.json
gcloud config set project $GAE_PROJECT_ID
