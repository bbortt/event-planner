CREATE TABLE jhi_user
(
    id                 CHARACTER VARYING(100) PRIMARY KEY NOT NULL,
    login              CHARACTER VARYING(50)              NOT NULL,
    first_name         CHARACTER VARYING(50),
    last_name          CHARACTER VARYING(50),
    email              CHARACTER VARYING(191)             NOT NULL,
    activated          boolean                            NOT NULL,
    lang_key           CHARACTER VARYING(10),
    image_url          CHARACTER VARYING(256),
    created_by         CHARACTER VARYING(50)              NOT NULL,
    created_date       TIMESTAMP WITH TIME ZONE,
    last_modified_by   CHARACTER VARYING(50),
    last_modified_date TIMESTAMP WITH TIME ZONE,
    CONSTRAINT ux_user_login UNIQUE (login),
    CONSTRAINT ux_user_email UNIQUE (email)
);


CREATE TABLE jhi_authority
(
    name CHARACTER VARYING(50) PRIMARY KEY NOT NULL
);


CREATE TABLE jhi_user_authority
(
    user_id        CHARACTER VARYING(100) NOT NULL,
    authority_name CHARACTER VARYING(50)  NOT NULL,
    PRIMARY KEY (user_id, authority_name),
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES jhi_user (id),
    CONSTRAINT fk_authority_name FOREIGN KEY (authority_name) REFERENCES jhi_authority (name)
);
