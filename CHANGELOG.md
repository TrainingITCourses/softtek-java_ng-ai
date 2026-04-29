## [Unreleased] - 2026-04-29

### Added
- Cobertura E2E de reservas por API y UI para los criterios CA1, CA2, CA3, CA4, CA5, CA6, CA7 y CA8 de la iniciativa de creación de reserva desde detalle de lanzamiento.

### Changed
- Refinada la validación interna de reservas en backend extrayendo helpers privados en `ReservaService` para separar obligatoriedad y formato sin cambiar el comportamiento observable.
- Endurecidos los datos de prueba E2E de cohetes y reservas para evitar colisiones con estado en memoria y ejecuciones paralelas.
