# Research: CRUD de Departamentos y Relación con Empleados

## Decision 1: Estrategia de identidad de `Departamento`
- Decision: Usar `id` numérico autogenerado por PostgreSQL (`BIGSERIAL`) como PK técnica de departamento.
- Rationale: Simplifica joins, índices y referencias en FK desde `empleado`.
- Alternatives considered:
  - UUID: válido pero más verboso para API y consultas del alcance actual.
  - Nombre como PK: frágil ante cambios de negocio y renombrados.

## Decision 2: Regla de unicidad de nombre de departamento
- Decision: Definir `nombre` como obligatorio y único en base de datos.
- Rationale: Evita ambigüedad funcional en asignaciones y reportes.
- Alternatives considered:
  - Permitir duplicados: introduce confusión operativa.
  - Unicidad lógica solo en aplicación: menor garantía de integridad.

## Decision 3: Relación obligatoria Empleado -> Departamento
- Decision: Agregar `departamento_id` NOT NULL en `empleado` y mapear relación `ManyToOne` obligatoria.
- Rationale: Cumple requisito de que todo empleado pertenezca a un único departamento.
- Alternatives considered:
  - FK nullable: contradice requisito funcional.
  - Tabla puente: innecesaria para relación 1:N.

## Decision 4: Política de eliminación de departamentos
- Decision: Bloquear eliminación de departamentos con empleados asociados (respuesta de conflicto).
- Rationale: Preserva integridad referencial y evita reasignaciones implícitas no solicitadas.
- Alternatives considered:
  - Borrado en cascada de empleados: riesgo alto de pérdida de datos.
  - Reasignación automática: comportamiento sorpresivo y no especificado.

## Decision 5: Migración de datos existentes
- Decision: Crear departamento técnico `SIN_ASIGNAR` y asociar automáticamente empleados existentes antes de imponer `NOT NULL` en `departamento_id`.
- Rationale: Responde a la clarificación aprobada y evita fallas de despliegue cuando ya existen empleados históricos.
- Alternatives considered:
  - Rechazar migración si hay empleados: bloquea despliegue.
  - Asignación manual previa obligatoria: más costo operativo y riesgo humano.
  - Permitir `departamento_id` nulo temporalmente: rompe requisito de obligatoriedad y posterga consistencia.

## Decision 6: Contrato API para consultas de estructura
- Decision: Exponer CRUD de departamentos en `/api/v1/departamentos` y enriquecer representación de empleado con referencia de departamento (`id`, `nombre`).
- Rationale: Separa responsabilidades y mantiene compatibilidad con API existente.
- Alternatives considered:
  - Solo endpoint agregado en empleados: mezclaría responsabilidades.
  - Endpoint agregado sin datos resumidos de departamento: reduce trazabilidad funcional.

## Decision 7: Seguridad y documentación
- Decision: Mantener HTTP Basic para todas las rutas nuevas y actualizar OpenAPI con `basicAuth` en todos los endpoints afectados.
- Rationale: Cumple constitución y evita superficies públicas no previstas.
- Alternatives considered:
  - Endpoints de lectura públicos: no alineado con baseline de seguridad.
  - Documentación parcial: incrementa riesgo de integración.

## Decision 8: Impacto frontend en monorepo
- Decision: Implementar en esta misma feature una nueva app Angular 19 dedicada en `frontend/` para CRUD de departamentos, asignación de empleados y detalle de estructura.
- Rationale: Clarificación aprobada por negocio; garantiza entrega full-stack coherente con monorepo y reduce dependencia de herramientas externas para operación.
- Alternatives considered:
  - Mantener solo backend en esta feature: no cumple clarificación funcional aceptada.
  - Extender app frontend existente: no aplica, se definió nueva app dedicada.

## Decision 9: Gestión de sesión HTTP Basic en frontend
- Decision: Implementar login simple en frontend y mantener credenciales únicamente en memoria durante la sesión activa.
- Rationale: Reduce exposición de secretos evitando persistencia en `localStorage` y cumple clarificación de seguridad.
- Alternatives considered:
  - Solicitar credenciales en cada operación: degrada experiencia de uso.
  - Persistir credenciales en almacenamiento local: aumenta riesgo de seguridad.
