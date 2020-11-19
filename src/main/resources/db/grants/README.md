# Flyway Grants

This migration files will be included when launching Spring with the active profile
`-Dspring.profiles.active=grant`. It allows you to run migrations using a separate user. Using a
less granted user called `event_planner` for the productive application runtime.

> Make sure you set `APPL_JDBC_USERNAME=event_planner` when in use!

For more information take a look at `src/main/resources/config/application-grants.yml`.
