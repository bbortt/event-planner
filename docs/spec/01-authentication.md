# Spec 01 — Authentication & Identity

**Status:** Written
**Last updated:** 2026-05-31

---

## Purpose

Define how users register, verify their email, log in, and are authorised to act within the system.

---

## Domain concepts

### User

A `User` is the single identity entity. Fields:

| Field               | Type         | Constraints                                          |
|---------------------|--------------|------------------------------------------------------|
| `id`                | UUID         | system-generated, immutable                          |
| `email`             | String       | unique, required, verified                           |
| `passwordHash`      | String       | BCrypt, never exposed in responses                   |
| `platformRole`      | PlatformRole | `PLATFORM_ADMIN` or `USER` (default)                 |
| `emailVerified`     | boolean      | `false` until verification link clicked              |
| `verificationToken` | String       | UUID; null after verification                        |
| `createdAt`         | Instant      | system-generated                                     |

Event-level roles (`EVENT_ADMIN`, `ORGANIZER`, `COORDINATOR`, `STAFF`, `VOLUNTEER`, `SPEAKER`, `VIEWER`) are **not** stored on the User node — they live on the `HAS_EVENT_ROLE` relationship between the User and each Event. See Spec 04.

### Platform role

`PlatformRole` is an enum stored on the `User` node.

```
PLATFORM_ADMIN  — superuser; implicit EVENT_ADMIN on all events
USER            — default; can create events and be invited to events
```

---

## API surface

### Registration

```
POST /api/auth/register
```

Request body:
```json
{
  "email": "alice@example.com",
  "password": "..."
}
```

- `email` must be unique; 409 if already taken.
- `password` must be ≥ 12 characters.
- `role` is ignored at registration — all new users receive `platformRole = USER`. Event roles are assigned via invitations or member management after the fact.
- On success: creates User with `emailVerified=false`, sends verification email, returns `202 Accepted`.
- Response body: `{ "message": "Verification email sent." }` — no tokens yet.

### Email verification

```
GET /api/auth/verify?token={verificationToken}
```

- Looks up user by `verificationToken`.
- Sets `emailVerified=true`, clears `verificationToken`.
- Returns `200 OK` with a short confirmation message.
- Token expires after 24 hours (after which the user must request a new one).
- Invalid or expired token: `400 Bad Request`.

### Resend verification email

```
POST /api/auth/resend-verification
```

Request body: `{ "email": "alice@example.com" }`

- Only valid if `emailVerified=false`.
- Rate-limited: max 3 requests per hour per email.
- Always returns `202 Accepted` (no information leakage about whether the address exists).

### Login

```
POST /api/auth/login
```

Request body:
```json
{
  "email": "alice@example.com",
  "password": "..."
}
```

- Rejects login if `emailVerified=false` → `403 Forbidden` with body `{ "error": "EMAIL_NOT_VERIFIED" }`.
- On success: returns a signed JWT (access token) and a refresh token.
- JWT payload: `sub` (userId), `email`, `platformRole`, `iat`, `exp` (15 min). Event roles are resolved per-request from the database, not embedded in the token.
- Refresh token: opaque, stored server-side (Neo4j), 30-day TTL.

### Token refresh

```
POST /api/auth/refresh
```

Request body: `{ "refreshToken": "..." }`

- Validates refresh token; issues a new access JWT.
- Rotates the refresh token (old token invalidated).

### Logout

```
POST /api/auth/logout
```

- Invalidates the refresh token server-side.
- Access tokens expire naturally (short TTL).

---

## Business rules

1. Email addresses are case-insensitive; store and compare in lowercase.
2. Passwords are never stored or logged in plain text.
3. A user who has not verified their email cannot log in or perform any authenticated action.
4. `PLATFORM_ADMIN` promotion is an out-of-band operation (direct database or a future admin API); there is no self-service path to it.
5. An unverified account whose token has expired can request a new verification email. The old token is invalidated on resend.

---

## Security notes

- Use `PasswordEncoder` (BCrypt, strength 12) from Spring Security.
- JWT signing key is environment-variable-configured (`app.jwt.secret`); never hardcoded.
- All `/api/auth/*` endpoints are public (no authentication required) except `/api/auth/logout`.
- All other `/api/**` endpoints require a valid JWT.

---

## Open questions

- Should we support "forgot password / password reset" in v1? (Requires another email flow.)
- Is there a need for an admin role (e.g. to manage all events/users) in v1?
