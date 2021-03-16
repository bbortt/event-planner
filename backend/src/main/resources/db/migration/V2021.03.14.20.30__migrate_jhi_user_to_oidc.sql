ALTER TABLE jhi_user_authority
DROP
CONSTRAINT fk_user_id;
ALTER TABLE invitation
DROP
CONSTRAINT invitation_jhi_user_id_fkey;
ALTER TABLE location
DROP
CONSTRAINT location_jhi_user_id_fkey;
ALTER TABLE section
DROP
CONSTRAINT section_jhi_user_id_fkey;
ALTER TABLE event
DROP
CONSTRAINT event_jhi_user_id_fkey;

ALTER TABLE jhi_user
ALTER
COLUMN id DROP DEFAULT,
ALTER
COLUMN id TYPE VARCHAR(100),
DROP
COLUMN password_hash,
DROP
COLUMN activation_key;

DROP SEQUENCE jhi_user_id_seq;

ALTER TABLE jhi_user_authority
ALTER
COLUMN user_id TYPE VARCHAR(100),
ADD FOREIGN KEY (user_id) REFERENCES jhi_user(id);
ALTER TABLE invitation
ALTER
COLUMN jhi_user_id TYPE VARCHAR(100),
ADD FOREIGN KEY (jhi_user_id) REFERENCES jhi_user(id);
ALTER TABLE location
ALTER
COLUMN jhi_user_id TYPE VARCHAR(100),
ADD FOREIGN KEY (jhi_user_id) REFERENCES jhi_user(id);
ALTER TABLE section
ALTER
COLUMN jhi_user_id TYPE VARCHAR(100),
ADD FOREIGN KEY (jhi_user_id) REFERENCES jhi_user(id);
ALTER TABLE event
ALTER
COLUMN jhi_user_id TYPE VARCHAR(100),
ADD FOREIGN KEY (jhi_user_id) REFERENCES jhi_user(id);
