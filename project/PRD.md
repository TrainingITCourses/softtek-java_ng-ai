# AstroBookings — Requerimientos

> **Versión objetivo:** v2.0.0  
> **Alcance:** Extiende v1.0.0 (Cohetes) añadiendo Lanzamientos, Pasajeros y Reservas.  
> **Público:** Empleados de operaciones y comerciales de AstroBookings.

## 1. Requerimientos Funcionales

### FR1 — Gestión de Flota de Cohetes
Los empleados pueden registrar, consultar, editar y dar de baja lógica cohetes de la flota. Cada cohete tiene nombre, capacidad de plazas y rango de vuelo (Tierra, Luna, Marte). *(Implementado en v1.0.0.)*

### FR2 — Planificación y Ciclo de Vida de Lanzamientos
Los empleados de operaciones pueden crear lanzamientos asignando un cohete, fecha y precio. Un lanzamiento avanza por los estados `Programado → Confirmado → Completado`. Desde cualquier estado activo puede pasar a `Suspendido` o `Cancelado`, registrando obligatoriamente el motivo.

### FR3 — Registro de Pasajeros
Los empleados comerciales pueden registrar y consultar pasajeros. Cada pasajero tiene nombre, email y documento de identidad (únicos en el sistema).

### FR4 — Gestión de Reservas con Control de Capacidad
Los empleados comerciales pueden crear reservas vinculando un pasajero a un lanzamiento. El sistema impide crear reservas que superen la capacidad del cohete asignado al lanzamiento. Las reservas siguen el estado de su lanzamiento: al suspenderse o cancelarse un lanzamiento, sus reservas pasan automáticamente a `Suspendida` o `Cancelada`.

---

## 2. Requerimientos Técnicos

### TR1 — Seguridad
Sin autenticación para el MVP (proyecto educativo). Las validaciones de dominio se aplican en backend. No se almacenan datos personales reales.

### TR2 — Rendimiento
Volumen mínimo (datos de prueba). Sin caché ni optimizaciones especiales requeridas.

### TR3 — Confiabilidad
Errores estructurados con formato `{ code, error, message }` en todas las respuestas de error. Soft delete para cohetes y lanzamientos. Transacciones de base de datos para actualizaciones de estado en cascada (lanzamiento → reservas).

### TR4 — Observabilidad
Logs estándar de Spring Boot. Sin requisitos de monitoreo adicional.

### TR5 — Integraciones
Sistema standalone. Sin integraciones externas (pagos, ERP, CRM).

---

## 3. Dominio del Problema

### 3.1. Entidades y Lenguaje Ubicuo

- **`Cohete`**: Nave de la flota con capacidad fija de plazas y rango de vuelo (Tierra, Luna, Marte).
- **`Lanzamiento`**: Evento de vuelo que asigna un cohete a una fecha y precio. Tiene ciclo de vida propio.
- **`Pasajero`**: Persona identificada por email y documento, que puede realizar reservas.
- **`Reserva`**: Vínculo entre un pasajero y un lanzamiento. Su estado sigue al del lanzamiento.

### 3.2. Reglas de Negocio

- Un lanzamiento debe tener siempre un cohete asignado.
- No se puede reservar en un lanzamiento `Cancelado` o `Completado`.
- La suma de plazas reservadas en un lanzamiento no puede superar la capacidad del cohete asignado.
- Suspender o cancelar un lanzamiento requiere un motivo obligatorio.
- Al suspender o cancelar un lanzamiento, todas sus reservas activas cambian de estado en cascada.
- El email y el documento de identidad de un pasajero son únicos en el sistema.

### 3.3. Ciclo de Vida del Lanzamiento

```
Programado ──► Confirmado ──► Completado
    │               │
    └───────┬────── ┘
            ▼
       Suspendido  (motivo requerido, reversible a Programado/Confirmado)
       Cancelado   (motivo requerido, estado terminal)
```
