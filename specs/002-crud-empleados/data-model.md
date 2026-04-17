# Data Model: CRUD de Empleados

## Entity: Empleado

### Fields
- `clave` (string, PK)
  - Tipo lógico: cadena de negocio autogenerada
  - Tipo BD: `VARCHAR(100)`
  - Reglas: obligatorio, único, patrón `E-<numero>`
  - Generación: `E-` + valor de secuencia PostgreSQL (`nextval`)
- `nombre` (string)
  - Tipo BD: `VARCHAR(100)`
  - Reglas: obligatorio, longitud 1..100
- `direccion` (string)
  - Tipo BD: `VARCHAR(100)`
  - Reglas: obligatorio, longitud 1..100
- `telefono` (string)
  - Tipo BD: `VARCHAR(100)`
  - Reglas: obligatorio, longitud 1..100

## Relationships
- No hay relaciones con otras entidades en el alcance de esta feature.

## Validation Rules
- `clave` MUST cumplir patrón `^E-[0-9]+$`.
- `clave`, `nombre`, `direccion`, `telefono` MUST ser no nulos.
- `nombre`, `direccion`, `telefono` MUST tener longitud máxima de 100.
- `clave` MUST ser de solo lectura en operaciones de actualización.
- Operaciones `PUT` y `DELETE` sobre `clave` inexistente MUST retornar estado de no encontrado.
- Inserción con colisión eventual de `clave` MUST retornar conflicto de unicidad controlado.

## State Transitions
- **No existe** -> `POST` válido -> **Activo**
- **Activo** -> `PUT` válido -> **Activo (actualizado)**
- **Activo** -> `DELETE` válido -> **No existe**

## Suggested SQL Shape
- Tabla: `empleado`
- PK: `clave`
- Secuencia: `empleado_seq`
- Columnas:
  - `clave VARCHAR(100) PRIMARY KEY`
  - `nombre VARCHAR(100) NOT NULL`
  - `direccion VARCHAR(100) NOT NULL`
  - `telefono VARCHAR(100) NOT NULL`
