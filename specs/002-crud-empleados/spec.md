# Feature Specification: CRUD de Empleados

**Feature Branch**: `002-crud-empleados`  
**Created**: 2026-02-25  
**Status**: Draft  
**Input**: User description: "crear un crud de empleados con los campos clave, nombre, direccion y telefono. Donde clave sea pk, y los demas campos sean de 100 espacios."

## Clarifications

### Session 2026-02-25

- Q: ¿Cómo se forma la clave del empleado? → A: `clave` mixta con prefijo fijo `E-` seguida de un número autogenerado.
- Q: ¿Cómo se genera el número autogenerado de la clave? → A: Con secuencia de PostgreSQL (`nextval`).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Registrar empleados (Priority: P1)

Como usuario administrador, quiero crear empleados con clave, nombre, dirección y teléfono para iniciar el catálogo de personal.

**Why this priority**: Sin la creación de registros no existe información base para consultar, editar o eliminar.

**Independent Test**: Puede probarse creando un empleado nuevo con datos válidos y verificando que queda disponible para consulta posterior.

**Acceptance Scenarios**:

1. **Given** que se envían nombre, dirección y teléfono válidos, **When** el usuario registra un empleado, **Then** el sistema genera `clave` con patrón `E-<numero>`, guarda el registro y confirma creación exitosa.
2. **Given** que ocurre un conflicto de clave durante la generación automática, **When** el usuario registra un empleado, **Then** el sistema reintenta o rechaza de forma controlada sin duplicar registros.
3. **Given** que un campo de texto supera 100 caracteres, **When** el usuario intenta registrar el empleado, **Then** el sistema rechaza la operación e indica el campo inválido.

---

### User Story 2 - Consultar empleados (Priority: P2)

Como usuario administrador, quiero consultar empleados por clave y listar todos para revisar información almacenada.

**Why this priority**: Permite usar y validar los datos existentes y habilita procesos de revisión operativa.

**Independent Test**: Puede probarse consultando un empleado existente por clave y luego solicitando el listado completo para validar resultados consistentes.

**Acceptance Scenarios**:

1. **Given** que existe un empleado con una clave específica, **When** el usuario consulta por esa clave, **Then** el sistema devuelve exactamente ese empleado.
2. **Given** que existen múltiples empleados, **When** el usuario solicita el listado general, **Then** el sistema devuelve todos los registros disponibles.
3. **Given** que la clave consultada no existe, **When** el usuario busca ese empleado, **Then** el sistema informa que no se encontró el registro.

---

### User Story 3 - Actualizar y eliminar empleados (Priority: P3)

Como usuario administrador, quiero actualizar datos y eliminar empleados para mantener el catálogo vigente y correcto.

**Why this priority**: Completa el ciclo de mantenimiento de datos y evita información obsoleta.

**Independent Test**: Puede probarse modificando nombre, dirección o teléfono de un empleado existente y luego eliminándolo para confirmar que deja de aparecer en consultas.

**Acceptance Scenarios**:

1. **Given** que existe un empleado, **When** el usuario actualiza nombre, dirección o teléfono con datos válidos, **Then** el sistema guarda cambios y muestra la versión actualizada.
2. **Given** que existe un empleado, **When** el usuario solicita eliminarlo, **Then** el sistema elimina el registro y confirma la operación.
3. **Given** que se intenta actualizar o eliminar una clave inexistente, **When** el usuario ejecuta la operación, **Then** el sistema rechaza la acción e informa que el empleado no existe.

### Edge Cases

- ¿Qué ocurre si el generador de `clave` no puede asignar un número único? El sistema rechaza la operación y devuelve un error controlado.
- ¿Qué ocurre si nombre, dirección o teléfono llegan vacíos? El sistema rechaza la operación por campos obligatorios.
- ¿Qué ocurre si nombre, dirección o teléfono tienen exactamente 100 caracteres? El sistema acepta la operación.
- ¿Qué ocurre si nombre, dirección o teléfono tienen 101 o más caracteres? El sistema rechaza la operación.
- ¿Qué ocurre si se intenta crear, actualizar o eliminar con datos malformados? El sistema responde con mensaje claro de validación.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST permitir registrar empleados con los campos clave, nombre, dirección y teléfono.
- **FR-002**: El campo `clave` MUST ser la clave primaria del empleado, de tipo cadena (`VARCHAR(100)`), único y obligatorio.
- **FR-003**: El sistema MUST permitir consultar un empleado por su clave.
- **FR-004**: El sistema MUST permitir listar todos los empleados registrados.
- **FR-005**: El sistema MUST permitir actualizar nombre, dirección y teléfono de un empleado existente.
- **FR-006**: El sistema MUST permitir eliminar un empleado existente por clave.
- **FR-007**: Nombre, dirección y teléfono MUST aceptar como máximo 100 caracteres cada uno.
- **FR-008**: Nombre, dirección y teléfono MUST ser obligatorios al crear y actualizar.
- **FR-009**: El sistema MUST rechazar operaciones sobre claves inexistentes con un resultado explícito de no encontrado.
- **FR-010**: El sistema MUST devolver mensajes de validación claros cuando un campo incumpla longitud o obligatoriedad.
- **FR-011**: El sistema MUST generar automáticamente `clave` con patrón `E-<numero>` al crear un empleado.
- **FR-012**: El sistema MUST impedir edición manual de `clave` en operaciones de actualización.
- **FR-013**: El número de `clave` MUST generarse mediante secuencia de PostgreSQL para garantizar unicidad bajo concurrencia.

### Constitution Alignment *(mandatory)*

- **CA-001 (Stack)**: La funcionalidad debe mantener compatibilidad con la base tecnológica definida para backend.
- **CA-002 (Auth)**: Las operaciones CRUD de empleados deben ejecutarse bajo las reglas de autenticación vigentes del proyecto.
- **CA-003 (Data)**: La funcionalidad debe persistir empleados como datos de negocio en la base de datos principal.
- **CA-004 (Docker)**: La funcionalidad debe poder validarse en el entorno contenedorizado del proyecto.
- **CA-005 (OpenAPI)**: Las operaciones CRUD deben estar reflejadas en la documentación de API del proyecto.

### Assumptions

- Se asume que existe un único tipo de usuario operativo para gestionar empleados.
- Se asume que la clave del empleado es generada por el sistema con prefijo fijo `E-` y parte numérica autoincremental.
- Se asume que la parte numérica de `clave` se obtiene desde una secuencia de PostgreSQL en el momento de creación.
- Se asume que no se requiere paginación para el listado en esta primera versión.
- Se asume que no se requiere historial de cambios para actualizaciones en esta versión.

### Key Entities *(include if feature involves data)*

- **Empleado**: Registro de personal identificado por `clave` (`VARCHAR(100)`) como PK con patrón `E-<numero>`, y compuesto por `nombre`, `direccion` y `telefono`, cada uno con longitud máxima de 100 caracteres.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de operaciones de alta con datos válidos crea un empleado visible en consulta posterior.
- **SC-002**: El 100% de operaciones con campos de texto mayores a 100 caracteres es rechazado con mensaje de validación.
- **SC-003**: Al menos 95% de operaciones de consulta por clave existente devuelven el registro correcto en menos de 2 segundos en condiciones normales de operación.
- **SC-004**: Al menos 95% de operaciones de actualización y eliminación sobre claves existentes se completan exitosamente en una sola interacción de usuario.
