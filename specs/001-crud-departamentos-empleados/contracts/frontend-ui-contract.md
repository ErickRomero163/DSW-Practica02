# Frontend UI Contract (Angular 19)

## Scope

Este contrato define el comportamiento esperado para la app Angular 19 en
`frontend/departamentos-admin/` que consume la API de empleados y departamentos.

## Authentication Contract

- El frontend solicita `username/password` al iniciar sesión.
- El frontend genera `Authorization: Basic <base64(user:pass)>`.
- Las credenciales y el header se almacenan solo en memoria de sesión.
- Al recargar la página, el estado autenticado se pierde y se requiere nuevo login.

## Required Views

1. **Login View**
   - Campos: usuario y contraseña.
   - Acción: autenticar y habilitar navegación.
   - Error esperado: mostrar mensaje ante `401 Unauthorized`.

2. **Departamentos List + CRUD View**
   - Listar departamentos.
   - Crear departamento con validación de nombre único.
   - Editar nombre/descripción.
   - Eliminar departamento solo si no tiene empleados.
   - Errores esperados: `400`, `404`, `409`.

3. **Empleado Form View**
   - Crear/editar empleado incluyendo `departamentoId` obligatorio.
   - Mostrar selector de departamentos activos.
   - Error esperado: `400` por datos inválidos, `404` por departamento inexistente.

4. **Departamento Detail View**
   - Mostrar datos del departamento.
   - Listar empleados asignados.
   - Mostrar estado vacío cuando no existan empleados.

## API Binding Rules

- La app usa endpoints definidos en `departamentos-empleados.openapi.yaml`.
- Base path de backend: `/api/v1`.
- Todas las llamadas incluyen header `Authorization` si la sesión está activa.
- Ante `401`, la app invalida sesión en memoria y redirige a login.
- Se deben mapear y mostrar mensajes de error consistentes para `400/401/404/409`.

## Payload Contract (Frontend -> Backend)

- **Crear/actualizar departamento**
   - Request: `{ nombre: string, descripcion?: string | null }`
- **Crear/actualizar empleado**
   - Request: `{ nombre: string, direccion: string, telefono: string, departamentoId: number }`
   - `departamentoId` es obligatorio.

## Navigation Contract

- Rutas protegidas deben requerir sesión en memoria activa.
- Al acceder sin sesión a rutas protegidas, se redirige a `/login`.
- Flujo mínimo de navegación:
   1. `/login`
   2. `/departamentos`
   3. `/departamentos/:id` (detalle)
