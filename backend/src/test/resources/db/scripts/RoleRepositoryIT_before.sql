INSERT INTO jhi_user(login, email, password_hash, activated, created_by)
VALUES ('RoleRepositoryIT-user-1', 'RoleRepositoryIT-user-1@localhost',
        'some-password-hash-whatever', true, 'me'),
       ('RoleRepositoryIT-user-2', 'RoleRepositoryIT-user-2@localhost',
        'some-password-hash-whatever', true, 'me');

INSERT INTO project(name, start_time, end_time)
VALUES ('RoleRepositoryIT-project-1', now(), now()),
       ('RoleRepositoryIT-project-2', now(), now());

INSERT INTO invitation(email, accepted, project_id, role_name, jhi_user_id, created_by)
VALUES ('RoleRepositoryIT-user-1@localhost', true,
        (select id from project where name = 'RoleRepositoryIT-project-1'), 'ADMIN',
        (select id from jhi_user where login = 'RoleRepositoryIT-user-1'), 'IT'),
       ('RoleRepositoryIT-user-2@localhost', false,
        (select id from project where name = 'RoleRepositoryIT-project-1'), 'ADMIN',
        (select id from jhi_user where login = 'RoleRepositoryIT-user-2'), 'IT'),
       ('RoleRepositoryIT-user-1@localhost', true,
        (select id from project where name = 'RoleRepositoryIT-project-2'), 'VIEWER',
        (select id from jhi_user where login = 'RoleRepositoryIT-user-1'), 'IT');
