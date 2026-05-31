# Spec 03 — Transactional Email

**Status:** Written
**Last updated:** 2026-05-31

---

## Purpose

Define the email messages the system sends, their triggers, and the SMTP infrastructure.

---

## Infrastructure

- **Library:** Spring Boot Mail Starter (`spring-boot-starter-mail`)
- **Local dev:** Mailhog (Docker) — catches all outgoing mail; accessible at `http://localhost:8025`
- **Production:** Any SMTP server configured via environment variables (see below)
- **Sending is async / fire-and-forget** — failures are logged but never surface as HTTP errors to the caller

### Configuration properties

```properties
spring.mail.host=${MAIL_HOST:localhost}
spring.mail.port=${MAIL_PORT:1025}
spring.mail.username=${MAIL_USERNAME:}
spring.mail.password=${MAIL_PASSWORD:}
spring.mail.properties.mail.smtp.auth=${MAIL_SMTP_AUTH:false}
spring.mail.properties.mail.smtp.starttls.enable=${MAIL_STARTTLS:false}

app.mail.from=${MAIL_FROM:noreply@event-planner.local}
app.base-url=${BASE_URL:http://localhost:8080}
```

---

## Email catalogue

### 1. Email verification

**Trigger:** `POST /api/auth/register` or `POST /api/auth/resend-verification`

**To:** registered email address
**Subject:** `Verify your Event Planner account`

**Body (text/html):**
```
Hello,

Please verify your email address by clicking the link below.
The link is valid for 24 hours.

[Verify my email] → {BASE_URL}/api/auth/verify?token={verificationToken}

If you did not create an account, ignore this email.
```

---

### 2. Volunteer invitation

**Trigger:** `POST /api/events/{eventId}/invitations`

**To:** invited email address
**Subject:** `You've been invited to help at {eventName}`

**Body (text/html):**
```
Hello,

{organizerName} has invited you to volunteer at the following event:

  Event:   {eventName}
  Date:    {eventStartDate} – {eventEndDate}
  Location: {locationName or "TBD"}

To accept:  {BASE_URL}/api/invitations/accept?token={inviteToken}
To decline: {BASE_URL}/api/invitations/decline?token={inviteToken}

This invitation expires on {expiresAt}.

If you don't have an account yet, accepting the invitation will guide you through a short registration.
```

---

### 3. RSVP accepted — confirmation to invitee

**Trigger:** invitation status transitions to `ACCEPTED`

**To:** invitee email
**Subject:** `You're confirmed for {eventName}`

**Body (text/html):**
```
Hello {firstName or email},

You are confirmed as a volunteer for {eventName} on {eventStartDate}.

We'll be in touch with more details closer to the date.
```

---

### 4. RSVP notification to organizer

**Trigger:** invitation status transitions to `ACCEPTED` or `DECLINED`

**To:** organizer email
**Subject:** `{inviteeEmail} has {accepted|declined} your invitation for {eventName}`

**Body (text/plain):**
```
{inviteeEmail} has {accepted / declined} your volunteer invitation for "{eventName}".

View the event: {BASE_URL}/api/events/{eventId}
```

---

## Local development setup

Add to `docker-compose.yml` (to be created):

```yaml
mailhog:
  image: mailhog/mailhog:latest
  ports:
    - "1025:1025"   # SMTP
    - "8025:8025"   # Web UI
```

---

### 5. Task overdue escalation

**Trigger:** task transitions to `OVERDUE` (15 minutes after `dueAt` with no completion)

**To:** parent task assignee (and task assignee if different)
**Subject:** `[ACTION REQUIRED] {task.title} is overdue at {eventName}`

**Body (text/html):**
```
Hello,

The following task is overdue:

  Task:      {task.title}
  Location:  {location.name}
  Due at:    {task.dueAt}
  Assigned to: {assignee.name}

Please check in with your team.

View event tasks: {BASE_URL}/api/v1/events/{eventId}/tasks
```

---

### 6. Volunteer application received

**Trigger:** `POST /api/v1/events/{eventId}/applications`

**To:** applicant email
**Subject:** `Your volunteer application for {eventName} is under review`

---

### 7. Volunteer application approved

**Trigger:** application status → `APPROVED`

**To:** applicant email
**Subject:** `You're approved as a volunteer for {eventName}`

---

### 8. Volunteer application rejected

**Trigger:** application status → `REJECTED`

**To:** applicant email
**Subject:** `Update on your volunteer application for {eventName}`

Body includes `reviewNote` if provided by the reviewer.

---

### 9. Volunteer assigned to shift

**Trigger:** volunteer assigned to a `VolunteerShift`

**To:** volunteer email
**Subject:** `You've been assigned a shift at {eventName}`

Body includes: location name and path in the hierarchy, shift start/end time, shift lead name and contact (if set).

---

## Resolved decisions

- i18n: not in v1 — English only.
- Delivery log: not in v1 — failures logged to application log only.

---

## Implementation notes

- Use `JavaMailSender` and `MimeMessage`; HTML content via `MimeMessageHelper`.
- Extract email content into Thymeleaf templates (under `resources/templates/mail/`) — do not build HTML by string concatenation.
- Create an `EmailService` interface with one method per email type; implementation uses `@Async` so callers are not blocked.
- Template variables are passed as a `Map<String, Object>` to Thymeleaf.
- Log a `WARN` if sending fails; do not throw from the async method.
