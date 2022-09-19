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

CREATE TABLE projects_service.member
(
    id            BIGSERIAL PRIMARY KEY    NOT NULL,
    project_id    BIGINT                   NOT NULL,
    auth0_user_id VARCHAR(64)              NOT NULL,
    created_by    VARCHAR(64)              NOT NULL,
    created_date  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    accepted      BOOLEAN                  NOT NULL DEFAULT false,
    accepted_by   VARCHAR(64)              NOT NULL,
    accepted_date TIMESTAMP WITH TIME ZONE,
    CONSTRAINT belongs_to FOREIGN KEY (project_id) REFERENCES projects_service.project (id),
    CONSTRAINT unique_user_per_project UNIQUE (project_id, auth0_user_id)
);

CREATE TABLE projects_service.permission
(
    id VARCHAR(20) PRIMARY KEY NOT NULL
);

INSERT INTO projects_service.permission (id)
VALUES ('project:update'),
       ('member:list'),
       ('member:accept'),
       ('member:remove'),
       ('permission:list'),
       ('permission:assign'),
       ('permission:revoke');

CREATE TABLE projects_service.member_permission
(
    member_id          BIGINT                   NOT NULL,
    permission_id      VARCHAR(20)              NOT NULL,
    created_by         VARCHAR(64)              NOT NULL,
    created_date       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    last_modified_by   VARCHAR(64),
    last_modified_date TIMESTAMP WITH TIME ZONE          DEFAULT now(),
    PRIMARY KEY (member_id, permission_id),
    CONSTRAINT member FOREIGN KEY (member_id) REFERENCES projects_service.member (id),
    CONSTRAINT permission FOREIGN KEY (permission_id) REFERENCES projects_service.permission (id)
);
