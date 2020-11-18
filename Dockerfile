FROM openjdk:11-slim
MAINTAINER Timon Borter <bbortt.github.io>

ENTRYPOINT ["java", "-jar", "event-planner.jar"]

RUN useradd -ms /bin/bash eventplanner

EXPOSE 8080

USER eventplanner
WORKDIR /home/eventplanner

ARG JAR_FILE
COPY build/libs/${JAR_FILE} ./event-planner.jar
