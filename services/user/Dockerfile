FROM adoptopenjdk:15-jre-hotspot
MAINTAINER Timon Borter <bbortt.github.io>

ENTRYPOINT ["java", "-jar", "user-service.jar"]

RUN useradd -ms /bin/bash eventplanner && \
    echo "deb [trusted=yes] https://apt.secrethub.io stable main" > /etc/apt/sources.list.d/secrethub.sources.list && \
    apt-get update && \
    apt-get install -y gettext-base secrethub-cli

EXPOSE 8080
EXPOSE 8090

USER eventplanner
WORKDIR /home/eventplanner

ARG JAR_FILE
COPY build/libs/${JAR_FILE} user-service.jar
