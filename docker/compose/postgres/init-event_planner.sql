CREATE DATABASE event_planner;

CREATE USER event_planner_hasura WITH PASSWORD 'event_planner_hasura_password';
GRANT ALL PRIVILEGES ON DATABASE event_planner TO event_planner_hasura;
