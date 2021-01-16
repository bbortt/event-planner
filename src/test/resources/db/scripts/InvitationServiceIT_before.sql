INSERT INTO jhi_user(login, email, password_hash, activated, created_by)
VALUES ('InvitationServiceIT-user', 'InvitationServiceIT-user@localhost',
        'some-password-hash-whatever', true, 'me');

INSERT INTO project(name, start_time, end_time)
VALUES ('InvitationServiceIT-project-1', now(), now()),
       ('InvitationServiceIT-project-2', now(), now());

INSERT INTO invitation(email, created_date, created_by, accepted, token, project_id, role_name,
                       jhi_user_id)
VALUES ('InvitationServiceIT-user@localhost',
        to_timestamp('2020/01/01 00:00', 'YYYY/MM/DD HH24:MI'), 'me', false,
        'ff4ebe9c-b817-4f76-835a-1f26899edd88',
        (select id from project where name = 'InvitationServiceIT-project-1'), 'VIEWER',
        (select id from jhi_user where login = 'InvitationServiceIT-user')),
       ('InvitationServiceIT-user@localhost', now(), 'me', false,
        'd5d5ce84-4b16-46fa-90b0-4a8a67b32d1c',
        (select id from project where name = 'InvitationServiceIT-project-2'), 'VIEWER',
        (select id from jhi_user where login = 'InvitationServiceIT-user'));
