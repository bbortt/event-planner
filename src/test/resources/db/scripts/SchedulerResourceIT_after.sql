DELETE
FROM section_has_events
WHERE section_id = (SELECT id FROM section WHERE name = 'SchedulerResourceIT-section');
DELETE
FROM event
WHERE name in ('SchedulerResourceIT-event-1', 'SchedulerResourceIT-event-2');
DELETE
FROM section
WHERE name = 'SchedulerResourceIT-section';
DELETE
FROM location
WHERE name = 'SchedulerResourceIT-location';
DELETE
FROM responsibility
WHERE name = 'SchedulerResourceIT-responsibility';
DELETE
FROM invitation
WHERE email = 'SchedulerResourceIT-user@localhost';
DELETE
FROM project
WHERE name = 'SchedulerResourceIT-project-1';
DELETE
FROM jhi_user
WHERE email = 'SchedulerResourceIT-user@localhost';
