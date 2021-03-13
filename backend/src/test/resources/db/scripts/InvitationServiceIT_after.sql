DELETE
FROM invitation
WHERE email IN ('InvitationServiceIT-user@localhost');

DELETE
FROM project
WHERE name IN ('InvitationServiceIT-project-1', 'InvitationServiceIT-project-2');

DELETE
FROM jhi_user
WHERE login IN ('InvitationServiceIT-user');
