# gateway

This application was generated using JHipster 7.0.0, you can find documentation and help at [https://www.jhipster.tech/documentation-archive/v7.0.0](https://www.jhipster.tech/documentation-archive/v7.0.0).

This is a "microservice" application intended to be part of a microservice architecture, please refer to the [Doing microservices with JHipster][] page of the documentation for more information.
This application is configured for Service Discovery and Configuration with . On launch, it will refuse to start if it is not able to connect to .

## Development

To start your application in the dev profile, run:

```
./gradlew :gateway
```

For further instructions on how to develop with JHipster, have a look at [Using JHipster in development][].

## Building for production

### Packaging as jar

To build the final jar and optimize the gateway application for production, run:

```
./gradlew :event-plannergateway:bootJar -Pprod
```

To ensure everything worked, run:

```
java -jar gateway/build/libs/*.jar
```

Refer to [Using JHipster in production][] for more details.

## Testing

To launch your application's tests, run:

```
./gradlew test integrationTest jacocoTestReport
```

For more information, refer to the [Running tests page][].

### Code quality

Sonar is used to analyse code quality.

You can run a Sonar analysis with using the [sonar-scanner](https://docs.sonarqube.org/display/SCAN/Analyzing+with+SonarQube+Scanner) or by using the gradle plugin.

Then, run a Sonar analysis:

```
./gradlew -Pprod clean check jacocoTestReport sonarqube
```

For more information, refer to the [Code quality page][].

## Using Docker to simplify development (optional)

You can use Docker to improve your JHipster development experience. A number of docker-compose configuration are available in the [src/main/docker](src/main/docker) folder to launch required third party services.

For example, to start a postgresql database in a docker container, run:

```
docker-compose -f docker/postgresql.yml up -d
```

To stop it and remove the container, run:

```
docker-compose -f docker/postgresql.yml down
```

For more information refer to [Using Docker and Docker-Compose][], this page also contains information on the docker-compose sub-generator (`jhipster docker-compose`), which is able to generate docker configurations for one or several JHipster applications.

## Continuous Integration (optional)

To configure CI for your project, run the ci-cd sub-generator (`jhipster ci-cd`), this will let you generate configuration files for a number of Continuous Integration systems. Consult the [Setting up Continuous Integration][] page for more information.

[jhipster homepage and latest documentation]: https://www.jhipster.tech
[jhipster 7.0.0 archive]: https://www.jhipster.tech/documentation-archive/v7.0.0
[doing microservices with jhipster]: https://www.jhipster.tech/documentation-archive/v7.0.0/microservices-architecture/
[using jhipster in development]: https://www.jhipster.tech/documentation-archive/v7.0.0/development/
[using docker and docker-compose]: https://www.jhipster.tech/documentation-archive/v7.0.0/docker-compose
[using jhipster in production]: https://www.jhipster.tech/documentation-archive/v7.0.0/production/
[running tests page]: https://www.jhipster.tech/documentation-archive/v7.0.0/running-tests/
[code quality page]: https://www.jhipster.tech/documentation-archive/v7.0.0/code-quality/
[setting up continuous integration]: https://www.jhipster.tech/documentation-archive/v7.0.0/setting-up-ci/
