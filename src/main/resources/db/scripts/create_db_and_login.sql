-------------------------------------------------------------------
-- create_db_and_login.sql creates required databases and logins --
-------------------------------------------------------------------

CREATE DATABASE event_planner;
CREATE DATABASE event_planner_integration;

CREATE USER event_planner WITH PASSWORD 'event_planner_password';

GRANT ALL PRIVILEGES ON DATABASE event_planner TO event_planner;
GRANT ALL PRIVILEGES ON DATABASE event_planner_integration TO event_planner;
