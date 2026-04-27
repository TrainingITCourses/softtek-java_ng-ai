# Plan: lanzamientos (back)

**Contexto y alcance**
- Spec: `project/specs/lanzamientos.spec.md`
- Tier: `back` (API REST, validaciones de negocio, persistencia y reglas de ciclo de vida)
- Objetivo: Implementar entidad `Lanzamiento`, repositorio, servicio, controlador y reglas de transición de estados con validaciones y pruebas.

**Plan Status**: Pending

## Pasos y tareas

### Paso 1 — Modelo y persistencia
- [ ] Crear entidad `Lanzamiento` con campos `id`, `coheteId`, `fecha`, `precio`, `estado`, `motivo`, `activo`.
- [ ] Añadir migración/esquema y mapeo JPA (si aplica) o DDL correspondiente.

### Paso 2 — Repositorio y servicios
- [ ] Implementar `LanzamientoRepository` con consultas para listado, filtro por estado y cohete.
- [ ] Implementar `LanzamientoService` con métodos: create, update, find, softDelete, changeState.

### Paso 3 — Reglas de negocio y validaciones
- [ ] Validar existencia y `activo=true` del `coheteId` antes de crear/editar.
- [ ] En `create` asignar estado inicial `Programado`.
- [ ] Implementar transiciones permitidas y rechazar cambios inválidos (`Cancelado` es terminal).
- [ ] Exigir `motivo` no vacío para `Suspendido` y `Cancelado`.
- [ ] Devolver errores estructurados `{ code, error, message }`.

### Paso 4 — API y contratos
- [ ] Exponer endpoints REST: GET `/api/lanzamientos`, GET `/api/lanzamientos/{id}`, POST `/api/lanzamientos`, PUT `/api/lanzamientos/{id}`, POST `/api/lanzamientos/{id}/state`.
- [ ] Documentar contratos y ejemplos de payload.

### Paso 5 — Tests y verificación
- [ ] Añadir pruebas unitarias para `LanzamientoService` (validaciones, transiciones y reglas).
- [ ] Añadir pruebas de integración para los endpoints principales.

## Criterios de validación (back)
- El backend rechaza creación/edición con `cohete` inactivo o inexistente.
- Transiciones invalidas son rechazadas y devuelven error estructurado.
- `Cancelado` no permite transiciones posteriores.

## Dependencias y bloqueos
- Requiere que el servicio `cohetes` exponga verificación de estado `activo`.
- Migraciones/DB accesible en el entorno de CI para pruebas de integración.

## Notas
- Diseñar APIs idempotentes y seguras; registrar auditoría de cambios de estado.
