# Spec 04 — Events

**Status:** Written
**Last updated:** 2026-05-31

---

## Purpose

Define the event entity, its lifecycle, the role model that governs access, and the CRUD API.

---

## Role model

### Platform roles

Stored on the `User` node. Applies globally.

| Role              | Description                                                                    |
|-------------------|--------------------------------------------------------------------------------|
| `PLATFORM_ADMIN`  | Full access everywhere. Implicitly holds `EVENT_ADMIN` on every event.         |
| `USER`            | Default. Can create events (becomes `EVENT_ADMIN` of that event) and be invited to events. |

### Event roles

Stored as a property on the `HAS_EVENT_ROLE` relationship between `User` and `Event`. A user has exactly one event role per event.

| Role          | Description                                                                         |
|---------------|-------------------------------------------------------------------------------------|
| `EVENT_ADMIN` | Full control of the event: edit details, manage members, delete event.              |
| `ORGANIZER`   | Can edit event details, manage locations, invite members, manage schedules.         |
| `COORDINATOR` | Can manage volunteers assigned to their area; can check in attendees. Cannot edit event-level details. |
| `STAFF`       | Paid/contracted worker. Same data access as `VOLUNTEER`; semantically distinct.     |
| `VOLUNTEER`   | Helper. Can view event details, see their assignments, update their own RSVP.       |
| `SPEAKER`     | Scheduled presenter/performer. Read-only access to the event; visible on the programme. |
| `VIEWER`      | Read-only. Can see event and location details they are explicitly given access to.  |

**Permission inheritance (for authorization checks):**

```
PLATFORM_ADMIN
  └── EVENT_ADMIN
        └── ORGANIZER
              └── COORDINATOR
                    ├── STAFF
                    ├── VOLUNTEER
                    └── SPEAKER
                          └── VIEWER
```

`COORDINATOR` can do everything `VOLUNTEER`/`STAFF`/`SPEAKER` can, plus coordination actions. `ORGANIZER` can do everything `COORDINATOR` can, plus event-level management. Etc.

### Location-scoped role

Stored on the `IS_LOCATION_ADMIN` relationship between `User` and `Location`, with an `eventId` property to scope it to a specific event.

| Role             | Description                                                                        |
|------------------|------------------------------------------------------------------------------------|
| `LOCATION_ADMIN` | Can edit location details (name, address, capacity), manage sub-tasks and schedules at that location, and view the member list assigned there. No event-wide permissions. |

A user can be `LOCATION_ADMIN` at a location regardless of their event role (a `VOLUNTEER` could be `LOCATION_ADMIN` for the backstage area, for example). A `LOCATION_ADMIN` who is also an `ORGANIZER` does not gain any additional location powers — their `ORGANIZER` event role already covers location management.

---

## Event entity

| Field         | Type          | Constraints                                                  |
|---------------|---------------|--------------------------------------------------------------|
| `id`          | UUID          | system-generated, immutable                                  |
| `name`        | String        | required, max 200 chars                                      |
| `description` | String        | optional, max 5000 chars                                     |
| `status`      | EventStatus   | see lifecycle below                                          |
| `startAt`     | OffsetDateTime| required; must be in the future at creation                  |
| `endAt`       | OffsetDateTime| required; must be after `startAt`                            |
| `createdAt`   | OffsetDateTime| system-generated                                             |
| `updatedAt`   | OffsetDateTime| system-updated on every write                                |

### EventStatus lifecycle

```
DRAFT ──► PUBLISHED ──► CANCELLED
  │                         ▲
  └────────────────────────►┘

PUBLISHED ──► COMPLETED  (set automatically or manually once endAt has passed)
```

- `DRAFT`: only visible to the event's members. Cannot accept RSVPs yet.
- `PUBLISHED`: visible to invited members; invitations can be sent and RSVPs collected.
- `CANCELLED`: no further edits; members are notified by email.
- `COMPLETED`: read-only archive state. Set by organizer or automatically after `endAt`.

---

## API surface

### Create an event

```
POST /api/events
```

Authorization: any authenticated `USER` or `PLATFORM_ADMIN`.

Request body:
```json
{
  "name": "Summer Gala 2026",
  "description": "Annual fundraising gala.",
  "startAt": "2026-08-15T18:00:00+02:00",
  "endAt":   "2026-08-15T23:00:00+02:00"
}
```

- Creates the event with `status = DRAFT`.
- The calling user is automatically assigned the `EVENT_ADMIN` role for this event.
- Returns `201 Created` with the full event resource.

### Get an event

```
GET /api/events/{eventId}
```

Authorization: any member of the event (any event role), or `PLATFORM_ADMIN`.

Returns the event resource including current status and the caller's role.

### List my events

```
GET /api/events
```

Authorization: any authenticated user.

Returns all events where the caller has any event role. Supports query parameters:

| Parameter  | Description                                      |
|------------|--------------------------------------------------|
| `status`   | Filter by EventStatus (e.g. `?status=PUBLISHED`) |
| `role`     | Filter by caller's role in the event             |
| `page`     | Pagination (0-indexed)                           |
| `size`     | Page size (default 20, max 100)                  |

### Update an event

```
PUT /api/events/{eventId}
```

Authorization: `EVENT_ADMIN` or `ORGANIZER` of this event, or `PLATFORM_ADMIN`.

Request body: same shape as create (all fields optional; only provided fields are updated).

- Cannot change `startAt` / `endAt` if `status = COMPLETED` or `CANCELLED`.
- Changing `status` from `PUBLISHED` → `CANCELLED` sends cancellation emails to all members.
- Returns `200 OK` with the updated event resource.

### Delete an event

```
DELETE /api/events/{eventId}
```

Authorization: `EVENT_ADMIN` of this event, or `PLATFORM_ADMIN`.

- Only allowed if `status = DRAFT`. Published events must be cancelled first.
- Cascades: removes all invitations, memberships, and location associations for this event.
- Returns `204 No Content`.

### List members of an event

```
GET /api/events/{eventId}/members
```

Authorization: any member of the event, or `PLATFORM_ADMIN`.

Returns list of `{ userId, email, eventRole, locationAdminOf[] }`.

### Update a member's event role

```
PATCH /api/events/{eventId}/members/{userId}
```

Authorization: `EVENT_ADMIN` of this event, or `PLATFORM_ADMIN`.

Request body: `{ "role": "COORDINATOR" }`

- Cannot downgrade the last `EVENT_ADMIN` — the event must always have at least one.

### Remove a member from an event

```
DELETE /api/events/{eventId}/members/{userId}
```

Authorization: `EVENT_ADMIN` or `ORGANIZER`, or `PLATFORM_ADMIN`. A user cannot remove themselves if they are the last `EVENT_ADMIN`.

### Grant / revoke location admin

```
PUT  /api/events/{eventId}/locations/{locationId}/admins/{userId}
DELETE /api/events/{eventId}/locations/{locationId}/admins/{userId}
```

Authorization: `EVENT_ADMIN` or `ORGANIZER` of this event, or `PLATFORM_ADMIN`.

- The target user must already be a member of the event.
- `PUT` is idempotent.

---

## Neo4j graph model

```
(:User {platformRole})
  -[:HAS_EVENT_ROLE {role}]->
(:Event {id, name, description, status, startAt, endAt, createdAt, updatedAt})

(:User)
  -[:IS_LOCATION_ADMIN {eventId}]->
(:Location)
  -[:USED_IN {eventId}]->
(:Event)
```

The `HAS_EVENT_ROLE` relationship is the event membership edge. Every member of an event has exactly one such relationship per event.

---

## Business rules

1. Every event must have at least one `EVENT_ADMIN` at all times.
2. A `PLATFORM_ADMIN` acts as an implicit `EVENT_ADMIN` on all events and cannot be removed from one.
3. `status` transitions are one-way except `DRAFT` → `PUBLISHED` → `CANCELLED` (no re-opening a cancelled event).
4. `startAt` must be before `endAt`; both must be future timestamps at creation time (not enforced on update to allow minor corrections).
5. Invitations (Spec 02) can only be sent for events with `status = DRAFT` or `PUBLISHED`.
6. A `COORDINATOR` can be granted `LOCATION_ADMIN` to give them management rights over a specific area without elevating them to `ORGANIZER`.
7. Removing a member also removes any `LOCATION_ADMIN` relationships they hold for that event.
8. Deleting an event also cancels and removes all outstanding invitations.

---

## Open questions

- Should `GET /api/events` support searching/filtering by name or date range?
- Should events have a maximum-capacity field (max number of volunteers/attendees)?
- How does `COMPLETED` status get set — scheduled job, manual organizer action, or both?
