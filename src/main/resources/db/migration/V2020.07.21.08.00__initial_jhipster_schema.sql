CREATE TABLE jhi_authority
(
    name CHARACTER VARYING(50) PRIMARY KEY NOT NULL
);

INSERT INTO jhi_authority (name)
values ('ROLE_ADMIN'),
       ('ROLE_USER');

CREATE TABLE jhi_persistent_audit_event
(
    event_id   BIGSERIAL PRIMARY KEY NOT NULL,
    principal  CHARACTER VARYING(50) NOT NULL,
    event_date TIMESTAMP WITH TIME ZONE,
    event_type CHARACTER VARYING(255)
);

CREATE SEQUENCE persistent_audit_event_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE jhi_persistent_audit_evt_data
(
    event_id BIGINT                 NOT NULL,
    name     CHARACTER VARYING(150) NOT NULL,
    value    CHARACTER VARYING(255),
    PRIMARY KEY (event_id, name),
    CONSTRAINT fk_evt_pers_audit_evt_data FOREIGN KEY (event_id) REFERENCES jhi_persistent_audit_event (event_id)
);

CREATE TABLE jhi_user
(
    id                 BIGSERIAL PRIMARY KEY  NOT NULL,
    login              CHARACTER VARYING(50)  NOT NULL,
    password_hash      CHARACTER VARYING(60)  NOT NULL,
    first_name         CHARACTER VARYING(50),
    last_name          CHARACTER VARYING(50),
    email              CHARACTER VARYING(191) NOT NULL,
    image_url          CHARACTER VARYING(256),
    activated          boolean                NOT NULL,
    lang_key           CHARACTER VARYING(10),
    activation_key     CHARACTER VARYING(20),
    reset_key          CHARACTER VARYING(20),
    created_by         CHARACTER VARYING(50)  NOT NULL,
    created_date       TIMESTAMP WITH TIME ZONE,
    reset_date         TIMESTAMP WITH TIME ZONE,
    last_modified_by   CHARACTER VARYING(50),
    last_modified_date TIMESTAMP WITH TIME ZONE,
    CONSTRAINT ux_user_login UNIQUE (login),
    CONSTRAINT ux_user_email UNIQUE (email)
);

CREATE SEQUENCE user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE jhi_user_authority
(
    user_id        BIGINT                NOT NULL,
    authority_name CHARACTER VARYING(50) NOT NULL,
    PRIMARY KEY (user_id, authority_name),
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES jhi_user (id),
    CONSTRAINT fk_authority_name FOREIGN KEY (authority_name) REFERENCES jhi_authority (name)
);

CREATE INDEX idx_persistent_audit_event ON jhi_persistent_audit_event USING btree (principal, event_date);
CREATE INDEX idx_persistent_audit_evt_data ON jhi_persistent_audit_evt_data USING btree (event_id);
