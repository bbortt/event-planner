# Event Planner - Gateway

A Spring Cloud Gateway: The central entry point, proxying all services and managing OAuth2 login.

## JHipster Information

This application was originally created via JHipster. The building information is still available
in `DEVELOPMENT.md`.

## Prerequisites

### Keycloak

You must have a running Keycloak instance with an `web_app:web_app` client. It requires
the `openid,profile,email` scopes. The following command can get you kickstarted in
Docker: `docker-compose -f docker/keycloak.yml up -d`.

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
            client-id: web_app
            scope: openid,profile,email
```

### Kafka

The Gateway optionally needs access to a Kafka broker on `localhost:9092` in order to broadcast user
information. You can start the Gateway without this, but you may run into problems later on.

### Redis

If you want to run multiple instances of the Gateway, it must store session information in a Redis
store on `localhost:6379`. We have created a docker-compose
file: `docker-compose -f docker/redis.yml up -d`.

## Runtime Configuration

From
the [docker-compose](https://github.com/bbortt/event-planner/blob/canary/docker/event-planner.yml)
configuration:

```dockerfile
services:
  # Gateway
  gateway:
    environment:
      APPL_KAFKA_BOOTSTRAP_SERVERS: kafka:9092
      # note: this must be the keycloak *public* url!
      # on localhost, edit your hosts file: keycloak -> 127.0.0.1
      APPL_OIDC_ISSUER_URI: http://keycloak:9080/auth/realms/jhipster
      APPL_OIDC_CLIENT_ID: web_app
      APPL_REDIS_HOST: redis
      APPL_REDIS_PORT: 6379
```

## License

This project is licensed under the terms of
the [Apache 2.0 License](https://github.com/bbortt/event-planner/blob/canary/LICENSE).
