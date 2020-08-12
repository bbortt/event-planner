CREATE TABLE event
(
    id                BIGSERIAL PRIMARY KEY    NOT NULL,
    name              VARCHAR(50)              NOT NULL,
    description       VARCHAR(300),
    start_time        TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time          TIMESTAMP WITH TIME ZONE NOT NULL,
    responsibility_id BIGINT                   NOT NULL,
    jhi_user_id       BIGINT,
    FOREIGN KEY (responsibility_id) REFERENCES responsibility (id),
    FOREIGN KEY (jhi_user_id) REFERENCES jhi_user (id)
);

CREATE TABLE section_has_events
(
    section_id BIGINT NOT NULL,
    event_id   BIGINT NOT NULL,
    PRIMARY KEY (section_id, event_id)
);
