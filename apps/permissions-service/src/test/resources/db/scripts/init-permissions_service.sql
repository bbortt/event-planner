CREATE USER permissions_service WITH PASSWORD 'permissions_service';
CREATE SCHEMA permissions_service AUTHORIZATION permissions_service;

ALTER DEFAULT PRIVILEGES IN SCHEMA permissions_service GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO permissions_service;
ALTER DEFAULT PRIVILEGES IN SCHEMA permissions_service GRANT USAGE, SELECT ON SEQUENCES TO permissions_service;
