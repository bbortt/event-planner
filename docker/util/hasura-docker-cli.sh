#!/usr/bin/env sh
#
# Docker CLI for Hasura metadata API (entrypoint). Usage: ./hasura-docker-cli [export/diff].

set -ex

command=$1
dir=$(dirname $0)
image_full_tag="compose_hasura_migration:latest"

docker build -q -t $image_full_tag $dir/../compose/migration
docker run \
    --rm \
    -e HASURA_COMMAND=$command \
    -v $dir/../../:/workspace
    -v $dir/hasura-docker-cli-entrypoint.sh:/entrypoint.sh \
    $image_full_tag
