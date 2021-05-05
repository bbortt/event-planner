#!/usr/bin/env bash
#
# Configure nginx-files.conf from template:
#   $APPL_LOGSTASH_HOST An optional Logstash host

if [[ -n $APPL_LOGSTASH_HOST ]]; then
    cat ./nginx-logstash.conf | envsubst '$APPL_LOGSTASH_HOST,$APPL_LOGSTASH_PORT' > /etc/nginx/nginx.conf
else
    cp ./nginx-files.conf /etc/nginx/nginx.conf
fi

exec /docker-entrypoint.sh
