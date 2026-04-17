# Tasks: CRUD de Departamentos y Relación con Empleados

**Input**: Design documents from `/specs/001-crud-departamentos-empleados/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No se incluyen tareas de pruebas automáticas porque la especificación no solicita enfoque TDD ni una suite nueva obligatoria.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar estructura y configuración de trabajo para backend + frontend en monorepo

- [X] T001 Actualizar documentación de alcance full-stack en specs/001-crud-departamentos-empleados/plan.md
- [X] T002 [P] Validar contrato API base en specs/001-crud-departamentos-empleados/contracts/departamentos-empleados.openapi.yaml
- [X] T003 [P] Validar contrato de UI en specs/001-crud-departamentos-empleados/contracts/frontend-ui-contract.md
- [X] T004 [P] Actualizar pasos de ejecución backend+frontend en specs/001-crud-departamentos-empleados/quickstart.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestructura compartida obligatoria antes de comenzar historias de usuario

**⚠️ CRITICAL**: Ninguna historia inicia hasta completar esta fase

- [X] T005 Crear/ajustar entidad Departamento en src/main/java/com/example/empleados/model/Departamento.java
- [X] T006 [P] Crear/ajustar repositorio de departamentos en src/main/java/com/example/empleados/repository/DepartamentoRepository.java
- [X] T007 Extender entidad Empleado con relación obligatoria a departamento en src/main/java/com/example/empleados/model/Empleado.java
- [X] T008 [P] Extender repositorio de empleados por departamento en src/main/java/com/example/empleados/repository/EmpleadoRepository.java
- [X] T009 [P] Implementar DTO resumen de departamento compartido en src/main/java/com/example/empleados/dto/DepartamentoResumenResponse.java
- [X] T010 [P] Implementar mapper de departamentos compartido en src/main/java/com/example/empleados/service/DepartamentoMapper.java
- [X] T011 Implementar migración V2 con backfill SIN_ASIGNAR en src/main/resources/db/migration/V2__departamento_empleado_relation.sql
- [X] T012 Asegurar seguridad Basic Auth para rutas de departamentos y empleados en src/main/java/com/example/empleados/config/SecurityConfig.java
- [X] T013 [P] Configurar app Angular 19 dedicada en frontend/departamentos-admin/package.json
- [X] T014 [P] Configurar servicio base HTTP con Authorization en memoria en frontend/departamentos-admin/src/app/services/auth-session.service.ts

**Checkpoint**: Base compartida lista; historias pueden implementarse y validarse de forma independiente

---

## Phase 3: User Story 1 - Registrar y administrar departamentos (Priority: P1) 🎯 MVP

**Goal**: Habilitar CRUD completo de departamentos con validación de unicidad y restricción de eliminación

**Independent Test**: Ejecutar alta/listado/actualización/eliminación de un departamento sin empleados usando `/api/v1/departamentos`

### Implementation for User Story 1

- [X] T015 [P] [US1] Implementar request DTO de creación de departamento en src/main/java/com/example/empleados/dto/DepartamentoCreateRequest.java
- [X] T016 [P] [US1] Implementar request DTO de actualización de departamento en src/main/java/com/example/empleados/dto/DepartamentoUpdateRequest.java
- [X] T017 [US1] Implementar caso de uso de creación con unicidad por nombre en src/main/java/com/example/empleados/service/CreateDepartamentoService.java
- [X] T018 [US1] Implementar caso de uso de listado de departamentos en src/main/java/com/example/empleados/service/ListDepartamentosService.java
- [X] T019 [US1] Implementar caso de uso de actualización de departamento en src/main/java/com/example/empleados/service/UpdateDepartamentoService.java
- [X] T020 [US1] Implementar caso de uso de eliminación con regla de conflicto en src/main/java/com/example/empleados/service/DeleteDepartamentoService.java
- [X] T021 [US1] Implementar endpoint POST de departamentos en src/main/java/com/example/empleados/controller/DepartamentoCreateController.java
- [X] T022 [US1] Implementar endpoint GET de listado de departamentos en src/main/java/com/example/empleados/controller/DepartamentoQueryController.java
- [X] T023 [US1] Implementar endpoints PUT/DELETE de departamentos en src/main/java/com/example/empleados/controller/DepartamentoCommandController.java

**Checkpoint**: US1 funcional y demostrable por sí sola (MVP)

---

## Phase 4: User Story 2 - Asignar empleados a departamentos (Priority: P2)

**Goal**: Exigir `departamentoId` válido al crear/actualizar empleados y reflejar departamento en respuesta

**Independent Test**: Crear y actualizar empleado con `departamentoId` válido y validar rechazo para departamento inexistente

### Implementation for User Story 2

- [X] T024 [P] [US2] Agregar `departamentoId` obligatorio al DTO de alta en src/main/java/com/example/empleados/dto/EmpleadoCreateRequest.java
- [X] T025 [P] [US2] Agregar `departamentoId` obligatorio al DTO de actualización en src/main/java/com/example/empleados/dto/EmpleadoUpdateRequest.java
- [X] T026 [P] [US2] Incluir resumen de departamento en DTO de salida de empleado en src/main/java/com/example/empleados/dto/EmpleadoResponse.java
- [X] T027 [US2] Actualizar mapper de empleado con asociación de departamento en src/main/java/com/example/empleados/service/EmpleadoMapper.java
- [X] T028 [US2] Validar existencia de departamento en alta de empleado en src/main/java/com/example/empleados/service/CreateEmpleadoService.java
- [X] T029 [US2] Validar y aplicar cambio de departamento en actualización de empleado en src/main/java/com/example/empleados/service/UpdateEmpleadoService.java
- [X] T030 [US2] Ajustar endpoint POST de empleados al nuevo contrato en src/main/java/com/example/empleados/controller/EmpleadoCreateController.java
- [X] T031 [US2] Ajustar endpoint PUT de empleados al nuevo contrato en src/main/java/com/example/empleados/controller/EmpleadoCommandController.java

**Checkpoint**: US2 funcional y verificable en forma independiente

---

## Phase 5: User Story 3 - Consultar estructura organizacional (Priority: P3)

**Goal**: Exponer detalle de departamento con empleados asociados y estado vacío cuando corresponda

**Independent Test**: Consultar `/api/v1/departamentos/{id}` para departamento con y sin empleados y validar estructura de respuesta

### Implementation for User Story 3

- [X] T032 [P] [US3] Implementar DTO de empleado resumen para detalle en src/main/java/com/example/empleados/dto/EmpleadoResumenResponse.java
- [X] T033 [P] [US3] Implementar DTO de departamento detalle con lista de empleados en src/main/java/com/example/empleados/dto/DepartamentoDetalleResponse.java
- [X] T034 [US3] Implementar caso de uso de consulta de detalle departamento-empleados en src/main/java/com/example/empleados/service/GetDepartamentoDetalleService.java
- [X] T035 [US3] Exponer endpoint GET de detalle por id en src/main/java/com/example/empleados/controller/DepartamentoQueryController.java
- [X] T036 [US3] Implementar consulta de empleados por departamento ordenados por nombre en src/main/java/com/example/empleados/repository/EmpleadoRepository.java

**Checkpoint**: US3 funcional y validable sin depender de UI

---

## Phase 6: User Story 4 - Gestionar departamentos desde frontend (Priority: P4)

**Goal**: Entregar UI Angular 19 para login, CRUD de departamentos, formulario de empleado con `departamentoId` y detalle de departamento

**Independent Test**: Iniciar frontend, autenticarse, operar CRUD de departamentos, actualizar empleado con departamento y abrir detalle de departamento

### Implementation for User Story 4

- [X] T037 [P] [US4] Implementar pantalla de login y estado autenticado en memoria en frontend/departamentos-admin/src/app/pages/login/login.component.ts
- [X] T038 [P] [US4] Implementar guard de rutas autenticadas basado en sesión en memoria en frontend/departamentos-admin/src/app/guards/auth.guard.ts
- [X] T039 [US4] Implementar cliente API de departamentos en frontend/departamentos-admin/src/app/services/departamentos-api.service.ts
- [X] T040 [US4] Implementar cliente API de empleados para alta/edición con departamento en frontend/departamentos-admin/src/app/services/empleados-api.service.ts
- [X] T041 [US4] Implementar página de listado/CRUD de departamentos en frontend/departamentos-admin/src/app/pages/departamentos/departamentos-page.component.ts
- [X] T042 [US4] Implementar formulario de empleado con selector `departamentoId` en frontend/departamentos-admin/src/app/components/empleado-form/empleado-form.component.ts
- [X] T043 [US4] Implementar vista de detalle de departamento con estado vacío en frontend/departamentos-admin/src/app/pages/departamento-detalle/departamento-detalle-page.component.ts
- [X] T044 [US4] Implementar mapeo de errores HTTP `400/401/404/409` y redirección a login en frontend/departamentos-admin/src/app/services/http-error-mapper.service.ts

**Checkpoint**: US4 funcional en frontend sin requerir herramientas externas

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Cierre transversal, coherencia documental y validación final de flujos

- [X] T045 Actualizar contrato OpenAPI final backend en specs/001-crud-departamentos-empleados/contracts/departamentos-empleados.openapi.yaml
- [X] T046 [P] Actualizar contrato funcional de UI en specs/001-crud-departamentos-empleados/contracts/frontend-ui-contract.md
- [X] T047 [P] Consolidar guía de ejecución E2E backend+frontend en specs/001-crud-departamentos-empleados/quickstart.md
- [X] T048 Verificar consistencia de errores Problem/HTTP en backend en src/main/java/com/example/empleados/exception/GlobalExceptionHandler.java
- [X] T049 Ejecutar validación manual de flujo MVP y registrar resultado en specs/001-crud-departamentos-empleados/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: Sin dependencias.
- **Phase 2 (Foundational)**: Depende de Phase 1; bloquea todas las historias.
- **Phase 3 (US1)**: Depende de Phase 2.
- **Phase 4 (US2)**: Depende de Phase 2 y usa catálogo de US1.
- **Phase 5 (US3)**: Depende de Phase 2 y de relación de datos disponible.
- **Phase 6 (US4)**: Depende de Phase 2 y consume contratos de US1-US3.
- **Phase 7 (Polish)**: Depende de historias objetivo completadas.

### User Story Dependencies

- **US1 (P1)**: Base de valor de negocio; independiente tras fundacional.
- **US2 (P2)**: Depende funcionalmente de departamentos creados (US1).
- **US3 (P3)**: Depende de relación empleados-departamentos (US2 + base US1).
- **US4 (P4)**: Depende de endpoints disponibles de US1-US3.

### Story Completion Order

1. **US1 (MVP recomendado)**
2. **US2**
3. **US3**
4. **US4**

---

## Parallel Opportunities

- **Setup**: T002, T003 y T004 en paralelo.
- **Foundational**: T006, T008, T009, T010, T013 y T014 en paralelo.
- **US1**: T015 y T016 en paralelo.
- **US2**: T024, T025 y T026 en paralelo.
- **US3**: T032 y T033 en paralelo.
- **US4**: T037 y T038 en paralelo; T039 y T040 en paralelo.
- **Polish**: T046 y T047 en paralelo.

---

## Parallel Example: User Story 1

```bash
Task: "T015 [US1] Implementar request DTO de creación de departamento en src/main/java/com/example/empleados/dto/DepartamentoCreateRequest.java"
Task: "T016 [US1] Implementar request DTO de actualización de departamento en src/main/java/com/example/empleados/dto/DepartamentoUpdateRequest.java"
```

## Parallel Example: User Story 2

```bash
Task: "T024 [US2] Agregar departamentoId obligatorio al DTO de alta en src/main/java/com/example/empleados/dto/EmpleadoCreateRequest.java"
Task: "T025 [US2] Agregar departamentoId obligatorio al DTO de actualización en src/main/java/com/example/empleados/dto/EmpleadoUpdateRequest.java"
Task: "T026 [US2] Incluir resumen de departamento en DTO de salida en src/main/java/com/example/empleados/dto/EmpleadoResponse.java"
```

## Parallel Example: User Story 3

```bash
Task: "T032 [US3] Implementar DTO de empleado resumen para detalle en src/main/java/com/example/empleados/dto/EmpleadoResumenResponse.java"
Task: "T033 [US3] Implementar DTO de departamento detalle con lista de empleados en src/main/java/com/example/empleados/dto/DepartamentoDetalleResponse.java"
```

## Parallel Example: User Story 4

```bash
Task: "T037 [US4] Implementar pantalla de login en frontend/departamentos-admin/src/app/pages/login/login.component.ts"
Task: "T038 [US4] Implementar guard de rutas autenticadas en frontend/departamentos-admin/src/app/guards/auth.guard.ts"
Task: "T039 [US4] Implementar cliente API de departamentos en frontend/departamentos-admin/src/app/services/departamentos-api.service.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Completar Setup y Foundational.
2. Entregar US1 como incremento MVP.
3. Validar CRUD de departamentos de forma independiente.

### Incremental Delivery

1. Setup + Foundational.
2. Entregar US1.
3. Entregar US2.
4. Entregar US3.
5. Entregar US4.
6. Cierre transversal en Polish.

### Parallel Team Strategy

1. Equipo completo en fases 1 y 2.
2. División por historia: backend US1-US3 y frontend US4.
3. Integración final con validación E2E documentada.
