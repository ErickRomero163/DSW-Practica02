<!--
Sync Impact Report
- Version change: 1.0.0 -> 1.1.0
- Modified principles:
	- I. Spring Boot 3 + Java 17 Mandate -> I. Backend Platform Baseline (Spring Boot 3 + Java 17)
	- IV. Docker-First Runtime and Delivery -> IV. Monorepo + Docker-First Delivery
	- V. OpenAPI/Swagger Contract-First Documentation -> V. Contract-First API + Frontend Integration Documentation
- Added sections:
	- VI. Angular 19 Frontend Standard
	- Security & Platform Constraints
	- Delivery Workflow & Quality Gates
- Removed sections:
	- None
- Templates requiring updates:
	- ✅ updated: .specify/templates/plan-template.md
	- ✅ updated: .specify/templates/spec-template.md
	- ✅ updated: .specify/templates/tasks-template.md
	- ⚠ pending: .specify/templates/commands/*.md (directory not present in repository)
	- ✅ updated: .github/agents/copilot-instructions.md
- Follow-up TODOs:
	- None
-->

# DSW-Practica02 Constitution

## Core Principles

### I. Backend Platform Baseline (Spring Boot 3 + Java 17)
All backend services MUST be implemented with Spring Boot 3.x on Java 17.
Alternative runtimes or framework versions MUST NOT be introduced without a
formal constitution amendment. This keeps language/runtime consistency,
security patching, and build reproducibility predictable across environments.

### II. HTTP Basic Authentication Baseline
All protected endpoints MUST enforce HTTP Basic Authentication via Spring
Security. The baseline credential pair for project setup is `admin/admin123`.
Credentials MUST be externalizable by environment variables for non-local
deployments, and plaintext defaults MUST only be accepted for local/dev use.
This provides a deterministic security minimum for initial delivery.

### III. PostgreSQL as the System of Record
Persistent data MUST be stored in PostgreSQL. Application code MUST target
PostgreSQL-compatible SQL and configuration defaults MUST include PostgreSQL
connection properties. In-memory databases MAY be used only in isolated tests.
This enforces production parity and avoids dialect drift.

### IV. Monorepo + Docker-First Delivery
The project MUST be maintained as a monorepo with explicit separation between
backend and frontend applications. Local integration MUST support Docker-based
orchestration for backend and PostgreSQL; frontend runtime MAY be containerized
or run through Angular tooling, but MUST remain compatible with monorepo paths
and shared documentation. This ensures reproducible onboarding and coordinated
changes across the full stack.

### V. Contract-First API + Frontend Integration Documentation
Every exposed REST endpoint MUST be represented in generated OpenAPI docs and
discoverable through Swagger UI. API changes MUST update the contract in the
same change set and MUST document frontend impact when request/response shapes
change. This keeps backend and frontend implementations aligned.

### VI. Angular 19 Frontend Standard
All frontend web applications in this repository MUST use Angular 19 as the
primary framework. New UI features MUST be implemented inside the monorepo
frontend workspace, and cross-application design/system decisions MUST be
documented in feature artifacts. Framework downgrades or migrations away from
Angular 19 require a constitution amendment.

## Security & Platform Constraints

- The canonical backend stack is Spring Boot 3.x, Java 17, Spring Security,
	Spring Data JPA, PostgreSQL driver, and Springdoc OpenAPI.
- The canonical frontend stack is Angular 19 with TypeScript and standard
	Angular CLI workspace conventions within the monorepo.
- Authentication defaults MUST be configured through properties and/or
	environment variables with secure override support.
- Secrets in source control are forbidden except explicitly approved local
	development defaults documented by this constitution.
- Container images for backend MUST build from the repository and start without
	manual source edits.

## Delivery Workflow & Quality Gates

- Every plan MUST pass a Constitution Check that verifies compliance with all
	six core principles before implementation begins.
- Every specification MUST define authentication behavior, data persistence
	expectations, Docker/monorepo runtime expectations, and API/frontend
	documentation impact.
- Every task list MUST include explicit work items for security setup,
	PostgreSQL configuration/migrations, monorepo path integration, Docker
	runtime, Swagger exposure, and frontend update tasks when applicable.
- Pull requests MUST include evidence of successful build and at least one
	integration verification path for authenticated endpoint + database access;
	frontend-impacting changes MUST include a frontend verification path.

## Governance

This constitution is the highest-priority engineering policy for this
repository. If lower-level docs conflict, this constitution takes precedence.

Amendment process:
- Propose changes in a pull request that includes rationale, migration impact,
	and updates to affected templates/docs.
- Obtain maintainer approval before merge.
- Apply semantic versioning to this document:
	- MAJOR for incompatible principle/governance redefinition or removal.
	- MINOR for new principle/section or materially expanded obligations.
	- PATCH for clarifications, wording, or non-semantic improvements.
- Update `Last Amended` on any merged change; `Ratified` remains the first
	adoption date.

Compliance review expectations:
- Plan review MUST verify Constitution Check pass/fail status.
- Spec review MUST verify mandatory constraints are explicitly captured.
- Task review MUST verify principle-driven tasks are present and testable.

**Version**: 1.1.0 | **Ratified**: 2026-02-25 | **Last Amended**: 2026-03-11
