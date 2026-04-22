# F4. Gestión de Reservas con Control de Capacidad

## Definición del problema

### Contexto

El equipo comercial necesita registrar reservas sobre lanzamientos disponibles sin exceder la capacidad real de cada cohete ni operar sobre vuelos no válidos. Sin este control centralizado, el negocio puede incurrir en sobreventa, inconsistencias de estado y mala comunicación con los pasajeros afectados por incidencias.

### Historias de usuario

- Como `empleado comercial` quiero **crear una reserva vinculando un pasajero a un lanzamiento** para _asignarle una plaza en un vuelo disponible_
- Como `empleado comercial` quiero **consultar el estado de las reservas** para _informar correctamente al pasajero_
- Como `empleado de operaciones` quiero **que las reservas reaccionen automáticamente a suspensiones o cancelaciones del lanzamiento** para _mantener consistencia operativa_
- Como `empleado comercial` quiero **recibir errores claros cuando no sea posible reservar** para _evitar sobreventa y registros inválidos_

### Fuera de scope

- Cobro, facturación o integración con pasarelas de pago.
- Selección de asiento, equipaje o servicios adicionales.
- Reubicación automática en otro lanzamiento tras una cancelación.

---

## Boceto de la solución

La funcionalidad permitirá registrar reservas sobre lanzamientos activos, comprobando en backend la capacidad disponible del cohete asignado y el estado operativo del vuelo. Las reservas tendrán un estado visible para front y cambiarán automáticamente cuando el lanzamiento se suspenda o cancele.

### Modelo

| Entidad | Atributo | Tipo | Restricciones |
|---------|----------|------|---------------|
| `Reserva` | `id` | `uuid#` | Autogenerado |
| `Reserva` | `pasajeroId` | `uuid` | Requerido, debe referenciar un pasajero existente |
| `Reserva` | `lanzamientoId` | `uuid` | Requerido, debe referenciar un lanzamiento existente |
| `Reserva` | `estado` | `enum` | `Activa`, `Suspendida`, `Cancelada` |
| `Reserva` | `fechaReserva` | `datetime` | Autogenerada al crear |

> leyenda: `#` para único, `?` para opcional (requerido por defecto)

### Back

- Exponer operaciones para crear y consultar reservas vinculadas a pasajero y lanzamiento.
- Validar que el lanzamiento exista y no esté en estado `Cancelado` ni `Completado` antes de aceptar una reserva.
- Comprobar la capacidad ocupada frente a la capacidad del cohete asignado y rechazar nuevas reservas si no hay plazas.
- Actualizar en cascada el estado de las reservas cuando el lanzamiento pase a `Suspendido` o `Cancelado`.
- Devolver errores estructurados con formato `{ code, error, message }` cuando falle una regla de negocio.

### Front

- Mostrar un listado de reservas con pasajero, lanzamiento y estado.
- Ofrecer un formulario con selección de pasajero y lanzamiento disponible.
- Bloquear o advertir al usuario cuando el lanzamiento no admita nuevas reservas.
- Reflejar visualmente si una reserva ha quedado suspendida o cancelada por incidencia del lanzamiento.

---

## Criterios de aceptación

> Formato EARS (en español)

- [ ] el sistema DEBE permitir crear una reserva cuando existan pasajero y lanzamiento válidos con plazas disponibles.
- [ ] CUANDO se registre una reserva válida el sistema DEBE descontar la disponibilidad efectiva del lanzamiento para operaciones futuras.
- [ ] SI un lanzamiento está `Cancelado` ENTONCES el sistema DEBE impedir nuevas reservas sobre él.
- [ ] SI un lanzamiento está `Completado` ENTONCES el sistema DEBE impedir nuevas reservas sobre él.
- [ ] SI la capacidad del cohete ya está cubierta ENTONCES el sistema DEBE rechazar la nueva reserva con un error de negocio.
- [ ] CUANDO un lanzamiento pase a `Suspendido` el sistema DEBE actualizar automáticamente sus reservas activas a estado `Suspendida`.
- [ ] CUANDO un lanzamiento pase a `Cancelado` el sistema DEBE actualizar automáticamente sus reservas activas a estado `Cancelada`.
- [ ] CUANDO se consulte una reserva el sistema DEBE mostrar el estado vigente derivado de la operación del lanzamiento.
