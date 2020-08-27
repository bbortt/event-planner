DELETE
FROM invitation
WHERE email IN ('ProjectRepositoryIT-user-1@localhost', 'ProjectRepositoryIT-user-2@localhost');

DELETE
FROM project
WHERE name IN ('ProjectRepositoryIT-project-1', 'ProjectRepositoryIT-project-2',
               'ProjectRepositoryIT-project-3');

DELETE
FROM jhi_user
WHERE login IN ('ProjectRepositoryIT-user-1', 'ProjectRepositoryIT-user-2');
