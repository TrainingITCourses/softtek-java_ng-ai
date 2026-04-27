# Plan: lanzamientos (back)

**Contexto y alcance**
- Spec: `project/specs/lanzamientos.spec.md`
- Tier: `back` (API REST, validaciones de negocio, persistencia y reglas de ciclo de vida)
- Objetivo: Implementar entidad `Lanzamiento`, repositorio, servicio, controlador y reglas de transición de estados con validaciones y pruebas.

**Plan Status**: Implemented

## Pasos y tareas

### Paso 1 — Modelo y persistencia
- [x] Definir modelo de dominio `Lanzamiento` con campos `id`, `coheteId`, `fecha`, `precio`, `estado`, `motivo`, `activo`.
- [x] Definir enum `EstadoLanzamiento`: `Programado`, `Confirmado`, `Completado`, `Suspendido`, `Cancelado`.
- [x] Implementar `InMemoryLanzamientoRepository` con almacenamiento en memoria y operaciones CRUD + baja lógica.
- [x] Definir interfaz de repositorio para desacoplar servicio y facilitar migración futura a DB.

### Paso 3 — Reglas de negocio y validaciones
- [x] Validar existencia y `activo=true` del `coheteId` antes de crear/editar.
- [x] En `create` asignar estado inicial `Programado`.
- [x] Implementar transiciones permitidas y rechazar cambios inválidos (`Cancelado` es terminal).
- [x] Exigir `motivo` no vacío para `Suspendido` y `Cancelado`.
- [x] Devolver errores estructurados `{ code, error, message }`.

### Paso 4 — API y contratos
- [x] Exponer endpoints REST: GET `/api/lanzamientos`, GET `/api/lanzamientos/{id}`, POST `/api/lanzamientos`, PUT `/api/lanzamientos/{id}`, POST `/api/lanzamientos/{id}/state`.
- [x] Documentar contratos y ejemplos de payload.

### Paso 5 — Tests y verificación
- [x] Añadir pruebas unitarias para `LanzamientoService` (validaciones, transiciones y reglas).
- [x] Añadir pruebas de integración para los endpoints principales.

## Criterios de validación (back)
- El backend rechaza creación/edición con `cohete` inactivo o inexistente.
- Transiciones invalidas son rechazadas y devuelven error estructurado.
- `Cancelado` no permite transiciones posteriores.

## Dependencias y bloqueos
- Requiere que el servicio `cohetes` exponga verificación de estado `activo`.
- Migraciones/DB accesible en el entorno de CI para pruebas de integración.

## Notas
- Diseñar APIs idempotentes y seguras; registrar auditoría de cambios de estado.
