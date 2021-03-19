ALTER TABLE project
    ALTER COLUMN start_time SET NOT NULL,
    ALTER COLUMN end_time SET NOT NUll;

ALTER TABLE location_time_slot
    ALTER COLUMN start_time SET NOT NULL,
    ALTER COLUMN end_time SET NOT NULL;
