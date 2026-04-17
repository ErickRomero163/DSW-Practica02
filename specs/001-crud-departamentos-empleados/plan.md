# Implementation Plan: CRUD de Departamentos y Relación con Empleados

**Branch**: `001-crud-departamentos-empleados` | **Date**: 2026-03-23 | **Spec**: `/specs/001-crud-departamentos-empleados/spec.md`
**Input**: Feature specification from `/specs/001-crud-departamentos-empleados/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Implementar el CRUD de departamentos y la relación obligatoria con empleados,
incluyendo migración automática de históricos a `SIN_ASIGNAR`, y entregar en la
misma feature una nueva app Angular 19 en `frontend/` para operar los flujos de
departamentos, asignación de empleados y consulta de detalle por departamento.

## Technical Context

**Language/Version**: Java 17 (backend), TypeScript con Angular 19 (frontend)  
**Primary Dependencies**: Spring Boot 3.3.x, Spring Web, Spring Data JPA, Spring Security (HTTP Basic), Flyway, PostgreSQL driver, Springdoc OpenAPI, Bean Validation, Angular 19, Angular CLI, RxJS  
**Storage**: PostgreSQL 16 para backend; estado de sesión frontend en memoria (sin persistencia)  
**Testing**: JUnit 5 + Spring Boot Test + MockMvc (backend), Angular test runner para componentes/servicios clave (frontend)  
**Target Platform**: Linux; backend y DB en Docker Compose; frontend con Angular CLI (opcionalmente containerizable)
**Project Type**: Monorepo full-stack (backend API + frontend SPA)  
**Performance Goals**: p95 < 2s en consultas de departamentos; UX frontend sin recargas manuales en flujos CRUD  
**Constraints**: sesión HTTP Basic en frontend solo en memoria; nueva app Angular en `frontend/`; migración con backfill `SIN_ASIGNAR`; manejo explícito de errores `400/401/404/409`  
**Scale/Scope**: 1 entidad nueva (`Departamento`), extensión de `Empleado`, endpoints de departamentos y empleados, nueva app frontend dedicada

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Stack gate: PASS. Backend mantiene Spring Boot 3.x + Java 17; frontend usa Angular 19.
- Security gate: PASS. HTTP Basic definido para API y comportamiento de sesión en memoria definido para frontend.
- Data gate: PASS. PostgreSQL como sistema de registro y migración con `SIN_ASIGNAR` documentada.
- Runtime gate: PASS. Monorepo explícito; backend+DB con Docker y frontend con ruta de ejecución en workspace `frontend/`.
- API contract gate: PASS. OpenAPI y contrato de integración UI documentados.
- Frontend gate: PASS. Nueva app Angular 19 dedicada en `frontend/`.

**Post-Design Re-check**: PASS. `research.md`, `data-model.md`, `contracts/` y `quickstart.md` cubren backend + frontend sin violaciones constitucionales.

## Project Structure

### Documentation (this feature)

```text
specs/001-crud-departamentos-empleados/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── departamentos-empleados.openapi.yaml
│   └── frontend-ui-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
src/main/java/com/example/empleados/
├── config/
├── controller/
├── dto/
├── exception/
├── model/
├── repository/
└── service/

src/main/resources/
└── db/migration/

frontend/departamentos-admin/
├── src/
│   ├── app/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   └── guards/
│   └── environments/
└── package.json
```

**Structure Decision**: Mantener backend por capas y crear una app Angular 19 dedicada en `frontend/departamentos-admin/`, conectada al contrato OpenAPI existente.

## Complexity Tracking

No hay violaciones constitucionales ni excepciones justificadas.
