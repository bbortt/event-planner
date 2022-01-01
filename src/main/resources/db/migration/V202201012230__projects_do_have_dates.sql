ALTER TABLE project
    ADD COLUMN start_date DATE NOT NULL DEFAULT now(),
    ADD COLUMN end_date   DATE NOT NULL DEFAULT now(),
    DROP COLUMN start_time,
    DROP COLUMN end_time;
