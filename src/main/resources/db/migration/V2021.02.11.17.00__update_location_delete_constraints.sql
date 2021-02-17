ALTER TABLE location
    DROP CONSTRAINT location_project_id_fkey,
    ADD FOREIGN KEY (project_id) REFERENCES project (id) ON DELETE CASCADE;

ALTER TABLE section
    DROP CONSTRAINT section_location_id_fkey,
    ADD FOREIGN KEY (location_id) REFERENCES location (id) ON DELETE CASCADE;

ALTER TABLE event
    ADD COLUMN section_id BIGINT;

DO
$$
    DECLARE
        tmprow record;
    BEGIN
        FOR tmprow IN SELECT section_id, event_id FROM section_has_events
            LOOP
                UPDATE event
                SET section_id = tmprow.section_id
                WHERE id = tmprow.event_id;
            END LOOP;
    END;
$$;

ALTER TABLE event
    ADD FOREIGN KEY (section_id) references section (id) ON DELETE CASCADE;

DROP TABLE section_has_events;
