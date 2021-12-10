# Developer Instructions

> Detailed developer instructions for Event-Planner

- [Getting Started](#getting-started)
- [Database Migrations](#database-migrations)
- [Auth0](#auth0)

## Getting Started

It's the following - pretty simple! 😉

```shell
$ docker-compose -f docker/docker-compose.yml up -d
...
$ ./gradlew flywayMigrateDev
...
$ SPRING_PROFILES_ACTIVE=dev,local ./gradlew bootRun
...
```

## Database

As seen in the sample above, you can start a local development setup using `docker-compose`. A more
advanced sample is located in the `/deployment`-folder. It is a statefulset deployment of bitnami's
PostgreSQL HA setup on kubernetes. The result is the following:

[![PostgreSQL HA](http://www.plantuml.com/plantuml/svg/VP3H2i8m34NVynN5zu7jtlsNcCOXrgMktK34VpVjwXG4-r1kSW-tQP2oJ6PEF1bC1Ya31PczeN3cCPVUn3U0KJoRNHoYI30ABsVYNN7JGa1oZJ8M_4ruZa7kLsrLI4k0Y7J1eQH8oiF4wQP96JEVvf1OmGSOFTzX6zZjQmxPFuXT4VS7SIlIGsKyPZnYAXCjxG5_jB-MRPRxjLopUdW2wF9CrntgIdHfcmQzQb7Ne5Sjz2-RT1-fiv5TQPs5N9CEg6-oXnS0)](https://github.com/bbortt/event-planner/blob/release/doc/postgresql_on_k8s.puml)

### Migrations

Migrations are done using [Flyway](https://flywaydb.org/). There are multiple Gradle commands for
developing and testing available.

| Command             | Usage                                            |
| ------------------- | ------------------------------------------------ |
| `flywayMigrateDev`  | Migrate development schema to latest.            |
| `flywayCleanTest`   | Clean the test schema. Useful for local testing. |
| `flywayMigrateTest` | Migrate test schema to latest.                   |

## Auth0

### Roles & Permissions

The `User` Role has the following Permissions:

`graphql:access`.

### Actions

**Note:** Samples for all actions are available in
the [`doc/auth0`](https://github.com/bbortt/event-planner/blob/release/doc/auth0) folder. You can
run them using `npm run [SCRIPT_NAME]`.

#### Assigning default Role

The
Action [`assign-default-role.js`](https://github.com/bbortt/event-planner/blob/release/doc/auth0/assign-default-role.js)
must be installed in your Auth0 tenant. It's a post user registration Action which will assign the
default Role and therefore Permissions (OAuth2 scopes) to new registered users.

#### Synchronize user information

Next, the
Action [`synchronize-users.js`](https://github.com/bbortt/event-planner/blob/release/doc/auth0/synchronize-users.js)
must be added post login. It will synchronize users to the application local database.

The callee machine-to-machine application must have the following Permission: `user:synchronize`.
