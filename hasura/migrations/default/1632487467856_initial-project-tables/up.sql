CREATE TABLE project
(
    id              BIGSERIAL PRIMARY KEY    NOT NULL,
    name            VARCHAR(50)              NOT NULL,
    description     VARCHAR(300),
    start_time      TIMESTAMP WITH TIME ZONE,
    end_time        TIMESTAMP WITH TIME ZONE,
    archived        BOOLEAN                  NOT NULL DEFAULT FALSE,
    created_by      VARCHAR(50)              NOT NULL,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    last_updated_by VARCHAR(50)              NOT NULL,
    last_updated_at TIMESTAMP WITH TIME ZONE          DEFAULT now()
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

CREATE TABLE invitation
(
    id            BIGSERIAL PRIMARY KEY    NOT NULL,
    project_id    BIGINT                   NOT NULL,
    auth0_user_id VARCHAR(64),
    nickname      VARCHAR(256)             NOT NULL,
    token         CHAR(36)                 NOT NULL,
    created_by    VARCHAR(50)              NOT NULL,
    created_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    accepted      BOOLEAN                  NOT NULL DEFAULT false,
    accepted_at   TIMESTAMP WITH TIME ZONE,
    CONSTRAINT invited_to FOREIGN KEY (project_id) REFERENCES project (id),
    CONSTRAINT accepted_by FOREIGN KEY (auth0_user_id) REFERENCES auth0_user (user_id),
    CONSTRAINT unique_invitation UNIQUE (project_id, nickname),
    CONSTRAINT unique_token UNIQUE (token)
);
