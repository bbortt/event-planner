ALTER TABLE INVITATION
    ADD COLUMN created_by         CHARACTER VARYING(50) NOT NULL DEFAULT 'anonymousUser',
    ADD COLUMN created_date       TIMESTAMP WITH TIME ZONE,
    ADD COLUMN reset_date         TIMESTAMP WITH TIME ZONE,
    ADD COLUMN last_modified_by   CHARACTER VARYING(50),
    ADD COLUMN last_modified_date TIMESTAMP WITH TIME ZONE,
    ADD CONSTRAINT unique_user_per_project UNIQUE (jhi_user_id, project_id);

ALTER TABLE invitation
    ALTER COLUMN created_by DROP DEFAULT;
