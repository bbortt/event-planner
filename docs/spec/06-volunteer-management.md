# Spec 06 — Volunteer Management

**Status:** Written
**Last updated:** 2026-05-31

---

## Purpose

Define how volunteers self-register for an event during an open registration window, how organisers and coordinators review and approve applications, and how approved volunteers are assigned to shifts. Also covers profile data, age restriction enforcement, and communication.

---

## Two paths to becoming a VOLUNTEER

| Path | Initiator | Approval required | Spec |
|------|-----------|-------------------|------|
| **Invitation** | Organiser sends invite by email | No — invitee RSVPs directly | Spec 02 |
| **Self-application** | User applies during registration window | Yes — ORGANISER or COORDINATOR approves | This spec |

Both paths result in the same `HAS_EVENT_ROLE {role: "VOLUNTEER"}` relationship on the graph. A user who already holds any event role cannot submit an application (single-role-per-event constraint, see Spec 04).

---

## User profile additions

These fields extend the `User` entity defined in Spec 01. All are optional at registration; some become required when submitting a volunteer application (noted below).

| Field                | Type           | Constraints                                          | Required for application |
|----------------------|----------------|------------------------------------------------------|--------------------------|
| `address.street`     | String         | max 200 chars                                        | Yes                      |
| `address.city`       | String         | max 100 chars                                        | Yes                      |
| `address.postalCode` | String         | max 20 chars                                         | Yes                      |
| `address.country`    | String         | ISO 3166-1 alpha-2 country code                      | Yes                      |
| `birthdate`          | LocalDate      | must be in the past; user must be ≥ 14 at submission | Yes                      |
| `phoneNumber`        | String         | E.164 format recommended; max 30 chars               | Yes                      |
| `clothingSize`       | String         | free text; e.g. "M", "XL", "38"                     | No                       |
| `skills`             | List\<String\> | free tags; e.g. ["first-aid", "german", "forklift"]  | No                       |
| `dietaryRestrictions`| List\<String\> | free tags; e.g. ["vegan", "gluten-free"]             | No                       |

Profile data is stored once on the `User` node and reused across all events. Users can update their profile at any time; changes apply to future applications only (accepted applications snapshot nothing — shifts reference the live user).

---

## Registration period

Events carry two timestamps and a manual override flag that together control whether self-application is open.

| Field                      | Type           | Description |
|----------------------------|----------------|-------------|
| `registrationOpensAt`      | OffsetDateTime | System automatically opens registration at this time |
| `registrationClosesAt`     | OffsetDateTime | System automatically closes registration at this time |
| `registrationForceOpen`    | boolean        | If `true`, registration stays open regardless of `registrationClosesAt` |

**Effective registration state** (computed, not stored):

```
open  ← (now ≥ registrationOpensAt AND now < registrationClosesAt)
        OR registrationForceOpen == true
```

Organizers set `registrationOpensAt` / `registrationClosesAt` when configuring the event. They can toggle `registrationForceOpen` at any time to keep registration live while simultaneously running assignments (the under-staffed scenario).

Both timestamps must fall within the event's `[startAt, endAt]` window. `registrationOpensAt` must be before `registrationClosesAt`.

---

## VolunteerApplication entity

| Field         | Type                | Description |
|---------------|---------------------|-------------|
| `id`          | UUID                | system-generated |
| `user`        | User (ref)          | the applicant |
| `event`       | Event (ref)         | the event applied to |
| `status`      | ApplicationStatus   | see below |
| `appliedAt`   | OffsetDateTime      | system-generated |
| `reviewedAt`  | OffsetDateTime      | null until reviewed |
| `reviewedBy`  | User (ref)          | the ORGANISER or COORDINATOR who reviewed |
| `note`        | String              | optional free-text from the applicant (max 1000 chars) |
| `reviewNote`  | String              | optional free-text from the reviewer (e.g. reason for rejection) |

### ApplicationStatus lifecycle

```
PENDING ──► APPROVED ──► (user receives VOLUNTEER event role)
        │
        └──► REJECTED ──► PENDING  (applicant may re-apply if window is still open,
                                    unless organiser explicitly blocks re-application)
```

- `PENDING`: submitted; awaiting organiser/coordinator review.
- `APPROVED`: accepted; the user is granted `HAS_EVENT_ROLE {role: "VOLUNTEER"}` on the event.
- `REJECTED`: declined; the applicant is notified by email. They may re-apply while the window is open.

A user can have at most one non-rejected application per event at a time.

---

## Assignment phase

There is no automatic assignment algorithm. After (or alongside) the registration period, organisers and coordinators manually assign approved volunteers to volunteer shifts (see Spec 05).

The system supports this through the shift assignment API (`PUT .../shifts/{shiftId}/volunteers/{userId}`), with two automatic enforcement checks on every assignment:

1. **Double-booking** — rejects if the user has any overlapping shift across the entire event (Spec 05, rule 11).
2. **Age restriction** — rejects if the shift's location carries a `minimumAge` that the volunteer does not meet based on their `birthdate` (see below).

There is no explicit "start assigning" action in the API — organisers simply begin making assignments. The `registrationForceOpen` flag is the mechanism for "keep accepting applications while we assign."

### Viewing unassigned volunteers

```
GET /api/events/{eventId}/volunteers/unassigned
```

Returns all approved volunteers who have no shift assignments yet. Useful for organisers working through the assignment queue.

---

## Age restriction enforcement

`Location.minimumAge` is an optional integer (null = no restriction). On `PUT .../shifts/{shiftId}/volunteers/{userId}`:

1. Resolve the shift's location.
2. Walk up the location tree — the **effective minimum age** for a shift is the maximum `minimumAge` across the shift's location and all its ancestors. (A child location inside an 18+ venue is implicitly 18+.)
3. If effective minimum age is set: compute the volunteer's age from `User.birthdate` and the shift's `startAt` date.
4. If age < effective minimum age → reject `403 Forbidden` with body `{ "error": "AGE_RESTRICTION", "minimumAge": 18, "location": "Bar Area" }`.

Age is computed as of the shift's `startAt`, not today's date (a volunteer who turns 18 the day of the shift is eligible).

---

## API surface

### Registration period management

```
PATCH /api/events/{eventId}/registration
```

Authorization: `EVENT_ADMIN` or `ORGANIZER`.

Request body (all fields optional — only provided fields are updated):
```json
{
  "registrationOpensAt":  "2026-07-01T00:00:00+02:00",
  "registrationClosesAt": "2026-07-31T23:59:59+02:00",
  "registrationForceOpen": true
}
```

### Self-apply as volunteer

```
POST /api/events/{eventId}/applications
```

Authorization: any authenticated user with `platformRole = USER`. User must not already hold an event role in this event.

- Rejected if effective registration state is not `open`.
- Rejected if user's profile is missing required fields (address, birthdate, phoneNumber).
- Rejected if an active (PENDING or APPROVED) application already exists.
- Returns `201 Created` with the application resource.
- Sends confirmation email to applicant (see email catalogue update).

Request body:
```json
{
  "note": "I have first aid training and speak German and English."
}
```

### List applications

```
GET /api/events/{eventId}/applications
GET /api/events/{eventId}/applications?status=PENDING
```

Authorization: `EVENT_ADMIN`, `ORGANIZER`, `COORDINATOR` (coordinators see all PENDING; cannot see REJECTED unless also ORGANIZER+).

### Review an application

```
PATCH /api/events/{eventId}/applications/{applicationId}
```

Authorization: `EVENT_ADMIN`, `ORGANIZER`, or `COORDINATOR`.

Request body:
```json
{
  "status": "APPROVED",
  "reviewNote": "Welcome aboard!"
}
```

- On `APPROVED`: creates `HAS_EVENT_ROLE {role: "VOLUNTEER"}` for the user; sends approval email.
- On `REJECTED`: sends rejection email with `reviewNote` included.
- A `COORDINATOR` cannot approve an application if doing so would exceed the event's total volunteer count relative to available shifts (soft warning returned in response, not a hard block).

### View unassigned volunteers

```
GET /api/events/{eventId}/volunteers/unassigned
```

Authorization: `EVENT_ADMIN`, `ORGANIZER`, `COORDINATOR`.

### User profile

```
GET  /api/users/me
PUT  /api/users/me
```

Authorization: authenticated user (own profile only). `PLATFORM_ADMIN` can also `GET /api/users/{userId}`.

`PUT` body includes all updatable profile fields (address, birthdate, phoneNumber, clothingSize, skills, dietaryRestrictions).

---

## Email catalogue additions (extends Spec 03)

| Trigger | To | Subject |
|---|---|---|
| Application submitted | Applicant | `Your volunteer application for {eventName} is under review` |
| Application approved | Applicant | `You're approved as a volunteer for {eventName}` |
| Application rejected | Applicant | `Update on your volunteer application for {eventName}` |
| Assigned to shift | Volunteer | `You've been assigned a shift at {eventName}` |

Assignment email body includes: location name, shift start/end time, shift lead name and contact (if set).

---

## Business rules

1. A user can only hold one role per event at a time (Spec 04). Submitting an application while already holding a role is rejected.
2. A `PLATFORM_ADMIN` does not need to apply; they are implicitly `EVENT_ADMIN` everywhere.
3. Required profile fields (address, birthdate, phoneNumber) must be complete before an application can be submitted. The API returns `422 Unprocessable Entity` with a list of missing fields.
4. A volunteer's profile data is live — there is no snapshot taken at application or assignment time. Changes to `birthdate` after assignment will affect future age-restriction checks on re-assignment.
5. Age is computed against the shift's `startAt` date, not the current date.
6. The effective `minimumAge` for a location is the maximum across the location and all its ancestors in the location tree.
7. `COORDINATOR` can approve applications and assign volunteers to shifts, but only within their defined scope (open question — see below).
8. Withdrawal: a volunteer can withdraw from an event (`DELETE /api/events/{eventId}/members/{userId}` on themselves) before the event starts. Their shift assignments are removed. Organizer is notified by email.

---

## Open questions

- **Coordinator scope**: which applications and which shifts can a `COORDINATOR` review and assign? (Shared open question with Spec 05.)
- **Re-application after rejection**: can an organiser permanently block re-application for a specific user (e.g., for conduct reasons)?
- **Waitlist**: if registration is closed but under-staffed and `registrationForceOpen` is false, should there be a waitlist mechanism?
- **Skill matching**: should the system surface skill mismatches as warnings during assignment (e.g., assigning someone without first-aid training to a first-aid post)?
