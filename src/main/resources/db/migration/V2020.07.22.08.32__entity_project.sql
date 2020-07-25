CREATE TABLE project (
    id BIGSERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(300),
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE
);

ALTER TABLE responsibility
    ADD COLUMN project_id BIGINT NOT NULL,
    ADD FOREIGN KEY (project_id) REFERENCES project(id);
