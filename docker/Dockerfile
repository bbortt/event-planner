FROM openjdk:17-slim-bullseye
MAINTAINER Timon Borter <bbortt.github.io>

ENTRYPOINT ["java", "-jar", "event-planner.jar"]

EXPOSE 8080
EXPOSE 8090

RUN useradd -ms /bin/sh eventplanner && \
    apt update && \
    apt full-upgrade -y

USER eventplanner
WORKDIR /home/eventplanner

COPY build/libs/event-planner-*.jar event-planner.jar
