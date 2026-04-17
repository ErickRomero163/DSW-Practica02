# Tasks: CRUD de Empleados

**Input**: Design documents from `/specs/002-crud-empleados/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No se incluyen tareas de pruebas en esta iteración porque no se solicitó enfoque TDD explícito en la especificación.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Inicialización de estructura backend y dependencias base del proyecto.

- [X] T001 Crear estructura base de paquetes en src/main/java/com/example/empleados/{config,controller,dto,model,repository,service,exception}
- [X] T002 Configurar dependencias de Spring Boot 3, Security, JPA, PostgreSQL, Flyway y springdoc en pom.xml
- [X] T003 [P] Configurar propiedades de entorno para datasource, seguridad y swagger en src/main/resources/application.properties
- [X] T004 [P] Crear plantilla de variables locales en .env.example

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestructura central obligatoria antes de cualquier historia de usuario.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 Crear migración inicial de tabla empleado y secuencia empleado_seq en src/main/resources/db/migration/V1__create_empleado_schema.sql
- [X] T006 Implementar configuración de seguridad HTTP Basic para proteger `/api/v1/empleados/**` en src/main/java/com/example/empleados/config/SecurityConfig.java
- [X] T007 [P] Implementar configuración OpenAPI con esquema basicAuth en src/main/java/com/example/empleados/config/OpenApiConfig.java
- [X] T008 [P] Implementar manejador global de errores (400/401/404/409/500) en src/main/java/com/example/empleados/exception/GlobalExceptionHandler.java
- [X] T009 Implementar entidad JPA Empleado con clave PK `VARCHAR(100)` en src/main/java/com/example/empleados/model/Empleado.java
- [X] T010 [P] Crear repositorio JPA de Empleado en src/main/java/com/example/empleados/repository/EmpleadoRepository.java
- [X] T011 Implementar servicio generador de clave `E-<numero>` usando secuencia PostgreSQL en src/main/java/com/example/empleados/service/ClaveEmpleadoGeneratorService.java
- [X] T012 [P] Crear docker-compose para app + postgres con healthcheck en docker-compose.yml
- [X] T013 [P] Crear Dockerfile de aplicación Spring Boot en Dockerfile

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Registrar empleados (Priority: P1) 🎯 MVP

**Goal**: Permitir alta de empleados con clave autogenerada `E-<numero>` y validaciones de campos.

**Independent Test**: Ejecutar POST autenticado con `nombre`, `direccion`, `telefono` válidos y verificar respuesta 201 con `clave` generada; validar rechazo por longitudes >100.

### Implementation for User Story 1

- [X] T014 [P] [US1] Crear DTO de alta de empleado en src/main/java/com/example/empleados/dto/EmpleadoCreateRequest.java
- [X] T015 [P] [US1] Crear DTO de respuesta de empleado en src/main/java/com/example/empleados/dto/EmpleadoResponse.java
- [X] T016 [US1] Implementar mapeador DTO↔Entidad para creación en src/main/java/com/example/empleados/service/EmpleadoMapper.java
- [X] T017 [US1] Implementar caso de uso de alta con generación de clave y persistencia en src/main/java/com/example/empleados/service/CreateEmpleadoService.java
- [X] T018 [US1] Implementar endpoint POST `/api/v1/empleados` en src/main/java/com/example/empleados/controller/EmpleadoCreateController.java
- [X] T019 [US1] Integrar manejo de conflicto de clave y validación de entrada en src/main/java/com/example/empleados/exception/GlobalExceptionHandler.java

**Checkpoint**: User Story 1 completa y verificable de forma independiente

---

## Phase 4: User Story 2 - Consultar empleados (Priority: P2)

**Goal**: Consultar empleados por clave y listar todos los empleados registrados.

**Independent Test**: Ejecutar GET autenticado por clave existente/no existente y GET listado general validando respuestas 200/404.

### Implementation for User Story 2

- [X] T020 [P] [US2] Crear servicio de consulta por clave en src/main/java/com/example/empleados/service/GetEmpleadoByClaveService.java
- [X] T021 [P] [US2] Crear servicio de listado de empleados en src/main/java/com/example/empleados/service/ListEmpleadosService.java
- [X] T022 [US2] Implementar endpoint GET `/api/v1/empleados/{clave}` en src/main/java/com/example/empleados/controller/EmpleadoQueryController.java
- [X] T023 [US2] Implementar endpoint GET `/api/v1/empleados` en src/main/java/com/example/empleados/controller/EmpleadoQueryController.java
- [X] T024 [US2] Integrar respuesta 404 para clave inexistente en src/main/java/com/example/empleados/exception/GlobalExceptionHandler.java

**Checkpoint**: User Stories 1 y 2 funcionales y probables de manera independiente

---

## Phase 5: User Story 3 - Actualizar y eliminar empleados (Priority: P3)

**Goal**: Actualizar `nombre/direccion/telefono` y eliminar empleados por clave sin permitir edición manual de clave.

**Independent Test**: Ejecutar PUT y DELETE autenticados sobre clave existente y validar 200/204; ejecutar sobre clave inexistente y validar 404.

### Implementation for User Story 3

- [X] T025 [P] [US3] Crear DTO de actualización de empleado sin campo `clave` en src/main/java/com/example/empleados/dto/EmpleadoUpdateRequest.java
- [X] T026 [US3] Implementar caso de uso de actualización en src/main/java/com/example/empleados/service/UpdateEmpleadoService.java
- [X] T027 [US3] Implementar caso de uso de eliminación en src/main/java/com/example/empleados/service/DeleteEmpleadoService.java
- [X] T028 [US3] Implementar endpoint PUT `/api/v1/empleados/{clave}` en src/main/java/com/example/empleados/controller/EmpleadoCommandController.java
- [X] T029 [US3] Implementar endpoint DELETE `/api/v1/empleados/{clave}` en src/main/java/com/example/empleados/controller/EmpleadoCommandController.java
- [X] T030 [US3] Reforzar regla de no edición de `clave` en validación de actualización en src/main/java/com/example/empleados/service/UpdateEmpleadoService.java

**Checkpoint**: Todas las historias de usuario funcionales e independientes

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Ajustes transversales, documentación y verificación final.

- [X] T031 [P] Actualizar especificación OpenAPI final en specs/002-crud-empleados/contracts/empleados.openapi.yaml
- [X] T032 [P] Actualizar guía de ejecución y ejemplos curl en specs/002-crud-empleados/quickstart.md
- [X] T033 Ajustar mensajes de error y consistencia de Problem Details en src/main/java/com/example/empleados/exception/GlobalExceptionHandler.java
- [X] T034 Ejecutar validación manual de quickstart y registrar notas en specs/002-crud-empleados/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (P1)**: Inicia tras Foundational, sin dependencia funcional de otras historias.
- **US2 (P2)**: Inicia tras Foundational; independiente de US1 si existen datos semilla.
- **US3 (P3)**: Inicia tras Foundational; independiente de US1/US2 usando registros existentes.

### Within Each User Story

- DTOs/modelado antes de servicios
- Servicios antes de endpoints
- Endpoints antes de integración de errores
- Cierre de historia con criterio de prueba independiente

### Parallel Opportunities

- Setup: T003 y T004 en paralelo tras T001/T002
- Foundational: T007, T008, T010, T012 y T013 en paralelo
- US1: T014 y T015 en paralelo
- US2: T020 y T021 en paralelo
- US3: T025 y T027 en paralelo

---

## Parallel Example: User Story 1

```bash
Task: "T014 [US1] Crear DTO de alta en src/main/java/com/example/empleados/dto/EmpleadoCreateRequest.java"
Task: "T015 [US1] Crear DTO de respuesta en src/main/java/com/example/empleados/dto/EmpleadoResponse.java"
```

## Parallel Example: User Story 2

```bash
Task: "T020 [US2] Crear servicio de consulta por clave en src/main/java/com/example/empleados/service/GetEmpleadoByClaveService.java"
Task: "T021 [US2] Crear servicio de listado en src/main/java/com/example/empleados/service/ListEmpleadosService.java"
```

## Parallel Example: User Story 3

```bash
Task: "T025 [US3] Crear DTO de actualización en src/main/java/com/example/empleados/dto/EmpleadoUpdateRequest.java"
Task: "T027 [US3] Implementar servicio de eliminación en src/main/java/com/example/empleados/service/DeleteEmpleadoService.java"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validar creación autenticada con clave autogenerada `E-<numero>`

### Incremental Delivery

1. Base técnica: Setup + Foundational
2. Entrega MVP: US1
3. Entrega de consulta: US2
4. Entrega de mantenimiento: US3
5. Cierre transversal: Polish

### Parallel Team Strategy

1. Equipo completo en Setup + Foundational
2. Luego reparto por historia:
   - Dev A: US1
   - Dev B: US2
   - Dev C: US3
3. Integración final en Polish

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Cada historia mantiene criterio de prueba independiente
- Mantener CRUD protegido por HTTP Basic en todo momento
- `clave` se genera por secuencia PostgreSQL con formato `E-<numero>`
