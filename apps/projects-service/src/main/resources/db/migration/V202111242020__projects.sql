CREATE TABLE projects_service.project
(
    id                 BIGSERIAL PRIMARY KEY    NOT NULL,
    token              VARCHAR(36)              NOT NULL DEFAULT uuid_generate_v1(),
    name               VARCHAR(50)              NOT NULL,
    description        VARCHAR(300),
    start_date         DATE                     NOT NULL DEFAULT now(),
    end_date           DATE                     NOT NULL DEFAULT now(),
    archived           BOOLEAN                  NOT NULL DEFAULT FALSE,
    created_by         VARCHAR(64)              NOT NULL,
    created_date       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    last_modified_by   VARCHAR(64),
    last_modified_date TIMESTAMP WITH TIME ZONE          DEFAULT now(),
    CONSTRAINT unique_token UNIQUE (token)
);
