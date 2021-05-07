#!/usr/bin/env sh
#
# Configure nginx-files.conf from template:
#   $APPL_LOGSTASH_HOST  An optional Logstash host
#   $APPL_LOGSTASH_PORT  An optional Logstash port

if [ -n "$APPL_LOGSTASH_HOST" ]; then
    cat ./nginx-logstash.conf | envsubst '$APPL_LOGSTASH_HOST,$APPL_LOGSTASH_PORT' > /etc/nginx/nginx.conf
else
    cp ./nginx-files.conf /etc/nginx/nginx.conf
fi

exec /docker-entrypoint.sh nginx -g "daemon off;"
