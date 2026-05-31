# Event Planner — Specification Overview

**Status:** Draft — open questions must be resolved before implementation begins.

---

## Vision

A REST API that allows users to plan and coordinate events. An organizer creates an event, invites participants, and tracks RSVPs. Participants can view events they are invited to and respond to invitations.

---

## Domain concepts (initial)

| Concept       | Description                                                              |
|---------------|--------------------------------------------------------------------------|
| **User**      | An authenticated principal. Can be an organizer and/or a participant.    |
| **Event**     | A named happening with a time range and optional location.               |
| **Invitation**| A relationship between an Event and a User with an RSVP status.          |
| **Location**  | A named venue or address associated with zero or more events.            |
| **Schedule**  | (TBD) A set of time slots or sub-events within a parent event.           |

---

## Core capabilities (planned)

- [ ] User registration and authentication
- [ ] Create / read / update / delete events
- [ ] Invite participants to an event
- [ ] RSVP (accept / decline / tentative)
- [ ] View events I own
- [ ] View events I am invited to
- [ ] Location management
- [ ] (stretch) Recurring events
- [ ] (stretch) Email notifications

---

## Open questions

These must be answered before the relevant spec is written.

1. **Authentication mechanism** — OAuth2 / OIDC (external IdP) or local username+password?
2. **Invitation model** — invite by email (user may not exist yet) or only registered users?
3. **Event visibility** — public events anyone can discover, or always private (invite-only)?
4. **Schedule granularity** — does an event have one time range, or multiple sessions/slots?
5. **Multi-tenancy** — are events scoped to an organisation/team, or flat per-user?
6. **API versioning** — `/api/v1/...` prefix from day one, or add later?

---

## Spec index

| File                          | Topic                  | Status  |
|-------------------------------|------------------------|---------|
| `00-overview.md` (this file)  | Vision & open Qs       | Draft   |
| `01-authentication.md`        | Auth & identity        | Pending |
| `02-events.md`                | Event CRUD             | Pending |
| `03-invitations.md`           | Invite & RSVP flow     | Pending |
| `04-locations.md`             | Location management    | Pending |

---

## Non-goals (for v1)

- No frontend / UI — API only.
- No real-time push (WebSocket / SSE).
- No calendar sync (iCal / Google Calendar export).
