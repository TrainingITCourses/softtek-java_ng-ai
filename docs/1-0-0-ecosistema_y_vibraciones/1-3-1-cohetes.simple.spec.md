# F1. Gestión de Cohetes

## Definición del problema

- Como `usuario` quiero **registrar nuevos cohetes con su capacidad de asientos y rango operativo** para _disponer de ellos al programar futuros lanzamientos_
- Como `usuario` quiero **visualizar el listado de todos los cohetes disponibles** para _gestionar el conocimiento del inventario de la flota actual_
- Como `usuario` quiero **modificar los datos de un cohete** para _corregir errores o actualizar su capacidad y rango_
- Como `usuario` quiero **dar de baja un cohete** para _retirarlo de la flota activa sin eliminar su histórico_

---

## Boceto de la solución

Una interfaz web y un API RESTful para la gestión simple para consultar e introducir los vehículos de la flota, manteniendo almacenado el nombre, capacidad y rango de cada cohete.

### Modelo

| Entidad | Atributo | Tipo | Restricciones |
|--------|----------|-------------|-------------|
| `Cohete` | `id` | `uuid#` | Autogenerado, único |
| `Cohete` | `nombre` | `string#` | min 3, max 100 caracteres |
| `Cohete` | `capacidad` | `integer` | min 1, max 10 |
| `Cohete` | `rango` | `enum` | Valores: Tierra, Luna, Marte |

> leyenda: `#` para único, `?` para opcional (requrido por defecto)

---

## Criterios de aceptación

- [ ] el sistema DEBE requerir nombre, capacidad de asientos y un rango válido (Tierra, Luna, Marte) para cada cohete
- [ ] SI un usuario intenta asignar un rango o capacidad no permitidos ENTONCES el sistema DEBE rechazar la operación con un error de validación



