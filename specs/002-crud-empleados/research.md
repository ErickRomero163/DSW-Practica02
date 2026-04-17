# Research: CRUD de Empleados

## Decision 1: Exponer CRUD REST versionado
- **Decision**: Implementar endpoints en `/api/v1/empleados` con operaciones `POST`, `GET /{clave}`, `GET`, `PUT /{clave}` y `DELETE /{clave}`.
- **Rationale**: Permite contrato estable, trazable y alineado con el alcance CRUD del spec.
- **Alternatives considered**:
  - Endpoints sin versionado (`/empleados`): más simple, pero menos preparado para cambios futuros.
  - PATCH en lugar de PUT para actualización: útil, pero agrega complejidad no requerida para esta iteración.

## Decision 2: Validación en API + restricciones en BD
- **Decision**: Validar obligatoriedad y longitud máxima 100 en API (Bean Validation) para `nombre`, `direccion` y `telefono`, y reforzar en PostgreSQL con `VARCHAR(100)` + `NOT NULL`; validar formato de `clave` generada (`^E-[0-9]+$`).
- **Rationale**: Entrega errores claros al usuario y mantiene integridad de datos aun ante accesos alternos.
- **Alternatives considered**:
  - Validar solo en base de datos: mensajes de error menos claros y tardíos.
  - Validar solo en aplicación: riesgo de inconsistencias por fuera de la API.

## Decision 3: Seguridad con HTTP Basic para todo el CRUD
- **Decision**: Proteger todos los endpoints de empleados con HTTP Basic.
- **Rationale**: El módulo es administrativo y la constitución exige baseline de seguridad con Basic Auth.
- **Alternatives considered**:
  - Lecturas públicas y escrituras autenticadas: reduce seguridad y genera políticas mixtas innecesarias.
  - Endpoints públicos para MVP: contradice el baseline de seguridad definido.

## Decision 4: Persistencia PostgreSQL con migraciones versionadas
- **Decision**: Usar PostgreSQL como storage principal y versionar esquema con Flyway; usar `ddl-auto=validate` en ejecución normal.
- **Rationale**: Evita deriva de esquema, mejora trazabilidad y alinea entornos local/CI.
- **Alternatives considered**:
  - `ddl-auto=update`: rápido para prototipo, pero riesgoso en evolución.
  - H2 en producción o integración principal: no representa fielmente PostgreSQL.

## Decision 5: Docker como entorno local por defecto
- **Decision**: Ejecutar app + PostgreSQL con Docker Compose, con healthchecks y variables de entorno.
- **Rationale**: Hace el entorno reproducible y consistente para desarrollo y pruebas de integración.
- **Alternatives considered**:
  - Base local fuera de Docker: menos reproducible.
  - Contenedor único app+db: mala separación operacional.

## Decision 6: OpenAPI/Swagger con esquema de seguridad documentado
- **Decision**: Publicar OpenAPI mediante springdoc y documentar esquema `http` + `basic` global para endpoints CRUD.
- **Rationale**: Consumidores entienden autenticación y contratos sin ambigüedad.
- **Alternatives considered**:
  - Swagger sin seguridad declarada: documentación incompleta.
  - Documentación manual sin OpenAPI: mayor costo y desalineación.

## Resolved Clarifications
- `clave` definida como PK `VARCHAR(100)` autogenerada con patrón `E-<numero>`.
- Parte numérica de `clave` generada con secuencia PostgreSQL (`nextval`).
- `nombre`, `direccion`, `telefono` obligatorios con longitud máxima 100.
- Cobertura de seguridad: CRUD completo autenticado por HTTP Basic.
