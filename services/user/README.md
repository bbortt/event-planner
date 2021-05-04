# Event Planner - Service User

The very first microservice. Manages application users.

## JHipster Information

This application was originally created via JHipster. The building information is still available
in `DEVELOPMENT.md`.

## Prerequisites

### Keycloak

You must have a running Keycloak instance with an `internal:internal` client. The following command
can get you kickstarted in Docker: `docker-compose -f docker/keycloak.yml up -d`.

```
spring:
  security:
    oauth2:
      client:
        provider:
          oidc:
            issuer-uri: http://localhost:9080/auth/realms/jhipster
        registration:
          oidc:
            client-id: internal
            client-secret: internal
```

### PostgreSQL

You can run a fully configured PostgreSQL node in
Docker: `docker-compose -f docker/postgres.yml up -d`.

#### Development Configuration

```
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/service_user
    username: service_user_user
    password: service_user_password
```

#### Testing Configuration

```
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/service_user_integration
    username: backend_user
    password: backend_password
```

### Kafka

User information initially comes in via Kafka broker on `localhost:9092`. The REST API is (at least
at the time being) a read-only interface.

## Runtime Configuration

From
the [docker-compose](https://github.com/bbortt/event-planner/blob/canary/docker/event-planner.yml)
configuration:

```dockerfile
services:
  # Service User
  service_user:
    environment:
      APPL_JDBC_URL: jdbc:postgresql://postgres:5432/service_user
      APPL_JDBC_USERNAME: service_user_user
      APPL_JDBC_PASSWORD: service_user_password
      APPL_KAFKA_BOOTSTRAP_SERVERS: kafka:9092
      APPL_OIDC_ISSUER_URI: http://keycloak:9080/auth/realms/jhipster
      APPL_OIDC_CLIENT_ID: internal
      APPL_OIDC_CLIENT_SECRET: internal
```

### Logstash

Activate the `logstash` profile in order to send logs to Logstash (TCP). This requires the  following
environment variables to be set:
* `APPL_LOGSTASH_HOST`: The Logstash host.
* `APPL_LOGSTASH_PORT`: The Logstash port.

## License

This project is licensed under the terms of
the [Apache 2.0 License](https://github.com/bbortt/event-planner/blob/canary/LICENSE).
