FROM nginx:1.17.5-alpine
MAINTAINER Timon Borter <bbortt.github.io>

EXPOSE 80

RUN \
  mkdir /appl && mkdir /appl/nginx && \
  touch /var/run/nginx.pid && \
  chown -R nginx:nginx /var/run/nginx.pid && \
  chown -R nginx:nginx /var/cache/nginx

# Careful: Base image contains its own `/entrypoint.sh`!
# See: https://github.com/nginxinc/docker-nginx/blob/master/Dockerfile-alpine.template
ENTRYPOINT ["/appl/nginx/entrypoint.sh"]
WORKDIR /appl/nginx

COPY src/main/docker/entrypoint.sh entrypoint.sh
COPY src/main/docker/nginx-files.conf nginx-files.conf
COPY src/main/docker/nginx-logstash.conf nginx-logstash.conf
COPY src/main/docker/site.conf /etc/nginx/conf.d/default.conf
COPY build /usr/share/nginx/html
