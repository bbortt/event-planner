CREATE USER backend_user WITH PASSWORD 'backend_password';

CREATE DATABASE backend;
GRANT ALL PRIVILEGES ON DATABASE backend TO backend_user;

CREATE DATABASE backend_integration;
GRANT ALL PRIVILEGES ON DATABASE backend_integration TO backend_user;
