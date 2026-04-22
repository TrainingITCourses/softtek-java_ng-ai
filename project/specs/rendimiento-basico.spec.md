# TR2. Rendimiento Base del Sistema

## Definición del problema

### Contexto

El sistema debe ofrecer una experiencia fluida con el volumen reducido de datos esperado en el curso, sin requerir optimizaciones complejas ni infraestructura adicional. El objetivo es garantizar usabilidad local estable para altas, consultas y cambios de estado, priorizando simplicidad y mantenibilidad.

### Historias de usuario

- Como `empleado interno` quiero **consultar listados y formularios sin esperas perceptibles** para _trabajar con normalidad_
- Como `equipo técnico` quiero **mantener una arquitectura simple sin caché ni tuning prematuro** para _favorecer el aprendizaje y la claridad_
- Como `instructor` quiero **que el sistema funcione correctamente con datos de prueba** para _ejecutar demostraciones y ejercicios sin bloqueos_

### Fuera de scope

- Pruebas de carga masiva o benchmarking formal.
- Optimización avanzada de base de datos o caché distribuida.
- Escalado horizontal o alta concurrencia productiva.

---

## Boceto de la solución

La solución se diseñará para un volumen pequeño y controlado, con consultas sencillas, validaciones claras y feedback visual cuando una operación tarde más de lo normal. No se introducirán mecanismos de rendimiento avanzados mientras no exista una necesidad real demostrada.


### Back

- Resolver operaciones CRUD con consultas directas y lógica de negocio simple.
- Evitar optimizaciones prematuras mientras el volumen siga siendo reducido.
- Mantener tiempos de respuesta razonables en entorno local con datos de prueba.

### Front

- Mostrar listados y formularios de manera fluida con el conjunto de datos del MVP.
- Incluir indicadores de carga o estados de espera cuando una operación no sea inmediata.
- Evitar recargas innecesarias y mantener una navegación simple.

---

## Criterios de aceptación

- [ ] el sistema DEBE ser usable con volumen bajo de datos sin requerir caché ni optimización especial.
- [ ] CUANDO el usuario consulte listados típicos del MVP el sistema DEBE responder sin bloqueos perceptibles en entorno local.
- [ ] SI una operación tarda más de lo esperado ENTONCES el sistema DEBE mostrar un estado de carga o espera.
- [ ] el sistema NO DEBE depender de componentes externos de rendimiento para cumplir el alcance actual.
