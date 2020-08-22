--------------------------------------------------
-- clean_db.sql removes all objects from schema --
--------------------------------------------------

-- domain
DROP TABLE invitation;
DROP TABLE section;
DROP TABLE location;
DROP TABLE event;
DROP TABLE section_has_events;
DROP TABLE responsibility;
DROP TABLE role;
DROP TABLE project;

-- JHipster entities
DROP TABLE jhi_persistent_audit_evt_data;
DROP TABLE jhi_persistent_audit_event;
DROP TABLE jhi_user_authority;
DROP TABLE jhi_authority;
DROP TABLE jhi_user;

-- Flyway migration history
DROP TABLE flyway_schema_history;
