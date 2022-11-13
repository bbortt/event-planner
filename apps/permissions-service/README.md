# Permissions Service

## PostgreSQL

> **Note:** All Microservices use a single database instance (called `event_planner`). They are separated by schemas!

The following lines will get you started (execute them from within the `project.rootDirectory`):

```shell
pod_id=$(
  [docker/podman] run \
      -p 5432:5432 -d \
      --name event_planner \
      -e POSTGRES_DB=event_planner \
      -e POSTGRES_USER=event_planner \
      -e POSTGRES_PASSWORD=event_planner_password \
      postgres:14.6-alpine
)
cat apps/permissions-service/src/test/resources/db/scripts/init-permissions_service.sql | \
  docker exec -i $pod_id psql -U event_planner -f - event_planner
./gradlew :apps:permissions-service:flywayMigrateDev
```

This project uses Quarkus, the Supersonic Subatomic Java Framework.
If you want to learn more about Quarkus, please visit its website: https://quarkus.io/ .

## Running the application in dev mode

You can run your application in dev mode that enables live coding using:

```shell script
./gradlew quarkusDev
```

> **_NOTE:_** Quarkus now ships with a Dev UI, which is available in dev mode only at http://localhost:8080/q/dev/.

## Packaging and running the application

The application can be packaged using:

```shell script
./gradlew build
```

It produces the `quarkus-run.jar` file in the `build/quarkus-app/` directory.
Be aware that it’s not an _über-jar_ as the dependencies are copied into the `build/quarkus-app/lib/` directory.

The application is now runnable using `java -jar build/quarkus-app/quarkus-run.jar`.

## Creating a native executable

You can create a native executable using:

```shell script
./gradlew build -Dquarkus.package.type=native
```

Or, if you don't have GraalVM installed, you can run the native executable build in a container using:

```shell script
./gradlew build -Dquarkus.package.type=native -Dquarkus.native.container-build=true
```

You can then execute your native executable with: `./build/permissions-service-0.1.1-runner`

If you want to learn more about building native executables, please consult https://quarkus.io/guides/gradle-tooling.
