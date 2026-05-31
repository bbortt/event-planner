# Event Planner — Specification Overview

**Status:** Active — core decisions resolved; specs being written.

---

## Vision

A REST API that allows users to plan and coordinate events. An organizer creates an event, invites participants, and tracks RSVPs. Participants can view events they are invited to and respond to invitations.

---

## Domain concepts (initial)

| Concept       | Description                                                              |
|---------------|--------------------------------------------------------------------------|
| **User**          | An authenticated principal with a verified email address. Has a platform role and zero or more event roles. |
| **Platform role** | `PLATFORM_ADMIN` (global superuser) or `USER` (default). Stored on the User node. |
| **Event role**    | Per-event role on the User↔Event relationship: `EVENT_ADMIN`, `ORGANIZER`, `COORDINATOR`, `STAFF`, `VOLUNTEER`, `SPEAKER`, `VIEWER`. A user can have different roles in different events. |
| **Location role** | `LOCATION_ADMIN` — scoped to a specific Location within a specific event. Grants location-level management without event-wide powers. |
| **Event**         | A named happening with a status lifecycle (DRAFT → PUBLISHED → COMPLETED / CANCELLED). |
| **Invitation**    | A pending invite to an email address for an event with a specific event role. Has its own state machine. |
| **LocationType**      | An event-scoped label for locations (e.g. "Stage", "Booth"). Reusable within the event. |
| **Location**          | A physical place, event-specific, forming an unbounded tree (child locations nest inside parents). Has a type and optional capacity. |
| **LocationTimeSlot**  | A contiguous open/close window for a location (multiple per location). Has a status and one optional shift lead. |
| **VolunteerShift**    | A working period within a LocationTimeSlot. Volunteers are assigned to shifts, not directly to slots. |

---

## Core capabilities (planned)

- [ ] User registration with email verification
- [ ] Local login (username/password) and session/token management
- [ ] Role assignment (`ORGANIZER`, `VOLUNTEER`)
- [ ] Create / read / update / delete events (organizers only)
- [ ] Invite volunteers to an event by email (email-first — account not required)
- [ ] RSVP (accept / decline / tentative)
- [ ] View events I own
- [ ] View events I am invited to
- [ ] Transactional email via SMTP (verification, invitation, RSVP notifications)
- [ ] Location management
- [ ] (stretch) Recurring events
- [ ] (stretch) Committee-member invite flow (separate from volunteer invite)

---

## Resolved decisions

| Question                   | Decision                                                      |
|----------------------------|---------------------------------------------------------------|
| Authentication mechanism   | Local credentials — Spring Security, we own email verification |
| Invitation model           | Email-first — invite any address; pending-invite state machine |
| Email infrastructure       | Spring Mail + SMTP (Mailhog locally, real SMTP in prod)        |
| Role model                 | Single User entity; role field distinguishes organizer/volunteer |

## Remaining open questions

4. **Event visibility** — resolved: publicly visible within the tool; only volunteer role is self-applicable; all other roles require explicit invitation.
5. **Schedule granularity** — single time range per event, or multiple sessions/slots?
6. **Multi-tenancy** — events scoped to an organisation, or flat per-user?
7. **API versioning** — `/api/v1/...` from day one?
8. **Coordinator scope** — how is a COORDINATOR's scope of locations/applications defined? (shared open question, Specs 05 & 06)

---

## Spec index

| File                          | Topic                                   | Status   |
|-------------------------------|-----------------------------------------|----------|
| `00-overview.md` (this file)  | Vision & decisions                      | Active   |
| `01-authentication.md`        | Registration, login, email verification | Written  |
| `02-invitations.md`           | Invite & RSVP state machine             | Written  |
| `03-email.md`                 | Transactional email via SMTP            | Written  |
| `04-events.md`                | Event CRUD, role model, member mgmt     | Written  |
| `05-locations.md`             | Location hierarchy, time slots, volunteer shifts | Written  |
| `06-volunteer-management.md`  | Registration window, application flow, age enforcement | Written  |

---

## Non-goals (for v1)

- No frontend / UI — API only.
- No real-time push (WebSocket / SSE).
- No calendar sync (iCal / Google Calendar export).
