# Quickstart: CRUD de Empleados

## Prerrequisitos
- Java 17
- Maven o Gradle (según build del proyecto)
- Docker y Docker Compose

## 1) Levantar PostgreSQL con Docker
Ejemplo de arranque (ajusta si ya existe `docker-compose.yml`):

```bash
docker compose up -d db
```

Para levantar aplicación + base de datos en contenedores:

```bash
docker compose up -d --build
```

Variables esperadas por la app:
- `SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/dsw_practica02`
- `SPRING_DATASOURCE_USERNAME=postgres`
- `SPRING_DATASOURCE_PASSWORD=postgres`

## 2) Configurar credenciales de Basic Auth
Por defecto:
- Usuario: `admin`
- Contraseña: `admin123`

Sobrescribir por entorno:
- `APP_SECURITY_USERNAME`
- `APP_SECURITY_PASSWORD`

## 3) Ejecutar la aplicación
Ejemplo:

```bash
./mvnw spring-boot:run
```

## 4) Verificar endpoints
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

## 5) Prueba rápida por cURL
Crear empleado:

```bash
curl -u admin:admin123 -X POST http://localhost:8080/api/v1/empleados \
  -H 'Content-Type: application/json' \
  -d '{"nombre":"Ana","direccion":"Calle 1","telefono":"5551234"}'
```

Consultar empleado:

```bash
curl -u admin:admin123 http://localhost:8080/api/v1/empleados/E-1
```

## 6) Criterios de validación mínimos
- `clave` autogenerada con patrón `E-<numero>`, única y no editable en `PUT`.
- `nombre`, `direccion`, `telefono` obligatorios, máximo 100.
- CRUD protegido con HTTP Basic.
- Respuestas de error consistentes para 400/401/404/409.

## 7) Notas de validación

- 2026-03-03: Se verificó compilación del backend con `mvn -DskipTests package`.
- 2026-03-03: Contrato OpenAPI actualizado para reflejar `clave` generada automáticamente en altas.
