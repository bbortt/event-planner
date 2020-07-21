--------------------------------------------------
-- clean_db.sql removes all objects from schema --
--------------------------------------------------

-- sequences
DROP SEQUENCE jhi_persistent_audit_event_event_id_seq;
DROP SEQUENCE jhi_user_id_seq;
DROP SEQUENCE responsibility_id_seq;

-- JHipster entities
DROP TABLE jhi_persistent_audit_evt_data;
DROP TABLE jhi_persistent_audit_event;
DROP TABLE jhi_user_authority;
DROP TABLE jhi_authority;
DROP TABLE jhi_user;

-- domain
DROP TABLE responsibility;

-- Flyway migration history
DROP TABLE flyway_schema_history;
