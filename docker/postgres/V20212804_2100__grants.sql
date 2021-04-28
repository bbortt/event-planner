-- backend
CREATE USER backend_user WITH PASSWORD 'backend_password';
GRANT ALL PRIVILEGES ON DATABASE backend TO backend_user;
GRANT ALL PRIVILEGES ON DATABASE backend_integration TO backend_user;

-- service_user
CREATE USER service_user_user WITH PASSWORD 'service_user_password';
GRANT ALL PRIVILEGES ON DATABASE service_user TO service_user_user;
GRANT ALL PRIVILEGES ON DATABASE service_user_integration TO service_user_user;
