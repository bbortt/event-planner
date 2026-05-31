# Spec 07 — Tasks & Notifications

**Status:** Written
**Last updated:** 2026-05-31

---

## Purpose

Define the task system: auto-generated tasks triggered by time range transitions, manually created tasks, the task hierarchy used for notification escalation, and how notifications reach the right level of the event team.

---

## Motivation

During a live event, many things must happen at specific times: locations must open and close, volunteers must start and end their shifts, setup and teardown must complete. The task system turns these obligations into trackable items. If something goes wrong — a location isn't opened in time — the system escalates up the task hierarchy to notify the right person, without flooding event admins with low-level detail.

---

## Task entity

| Field          | Type           | Constraints                                                        |
|----------------|----------------|--------------------------------------------------------------------|
| `id`           | UUID           | system-generated                                                   |
| `title`        | String         | required; auto-populated for system tasks                          |
| `description`  | String         | optional                                                           |
| `type`         | TaskType       | `SYSTEM` (auto-generated) or `MANUAL`                             |
| `category`     | TaskCategory   | see below                                                          |
| `status`       | TaskStatus     | `PENDING`, `COMPLETED`, `OVERDUE`, `CANCELLED`                    |
| `dueAt`        | OffsetDateTime | required; when the task must be completed                          |
| `completedAt`  | OffsetDateTime | null until completed                                               |
| `completedBy`  | User (ref)     | null until completed                                               |
| `assignedTo`   | User (ref)     | required; the person responsible for completing this task          |
| `parent`       | Task (ref)     | optional; links to the parent task in the hierarchy                |
| `event`        | Event (ref)    | the event this task belongs to                                     |
| `context`      | (ref)          | polymorphic: the LocationTimeSlot, VolunteerShift, etc. that triggered this task |
| `createdAt`    | OffsetDateTime | system-generated                                                   |

### TaskStatus lifecycle

```
PENDING ──► COMPLETED   (assignee marks task done)
   │
   └──► OVERDUE         (system sets when dueAt passes without completion)
              │
              └──► COMPLETED  (can still be completed after overdue)

Any state ──► CANCELLED  (context is cancelled, e.g. slot cancelled)
```

### TaskCategory

| Category            | Description                                                        |
|---------------------|--------------------------------------------------------------------|
| `LOCATION_SETUP`    | Prepare a location before it opens                                 |
| `LOCATION_OPEN`     | Confirm a location is open at `opensAt`                           |
| `LOCATION_CLOSE`    | Confirm a location is closed at `closesAt`                        |
| `LOCATION_TEARDOWN` | Complete teardown after the location closes                        |
| `SHIFT_START`       | Volunteer confirms they are in position at shift start             |
| `SHIFT_END`         | Volunteer confirms their shift is complete                         |
| `MANUAL`            | Organiser or coordinator created task                              |

---

## Task hierarchy

Tasks form a two-level tree (expandable to more levels in future). The hierarchy determines **who gets notified when a child task becomes overdue**.

```
Event-level task  (parent: null)
  └── Location-level task  (parent: event-level)
        └── Shift-level task  (parent: location-level)
```

### Automatically generated task trees

When a `LocationTimeSlot` is created, the system generates a task tree:

```
[Event-level]  "Operations: {Location Name}"          → assigned to EVENT_ADMIN or ORGANIZER
  │
  ├── [Location-level] "Setup {Location Name}"         → LOCATION_ADMIN (if no shift lead for setup)
  │     category: LOCATION_SETUP, dueAt: setupAt
  │
  ├── [Location-level] "Open {Location Name}"          → shift lead (or LOCATION_ADMIN if none)
  │     category: LOCATION_OPEN, dueAt: opensAt
  │
  ├── [Location-level] "Close {Location Name}"         → shift lead (or LOCATION_ADMIN if none)
  │     category: LOCATION_CLOSE, dueAt: closesAt
  │
  └── [Location-level] "Teardown {Location Name}"      → LOCATION_ADMIN
        category: LOCATION_TEARDOWN, dueAt: teardownUntil
```

If a location has no `setupAt`, the `LOCATION_SETUP` task is not generated. Same for `teardownUntil` and `LOCATION_TEARDOWN`.

When a volunteer is assigned to a `VolunteerShift`, `SHIFT_START` and `SHIFT_END` tasks are auto-generated as children of the parent location-level task for that slot (e.g., a shift during setup is a child of `LOCATION_SETUP`; during the open window, a child of `LOCATION_OPEN`; during teardown, a child of `LOCATION_TEARDOWN`). The parent task is determined by which phase the shift's `startAt` falls into. When a volunteer is unassigned, their shift tasks are cancelled.

When a shift lead is assigned to a `LocationTimeSlot`, the `LOCATION_OPEN` and `LOCATION_CLOSE` tasks are reassigned to them. If no shift lead exists, they are assigned to the `LOCATION_ADMIN`. If neither exists, they are assigned to the event's primary `ORGANIZER`.

---

## Notification escalation

The system sends email notifications at two trigger points:

### 1. Task overdue notification

When a task transitions to `OVERDUE` (i.e., `dueAt` is passed and status is still `PENDING`):

- **Shift-level task overdue** → notify the task's `assignedTo` (the volunteer) and the parent task's `assignedTo` (the shift lead / location admin).
- **Location-level task overdue** → notify the task's `assignedTo` and the parent task's `assignedTo` (the event organizer/admin watching that location).
- **Event-level task overdue** → notify the event's `EVENT_ADMIN` and `ORGANIZER` members.

A grace period of **15 minutes** applies before a task is marked `OVERDUE` — i.e., the system waits 15 minutes past `dueAt` before triggering escalation. This prevents false alarms for minor delays.

### 2. Task completed notification (optional, configurable)

When a child task is completed, the parent task assignee can optionally receive a confirmation email. Off by default; event admins can enable per event.

### Notification: task overdue email

**To:** parent task assignee (and task assignee if they are a different person)
**Subject:** `[ACTION REQUIRED] {task.title} is overdue at {eventName}`

**Body includes:**
- Task title and category
- Location name
- Scheduled time and current time
- Link to the task in the tool

---

## Manual tasks

Organisers and coordinators can create manual tasks on top of the auto-generated ones.

```
POST /api/v1/events/{eventId}/tasks
```

Authorization: `EVENT_ADMIN`, `ORGANIZER`, `COORDINATOR`.

Request body:
```json
{
  "title": "Deliver volunteer meals to Stage A",
  "description": "Catering box is in the green room.",
  "assignedToUserId": "<uuid>",
  "dueAt": "2026-08-15T12:30:00+02:00",
  "parentTaskId": "<uuid>"   // optional; links to an existing task
}
```

Manual tasks follow the same status lifecycle and escalation rules as system tasks.

---

## API surface

### List tasks for an event

```
GET /api/v1/events/{eventId}/tasks
```

Authorization: `COORDINATOR` and above see all tasks. `VOLUNTEER`/`STAFF`/`SPEAKER` see only tasks assigned to themselves.

Query parameters:

| Parameter    | Description                                   |
|--------------|-----------------------------------------------|
| `status`     | Filter by TaskStatus                          |
| `category`   | Filter by TaskCategory                        |
| `assignedTo` | Filter by assigned user ID                    |
| `locationId` | Filter tasks for a specific location          |
| `overdue`    | `true` to return only overdue tasks           |

### Complete a task

```
PATCH /api/v1/tasks/{taskId}/complete
```

Authorization: the task's `assignedTo` user, or `COORDINATOR` and above.

- Sets `status = COMPLETED`, `completedAt = now()`, `completedBy = caller`.
- Returns `200 OK` with the updated task.
- If the task has a parent, checks whether all sibling tasks are now complete and optionally notifies the parent assignee.

### Reassign a task

```
PATCH /api/v1/tasks/{taskId}
```

Authorization: `COORDINATOR` and above.

Request body: `{ "assignedToUserId": "<uuid>", "dueAt": "..." }` (both optional).

- Cannot reassign a `COMPLETED` or `CANCELLED` task.

### Cancel a task

```
DELETE /api/v1/tasks/{taskId}
```

Authorization: `EVENT_ADMIN` or `ORGANIZER`. System tasks cannot be manually cancelled (they are cancelled automatically when their context is cancelled).

---

## Neo4j graph model

```
(:Task {id, title, type, category, status, dueAt, completedAt, createdAt})
  -[:ASSIGNED_TO]->   (:User)
  -[:COMPLETED_BY]->  (:User)           // null until completed
  -[:CHILD_OF]->      (:Task)           // null for root tasks
  -[:BELONGS_TO]->    (:Event)
  -[:FOR_SLOT]->      (:LocationTimeSlot)   // for LOCATION_* tasks
  -[:FOR_SHIFT]->     (:VolunteerShift)     // for SHIFT_* tasks
```

---

## Business rules

1. System tasks are generated automatically and cannot be manually created with `type = SYSTEM` via the API.
2. When a `LocationTimeSlot` is cancelled, all its `PENDING` tasks transition to `CANCELLED`.
3. When a `VolunteerShift` is cancelled or a volunteer is unassigned, their `SHIFT_START` and `SHIFT_END` tasks are `CANCELLED`.
4. If a shift lead is changed on a `LocationTimeSlot`, the `LOCATION_OPEN` and `LOCATION_CLOSE` tasks are reassigned to the new shift lead (if `PENDING`; already-completed tasks are not touched).
5. The grace period before `OVERDUE` is 15 minutes and is applied system-wide (not configurable per event in v1).
6. A volunteer can only complete their own `SHIFT_START` / `SHIFT_END` tasks. A coordinator or above can complete any task on behalf of the assignee.
7. Manual tasks with a `parentTaskId` must reference a task belonging to the same event.
8. Event-level root tasks (one per LocationTimeSlot) are assigned to the event's primary `ORGANIZER` at generation time. If reassigned, the new assignee receives escalated notifications.

---

## Open questions

- **Notification opt-out**: should individual users be able to opt out of task notification emails (e.g., volunteers who don't want email reminders)?
- **Task templates**: should organizers be able to define reusable manual task templates (e.g., "pre-event checklist") that get applied to every new location?
- **Grace period configurability**: should the 15-minute overdue grace period be configurable per event in a future version?
