CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE USER projects_service WITH PASSWORD 'projects_service';
CREATE SCHEMA projects_service AUTHORIZATION projects_service;

ALTER DEFAULT PRIVILEGES IN SCHEMA projects_service GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO projects_service;
ALTER DEFAULT PRIVILEGES IN SCHEMA projects_service GRANT USAGE, SELECT ON SEQUENCES TO projects_service;
