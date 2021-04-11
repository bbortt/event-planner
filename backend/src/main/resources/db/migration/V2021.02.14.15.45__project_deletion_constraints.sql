ALTER TABLE responsibility
    DROP CONSTRAINT responsibility_project_id_fkey,
    ADD FOREIGN KEY (project_id) REFERENCES project (id) ON DELETE CASCADE;

ALTER TABLE invitation
    DROP CONSTRAINT invitation_project_id_fkey,
    ADD FOREIGN KEY (project_id) REFERENCES project (id) ON DELETE CASCADE;
