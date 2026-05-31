# Event Planner — Agent Guide

This file is the authoritative orientation document for any Claude Code agent working in this repository. Read it fully before touching any code.

---

## Project purpose

A collaborative **event planner** REST API. Users can create events, invite participants, manage schedules, and track RSVPs. The graph data model (Neo4j) is intentional: events, people, and locations are nodes; invitations, attendance, and ownership are relationships.

---

## Tech stack

| Layer            | Choice                         | Version  |
|------------------|--------------------------------|----------|
| Runtime          | Java                           | 25       |
| Framework        | Spring Boot                    | 4.0.6    |
| Web              | Spring Web MVC                 | (Boot)   |
| Security         | Spring Security                | (Boot)   |
| Persistence      | Spring Data Neo4j              | (Boot)   |
| Build            | Maven                          | wrapper  |
| Database         | Neo4j                          | ≥ 5.x    |

---

## Repository layout

```
docs/
  spec/          Functional specifications (source of truth for behaviour)
  adr/           Architecture Decision Records — one file per decision
src/
  main/java/io/github/bbortt/event/planner/
  main/resources/
  test/java/io/github/bbortt/event/planner/
```

---

## Specification-first workflow

**All non-trivial features must have a spec before any implementation begins.**

1. Write or update the relevant file under `docs/spec/`.
2. Get the spec reviewed (human or agent review in conversation).
3. Only then implement.

Spec files use plain Markdown. Each spec should state: purpose, domain concepts, API surface, business rules, and open questions.

---

## Architecture rules

- **Layered architecture**: Controller → Service → Repository. No repository calls from controllers; no HTTP concerns in services.
- **Neo4j domain model**: Use `@Node` entities and `@Relationship` for edges. Avoid `Map<String,Object>` as a lazy substitute for typed nodes.
- **Security at the controller level**: Use method-level `@PreAuthorize` / `@PostAuthorize` for resource ownership checks.
- **No business logic in entities**: entities are data carriers only.
- **Test structure**: unit tests for services (mock the repo), integration tests for controllers (use `@SpringBootTest` + embedded Neo4j).

---

## Code conventions

- Package-private where possible; `public` only at controller and service interfaces.
- No Lombok — write explicit getters/setters or use Java records for DTOs.
- No `Optional.get()` without `isPresent()` guard — prefer `orElseThrow`.
- Exception handling via `@ControllerAdvice`, not try/catch scattered through controllers.
- No commented-out code committed. No `TODO` committed without a linked issue.

---

## Agentic workflow

When executing multi-step work:

1. Use `TaskCreate` / `TaskUpdate` to track progress within a session.
2. Commit often — one logical change per commit.
3. Write the spec or ADR *before* the implementation commit when adding a new feature.
4. Do not force-push or rebase published branches.
5. Ask before deleting files, dropping data, or modifying CI pipelines.

---

## What NOT to do

- Do not add dependencies without justification in the conversation or an ADR.
- Do not add security bypasses (`permitAll`, `csrf().disable()`) without explicit user approval.
- Do not write to `.env` or `application-local.*` — those are gitignored and user-managed.
- Do not guess at business rules — ask when a spec is ambiguous.
