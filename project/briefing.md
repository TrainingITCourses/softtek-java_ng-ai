# Briefing para AstroBookings

## 1. Idea

### 1.1 Problema o necesidad
AstroBookings (empresa ficticia de turismo espacial) necesita una solución interna para coordinar su operación diaria sin errores de capacidad ni conflictos de agenda. Hoy la gestión manual de cohetes, lanzamientos y reservas puede provocar sobreventa, lanzamientos mal planificados y baja trazabilidad ante cancelaciones o suspensiones.

### 1.2 Misión u objetivo
Diseñar y construir una solución didáctica (API REST + aplicación web) para que empleados de AstroBookings gestionen flota, lanzamientos y reservas de forma centralizada. El sistema debe impedir reservas por encima de la capacidad de cada cohete y permitir suspender/cancelar lanzamientos por causas técnicas o económicas. Objetivo de entrega para el curso: MVP funcional con pruebas automatizadas y documentación básica.

### 1.3 Público objetivo
- Empleados de operaciones: planifican lanzamientos y asignación de cohetes.
- Empleados comerciales/atención: registran y consultan reservas.
- Instructores y alumnos: usan el proyecto como base de aprendizaje en cursos/talleres de programación.

## 2. Alcance

### 2.1 Qué se incluye
- API REST para:
  - Gestión de cohetes (alta, consulta, edición, baja lógica).
  - Gestión de lanzamientos (crear, programar, suspender, cancelar, consultar estado).
  - Gestión de reservas vinculadas a lanzamientos.
- Reglas de negocio mínimas:
  - No permitir reservas que superen la capacidad del cohete asignado.
  - No permitir reservas en lanzamientos cancelados.
  - Registrar motivo de suspensión/cancelación.
- Aplicación web para empleados:
  - Pantallas de listado y formularios de cohetes, lanzamientos y reservas.
  - Mensajes claros de validación y error.
- Pruebas automáticas básicas (unitarias y e2e) para escenarios críticos de capacidad y estados de lanzamiento.

### 2.2 Qué se excluye
- Uso productivo real, despliegue empresarial y SLA.
- Integraciones externas reales (pasarelas de pago, proveedores aeronáuticos, ERP, CRM).
- Seguridad avanzada productiva (SSO corporativo, hardening, auditoría regulatoria completa).
- Optimización de costos de infraestructura y alta disponibilidad.
- Aplicación móvil nativa.

### 2.3 Limitaciones y notas
- Proyecto educativo: prima claridad del código y valor pedagógico sobre escalabilidad extrema.
- Datos de prueba/ficticios; no usar información sensible real.
- Requisitos funcionales pensados para iterar en ejercicios de clase.
- Se recomienda arquitectura simple y mantenible, con validaciones de negocio en backend y feedback inmediato en frontend.
- Entorno esperado del curso: frontend Angular SPA, backend Spring Boot REST, pruebas automatizadas y ejecución local en Windows/macOS/Linux.
