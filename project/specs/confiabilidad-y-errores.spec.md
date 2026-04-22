# TR3. Confiabilidad y Manejo de Errores

## Definición del problema

### Contexto

AstroBookings necesita que las operaciones críticas mantengan consistencia incluso cuando ocurren validaciones fallidas o cambios de estado en cascada. En especial, la gestión de lanzamientos y reservas debe evitar estados parciales, conservar histórico mediante borrado lógico y exponer errores uniformes para facilitar soporte y pruebas.

### Historias de usuario

- Como `empleado interno` quiero **recibir errores comprensibles y homogéneos** para _saber qué ha ocurrido y cómo actuar_
- Como `equipo técnico` quiero **garantizar actualizaciones atómicas en cambios de estado dependientes** para _evitar inconsistencias entre lanzamientos y reservas_
- Como `negocio` quiero **conservar histórico mediante baja lógica** para _mantener trazabilidad operativa_

### Fuera de scope

- Recuperación automática ante desastres o replicación multi-región.
- Reintentos distribuidos, colas o patrones de resiliencia avanzados.
- SLA productivos o tolerancia a fallos de nivel empresarial.

---

## Boceto de la solución

La solución establecerá un formato único de error para todo el API, aplicará baja lógica donde el PRD lo exige y encapsulará en transacciones los cambios con impacto en cascada. De este modo, el sistema será predecible, trazable y más fácil de mantener.

### Modelo

| Entidad | Atributo | Tipo | Restricciones |
|---------|----------|------|---------------|
| `ErrorApi` | `code` | `string` | Requerido |
| `ErrorApi` | `error` | `string` | Requerido |
| `ErrorApi` | `message` | `string` | Requerido |
| `PoliticaBorrado` | `softDelete` | `boolean` | `true` para cohetes y lanzamientos |
| `TransaccionNegocio` | `atomica` | `boolean` | `true` en cambios en cascada |

> leyenda: `#` para único, `?` para opcional (requerido por defecto)

### Back

- Devolver todas las respuestas de error con formato `{ code, error, message }`.
- Aplicar borrado lógico a cohetes y lanzamientos para preservar histórico.
- Ejecutar en una misma transacción los cambios de estado de lanzamiento que afectan a reservas.
- Evitar persistencias parciales cuando falle una regla de negocio o una actualización relacionada.

### Front

- Interpretar el mensaje de error y mostrarlo de forma clara al usuario.
- Excluir por defecto registros inactivos en listados operativos, salvo que se diseñe una vista histórica.
- Reflejar de forma consistente el resultado de operaciones fallidas sin dejar la UI en un estado ambiguo.

---

## Criterios de aceptación

> Formato EARS (en español)

- [ ] el sistema DEBE responder los errores con la estructura `{ code, error, message }`.
- [ ] CUANDO un cohete o lanzamiento se dé de baja el sistema DEBE conservar el registro mediante borrado lógico.
- [ ] CUANDO un lanzamiento cambie a `Suspendido` o `Cancelado` el sistema DEBE actualizar sus reservas dependientes dentro de una operación atómica.
- [ ] SI falla una actualización en cascada ENTONCES el sistema DEBE evitar estados parciales y mantener la consistencia previa.
