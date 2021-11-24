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

## Database Migrations

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
