# Event Planner - Frontend

An Angular web application. Wrapped into Nginx container for productive environments.

## JHipster Information

This application was originally created via JHipster. The building information is still available
in `DEVELOPMENT.md`.

## Runtime Configuration

Because the application is intended to run _behind_ the Gateway there is no special configuration
required. The Gateway can take perfectly care of authorization and redirecting.

### Logstash

You can send logs to Logstash when setting the following variables:

- `APPL_LOGSTASH_HOST`: The Logstash host.
- `APPL_LOGSTASH_PORT`: The Logstash port.

## License

This project is licensed under the terms of
the [Apache 2.0 License](https://github.com/bbortt/event-planner/blob/canary/LICENSE).
