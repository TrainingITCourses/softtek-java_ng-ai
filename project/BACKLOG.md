# Backlog de AstroBookings

Estado actual del repositorio: la funcionalidad de cohetes está implementada y el resto de especificaciones permanece planificado o parcialmente cubierto por la base actual.

> Nota: las especificaciones técnicas son transversales y su cierre completo depende de que las funcionalidades de negocio estén terminadas.

| spec-id | dependencias | estado |
| --- | --- | --- |
| cohetes | — | completada |
| lanzamientos | cohetes | pendiente |
| pasajeros | — | pendiente |
| reservas | lanzamientos, pasajeros | bloqueada |
| seguridad-mvp | cohetes, lanzamientos, pasajeros, reservas | en progreso |
| confiabilidad-y-errores | cohetes, lanzamientos, reservas | en progreso |
| observabilidad-basica | cohetes, lanzamientos, pasajeros, reservas | en progreso |
| rendimiento-basico | cohetes, lanzamientos, pasajeros, reservas | en progreso |
| integraciones-standalone | — | completada |
