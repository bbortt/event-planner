FROM openjdk:17-slim-bullseye

LABEL author="Timon Borter <bbortt.github.io>"

ARG JAR_FILE

ENTRYPOINT ["java", "-jar", "project-service.jar"]

EXPOSE 8080
EXPOSE 8090

RUN useradd -ms /bin/sh eventplanner && \
    apt update && \
    apt full-upgrade -y

USER eventplanner
WORKDIR /home/eventplanner

COPY JAR_FILE project-service.jar
