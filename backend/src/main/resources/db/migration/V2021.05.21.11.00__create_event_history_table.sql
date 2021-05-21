CREATE TABLE event_history
(
    id                BIGSERIAL PRIMARY KEY    NOT NULL,
    event_id          BIGINT                   NOT NULL,
    project_id        BIGINT                   NOT NULL,
    action            CHAR(6)                  NOT NULL,
    name              VARCHAR(50)              NOT NULL,
    description       VARCHAR(300),
    start_time        TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time          TIMESTAMP WITH TIME ZONE NOT NULL,
    responsibility_id BIGINT,
    jhi_user_id       CHARACTER VARYING(100),
    section_id        BIGINT,
    created_by        CHARACTER VARYING(50)    NOT NULL,
    created_date      TIMESTAMP WITH TIME ZONE
);

ALTER TABLE event
    ALTER COLUMN section_id SET NOT NULL;
