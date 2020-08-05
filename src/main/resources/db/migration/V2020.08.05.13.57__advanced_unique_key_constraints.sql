-- responsibility / project
ALTER TABLE responsibility
    ADD CONSTRAINT unique_responsibility_per_project UNIQUE (name, project_id);

-- invitation / project
ALTER TABLE invitation
    ADD CONSTRAINT unique_invitation_per_project UNIQUE (email, project_id);

-- location / project
ALTER TABLE location
    ADD CONSTRAINT unique_location_per_project UNIQUE (name, project_id);

-- location / section
ALTER TABLE section
    ADD CONSTRAINT unique_section_per_location UNIQUE (name, location_id);
