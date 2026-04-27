# Plan: lanzamientos (front)

**Contexto y alcance**
- Spec: `project/specs/lanzamientos.spec.md`
- Tier: `front` (interfaz y experiencia de usuario para gestión de lanzamientos)
- Objetivo: Implementar listado, detalle, formulario de alta/edición y controles de transición de estado con validaciones y mensajes de usuario.

**Plan Status**: Pending

## Pasos y tareas

### Paso 1 — Listado y detalle
- [ ] Implementar endpoint de consumo: GET `/api/lanzamientos`.
- [ ] Diseñar y desarrollar componente `LanzamientosList` mostrando cohete, fecha, precio y estado.
- [ ] Añadir vista de detalle `LanzamientoDetail` con campos completos y motivo si aplica.

### Paso 2 — Formulario de alta/edición
- [ ] Crear `LanzamientoForm` con campos: `cohete`, `fecha`, `precio`.
- [ ] Validaciones locales: cohete requerido, fecha válida, precio > 0.
- [ ] Integrar selector de cohetes activos (consumir `/api/cohetes?activo=true`).

### Paso 3 — Acciones de ciclo de vida
- [ ] Implementar botones/acciones según transiciones válidas (Programado→Confirmado, Suspendido/Cancelado, Reactivar desde Suspendido).
- [ ] Al solicitar Suspendido/Cancelado, abrir modal para ingresar `motivo` obligatorio.
- [ ] Confirmar cambios con mensajes toast y refrescar listado.

### Paso 4 — Tests y validación
- [ ] Añadir unit tests para componentes críticos (form validation, botones de estado).
- [ ] Añadir tests E2E básicos para flujo de alta, cambio de estado con motivo y listado actualizado.

## Criterios de validación (front)
- El formulario previene envío inválido (cohete vacío, precio <= 0).
- Cambios de estado muestran modal cuando se requiere motivo y rechazan sin motivo.
- Listado refleja cambios de estado inmediatamente tras operación exitosa.

## Dependencias y bloqueos
- Depende del API backend para validaciones de negocio y endpoints CRUD de lanzamientos.
- Dependencia: `cohetes` service/endpoint que provea sólo cohetes activos.

## Notas
- Mantener accesibilidad y mensajes claros para operadores.
