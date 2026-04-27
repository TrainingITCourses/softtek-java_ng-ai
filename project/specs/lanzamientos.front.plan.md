# Plan: lanzamientos (front)

**Contexto y alcance**
- Spec: `project/specs/lanzamientos.spec.md`
- Tier: `front` (UI Angular para gestión operativa de lanzamientos)
- Objetivo: implementar experiencia completa de listado, detalle, alta/edición y cambios de estado con validaciones locales, feedback de usuario y cobertura de pruebas.

**Plan Status**: Implemented

## Pasos y tareas

### Paso 1 — Modelo front, rutas y servicio
- [x] Definir modelo `Lanzamiento` + DTOs de petición (`LanzamientoPeticion`, `CambioEstadoLanzamientoPeticion`) en `front/src/app/lanzamientos/`.
- [x] Implementar `LanzamientosService` con métodos: `listar`, `obtener`, `crear`, `actualizar`, `cambiarEstado` usando `/api/lanzamientos`.
- [x] Extender `app.routes.ts` con ruta lazy `lanzamientos` y mantener navegación funcional desde ruta raíz.
- [x] Definir adaptador mínimo de errores API (`{ code, error, message }`) para mostrar mensajes consistentes en UI.

### Paso 2 — Pantalla de listado y detalle
- [x] Crear componente contenedor `LanzamientosComponent` con carga inicial, estado local (loading/error/success) y recarga tras operaciones.
- [x] Mostrar tabla/listado con columnas: `coheteId`, `fecha` formateada, `precio`, `estado` y acciones disponibles.
- [x] Añadir bloque de detalle en la misma pantalla o subvista con `id`, `coheteId`, `fecha`, `precio`, `estado`, `motivo`, `activo`.
- [x] Mostrar `motivo` solo cuando exista (`Suspendido`/`Cancelado`) y mensaje vacío cuando no aplique.

### Paso 3 — Formulario de alta y edición
- [x] Crear `LanzamientoFormComponent` reutilizable para alta/edición con Reactive Forms.
- [x] Campos obligatorios: `coheteId`, `fecha`, `precio`.
- [x] Validaciones locales: cohete requerido, fecha válida en formato ISO, precio numérico mayor a 0.
- [x] Cargar opciones de cohetes activos consumiendo `GET /api/cohetes` (backend ya devuelve activos).
- [x] Propagar errores de backend a mensajes visibles del formulario (role alert + texto accionable).

### Paso 4 — Ciclo de vida y UX operativa
- [x] Renderizar botones por estado actual respetando reglas de transición permitidas.
- [x] Implementar acción `POST /api/lanzamientos/{id}/state` con confirmación previa.
- [x] Al pasar a `Suspendido` o `Cancelado`, abrir diálogo/modal con campo `motivo` obligatorio y validación local de no vacío.
- [x] Al confirmar cambio de estado, refrescar listado/detalle y mostrar feedback no bloqueante de éxito o error.
- [x] Mantener accesibilidad mínima: foco gestionado en modal, `role="status"` para éxito y `role="alert"` para error.

### Paso 5 — Tests unitarios
- [x] Añadir unit tests de `LanzamientosService` para contratos HTTP principales y manejo de errores.
- [x] Añadir unit tests de `LanzamientoFormComponent` (validaciones, emisión de guardado y error servidor).
- [x] Añadir unit tests de lógica de acciones por estado (visibilidad/habilitación de botones de transición).
- [x] Diferir E2E de lanzamientos para una fase posterior.

## Criterios de validación (front)
- El formulario impide envío cuando `coheteId` está vacío, la fecha es inválida o `precio <= 0`.
- La UI exige `motivo` para `Suspendido`/`Cancelado` antes de enviar al backend.
- La UI no muestra transiciones inválidas para el estado actual del lanzamiento.
- Tras operación exitosa (crear/editar/cambiar estado), listado y detalle reflejan datos actualizados sin recargar página completa.
- Ante error de backend, el usuario ve mensaje estructurado y accionable sin perder contexto del formulario.

## Dependencias y bloqueos
- Requiere backend disponible con endpoints de `lanzamientos` implementados y estables.
- Requiere `GET /api/cohetes` para poblar selector de cohetes activos.
- Si cambia el contrato de estados o errores (`code/error/message`), ajustar mapeos y tests front.

## Notas
- Mantener estilo del proyecto Angular actual: componentes standalone, signals, control flow nativo (`@if`, `@for`) y formularios reactivos.
- Preferir una sola pantalla operativa para reducir navegación y acelerar flujo de operadores.
- E2E fuera de alcance por ahora; cuando se reactive, crear `e2e/tests/front/lanzamientos.spec.ts` con los escenarios definidos en la spec.
