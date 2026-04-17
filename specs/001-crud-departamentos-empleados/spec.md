# Feature Specification: CRUD de Departamentos y Relación con Empleados

**Feature Branch**: `001-crud-departamentos-empleados`  
**Created**: 2026-03-09  
**Status**: Draft  
**Input**: User description: "Crear una nueva feature para implementar un CRUD de departamentos relacionado con la tabla de empleados en el proyecto actual, agregar la entidad Departamento y establecer una relación entre empleados y departamentos. Crear entidad Departamento con los campos: id, nombre, descripcion. Relación: Un departamento puede tener muchos empleados y un empleado pertenece a un departamento."

## Clarifications

### Session 2026-03-11

- Q: ¿Cómo migrar empleados existentes cuando el departamento es obligatorio? → A: Crear departamento técnico `SIN_ASIGNAR` y migrar automáticamente empleados existentes antes de exigir la relación obligatoria.

### Session 2026-03-23

- Q: ¿Esta feature incluye frontend Angular 19 además del backend? → A: Sí, incluir backend + frontend Angular 19 en la misma feature.
- Q: ¿Cómo se gestiona la sesión HTTP Basic en frontend? → A: Login simple en frontend y credenciales mantenidas solo en memoria de sesión (se pierden al recargar).
- Q: ¿Cuál es el alcance funcional mínimo de UI en frontend? → A: Módulo de departamentos + formulario de empleado con `departamentoId` + detalle de departamento con empleados.
- Q: ¿Dónde implementar el frontend de esta feature en monorepo? → A: Crear una nueva app Angular 19 dedicada dentro de `frontend/`.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Registrar y administrar departamentos (Priority: P1)

Como administrador, quiero crear, consultar, actualizar y eliminar departamentos para organizar a los empleados por áreas funcionales.

**Why this priority**: Sin el catálogo de departamentos no se puede asignar correctamente la estructura organizacional de los empleados.

**Independent Test**: Puede validarse creando departamentos, consultándolos individualmente y en listado, editando sus datos y eliminándolos sin depender de otras historias.

**Acceptance Scenarios**:

1. **Given** que se registran nombre y descripción válidos, **When** el usuario crea un departamento, **Then** el sistema lo almacena y confirma su creación con identificador único.
2. **Given** que existe un departamento, **When** el usuario actualiza nombre o descripción, **Then** el sistema guarda los cambios y devuelve los datos actualizados.
3. **Given** que existe un departamento sin empleados asociados, **When** el usuario lo elimina, **Then** el sistema confirma la eliminación y el departamento deja de estar disponible en consultas.

---

### User Story 2 - Asignar empleados a departamentos (Priority: P2)

Como administrador, quiero que cada empleado pertenezca a un departamento para mantener la información de personal correctamente clasificada.

**Why this priority**: La relación entre empleados y departamentos permite reportes y gestión operativa coherente.

**Independent Test**: Puede verificarse creando o actualizando un empleado con un departamento existente y comprobando que la asociación se refleja en ambas consultas.

**Acceptance Scenarios**:

1. **Given** que existe un departamento válido, **When** el usuario crea un empleado indicando ese departamento, **Then** el sistema registra al empleado asociado al departamento indicado.
2. **Given** que existe un empleado, **When** el usuario cambia su departamento por otro válido, **Then** el sistema actualiza la relación y conserva el resto de datos del empleado.
3. **Given** que se envía un identificador de departamento inexistente para asignación, **When** el usuario intenta crear o actualizar empleado, **Then** el sistema rechaza la operación con error de validación de referencia.

---

### User Story 3 - Consultar estructura organizacional (Priority: P3)

Como administrador, quiero visualizar departamentos con sus empleados asociados para revisar la distribución del personal.

**Why this priority**: Ayuda a tomar decisiones operativas y validar que las asignaciones de departamento son correctas.

**Independent Test**: Puede validarse consultando un departamento y confirmando que se muestran sus empleados asociados, además de validar comportamiento para departamentos sin empleados.

**Acceptance Scenarios**:

1. **Given** que un departamento tiene empleados asociados, **When** el usuario consulta ese departamento, **Then** el sistema devuelve la información del departamento junto con su lista de empleados.
2. **Given** que un departamento no tiene empleados asociados, **When** el usuario consulta ese departamento, **Then** el sistema devuelve el departamento con lista vacía de empleados.

---

### User Story 4 - Gestionar departamentos desde frontend (Priority: P4)

Como administrador, quiero operar el CRUD de departamentos y asignaciones desde una interfaz Angular 19 para gestionar la estructura sin usar herramientas externas.

**Why this priority**: Completa el flujo de negocio de punta a punta para usuarios no técnicos y alinea la feature con el estándar de frontend del monorepo.

**Independent Test**: Puede validarse ejecutando el frontend Angular 19, autenticándose y completando los flujos crear/editar/eliminar departamento y asignar empleado a departamento.

**Acceptance Scenarios**:

1. **Given** que el administrador está autenticado, **When** abre el módulo de departamentos en frontend, **Then** puede listar, crear y actualizar departamentos consumiendo el API existente.
2. **Given** que intenta eliminar un departamento con empleados asociados, **When** ejecuta la acción desde frontend, **Then** la interfaz muestra el error de conflicto y evita estado inconsistente en pantalla.
3. **Given** que registra o edita un empleado, **When** selecciona `departamentoId` desde el formulario, **Then** el frontend envía la asignación y refleja la respuesta actualizada.
4. **Given** que consulta detalle de un departamento, **When** abre la vista de detalle, **Then** observa la lista de empleados asociados o una lista vacía cuando no existen.

### Edge Cases

- ¿Qué ocurre si se intenta crear un departamento con nombre vacío o solo espacios? El sistema rechaza la operación con mensaje de validación.
- ¿Qué ocurre si se intenta crear dos departamentos con el mismo nombre? El sistema rechaza la duplicidad para preservar la identificación clara de áreas.
- ¿Qué ocurre si se intenta eliminar un departamento que tiene empleados asociados? El sistema rechaza la eliminación y solicita reasignar o desvincular empleados primero.
- ¿Qué ocurre si se consulta o actualiza un departamento inexistente? El sistema responde con resultado explícito de no encontrado.
- ¿Qué ocurre si la consulta de departamentos se realiza sin registros existentes? El sistema devuelve una lista vacía.
- ¿Qué ocurre con empleados existentes al imponer departamento obligatorio? El sistema crea `SIN_ASIGNAR` y asigna automáticamente esos empleados durante la migración.
- ¿Qué ocurre si el frontend recibe 401 por credenciales inválidas? La interfaz debe informar autenticación fallida y requerir reintento.
- ¿Qué ocurre al recargar la página del frontend? La sesión en memoria se pierde y el usuario debe autenticarse nuevamente.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST permitir crear un departamento con `id`, `nombre` y `descripcion`.
- **FR-002**: El sistema MUST permitir consultar un departamento por su identificador y listar todos los departamentos.
- **FR-003**: El sistema MUST permitir actualizar `nombre` y `descripcion` de un departamento existente.
- **FR-004**: El sistema MUST permitir eliminar departamentos que no tengan empleados asociados.
- **FR-005**: El sistema MUST impedir eliminar un departamento cuando tenga uno o más empleados asociados.
- **FR-006**: El sistema MUST exigir que cada empleado pertenezca a exactamente un departamento.
- **FR-007**: El sistema MUST permitir asociar un empleado a un departamento existente durante el alta de empleado.
- **FR-008**: El sistema MUST permitir cambiar el departamento de un empleado existente.
- **FR-009**: El sistema MUST rechazar asignaciones de empleados a departamentos inexistentes.
- **FR-010**: El sistema MUST devolver en las consultas de departamento la información de empleados asociados.
- **FR-011**: El sistema MUST validar que `nombre` de departamento sea obligatorio y no vacío.
- **FR-012**: El sistema MUST tratar como no encontrado cualquier operación de consulta, actualización o eliminación sobre departamentos inexistentes.
- **FR-013**: El sistema MUST crear el departamento técnico `SIN_ASIGNAR` y asociar empleados existentes a este durante la migración previa a exigir obligatoriedad de departamento.
- **FR-014**: El sistema MUST incluir frontend Angular 19 en el monorepo para operar CRUD de departamentos y asignación de empleados a departamentos.
- **FR-015**: El frontend MUST consumir endpoints autenticados y manejar explícitamente respuestas de error `400`, `401`, `404` y `409`.
- **FR-016**: El frontend MUST permitir listar, crear, actualizar y eliminar departamentos, y ejecutar asignación/cambio de departamento en empleados.
- **FR-017**: El frontend MUST mantener credenciales HTTP Basic únicamente en memoria de sesión y MUST requerir nueva autenticación tras recarga de página.
- **FR-018**: El frontend MUST incluir formulario de empleado con selección obligatoria de `departamentoId` para alta y edición.
- **FR-019**: El frontend MUST incluir vista de detalle de departamento que muestre empleados asociados o estado vacío.
- **FR-020**: El frontend MUST implementarse como nueva aplicación Angular 19 dedicada dentro de `frontend/` en el monorepo.

### Constitution Alignment *(mandatory)*

- **CA-001 (Stack)**: Feature MUST remain compatible with Spring Boot 3.x and Java 17.
- **CA-002 (Auth)**: Feature MUST define authenticated vs public endpoints under HTTP Basic Auth.
- **CA-003 (Data)**: Feature MUST document PostgreSQL persistence impact (schema/data changes).
- **CA-004 (Monorepo/Runtime)**: Feature MUST document monorepo path impact and local runtime path (Docker para backend + DB; Angular CLI/Docker para frontend).
- **CA-005 (OpenAPI)**: Feature MUST state required OpenAPI/Swagger updates y su impacto de integración en frontend.
- **CA-006 (Frontend)**: Frontend de esta feature MUST implementarse en Angular 19.

### Dependencies

- La relación empleados-departamentos depende de la existencia del módulo CRUD de empleados ya implementado en el proyecto.
- La eliminación segura de departamentos depende de poder validar empleados asociados antes de ejecutar la operación.

### Assumptions

- Se asume que `id` de departamento es generado por el sistema y es único.
- Se asume que el nombre de departamento debe ser único para evitar ambigüedad operativa.
- Se asume que `descripcion` de departamento es opcional y editable.
- Se asume que la asociación de empleados a departamento es obligatoria para nuevos registros de empleados.
- Se asume que no se requiere gestión jerárquica entre departamentos en esta versión.
- Se asume que el frontend de la feature se implementa en una nueva app Angular 19 dentro de `frontend/`.

### Key Entities *(include if feature involves data)*

- **Departamento**: Unidad organizacional identificada por `id`, con `nombre` y `descripcion`, que agrupa múltiples empleados.
- **Empleado**: Registro de personal existente que ahora incluye pertenencia obligatoria a un único departamento.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de operaciones de alta de departamentos con datos válidos se refleja correctamente en consultas posteriores.
- **SC-002**: El 100% de intentos de asignar empleados a departamentos inexistentes es rechazado con mensaje de error claro.
- **SC-003**: Al menos 95% de consultas de departamentos devuelven resultado en menos de 2 segundos en condiciones normales de operación.
- **SC-004**: El 100% de intentos de eliminar departamentos con empleados asociados es bloqueado correctamente.
- **SC-005**: Al menos 95% de usuarios administrativos completan el flujo crear departamento + asignar empleado en un solo intento durante pruebas funcionales.
- **SC-006**: Al menos 90% de flujos CRUD ejecutados desde frontend Angular 19 finalizan sin recarga manual ni errores no controlados.
- **SC-007**: Al menos 90% de asignaciones/cambios de `departamentoId` en formulario de empleado se completan exitosamente en un solo intento.
