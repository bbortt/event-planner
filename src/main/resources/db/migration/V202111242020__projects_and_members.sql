CREATE TABLE project
(
    id                 BIGSERIAL PRIMARY KEY    NOT NULL,
    token              CHAR(36)              NOT NULL DEFAULT uuid_generate_v1(),
    name               VARCHAR(50)              NOT NULL,
    description        VARCHAR(300),
    start_time         TIMESTAMP WITH TIME ZONE,
    end_time           TIMESTAMP WITH TIME ZONE,
    archived           BOOLEAN                  NOT NULL DEFAULT FALSE,
    created_by         VARCHAR(64)              NOT NULL,
    created_date       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    last_modified_by   VARCHAR(64),
    last_modified_date TIMESTAMP WITH TIME ZONE          DEFAULT now(),
    CONSTRAINT unique_token UNIQUE (token)
);

CREATE TABLE auth0_user
(
    user_id     VARCHAR(64) PRIMARY KEY NOT NULL,
    nickname    VARCHAR(64)             NOT NULL,
    email       VARCHAR(64)             NOT NULL,
    picture     VARCHAR(254),
    family_name VARCHAR(128),
    given_name  VARCHAR(128),
    CONSTRAINT unique_email UNIQUE (email)
);

CREATE TABLE member
(
    id            BIGSERIAL PRIMARY KEY    NOT NULL,
    project_id    BIGINT                   NOT NULL,
    auth0_user_id VARCHAR(64)              NOT NULL,
    created_by    VARCHAR(64)              NOT NULL,
    created_date  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    accepted      BOOLEAN                  NOT NULL DEFAULT false,
    accepted_by   VARCHAR(64)              NOT NULL,
    accepted_date TIMESTAMP WITH TIME ZONE,
    CONSTRAINT belongs_to FOREIGN KEY (project_id) REFERENCES project (id),
    CONSTRAINT related_user FOREIGN KEY (auth0_user_id) REFERENCES auth0_user (user_id),
    CONSTRAINT accepted_by FOREIGN KEY (accepted_by) REFERENCES auth0_user (user_id)
);

CREATE TABLE permission
(
    id VARCHAR(20) PRIMARY KEY NOT NULL
);

INSERT INTO permission (id)
VALUES ('project:update'),
       ('member:list'),
       ('member:accept'),
       ('member:remove'),
       ('permission:list'),
       ('permission:assign'),
       ('permission:revoke');

CREATE TABLE member_permission
(
    member_id          BIGINT                   NOT NULL,
    permission_id      VARCHAR(20)              NOT NULL,
    created_by         VARCHAR(64)              NOT NULL,
    created_date       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    last_modified_by   VARCHAR(64),
    last_modified_date TIMESTAMP WITH TIME ZONE          DEFAULT now(),
    PRIMARY KEY (member_id, permission_id),
    CONSTRAINT member FOREIGN KEY (member_id) REFERENCES member (id),
    CONSTRAINT permission FOREIGN KEY (permission_id) REFERENCES permission (id)
);
