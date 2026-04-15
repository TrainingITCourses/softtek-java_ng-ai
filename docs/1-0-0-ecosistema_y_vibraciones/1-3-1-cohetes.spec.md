# F1. Gestión de Cohetes

## Definición del problema

### Contexto

El personal administrativo necesita una herramienta para registrar y mantener el inventario de la flota de naves espaciales de AstroBookings. Sin una gestión de los cohetes y sus características individuales (capacidad de asientos y rango operativo), resulta imposible planificar lanzamientos y controlar el volumen de reservas.

### Historias de usuario

- Como `usuario` quiero **registrar nuevos cohetes con su capacidad de asientos y rango operativo** para _disponer de ellos al programar futuros lanzamientos_
- Como `usuario` quiero **visualizar el listado de todos los cohetes disponibles** para _gestionar el conocimiento del inventario de la flota actual_
- Como `usuario` quiero **modificar los datos de un cohete** para _corregir errores o actualizar su capacidad y rango_
- Como `usuario` quiero **dar de baja un cohete** para _retirarlo de la flota activa sin eliminar su histórico_

---

## Boceto de la solución

Una interfaz web y un API RESTful para la gestión de cohetes. MVP para consultar e introducir los vehículos de la flota, manteniendo almacenado el nombre, capacidad y rango de cada cohete.

### Modelo

| Entidad | Atributo | Tipo | Restricciones |
|---------|----------|------|---------------|
| `Cohete` | `id` | `uuid#` | Autogenerado |
| `Cohete` | `nombre` | `string#` | [3..10] chars |
| `Cohete` | `capacidad` | `integer` | [1..9] value |
| `Cohete` | `rango` | `enum` | ['Tierra', 'Luna', 'Marte'] |

> leyenda: `#` para único, `?` para opcional (requerido por defecto)

### Back

- Recepción de peticiones, validación del payload y persistencia de cohetes.
- Devolución en formato JSON del resultado de cada operación.
- Implementación de borrado lógico (soft delete) para dar de baja los cohetes.
- Sin control de acceso ni firma de operaciones.

### Front

- Mostrar en pantalla inicial un listado de los cohetes activos.
- Disponer de un formulario para el alta de nuevos cohetes.
- Aplicar validaciones previas al envío de datos.
- Pantalla para la edición o borrado de un cohete existente.
- Mostrar resultado correcto o de error de cada operación al usuario.
- Sin control de acceso ni autenticación de usuarios.

### Contract

| Método | Endpoint | Success | Error |
|--------|----------|---------|-------|
| `GET` | `/api/cohetes` | `200` | `500` |
| `GET` | `/api/cohetes/:id` | `200` | `404, 500` |
| `POST` | `/api/cohetes` | `201` | `400, 409` |
| `PUT` | `/api/cohetes/:id` | `200` | `400, 404, 409` |
| `DELETE` | `/api/cohetes/:id` | `204` | `404` |

**Request — `CreateCohete` / `UpdateCohete`**

```json
{
  "nombre": "string",
  "capacidad": "number",
  "rango": "Tierra | Luna | Marte"
}
```

**Response — `Cohete`**

```json
{
  "id":      "uuid",
  "nombre": "string",
  "capacidad": "number",
  "rango": "Tierra | Luna | Marte"
}
```

**Error response**

```json
{
  "code":    "400",
  "error":   "validation_failed",
  "message": "La capacidad debe ser mayor a 0"
}
```

---

## Criterios de aceptación

- [ ] el sistema DEBE requerir nombre, capacidad de asientos y un rango válido (Tierra, Luna, Marte) para cada cohete
- [ ] CUANDO un usuario envía datos válidos para un cohete el sistema DEBE registrar el vehículo, asignarle un id único y hacerlo disponible en el sistema
- [ ] CUANDO un usuario modifica un cohete existente el sistema DEBE actualizar sus datos asegurando mantener la unicidad del nombre
- [ ] CUANDO un usuario da de baja un cohete el sistema DEBE marcarlo como inactivo (borrado lógico) sin eliminar el registro físico
- [ ] SI un usuario intenta asignar un rango no permitido ENTONCES el sistema DEBE rechazar la operación con un error de validación
- [ ] SI un usuario intenta asignar una capacidad no permitida ENTONCES el sistema DEBE rechazar la operación con un error de validación

---

## Fuera de scope

- Eliminación física de registros en base de datos (se debe conservar de forma perpetua el histórico).
- Asignación de cohetes a lanzamientos (pertenece a la funcionalidad específica de vuelos).
- Seguridad, autenticación o control de acceso a la gestión de cohetes (se asume que solo personal autorizado tendrá acceso a esta funcionalidad).

---

## Preguntas abiertas

- Ninguna por el momento.
