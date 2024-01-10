FROM redis:7.0.15-alpine

RUN apt update && \
    apt install \
      --no-install-recommends -y \
      dnsutils

COPY redis/connectRedisCluster.sh /usr/local/bin/connectRedisCluster

RUN chmod 755 /usr/local/bin/connectRedisCluster

ENTRYPOINT ["connectRedisCluster"]
