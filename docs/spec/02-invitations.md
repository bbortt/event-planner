# Spec 02 — Invitations & RSVP

**Status:** Written
**Last updated:** 2026-05-31

---

## Purpose

Define how organizers invite volunteers to events by email, the pending-invite state machine, and how invitees respond (RSVP).

---

## Domain concepts

### Invitation

An `Invitation` represents a request for a specific email address to participate in an event as a volunteer.

| Field          | Type              | Description                                          |
|----------------|-------------------|------------------------------------------------------|
| `id`           | UUID              | system-generated                                     |
| `email`        | String            | the invited address (lowercased)                     |
| `token`        | String            | UUID; included in the invite link; single-use        |
| `status`       | InvitationStatus  | see state machine below                              |
| `role`         | Role              | always `VOLUNTEER` for the volunteer invite endpoint |
| `invitedBy`    | User (ref)        | the organizer who sent the invite                    |
| `event`        | Event (ref)       | the event this invitation belongs to                 |
| `createdAt`    | Instant           | system-generated                                     |
| `expiresAt`    | Instant           | `createdAt + 7 days`; null after acceptance          |
| `respondedAt`  | Instant           | null until RSVP                                      |
| `user`         | User (ref)        | null until the invitee registers or logs in          |

### InvitationStatus

```
PENDING   → ACCEPTED
          → DECLINED
          → EXPIRED   (system-set after expiresAt passes)
DECLINED  → PENDING   (organizer can re-invite)
```

---

## API surface

### Invite a volunteer

```
POST /api/events/{eventId}/invitations
```

Authorization: requires `ORGANIZER` role and ownership of `eventId`.

Request body:
```json
{
  "email": "bob@example.com"
}
```

- Creates an `Invitation` with status `PENDING` and a fresh `token`.
- If an active (non-expired, non-declined) invitation for this email+event already exists: `409 Conflict`.
- If the email belongs to an existing verified user: link the invitation to that user immediately.
- Sends an invitation email to the address (see Spec 03).
- Returns `201 Created` with the invitation resource (token is **not** included in the response).

### List invitations for an event

```
GET /api/events/{eventId}/invitations
```

Authorization: `ORGANIZER` who owns the event.

Returns the list of invitations with status, email, respondedAt.

### Cancel an invitation

```
DELETE /api/events/{eventId}/invitations/{invitationId}
```

Authorization: `ORGANIZER` who owns the event.

- Only allowed if status is `PENDING`.
- Deletes the invitation; the invite link is invalidated.
- Returns `204 No Content`.

### Accept an invitation (invitee action)

```
POST /api/invitations/accept?token={token}
```

**Public endpoint** (no JWT required — this is the link from the email).

Flow:
1. Look up invitation by `token`. If not found or expired → `400`.
2. If `status != PENDING` → `409` (already responded).
3. **Case A — caller is already authenticated (valid JWT in header):**
   - Link the invitation to the authenticated user.
   - Set `status = ACCEPTED`, `respondedAt = now()`, clear `token`.
4. **Case B — no JWT (user not registered yet):**
   - Return `202 Accepted` with `{ "requiresRegistration": true, "token": "<token>" }`.
   - The token is preserved so the frontend can POST to `/api/auth/register` with it, completing registration and acceptance in one step.
5. Sends RSVP-confirmed email to invitee and notification email to organizer.

### Register + accept in one step

```
POST /api/auth/register?inviteToken={token}
```

Same as normal registration, but if `inviteToken` is present:
- Validates the invite token.
- Registers the user (sends verification email).
- After email verification, automatically accepts the invitation (status → `ACCEPTED`).

### Decline an invitation

```
POST /api/invitations/decline?token={token}
```

Public endpoint.

- Same token lookup and expiry checks as accept.
- Sets `status = DECLINED`, `respondedAt = now()`, clears `token`.
- Returns `200 OK`.
- Sends notification email to organizer.

### Re-invite after decline

Organizer calls `POST /api/events/{eventId}/invitations` again with the same email. A declined invitation is re-activated: new `token`, new `expiresAt`, status back to `PENDING`.

---

## State machine diagram

```
                     [organizer invites]
                            │
                            ▼
                         PENDING ◄─────────────────────────┐
                        /       \                           │
             [accept]  /         \ [decline]                │
                      /           \                         │ [re-invite]
                     ▼             ▼                        │
                 ACCEPTED        DECLINED ────────────────► │
                                                            
          [7 days pass, no response]
                     │
                     ▼
                  EXPIRED
```

---

## Business rules

1. An organizer can only invite volunteers to events they own.
2. An email address can have at most one active (PENDING or ACCEPTED) invitation per event.
3. Invitation tokens are single-use: once the invite is accepted or declined, the token is cleared.
4. Expired invitations are set by a scheduled job (see Spec 03 / infrastructure notes); the API treats them as expired on read even if the job hasn't run yet (compare `expiresAt` with `now()`).
5. An organizer cannot revoke an already-accepted invitation through the API in v1 (would require a separate "remove participant" flow).
6. RSVP emails (confirmation to invitee, notification to organizer) are fire-and-forget; invitation status does not depend on email delivery.

---

## Open questions

- Should `TENTATIVE` be a valid RSVP status in v1, or just accept/decline?
- Should the organizer receive a realtime notification (email) when someone RSVPs, or only a summary?
