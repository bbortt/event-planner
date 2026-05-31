# ADR 002 — Spring Boot 4 / Java 25 as the application stack

**Date:** 2026-05-31
**Status:** Accepted

## Context

The project was initialised with Spring Initializr. A stack choice was implicit in that bootstrap.

## Decision

- **Java 25** — current LTS-adjacent release; virtual threads (Loom) available if needed; modern language features (records, sealed classes, pattern matching) preferred.
- **Spring Boot 4.0.6** — latest stable Boot; integrates Spring Security 7, Spring Data Neo4j 8, and Spring MVC out of the box.
- **Maven wrapper** — reproducible builds without requiring a global Maven installation.

## Consequences

- Boot 4 requires Java 17 minimum; Java 25 is compatible.
- Spring Boot 4 drops some legacy APIs (e.g. `WebSecurityConfigurerAdapter`) — use component-based security configuration.
- Devtools on classpath for local hot-reload; excluded from production builds automatically.

## Rejected alternatives

- **Quarkus / Micronaut** — smaller footprint, but less Neo4j ecosystem support and unfamiliar to the team.
- **Spring Boot 3.x** — superseded; Boot 4 is the current release.
