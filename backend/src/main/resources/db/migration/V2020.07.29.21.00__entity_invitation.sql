CREATE TABLE invitation
(
    id                BIGSERIAL PRIMARY KEY  NOT NULL,
    email             CHARACTER VARYING(191) NOT NULL,
    accepted          BOOLEAN                NOT NULL,
    project_id        BIGINT                 NOT NULL,
    responsibility_id BIGINT,
    role_name         CHARACTER VARYING(50)  NOT NULL,
    jhi_user_id       BIGINT,
    FOREIGN KEY (project_id) REFERENCES project (id),
    FOREIGN KEY (responsibility_id) REFERENCES responsibility (id),
    FOREIGN KEY (role_name) REFERENCES role (name),
    FOREIGN KEY (jhi_user_id) REFERENCES jhi_user (id)
)
