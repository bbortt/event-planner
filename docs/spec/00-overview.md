# Event Planner — Specification Overview

**Status:** Active — core decisions resolved; specs being written.

---

## Vision

A REST API that allows users to plan and coordinate events. An organizer creates an event, invites participants, and tracks RSVPs. Participants can view events they are invited to and respond to invitations.

---

## Domain concepts (initial)

| Concept       | Description                                                              |
|---------------|--------------------------------------------------------------------------|
| **User**       | An authenticated principal with a verified email address. Carries one or more roles. |
| **Role**       | `ORGANIZER` (committee member) or `VOLUNTEER`. Stored on the User; same entity in DB. |
| **Event**      | A named happening with a time range and optional location.                            |
| **Invitation** | A pending invite to an email address for an event. Becomes linked to a User on registration/login. Has an RSVP status. |
| **Location**   | A named venue or address associated with zero or more events.                         |
| **Schedule**   | (TBD) A set of time slots or sub-events within a parent event.                        |

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

4. **Event visibility** — public events anyone can discover, or always invite-only?
5. **Schedule granularity** — single time range per event, or multiple sessions/slots?
6. **Multi-tenancy** — events scoped to an organisation, or flat per-user?
7. **API versioning** — `/api/v1/...` from day one?

---

## Spec index

| File                          | Topic                       | Status   |
|-------------------------------|-----------------------------|----------|
| `00-overview.md` (this file)  | Vision & decisions          | Active   |
| `01-authentication.md`        | Registration, login, email verification | Written |
| `02-invitations.md`           | Invite & RSVP state machine | Written  |
| `03-email.md`                 | Transactional email via SMTP| Written  |
| `04-events.md`                | Event CRUD                  | Pending  |
| `05-locations.md`             | Location management         | Pending  |

---

## Non-goals (for v1)

- No frontend / UI — API only.
- No real-time push (WebSocket / SSE).
- No calendar sync (iCal / Google Calendar export).
