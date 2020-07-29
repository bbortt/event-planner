ALTER TABLE role
    DROP COLUMN id,
    ADD PRIMARY KEY (name);

DROP SEQUENCE role_id_seq;
