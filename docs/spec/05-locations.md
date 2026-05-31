# Spec 05 — Locations

**Status:** Written
**Last updated:** 2026-05-31

---

## Purpose

Define the physical location model: the event-scoped type system, the unbounded location hierarchy, open/close time slots with shift leads, and the volunteer shift sub-divisions within those slots.

---

## Domain concepts

### LocationType

A label categorising locations within a single event. Defined and owned by the event; reusable across all locations in that event.

| Field         | Type    | Constraints                          |
|---------------|---------|--------------------------------------|
| `id`          | UUID    | system-generated                     |
| `name`        | String  | required; unique within the event    |
| `description` | String  | optional                             |
| `color`       | String  | optional; hex colour code (`#RRGGBB`) for UI display |

Examples: "Main Stage", "Food Booth", "Backstage", "Entrance Gate", "Parking".

---

### Location

A physical place where part of the event happens. Locations are **event-specific** — they are not shared across events. Locations form an unbounded tree via the `CHILD_OF` relationship; root locations (no parent) are the top-level venues of the event.

| Field         | Type         | Constraints                                          |
|---------------|--------------|------------------------------------------------------|
| `id`          | UUID         | system-generated                                     |
| `name`        | String       | required; unique within its parent scope (siblings)  |
| `description` | String       | optional                                             |
| `type`        | LocationType | required; must belong to the same event              |
| `capacity`    | Integer      | optional; max number of volunteers/staff on-site simultaneously |
| `event`       | Event (ref)  | the owning event                                     |
| `parent`      | Location (ref) | optional; null for root locations                  |

**Tree invariant:** a location cannot be its own ancestor (no cycles).

---

### LocationTimeSlot

A contiguous open/active window for a location. A location can have multiple non-overlapping time slots — it opens, closes, and can reopen within the event's overall time range. Each slot has exactly one optional shift lead.

| Field       | Type               | Constraints                                              |
|-------------|--------------------|---------------------------------------------------------|
| `id`        | UUID               | system-generated                                         |
| `startAt`   | OffsetDateTime     | required; must be ≥ event `startAt`                      |
| `endAt`     | OffsetDateTime     | required; must be ≤ event `endAt`; must be after `startAt` |
| `status`    | SlotStatus         | see lifecycle below                                      |
| `location`  | Location (ref)     | the location this slot belongs to                        |
| `shiftLead` | User (ref)         | optional; the on-the-ground responsible person during this window |

**SlotStatus lifecycle:**
```
SCHEDULED ──► OPEN ──► CLOSED
     │                    ▲
     └────────────────────┘  (cancelled slot skips OPEN)
     │
     ▼
CANCELLED
```

- `SCHEDULED`: planned but not yet started.
- `OPEN`: currently active; status may be set manually or by a future scheduled job.
- `CLOSED`: finished; no further volunteer shifts can start.
- `CANCELLED`: slot will not happen; volunteer shifts within it are also cancelled.

**Invariant:** no two time slots for the same location may overlap.

---

### VolunteerShift

A sub-period within a `LocationTimeSlot` to which one or more volunteers are assigned. Volunteer shifts subdivide the location's open window into working periods.

| Field            | Type               | Constraints                                                      |
|------------------|--------------------|------------------------------------------------------------------|
| `id`             | UUID               | system-generated                                                 |
| `startAt`        | OffsetDateTime     | required; must be ≥ parent `LocationTimeSlot.startAt`            |
| `endAt`          | OffsetDateTime     | required; must be ≤ parent `LocationTimeSlot.endAt`; after `startAt` |
| `locationTimeSlot` | LocationTimeSlot (ref) | the containing open window                               |

A `VolunteerShift` belongs to exactly one `LocationTimeSlot`. Multiple shifts may cover the same period (multiple volunteers working simultaneously). Shifts may not extend beyond the slot's bounds.

**Assignment:** A volunteer (any user with an event role) is assigned to a `VolunteerShift` via the `ASSIGNED_TO` relationship. A single user can be assigned to multiple shifts across different locations and slots.

---

## Neo4j graph model

```
(:Event)
  -[:HAS_LOCATION_TYPE]->
(:LocationType {id, name, description, color})

(:Location {id, name, description, capacity})
  -[:BELONGS_TO]->  (:Event)
  -[:OF_TYPE]->     (:LocationType)
  -[:CHILD_OF]->    (:Location)           // optional; absent for root locations

(:Location)
  -[:HAS_TIME_SLOT]->
(:LocationTimeSlot {id, startAt, endAt, status})
  -[:HAS_SHIFT_LEAD]->  (:User)           // optional; 0 or 1

(:LocationTimeSlot)
  -[:HAS_VOLUNTEER_SHIFT]->
(:VolunteerShift {id, startAt, endAt})
  -[:ASSIGNED_TO]->  (:User)              // 1 or more

(:User)
  -[:IS_LOCATION_ADMIN]->  (:Location)    // system permission (see Spec 04)
```

---

## API surface

### Location types

```
POST   /api/events/{eventId}/location-types          Create a location type
GET    /api/events/{eventId}/location-types          List all types for the event
PUT    /api/events/{eventId}/location-types/{typeId} Update a type
DELETE /api/events/{eventId}/location-types/{typeId} Delete a type (only if no locations use it)
```

Authorization: `EVENT_ADMIN` or `ORGANIZER`, or `PLATFORM_ADMIN`.

---

### Locations

```
POST   /api/events/{eventId}/locations               Create a root location
POST   /api/events/{eventId}/locations/{locationId}/children   Create a child location
GET    /api/events/{eventId}/locations               List root locations (shallow)
GET    /api/events/{eventId}/locations/{locationId}  Get a location (with immediate children)
GET    /api/events/{eventId}/locations/{locationId}/tree  Get full subtree
PUT    /api/events/{eventId}/locations/{locationId}  Update a location
DELETE /api/events/{eventId}/locations/{locationId}  Delete (only if no children and no time slots)
```

Authorization for write operations: `EVENT_ADMIN`, `ORGANIZER`, or `LOCATION_ADMIN` of that location.
Authorization for reads: any event member.

**Create location request body:**
```json
{
  "name": "Food Booth A",
  "description": "Western corner of the food court.",
  "typeId": "<uuid>",
  "capacity": 4,
  "parentId": "<uuid>"   // omit for root location
}
```

---

### Location time slots

```
POST   /api/events/{eventId}/locations/{locationId}/time-slots
GET    /api/events/{eventId}/locations/{locationId}/time-slots
PUT    /api/events/{eventId}/locations/{locationId}/time-slots/{slotId}
DELETE /api/events/{eventId}/locations/{locationId}/time-slots/{slotId}
PATCH  /api/events/{eventId}/locations/{locationId}/time-slots/{slotId}/status
```

Authorization for write: `EVENT_ADMIN`, `ORGANIZER`, or `LOCATION_ADMIN` of this location.
Authorization for read: any event member.

**Create time slot request body:**
```json
{
  "startAt": "2026-08-15T08:00:00+02:00",
  "endAt":   "2026-08-15T16:00:00+02:00",
  "shiftLeadUserId": "<uuid>"   // optional
}
```

**Status update request body:**
```json
{ "status": "OPEN" }
```

- Status transitions are validated against the lifecycle (e.g., cannot reopen a `CLOSED` slot).
- `DELETE` is only allowed if `status = SCHEDULED` and there are no volunteer shifts.

---

### Volunteer shifts

```
POST   /api/events/{eventId}/locations/{locationId}/time-slots/{slotId}/shifts
GET    /api/events/{eventId}/locations/{locationId}/time-slots/{slotId}/shifts
DELETE /api/events/{eventId}/locations/{locationId}/time-slots/{slotId}/shifts/{shiftId}
```

**Assign / unassign a volunteer to a shift:**
```
PUT    .../shifts/{shiftId}/volunteers/{userId}
DELETE .../shifts/{shiftId}/volunteers/{userId}
```

Authorization: `EVENT_ADMIN`, `ORGANIZER`, `COORDINATOR`, or `LOCATION_ADMIN` of this location.

**Create shift request body:**
```json
{
  "startAt": "2026-08-15T08:00:00+02:00",
  "endAt":   "2026-08-15T12:00:00+02:00"
}
```

Returns the created shift; volunteer assignment is a separate call.

---

## Business rules

1. `LocationType` must belong to the same event as the location that uses it. Cross-event type references are rejected.
2. A location's time slots must not overlap. The API rejects any slot whose `[startAt, endAt)` interval intersects an existing slot for the same location.
3. All time slot times must fall within the parent event's `[startAt, endAt]` window.
4. A volunteer shift's `[startAt, endAt)` must fall entirely within its parent `LocationTimeSlot`'s bounds. A shift cannot span across two location time slots.
5. A user can be assigned to multiple volunteer shifts (at the same or different locations) as long as the time windows do not overlap with other shifts at the *same* location. Overlap across different locations is permitted (a user might be floating).
6. Deleting a location cascades to all its time slots, all volunteer shifts within those slots, and all volunteer assignments. Child locations must be deleted first (no cascade up the tree).
7. The shift lead of a time slot must be a member of the event (have any event role). They do not need to be `LOCATION_ADMIN`.
8. `LOCATION_ADMIN` (system permission) grants: create/edit/delete this location's time slots; create/edit/delete volunteer shifts; assign/unassign volunteers and shift leads. It does not grant permissions on sibling or parent locations.
9. **Shift lead and `LOCATION_ADMIN` are fully independent.** `LOCATION_ADMIN` is a system permission governing what the user can do in the tool. Shift lead is an operational, real-world designation — who is physically responsible on-site during that window. Being a shift lead confers no system permissions; holding `LOCATION_ADMIN` does not make someone a shift lead.
10. **Capacity** is stored on the location for informational purposes only. The system does not enforce it — no assignment is rejected on the basis of capacity.
11. **Volunteer double-booking is blocked system-wide.** When assigning a user to a volunteer shift, the system checks all their existing shift assignments across the entire event. If any existing shift's `[startAt, endAt)` overlaps with the new shift's interval — regardless of location — the assignment is rejected with `409 Conflict` and a message identifying the conflicting shift.
12. A `COORDINATOR` may assign volunteers to shifts at locations they have been explicitly associated with (TBD: mechanism for coordinator scope — open question).

---

## Open questions

- **Coordinator scope**: how is a `COORDINATOR`'s scope of locations defined? Is it explicit (a list of locations assigned to them), or derived from the volunteer shifts they manage?
