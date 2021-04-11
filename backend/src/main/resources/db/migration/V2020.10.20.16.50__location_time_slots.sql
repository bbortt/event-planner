CREATE TABLE location_time_slot
(
    id          BIGSERIAL PRIMARY KEY NOT NULL,
    location_id BIGINT                NOT NULL,
    start_time  TIMESTAMP WITH TIME ZONE,
    end_time    TIMESTAMP WITH TIME ZONE,
    FOREIGN KEY (location_id) REFERENCES location (id),
    CONSTRAINT unique_time_slot_per_location UNIQUE (location_id, start_time, end_time)
);
