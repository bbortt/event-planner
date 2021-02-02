INSERT INTO jhi_user(login, email, password_hash, activated, created_by)
VALUES ('SchedulerResourceIT-user', 'SchedulerResourceIT-user@localhost',
        'some-password-hash-whatever', true, 'me');

INSERT INTO project(name, start_time, end_time)
VALUES ('SchedulerResourceIT-project-1', now(), now());

INSERT INTO invitation(email, created_date, created_by, accepted, token, project_id, role_name,
                       jhi_user_id, color)
VALUES ('SchedulerResourceIT-user@localhost', now(), 'me', true,
        'f22e0d81-b5b4-4d21-9c35-57eaf3cfe1f5',
        (SELECT id FROM project WHERE name = 'SchedulerResourceIT-project-1'), 'VIEWER',
        (SELECT id FROM jhi_user WHERE login = 'SchedulerResourceIT-user'), 'this-is-no-color');

INSERT INTO responsibility(name, project_id, color)
VALUES ('SchedulerResourceIT-responsibility',
        (SELECT id FROM project WHERE name = 'SchedulerResourceIT-project-1'), 'this-is-no-color');

INSERT INTO location(name, project_id)
VALUES ('SchedulerResourceIT-location',
        (SELECT id FROM project WHERE name = 'SchedulerResourceIT-project-1'));

INSERT INTO section(name, location_id)
VALUES ('SchedulerResourceIT-section',
        (SELECT id FROM location WHERE name = 'SchedulerResourceIT-location'));

INSERT INTO event(name, start_time, end_time, responsibility_id, jhi_user_id)
VALUES ('SchedulerResourceIT-event-1', now(), now(),
        (SELECT id FROM responsibility WHERE name = 'SchedulerResourceIT-responsibility'), null),
       ('SchedulerResourceIT-event-2', now(), now(), null,
        (SELECT id FROM jhi_user WHERE login = 'SchedulerResourceIT-user'));

INSERT INTO section_has_events (section_id, event_id)
VALUES ((SELECT id FROM section WHERE name = 'SchedulerResourceIT-section'),
        (SELECT id FROM event WHERE name = 'SchedulerResourceIT-event-1')),
       ((SELECT id FROM section WHERE name = 'SchedulerResourceIT-section'),
        (SELECT id FROM event WHERE name = 'SchedulerResourceIT-event-2'));

