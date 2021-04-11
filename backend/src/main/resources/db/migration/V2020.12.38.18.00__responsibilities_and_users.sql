ALTER TABLE location
    ADD COLUMN jhi_user_id BIGINT,
    ADD FOREIGN KEY (jhi_user_id) REFERENCES jhi_user (id),
    ADD CONSTRAINT location_responsibility_or_user CHECK (
            (responsibility_id IS NULL AND jhi_user_id IS NULL)
            OR (responsibility_id IS NULL AND jhi_user_id IS NOT NULL)
            OR (responsibility_id IS NOT NULL AND jhi_user_id IS NULL)
        );

ALTER TABLE section
    ADD COLUMN responsibility_id BIGINT,
    ADD COLUMN jhi_user_id       BIGINT,
    ADD FOREIGN KEY (responsibility_id) REFERENCES responsibility (id),
    ADD FOREIGN KEY (jhi_user_id) REFERENCES jhi_user (id),
    ADD CONSTRAINT section_responsibility_or_user CHECK (
            (responsibility_id IS NULL AND jhi_user_id IS NULL)
            OR (responsibility_id IS NULL AND jhi_user_id IS NOT NULL)
            OR (responsibility_id IS NOT NULL AND jhi_user_id IS NULL)
        );

ALTER TABLE event
    ALTER COLUMN responsibility_id DROP NOT NULL,
    ADD CONSTRAINT event_responsibility_or_user CHECK (
            (responsibility_id IS NULL AND jhi_user_id IS NULL)
            OR (responsibility_id IS NULL AND jhi_user_id IS NOT NULL)
            OR (responsibility_id IS NOT NULL AND jhi_user_id IS NULL)
        );
