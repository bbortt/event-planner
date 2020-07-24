CREATE TABLE role
(
    id   BIGSERIAL PRIMARY KEY NOT NULL,
    name CHARACTER VARYING(50) UNIQUE
);

INSERT INTO role
VALUES ('ADMIN'),
       ('SECRETARY'),
       ('CONTRIBUTOR'),
       ('VIEWER');
