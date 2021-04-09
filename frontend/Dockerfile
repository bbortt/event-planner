FROM nginx:1.17.5-alpine
MAINTAINER Timon Borter <bbortt.github.io>

EXPOSE 80

RUN touch /var/run/nginx.pid && \
  chown -R nginx:nginx /var/run/nginx.pid && \
  chown -R nginx:nginx /var/cache/nginx

COPY src/main/docker/nginx.conf /etc/nginx/nginx.conf
COPY src/main/docker/site.conf /etc/nginx/conf.d/default.conf
COPY build /usr/share/nginx/html

USER nginx
