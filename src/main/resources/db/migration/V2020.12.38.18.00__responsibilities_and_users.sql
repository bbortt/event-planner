ALTER TABLE location
    ADD COLUMN jhi_user_id BIGINT,
    ADD FOREIGN KEY (jhi_user_id) REFERENCES jhi_user (id);

ALTER TABLE section
    ADD COLUMN responsibility_id BIGINT,
    ADD COLUMN jhi_user_id       BIGINT,
    ADD FOREIGN KEY (responsibility_id) REFERENCES responsibility (id),
    ADD FOREIGN KEY (jhi_user_id) REFERENCES jhi_user (id);

ALTER TABLE event
    ALTER COLUMN responsibility_id DROP NOT NULL;
