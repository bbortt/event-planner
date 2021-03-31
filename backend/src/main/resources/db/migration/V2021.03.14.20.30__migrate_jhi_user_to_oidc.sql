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

DROP TABLE jhi_user;
DROP TABLE jhi_user_authority;
drop table jhi_authority;

ALTER TABLE invitation
ALTER
COLUMN jhi_user_id TYPE VARCHAR(100);

ALTER TABLE location
ALTER
COLUMN jhi_user_id TYPE VARCHAR(100);

ALTER TABLE section
ALTER
COLUMN jhi_user_id TYPE VARCHAR(100);

ALTER TABLE event
ALTER
COLUMN jhi_user_id TYPE VARCHAR(100);
