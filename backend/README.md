# Event Planner - Backend

This is the original Event Planner application, still in use although slowly migrated into
microservices.

## JHipster Information

This application was originally created via JHipster. The building information is still available
in `DEVELOPMENT.md`.

## Prerequisites

### Services/User

You will have the Services/User up and running as well, ideally. It is not a must-have for all
operations, but you may experience issues if you cannot have it running in parallel.

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
    url: jdbc:postgresql://localhost:5432/backend
    username: backend_user
    password: backend_password
```

#### Testing Configuration

```
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/backend_integration
    username: backend_user
    password: backend_password
```

### Mail Service

You can optionally install an SMTP server if you need to test anything regarding the mails. However
it is not 100% required, because all mails will be printed out in STDOUT too!

## Runtime Configuration

From
the [docker-compose](https://github.com/bbortt/event-planner/blob/canary/docker/event-planner.yml)
configuration:

```dockerfile
services:
  # Legacy Backend
  backend:
    environment:
      APPL_JDBC_URL: jdbc:postgresql://postgres:5432/backend
      APPL_JDBC_USERNAME: backend_user
      APPL_JDBC_PASSWORD: backend_password
      APPL_MAIL_HOST: localhost
      APPL_MAIL_PORT: 25
      APPL_MAIL_USERNAME: localhost
      APPL_MAIL_PASSWORD: localhost
      APPL_MAIL_BASE_URL: http://localhost
      APPL_OIDC_ISSUER_URI: http://keycloak:9080/auth/realms/jhipster
      APPL_OIDC_CLIENT_ID: internal
      APPL_OIDC_CLIENT_SECRET: internal
      APPL_USER_SERVICE_BASE_URL: http://service_user:8080
```

## License

This project is licensed under the terms of
the [Apache 2.0 License](https://github.com/bbortt/event-planner/blob/canary/LICENSE).
