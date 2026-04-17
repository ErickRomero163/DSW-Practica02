# Quickstart: CRUD de Departamentos y Relación con Empleados

## Prerrequisitos
- Docker y Docker Compose
- Java 17
- Maven
- Node.js LTS y Angular CLI compatible con Angular 19

## Contexto monorepo
- Esta feature modifica backend y agrega una app Angular 19 en `frontend/departamentos-admin/`.
- El frontend consume los contratos API definidos en OpenAPI.

## 1) Levantar el entorno

```bash
docker compose up -d --build
```

Verificar estado:

```bash
docker compose ps
```

## 1.1) Levantar frontend Angular 19

```bash
cd frontend/departamentos-admin
npm install
npm run start
```

URL esperada del frontend: `http://localhost:4200`

## 2) Credenciales de autenticación
- Usuario: `admin`
- Contraseña: `admin123`

(O usar variables de entorno `APP_SECURITY_USERNAME` y `APP_SECURITY_PASSWORD`.)

En frontend, las credenciales se guardan solo en memoria de sesión y se pierden
al recargar la página.

## 3) Verificar salud de la API

```bash
curl -u admin:admin123 http://localhost:8080/actuator/health
```

Respuesta esperada: `{"status":"UP"}`.

## 3.1) Verificar migración

Validar que Flyway aplicó versión `V2` y que existe el departamento técnico `SIN_ASIGNAR` para backfill de empleados históricos.

## 4) Flujo mínimo de departamentos

Crear departamento:

```bash
curl -u admin:admin123 -X POST http://localhost:8080/api/v1/departamentos \
  -H 'Content-Type: application/json' \
  -d '{"nombre":"Tecnologia","descripcion":"Equipo de sistemas"}'
```

Listar departamentos:

```bash
curl -u admin:admin123 http://localhost:8080/api/v1/departamentos
```

Consultar departamento con empleados:

```bash
curl -u admin:admin123 http://localhost:8080/api/v1/departamentos/1
```

## 5) Flujo mínimo de empleados con departamento

Crear empleado asociado a departamento existente:

```bash
curl -u admin:admin123 -X POST http://localhost:8080/api/v1/empleados \
  -H 'Content-Type: application/json' \
  -d '{"nombre":"Ana","direccion":"Calle 1","telefono":"5551234","departamentoId":1}'
```

Actualizar empleado cambiando de departamento:

```bash
curl -u admin:admin123 -X PUT http://localhost:8080/api/v1/empleados/E-1 \
  -H 'Content-Type: application/json' \
  -d '{"nombre":"Ana","direccion":"Calle 1","telefono":"5551234","departamentoId":2}'
```

## 6) Validaciones clave a confirmar
- No se puede crear/actualizar empleado con `departamentoId` inexistente.
- No se puede eliminar un departamento con empleados asociados (debe responder conflicto).
- Swagger/OpenAPI refleja rutas de departamentos y cambios en payload de empleados.

## 7) Contrato API
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`
- Contrato de diseño: `specs/001-crud-departamentos-empleados/contracts/departamentos-empleados.openapi.yaml`

## 8) Flujo mínimo frontend

- Ingresar credenciales en pantalla de login.
- Listar y crear departamentos desde el módulo Angular.
- Crear/editar empleado enviando `nombre`, `direccion`, `telefono` y `departamentoId`.
- Abrir detalle de departamento y validar lista de empleados o estado vacío.
- Forzar `401` con credenciales inválidas y verificar mensaje de error en UI.

## 9) Ejecución E2E sugerida (backend + frontend)

1. Levantar backend y base de datos con Docker Compose.
2. Iniciar frontend Angular en `frontend/departamentos-admin/`.
3. Iniciar sesión en UI con credenciales válidas.
4. Crear departamento y verificarlo en lista.
5. Crear empleado asociado al departamento creado.
6. Consultar detalle del departamento y verificar listado de empleados.
7. Intentar eliminar departamento con empleados y validar respuesta `409`.
8. Provocar `401` (credenciales inválidas o sesión expirada) y validar redirección a login.

## 10) Registro de validación MVP (2026-03-23)

- Checklist de feature: **PASS** (`requirements.md` completo).
- Validación técnica backend: `mvn -q -DskipTests package` **PASS**.
- Consistencia de errores backend (`400/404/409` en `ProblemDetail` y `401` por Spring Security): **PASS**.
- Contratos actualizados (`OpenAPI` y contrato UI): **PASS**.

### Evidencia de validación manual API (2026-03-23)

- `GET /actuator/health` con credenciales válidas: **200 / UP**.
- `POST /api/v1/departamentos` (2 registros de prueba): **201**.
- `POST /api/v1/empleados` con `departamentoId` válido: **201**.
- `PUT /api/v1/empleados/{clave}` reasignando departamento: **200**.
- `GET /api/v1/departamentos/{id}` con empleados: **200** y lista no vacía.
- `DELETE /api/v1/departamentos/{id}` con empleados asociados: **409 Conflict**.
- `GET /api/v1/departamentos` con credenciales inválidas: **401 Unauthorized**.

Resultado global de validación MVP: **PASS**.
