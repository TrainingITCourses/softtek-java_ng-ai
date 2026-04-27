# F2. Planificación y Ciclo de Vida de Lanzamientos

## Definición del problema

### Contexto

El equipo de operaciones necesita planificar vuelos espaciales con trazabilidad y control del estado de cada lanzamiento. Sin una gestión centralizada de fechas, cohetes asignados, precios y cambios operativos, se producen errores de agenda, incertidumbre comercial y falta de visibilidad sobre incidencias como suspensiones o cancelaciones.

### Historias de usuario

- Como `empleado de operaciones` quiero **crear un lanzamiento asignando cohete, fecha y precio** para _ponerlo a disposición del negocio_
- Como `empleado de operaciones` quiero **cambiar el estado de un lanzamiento según su evolución operativa** para _mantener información fiable y actualizada_
- Como `empleado de operaciones` quiero **suspender o cancelar un lanzamiento indicando el motivo** para _dejar constancia de la incidencia y su impacto_
- Como `empleado comercial` quiero **consultar el estado actual de un lanzamiento** para _informar correctamente a los pasajeros y gestionar reservas_

### Fuera de scope

- Reasignación automática de pasajeros a otros lanzamientos tras una cancelación o suspensión.
- Integraciones con sistemas externos de meteorología, pagos o logística.
- Cálculo dinámico de precios, promociones o revenue management.

---

## Boceto de la solución

La funcionalidad permitirá dar de alta lanzamientos vinculados a un cohete activo, consultar su información operativa y gestionar su ciclo de vida mediante transiciones de estado controladas. La solución debe garantizar consistencia de negocio, exigir motivo en incidencias y dejar visibles los estados para que reservas y operación trabajen sobre una única fuente de verdad.

### Modelo

| Entidad | Atributo | Tipo | Restricciones |
|---------|----------|------|---------------|
| `Lanzamiento` | `id` | `uuid#` | Autogenerado |
| `Lanzamiento` | `coheteId` | `uuid` | Requerido, debe referenciar un cohete activo |
| `Lanzamiento` | `fecha` | `datetime` | Requerido |
| `Lanzamiento` | `precio` | `decimal` | Requerido, mayor que 0 |
| `Lanzamiento` | `estado` | `enum` | `Programado`, `Confirmado`, `Completado`, `Suspendido`, `Cancelado` |
| `Lanzamiento` | `motivo` | `string?` | Obligatorio si el estado es `Suspendido` o `Cancelado` |
| `Lanzamiento` | `activo` | `boolean` | `true` por defecto, usado para baja lógica |

> leyenda: `#` para único, `?` para opcional (requerido por defecto)

### Back

- Exponer operaciones para crear, consultar, editar y dar de baja lógica lanzamientos.
- Validar que el cohete exista y permanezca activo antes de asignarlo al lanzamiento.
- Aplicar el ciclo de vida permitido: `Programado → Confirmado → Completado`; desde estados activos se puede pasar a `Suspendido` o `Cancelado`.
- Exigir un motivo no vacío cuando el lanzamiento pase a `Suspendido` o `Cancelado`.
- Tratar `Cancelado` como estado terminal y permitir que `Suspendido` pueda revertirse a `Programado` o `Confirmado`.
- Devolver errores estructurados con formato `{ code, error, message }` ante validaciones o reglas de negocio incumplidas.

### Front

- Mostrar un listado de lanzamientos con cohete, fecha, precio y estado visible.
- Ofrecer un formulario de alta y edición con selección de cohete activo, fecha y precio.
- Permitir acciones de cambio de estado según transición válida, solicitando motivo cuando corresponda.
- Informar al usuario con mensajes claros de éxito o error ante operaciones inválidas o rechazadas.

---

#### Plan de implementación (Back)

Se ha creado un plan de implementación detallado para el backend en `project/specs/lanzamientos.back.plan.md`.

- **Plan Status**: Pending

Resumen de tareas principales:

- Modelado y persistencia de `Lanzamiento`.
- Servicios y validaciones de negocio (cohete activo, transiciones, motivo obligatorio).
- Endpoints REST y pruebas de integración.

#### Plan de implementación (Front)

Se ha creado un plan de implementación detallado para el frontend en `project/specs/lanzamientos.front.plan.md`.

- **Plan Status**: Pending

Resumen de tareas principales:

- Listado y detalle de lanzamientos.
- Formulario de alta/edición con validaciones y selector de cohetes activos.
- Acciones para cambios de estado con modal de motivo y tests E2E.


## Criterios de aceptación

- [ ] el sistema DEBE permitir registrar un lanzamiento indicando cohete, fecha y precio válidos.
- [ ] CUANDO se crea un lanzamiento válido el sistema DEBE asignarle el estado inicial `Programado`.
- [ ] SI el usuario intenta crear o editar un lanzamiento sin cohete asignado ENTONCES el sistema DEBE rechazar la operación.
- [ ] SI el usuario intenta asignar un cohete inactivo o inexistente ENTONCES el sistema DEBE rechazar la operación con error de negocio.
- [ ] CUANDO un lanzamiento en estado `Programado` pasa a `Confirmado` el sistema DEBE reflejar el nuevo estado en consultas posteriores.
- [ ] CUANDO un lanzamiento en estado activo pasa a `Suspendido` o `Cancelado` el sistema DEBE exigir un motivo obligatorio y almacenarlo.
- [ ] SI se intenta suspender o cancelar un lanzamiento sin motivo ENTONCES el sistema DEBE rechazar la transición.
- [ ] CUANDO un lanzamiento en estado `Suspendido` se reactiva el sistema DEBE permitir volver a `Programado` o `Confirmado`.
- [ ] SI se intenta cambiar un lanzamiento `Cancelado` a cualquier otro estado ENTONCES el sistema DEBE rechazar la operación por tratarse de un estado terminal.
- [ ] CUANDO se consulte el detalle o listado de lanzamientos el sistema DEBE mostrar el estado operativo actualizado de cada registro.
