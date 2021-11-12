CREATE TABLE project
(
    id              BIGSERIAL PRIMARY KEY    NOT NULL,
    token           CHAR(36)                 NOT NULL DEFAULT uuid_generate_v1(),
    name            VARCHAR(50)              NOT NULL,
    description     VARCHAR(300),
    start_time      TIMESTAMP WITH TIME ZONE,
    end_time        TIMESTAMP WITH TIME ZONE,
    archived        BOOLEAN                  NOT NULL DEFAULT FALSE,
    created_by      VARCHAR(64)              NOT NULL,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    last_updated_by VARCHAR(64)              NOT NULL,
    last_updated_at TIMESTAMP WITH TIME ZONE          DEFAULT now(),
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
    auth0_user_id VARCHAR(64),
    created_by    VARCHAR(64)              NOT NULL,
    created_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    accepted      BOOLEAN                  NOT NULL DEFAULT false,
    accepted_by   VARCHAR(64)              NOT NULL,
    accepted_at   TIMESTAMP WITH TIME ZONE,
    CONSTRAINT member_of FOREIGN KEY (project_id) REFERENCES project (id),
    CONSTRAINT related_user FOREIGN KEY (auth0_user_id) REFERENCES auth0_user (user_id),
    CONSTRAINT accepted_by FOREIGN KEY (accepted_by) REFERENCES auth0_user (user_id),
    CONSTRAINT unique_invitation UNIQUE (project_id, auth0_user_id)
);

CREATE FUNCTION accept_member(accept_id BIGINT, accepting VARCHAR(64))
    RETURNS member
AS
$$
BEGIN
    UPDATE member
    SET accepted    = TRUE,
        accepted_by = accepting
    WHERE id = accept_id;
    RETURN (SELECT * FROM member WHERE id = accepted_by);
END;
$$ LANGUAGE plpgsql;

CREATE TABLE permission
(
    id   BIGSERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(20)           NOT NULL
);

INSERT INTO permission (name)
VALUES ('project:update'),
       ('members:list'),
       ('members:accept'),
       ('members:remove'),
       ('permissions:list'),
       ('permissions:assign'),
       ('permissions:revoke');

CREATE TABLE member_permission
(
    member_id     BIGINT NOT NULL,
    project_id    BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,
    CONSTRAINT member FOREIGN KEY (member_id) REFERENCES member (id),
    CONSTRAINT in_project FOREIGN KEY (project_id) REFERENCES project (id),
    CONSTRAINT permission FOREIGN KEY (permission_id) REFERENCES permission (id)
);

CREATE VIEW member_permissions_view AS
SELECT m.id as user_id, name as permission
FROM member m
         LEFT JOIN member_permission mp on m.id = mp.member_id
         LEFT JOIN permission p on p.id = mp.permission_id;
