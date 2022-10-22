CREATE TABLE permissions_service.member
(
    id            BIGSERIAL PRIMARY KEY    NOT NULL,
    project_id    BIGINT                   NOT NULL,
    auth0_user_id VARCHAR(64)              NOT NULL,
    created_by    VARCHAR(64)              NOT NULL,
    created_date  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    accepted      BOOLEAN                  NOT NULL DEFAULT false,
    accepted_by   VARCHAR(64)              NOT NULL,
    accepted_date TIMESTAMP WITH TIME ZONE,
    CONSTRAINT unique_user_per_project UNIQUE (project_id, auth0_user_id)
);

CREATE TABLE permissions_service.permission
(
    id VARCHAR(20) PRIMARY KEY NOT NULL
);

INSERT INTO permissions_service.permission (id)
VALUES ('project:update'),
       ('member:list'),
       ('member:accept'),
       ('member:remove'),
       ('permission:list'),
       ('permission:assign'),
       ('permission:revoke');

CREATE TABLE permissions_service.member_permission
(
    member_id          BIGINT                   NOT NULL,
    permission_id      VARCHAR(20)              NOT NULL,
    created_by         VARCHAR(64)              NOT NULL,
    created_date       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    last_modified_by   VARCHAR(64),
    last_modified_date TIMESTAMP WITH TIME ZONE          DEFAULT now(),
    PRIMARY KEY (member_id, permission_id),
    CONSTRAINT member FOREIGN KEY (member_id) REFERENCES permissions_service.member (id),
    CONSTRAINT permission FOREIGN KEY (permission_id) REFERENCES permissions_service.permission (id)
);
