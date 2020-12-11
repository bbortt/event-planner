FROM openjdk:11-slim
MAINTAINER Timon Borter <bbortt.github.io>

ENTRYPOINT ["./entrypoint.sh", "event-planner.jar"]

RUN useradd -ms /bin/bash eventplanner && \
    echo "deb [trusted=yes] https://apt.secrethub.io stable main" > /etc/apt/sources.list.d/secrethub.sources.list && \
    apt-get update && \
    apt-get install -y gettext-base secrethub-cli

EXPOSE 8080

USER eventplanner
WORKDIR /home/eventplanner

COPY src/main/docker/secrets.env.tpl secrets.env.tpl
COPY src/main/docker/entrypoint.sh entrypoint.sh

ARG JAR_FILE
COPY build/libs/${JAR_FILE} event-planner.jar
