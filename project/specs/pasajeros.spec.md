# F3. Registro de Pasajeros

## Definición del problema

### Contexto

El equipo comercial necesita registrar pasajeros de forma consistente para poder asociarlos a futuras reservas sin duplicidades ni errores de identificación. Sin una ficha única por pasajero, se pierde trazabilidad comercial y se complica la gestión operativa ante cambios en los lanzamientos.

### Historias de usuario

- Como `empleado comercial` quiero **dar de alta pasajeros con sus datos identificativos** para _poder usarlos en reservas posteriores_
- Como `empleado comercial` quiero **consultar el listado y detalle de pasajeros registrados** para _verificar rápidamente si ya existen en el sistema_
- Como `empleado comercial` quiero **editar los datos de un pasajero** para _corregir errores administrativos sin perder su historial_

### Fuera de scope

- Validación documental contra fuentes externas o registros oficiales.
- Gestión de menores, tutores legales o documentación internacional avanzada.
- Segmentación comercial, fidelización o preferencias de viaje.

---

## Boceto de la solución

La solución incorporará una ficha simple de pasajero, reutilizable desde la gestión de reservas. El sistema debe garantizar unicidad por email y documento, facilitar la consulta desde front y devolver errores claros cuando existan conflictos de datos.

### Modelo

| Entidad | Atributo | Tipo | Restricciones |
|---------|----------|------|---------------|
| `Pasajero` | `id` | `uuid#` | Autogenerado |
| `Pasajero` | `nombre` | `string` | Requerido, longitud mínima razonable |
| `Pasajero` | `email` | `string#` | Requerido, formato válido, único |
| `Pasajero` | `documento` | `string#` | Requerido, único |

> leyenda: `#` para único, `?` para opcional (requerido por defecto)

### Back

- Exponer operaciones para crear, consultar y editar pasajeros.
- Validar formato de email y obligatoriedad de nombre y documento.
- Impedir duplicados por `email` o `documento`, devolviendo errores estructurados con formato `{ code, error, message }`.
- Mantener el identificador del pasajero estable para reutilizarlo en reservas y consultas posteriores.

### Front

- Mostrar un listado simple de pasajeros con nombre, email y documento.
- Ofrecer un formulario reactivo de alta y edición con validaciones previas al envío.
- Informar claramente cuando un pasajero ya exista por email o documento.
- Permitir seleccionar pasajeros existentes desde la futura pantalla de reservas.

---

## Criterios de aceptación

> Formato EARS (en español)

- [ ] el sistema DEBE permitir registrar un pasajero con nombre, email y documento válidos.
- [ ] CUANDO un empleado registre un pasajero válido el sistema DEBE asignarle un identificador único y persistirlo.
- [ ] SI se intenta registrar un pasajero con un email ya existente ENTONCES el sistema DEBE rechazar la operación con un error de negocio.
- [ ] SI se intenta registrar un pasajero con un documento ya existente ENTONCES el sistema DEBE rechazar la operación con un error de negocio.
- [ ] CUANDO se consulte el listado de pasajeros el sistema DEBE mostrar la información básica necesaria para identificarlos.
- [ ] CUANDO se editen datos válidos de un pasajero el sistema DEBE reflejar los cambios sin crear un nuevo registro.
