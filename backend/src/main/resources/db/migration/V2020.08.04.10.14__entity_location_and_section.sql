CREATE TABLE location
(
    id                BIGSERIAL PRIMARY KEY NOT NULL,
    name              VARCHAR(50)           NOT NULL,
    date_from         TIMESTAMP WITH TIME ZONE,
    date_to           TIMESTAMP WITH TIME ZONE,
    project_id        BIGINT                NOT NULL,
    responsibility_id BIGINT,
    FOREIGN KEY (project_id) REFERENCES project (id),
    FOREIGN KEY (responsibility_id) REFERENCES responsibility (id)
);

CREATE TABLE section
(
    id          BIGSERIAL PRIMARY KEY NOT NULL,
    name        VARCHAR(50)           NOT NULL,
    location_id BIGINT                NOT NULL,
    FOREIGN KEY (location_id) REFERENCES location (id)
);
