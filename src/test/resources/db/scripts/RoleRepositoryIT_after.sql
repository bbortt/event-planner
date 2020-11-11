DELETE
FROM invitation
WHERE email IN ('RoleRepositoryIT-user-1@localhost', 'RoleRepositoryIT-user-2@localhost');

DELETE
FROM project
WHERE name IN ('RoleRepositoryIT-project-1', 'RoleRepositoryIT-project-2');

DELETE
FROM jhi_user
WHERE login IN ('RoleRepositoryIT-user-1', 'RoleRepositoryIT-user-2');
