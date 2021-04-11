# Flyway Grants

```postgresql
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO backend_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO backend_user;
```

This allows you to run migrations using a separate user. Using a
less granted user called `backend_user` for the productive application runtime.

> Make sure you set `APPL_JDBC_USERNAME=backend_user` when in use!
