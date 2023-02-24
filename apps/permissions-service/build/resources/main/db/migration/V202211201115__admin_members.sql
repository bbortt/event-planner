CREATE TABLE permissions_service.project_admin_member
(
    member_id    BIGINT                   NOT NULL,
    project_id   BIGINT                   NOT NULL,
    created_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    PRIMARY KEY (member_id, project_id)
);
