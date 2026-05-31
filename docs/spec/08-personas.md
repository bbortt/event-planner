# Spec 08 — Personas & User Stories

**Status:** Written
**Last updated:** 2026-05-31

---

## Purpose

Describe who uses the system, what they need, and why — so that implementation decisions stay grounded in real use cases. Each persona maps to one or more roles. User stories follow the format: *As a [persona], I want [capability] so that [outcome].*

---

## Persona 1 — The Platform Admin

**Role:** `PLATFORM_ADMIN`
**Who they are:** A technical operator or superuser responsible for the health of the entire installation. Often the person who deployed the system. May run multiple events for different organising teams.

### User stories

- As a platform admin, I want to view all events on the system so that I can monitor activity and detect misuse.
- As a platform admin, I want to access any event as if I were its admin so that I can support organisers who are locked out or have made a mistake.
- As a platform admin, I want to promote a user account to `PLATFORM_ADMIN` out-of-band so that I can delegate operational responsibility without exposing an admin UI.
- As a platform admin, I want user accounts to require verified email addresses so that I can be confident identity is genuine before any action is taken.

---

## Persona 2 — The Event Creator

**Role:** `USER` (before creating an event), then `EVENT_ADMIN` of that event
**Who they are:** Someone who decides to organise an event and creates it in the system. Often transitions into the Event Admin persona immediately.

### User stories

- As an event creator, I want to register with my email and password so that I can log in and manage my events.
- As an event creator, I want to create a new event with a name, description, and time range so that others can find and join it.
- As an event creator, I want to discover other published events on the platform so that I understand what is already happening and can volunteer if relevant.

---

## Persona 3 — The Event Admin

**Role:** `EVENT_ADMIN`
**Who they are:** The ultimate owner of a specific event. Accountable for everything from setup to teardown. May be the person who created the event or someone elevated later. Often not on-site for every operational detail — relies on organisers and coordinators to run the day.

### User stories

- As an event admin, I want to invite organisers by email so that I can delegate event management to my committee.
- As an event admin, I want to set the event's registration window so that volunteer applications open and close at the right time.
- As an event admin, I want to publish or cancel an event so that participants know its current status.
- As an event admin, I want to see a live overview of all location states (setup / open / closed) during the event so that I know whether operations are on track without being in every location.
- As an event admin, I want to receive an email when a location has not been opened within 15 minutes of its scheduled time so that I can intervene before it becomes a visible problem for participants.
- As an event admin, I want to remove a member from the event so that I can handle access revocations when someone's involvement ends.
- As an event admin, I want to define location types (e.g. "Stage", "Bar", "Entrance") so that my team can categorise locations consistently.

---

## Persona 4 — The Organiser

**Role:** `ORGANIZER`
**Who they are:** A committee member who manages the operational shape of the event — creating locations, scheduling time slots, reviewing volunteer applications. Usually knows the event well but may not have final authority over event-level settings.

### User stories

- As an organiser, I want to create the location hierarchy (venue → stage → backstage) so that the structure mirrors how the physical space is organised.
- As an organiser, I want to define setup, open, close, and teardown times for each location so that the schedule is clear and tasks are auto-generated.
- As an organiser, I want to mark a location as 18+ (with a minimum age) so that the system prevents under-age volunteers from being assigned there.
- As an organiser, I want to invite a specific person as a speaker or staff member by email so that they receive the right role without going through the volunteer application queue.
- As an organiser, I want to see all pending volunteer applications so that I can approve or reject them efficiently.
- As an organiser, I want to assign a shift lead to each location time slot so that there is a named responsible person on the ground.
- As an organiser, I want to assign volunteers to shifts across all locations so that coverage is planned before the event starts.
- As an organiser, I want the system to prevent me from double-booking a volunteer so that I don't accidentally schedule the same person at two places at once.
- As an organiser, I want to keep volunteer registration open while I start assigning so that I can fill gaps as they emerge, even if the nominal deadline has passed.
- As an organiser, I want to create manual tasks with a due time and assignee so that ad-hoc work (e.g. "deliver meals to Stage A by noon") is tracked alongside auto-generated tasks.
- As an organiser, I want volunteers to be notified by email when assigned to a shift so that they know where and when to show up.

---

## Persona 5 — The Coordinator

**Role:** `COORDINATOR`
**Who they are:** A trusted volunteer or mid-level staff member responsible for the day-to-day running of the event floor. Has broad operational access — manages shifts and volunteers across the whole event — but is not involved in event-level decisions. The "floor manager" archetype.

### User stories

- As a coordinator, I want to see all location states and pending tasks during the event so that I can respond to problems as they happen.
- As a coordinator, I want to review and approve volunteer applications so that the organiser doesn't have to handle every single one.
- As a coordinator, I want to reassign a volunteer shift when someone drops out so that coverage is maintained without escalating to the organiser.
- As a coordinator, I want to mark a task as complete on behalf of a volunteer so that the task system reflects reality even when the volunteer forgets to check in.
- As a coordinator, I want to receive an email when a shift-level task is overdue so that I can follow up with the volunteer directly.
- As a coordinator, I want to create volunteer shifts within a location's time slot so that I can subdivide working periods to match the team I have available.

---

## Persona 6 — The Location Admin

**Role:** `LOCATION_ADMIN` (scoped to one or more specific locations)
**Who they are:** A specialist responsible for a particular area — e.g., the bar manager, the stage technician, the parking coordinator. Knows everything about their location but has no authority over the broader event. May also be a volunteer or staff member.

### User stories

- As a location admin, I want to edit the details of my location (name, description, capacity) so that the information shown to volunteers is accurate.
- As a location admin, I want to manage the time slots for my location so that the schedule reflects how my area will actually operate.
- As a location admin, I want to see which volunteers are assigned to my location and when so that I can plan my team's day.
- As a location admin, I want to update the status of my location time slot (e.g. mark it as OPEN when we're ready) so that the live view reflects reality.
- As a location admin, I want to complete the "Open location" task when we open so that the event admin can see we are on track.

---

## Persona 7 — The Volunteer

**Role:** `VOLUNTEER`
**Who they are:** A person who gives their time to help run the event. May have applied themselves during the registration window, or been invited directly. Wants to know where to be, when, and what to do — with minimum friction.

### User stories

- As a volunteer, I want to browse published events on the platform so that I can find events I might want to support.
- As a volunteer, I want to apply to volunteer at an event during the registration window so that I can express my interest without needing to be personally invited.
- As a volunteer, I want to receive a confirmation email when my application is approved so that I know I'm on the team.
- As a volunteer, I want to see my assigned shifts (location, time, shift lead contact) so that I know where to be and who to report to.
- As a volunteer, I want to receive an email when I'm assigned to a new shift so that I'm not surprised on the day.
- As a volunteer, I want to confirm that I have started my shift (via the app) so that my shift lead knows I'm in position.
- As a volunteer, I want to confirm that I have ended my shift so that the system reflects that my commitment is complete.
- As a volunteer, I want to withdraw from an event before it starts if my plans change so that the organiser can fill my slot.
- As a volunteer, I want my birthdate and address to be stored on my profile once so that I don't have to re-enter them every time I volunteer at a new event.

---

## Persona 8 — The Staff Member

**Role:** `STAFF`
**Who they are:** A paid or contracted worker at the event. Has the same operational access as a volunteer but is treated differently in reporting and communications — e.g., payroll records, shift confirmation for invoicing.

### User stories

- As a staff member, I want to see my assigned shifts and their locations so that I know where I need to be.
- As a staff member, I want to confirm shift start and end so that my working hours are tracked.
- As a staff member, I want to receive shift assignment emails so that I have a written record of my scheduled hours.

*Note: the distinction between STAFF and VOLUNTEER is intentional but lightweight in v1 — same permissions, different role label. Future versions may add staff-specific features such as timesheet export.*

---

## Persona 9 — The Speaker / Performer

**Role:** `SPEAKER`
**Who they are:** A presenter, performer, or act scheduled at the event. Needs to know their slot, their stage, and who their contact is. Has no operational responsibilities.

### User stories

- As a speaker, I want to see the event details and my scheduled slot so that I know when and where I'm performing.
- As a speaker, I want to know who my contact at the venue is (shift lead / location admin) so that I can coordinate arrival and tech setup.
- As a speaker, I want to receive an invitation email with event and slot details so that I have everything I need in writing.

---

## Persona 10 — The Viewer

**Role:** `VIEWER`
**Who they are:** Someone with read-only access — perhaps a sponsor, a press contact, or a stakeholder who needs visibility without the ability to change anything.

### User stories

- As a viewer, I want to see the event details, locations, and schedule so that I can follow what is happening.
- As a viewer, I want to see the current status of locations during the live event so that I know what is open.
- As a viewer, I want to receive my access via an invitation so that the organiser controls who can see event details.

---

## Coverage gaps identified

Reading across these personas, the following areas are covered by existing specs. No new features required for v1, but worth flagging for future:

| Gap | Persona | Future spec? |
|-----|---------|--------------|
| Shift confirmation for invoicing (timesheet export) | Staff | Post-v1 |
| Speaker slot / programme visibility | Speaker | Could extend Spec 05 with a "programme" view |
| Sponsor / press viewer access controls | Viewer | Currently handled by invitation alone — sufficient for v1 |
| Volunteer self-service withdrawal | Volunteer | Covered in Spec 06 business rule 8 |
