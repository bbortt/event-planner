INSERT INTO jhi_user(login, email, password_hash, activated, created_by)
VALUES ('ProjectRepositoryIT-user-1', 'ProjectRepositoryIT-user-1@localhost', 'some-password-hash-whatever', true, 'me'),
       ('ProjectRepositoryIT-user-2', 'ProjectRepositoryIT-user-2@localhost', 'some-password-hash-whatever', true, 'me');

INSERT INTO project(name, start_time, end_time)
VALUES ('ProjectRepositoryIT-project-1', now(), now()),
       ('ProjectRepositoryIT-project-2', now(), now()),
       ('ProjectRepositoryIT-project-3', now(), now());

INSERT INTO invitation(email, accepted, project_id, role_name, jhi_user_id)
VALUES ('ProjectRepositoryIT-user-1@localhost', true, (select id from project where name = 'ProjectRepositoryIT-project-1'), 'VIEWER',
        (select id from jhi_user where login = 'ProjectRepositoryIT-user-1')),
       ('ProjectRepositoryIT-user-1@localhost', true, (select id from project where name = 'ProjectRepositoryIT-project-2'), 'VIEWER',
        (select id from jhi_user where login = 'ProjectRepositoryIT-user-1')),
       ('ProjectRepositoryIT-user-2@localhost', true, (select id from project where name = 'ProjectRepositoryIT-project-3'),
        'VIEWER', (select id from jhi_user where login = 'ProjectRepositoryIT-user-2'));
