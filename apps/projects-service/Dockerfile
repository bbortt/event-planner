FROM openjdk:17-slim-bullseye
MAINTAINER Timon Borter <bbortt.github.io>

ENTRYPOINT ["java", "-jar", "project-service.jar"]

EXPOSE 8080

RUN useradd -ms /bin/sh eventplanner && \
    apt update && \
    apt full-upgrade -y

USER eventplanner
WORKDIR /home/eventplanner

COPY build/libs/project-service-*.jar project-service.jar
