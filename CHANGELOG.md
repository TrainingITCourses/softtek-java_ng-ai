## [Unreleased] - 2026-04-29

### Added
- Cobertura E2E de reservas por API y UI para los criterios CA1, CA2, CA3, CA4, CA5, CA6, CA7 y CA8 de la iniciativa de creación de reserva desde detalle de lanzamiento.
- Cobertura E2E específica del rediseño mission control para criterios de aceptación de interfaz: navegación persistente, flujo de reserva con feedback, consistencia entre módulos, estabilidad responsive y verificación de ausencia de librerías UI externas en runtime.

### Changed
- Refinada la validación interna de reservas en backend extrayendo helpers privados en `ReservaService` para separar obligatoriedad y formato sin cambiar el comportamiento observable.
- Endurecidos los datos de prueba E2E de cohetes y reservas para evitar colisiones con estado en memoria y ejecuciones paralelas.
- Ajustado el estilo global para mejorar resiliencia móvil en tablas y bloques de contenido (`overflow-x` en paneles y `overflow-wrap` en celdas) sin alterar contratos funcionales.

### Fixed
- Corregido un fallo de E2E UI por selector de campo telefónico en el flujo de reserva del rediseño (`Teléfono`), manteniendo selectores accesibles por etiqueta.
