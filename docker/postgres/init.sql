-- backend
CREATE USER backend_user WITH PASSWORD 'backend_password';

CREATE DATABASE backend;
GRANT ALL PRIVILEGES ON DATABASE backend TO backend_user;

CREATE DATABASE backend_integration;
GRANT ALL PRIVILEGES ON DATABASE backend_integration TO backend_user;

-- service_user
CREATE USER service_user_user WITH PASSWORD 'service_user_password';

CREATE DATABASE service_user;
GRANT ALL PRIVILEGES ON DATABASE service_user TO service_user_user;

CREATE DATABASE service_user_integration;
GRANT ALL PRIVILEGES ON DATABASE service_user_integration TO service_user_user;
