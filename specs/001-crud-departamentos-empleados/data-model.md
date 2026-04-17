# Data Model: CRUD de Departamentos y Relación con Empleados

## Entity: Departamento

### Fields
- `id` (long, PK)
  - Tipo BD: `BIGSERIAL`
  - Reglas: obligatorio, único, inmutable
- `nombre` (string)
  - Tipo BD: `VARCHAR(100)`
  - Reglas: obligatorio, no vacío, único, longitud 1..100
- `descripcion` (string)
  - Tipo BD: `VARCHAR(255)`
  - Reglas: opcional, longitud 0..255

### Relationships
- `Departamento (1) -> (N) Empleado`
  - Un departamento puede contener cero o más empleados.

### State Transitions
- **No existe** -> `POST` válido -> **Activo**
- **Activo** -> `PUT` válido -> **Activo (actualizado)**
- **Activo sin empleados asociados** -> `DELETE` válido -> **No existe**
- **Activo con empleados asociados** -> `DELETE` -> **Activo** (operación rechazada por conflicto)

## Entity: Empleado (extendida)

### Existing Fields
- `clave` (`VARCHAR(100)`, PK, patrón `E-[0-9]+`)
- `nombre` (`VARCHAR(100)`, obligatorio)
- `direccion` (`VARCHAR(100)`, obligatorio)
- `telefono` (`VARCHAR(100)`, obligatorio)

### New Field
- `departamento_id` (long, FK)
  - Tipo BD: `BIGINT`
  - Reglas: obligatorio, referencia a `departamento.id`
  - Migración: backfill automático a departamento técnico `SIN_ASIGNAR` para registros existentes

### Relationships
- `Empleado (N) -> (1) Departamento`
  - Cada empleado pertenece exactamente a un departamento.

## Entity: FrontendSession (UI)

### Fields
- `username` (string)
  - Reglas: obligatorio durante sesión activa
- `basicAuthHeader` (string)
  - Reglas: generado en login; almacenado solo en memoria
- `authenticated` (boolean)
  - Reglas: true durante sesión activa, false al cerrar o recargar

### State Transitions
- **No autenticado** -> login exitoso -> **Autenticado en memoria**
- **Autenticado en memoria** -> recarga de página -> **No autenticado**

## Entity: DepartamentoDetalleView (UI)

### Fields
- `departamento` (DepartamentoResumen)
- `empleados` (lista de EmpleadoResumen)
- `emptyState` (boolean)
  - Reglas: true cuando la lista de empleados está vacía

## Validation Rules
- `departamento.nombre` MUST ser obligatorio y único.
- `departamento.descripcion` MAY ser nula; si se informa, MUST respetar longitud máxima.
- `empleado.departamento_id` MUST existir antes de crear/actualizar empleado.
- En migración, empleados históricos MUST quedar asociados a `SIN_ASIGNAR` antes de aplicar `NOT NULL`.
- `DELETE departamento` MUST fallar con conflicto cuando existan empleados asociados.
- Operaciones sobre `id` de departamento inexistente MUST retornar no encontrado.
- FrontendSession MUST descartarse al recargar página.
- Frontend MUST mapear y mostrar errores HTTP `400`, `401`, `404`, `409`.

## Suggested SQL Shape
- Tabla nueva `departamento`
  - `id BIGSERIAL PRIMARY KEY`
  - `nombre VARCHAR(100) NOT NULL UNIQUE`
  - `descripcion VARCHAR(255)`
- Alter tabla `empleado`
  - Agregar `departamento_id BIGINT`
  - Backfill de existentes a `SIN_ASIGNAR`
  - Crear FK `fk_empleado_departamento` hacia `departamento(id)`
  - Definir `NOT NULL` tras backfill de registros existentes
- Índices
  - Índice por `empleado.departamento_id`
  - Índice único por `departamento.nombre`
