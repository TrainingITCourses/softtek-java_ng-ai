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

Una interfaz y API para la gestión simple para consultar e introducir los vehículos de la flota, manteniendo almacenado el nombre, capacidad y rango de cada cohete.

### Modelo

| Entidad | Atributo | Tipo | Restricciones |
|--------|----------|-------------|-------------|
| `Cohete` | `id` | `uuid#` | Autogenerado, único |
| `Cohete` | `nombre` | `string#` | min 3, max 100 caracteres |
| `Cohete` | `capacidad` | `integer` | min 1, max 10 |
| `Cohete` | `rango` | `enum` | Valores: Tierra, Luna, Marte |

> leyenda: `#` para único, `?` para opcional (requrido por defecto)

### Back

- Recepción de peticiones, validación del payload y persistencia de cohetes (creación y actualización).
- Devolución en formato JSON de la lista de todos los cohetes activos del sistema.
- Validación de que el rango sea un valor del enumerado admitido.
- Implementación de borrado lógico (soft delete) para dar de baja los cohetes.
- No debe permitirse la creación o modificación de cohetes resultando en un nombre duplicado.

### Front

- Mostrar una pantalla específica de gestión de flota de cohetes con un listado/tabla de resumen.
- Disponer de un formulario para el alta de nuevos cohetes, aplicando validaciones previas al envío de datos.
- Permitir el acceso y gestión a cualquier usuario sin restricciones de rol u operativas en esta fase.
- Opcionalmente mostrar mensajes o alertas de éxito tras la creación.

### Contract

| Método | Endpoint | Success | Error |
|--------|----------|---------|-------|
| `GET` | `/api/rockets` | `200` | `500` |
| `POST` | `/api/rockets` | `201` | `400, 409` |
| `PUT` | `/api/rockets/:id` | `200` | `400, 404, 409` |
| `DELETE` | `/api/rockets/:id` | `204` | `404` |

**Request — `CreateRocket` / `UpdateRocket`**

```json
{
  "nombre": "string",
  "capacidad": "number",
  "rango": "Tierra | Luna | Marte"
}
```

**Response — `Rocket`**

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

---

## Preguntas abiertas

- Ninguna por el momento.
