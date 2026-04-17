# Implementation Plan: CRUD de Empleados

**Branch**: `002-crud-empleados` | **Date**: 2026-02-25 | **Spec**: `/specs/002-crud-empleados/spec.md`
**Input**: Feature specification from `/specs/002-crud-empleados/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Implementar un CRUD de empleados en backend Spring Boot 3/Java 17 con
persistencia en PostgreSQL. La `clave` del empleado será la PK (`VARCHAR(100)`)
y se generará automáticamente con patrón `E-<numero>`, usando una secuencia de
PostgreSQL para unicidad bajo concurrencia. Todos los endpoints CRUD estarán
protegidos por HTTP Basic y documentados en OpenAPI/Swagger.

## Technical Context

**Language/Version**: Java 17  
**Primary Dependencies**: Spring Boot 3.x, Spring Web, Spring Data JPA, Spring Security (HTTP Basic), PostgreSQL driver, Springdoc OpenAPI, Bean Validation, Flyway  
**Storage**: PostgreSQL  
**Testing**: JUnit 5, Spring Boot Test, MockMvc, Testcontainers (PostgreSQL)  
**Target Platform**: Linux server (containerizado), local con Docker
**Project Type**: web-service (backend REST)  
**Performance Goals**: p95 < 2s en operaciones CRUD de empleado  
**Constraints**: `clave` autogenerada con patrón `E-<numero>` por secuencia PostgreSQL, PK `VARCHAR(100)`; `nombre`, `direccion`, `telefono` obligatorios con máximo 100 caracteres; CRUD completo autenticado por HTTP Basic; contrato OpenAPI vigente  
**Scale/Scope**: 1 entidad principal (`Empleado`) y 5 endpoints REST (`POST`, `GET by clave`, `GET list`, `PUT`, `DELETE`)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Stack gate: PASS. Se usa Spring Boot 3.x + Java 17.
- Security gate: PASS. Todos los endpoints CRUD requieren HTTP Basic; credenciales externalizables por entorno.
- Data gate: PASS. Persistencia en PostgreSQL; `clave` generada con secuencia y patrón `E-<numero>`.
- Runtime gate: PASS. Flujo previsto con Docker (app + base PostgreSQL).
- API contract gate: PASS. Contrato OpenAPI incluye rutas CRUD y seguridad Basic Auth.

**Post-Design Re-check**: PASS. `research.md`, `data-model.md`, `contracts/` y
`quickstart.md` respetan la constitución sin excepciones.

## Project Structure

### Documentation (this feature)

```text
specs/002-crud-empleados/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/main/java/.../
├── controller/
├── service/
├── repository/
├── model/
├── dto/
└── config/

src/main/resources/
├── application.properties
└── db/migration/

src/test/java/.../
├── unit/
├── integration/
└── contract/

docker-compose.yml
Dockerfile
```

**Structure Decision**: Backend monolítico (web-service único) con capas
controller/service/repository, pruebas por nivel y documentación de feature en
`specs/002-crud-empleados/`.

## Complexity Tracking

No se identifican violaciones constitucionales que requieran justificación.
