# Event Planner - Developer Instructions

Event Planner consists of a set of Microservices. Each component has its own `README.md` with
prerequisites and instructions on getting started. This document covers the overall building and
testing commands.

> For an architectural overview take a look at [the wiki](https://github.com/bbortt/event-planner/wiki/Architecture).

## Testing

Unit tests are bound to the `test` phase. Integration tests should be executed when `check` has been
invoked. The `check` phase does depend on a PostgreSQL installation running on `localhost:5432`. You
could kickstart an environment via docker-compose: `docker-compose -f docker/postgres.yml up -d`.
The init scripts are also located there.

For example
the [fullbuild](https://github.com/bbortt/event-planner/actions/workflows/gradle-fullbuild.yml)
executes the following command:

```shell
./gradlew -Pprod --no-daemon -i check jacocoTestReport sonarqube
```

## Building

We build the application into Docker images. When running `./gradlew -Pprod build` all executable
files will be created, and the frontend will be packed.
The [`docker_build.sh`](https://github.com/bbortt/event-planner/blob/canary/.circleci/docker_build.sh)
should give you an idea of how to build docker images.

### I do not have any Node.js / npm installation

No problem! Just add `-PnodeInstall` and we'll take care of that.
