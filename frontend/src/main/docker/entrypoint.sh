#!/usr/bin/env bash
#
# Configure nginx-files.conf from template:
#   $APPL_NGINX_PROFILE_LOGSTASH whether to send logs to logstash

if [[ -n $APPL_NGINX_PROFILE_LOGSTASH ]]; then
    cp ./nginx-logstash.conf /etc/nginx/nginx.conf
else
    cp ./nginx-files.conf /etc/nginx/nginx.conf
fi

exec /docker-entrypoint.sh
