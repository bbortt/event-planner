CREATE TABLE locality
(
    id              BIGSERIAL PRIMARY KEY    NOT NULL,
    name            VARCHAR(50)              NOT NULL,
    description     VARCHAR(300),
    locality_id     BIGINT,
    project_id      BIGINT                   NOT NULL,
    created_by      VARCHAR(64)              NOT NULL,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    last_updated_by VARCHAR(64)              NOT NULL,
    last_updated_at TIMESTAMP WITH TIME ZONE          DEFAULT now(),
    CONSTRAINT child_of FOREIGN KEY (locality_id) REFERENCES locality (id),
    CONSTRAINT belongs_to FOREIGN KEY (project_id) REFERENCES project (id)
);

INSERT INTO permission (id)
VALUES ('locality:create'),
       ('locality:list'),
       ('locality:edit'),
       ('locality:move'),
       ('locality:delete');
