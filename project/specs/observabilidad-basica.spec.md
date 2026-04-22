# TR4. Observabilidad Básica

## Definición del problema

### Contexto

Aunque el MVP no requiere una plataforma completa de monitoreo, el equipo necesita señales mínimas para entender el comportamiento del sistema y diagnosticar errores durante el desarrollo y las demos. Una observabilidad básica basada en logs facilita el soporte técnico sin añadir complejidad innecesaria.

### Historias de usuario

- Como `equipo técnico` quiero **disponer de logs estándar de ejecución** para _diagnosticar incidencias rápidamente_
- Como `instructor` quiero **entender qué ocurre en demos y ejercicios** para _explicar errores o flujos al alumnado_
- Como `equipo de desarrollo` quiero **mantener una solución simple sin dashboards avanzados** para _centrarme en el MVP funcional_

### Fuera de scope

- Dashboards, métricas de negocio o alertas automáticas.
- Trazabilidad distribuida entre múltiples servicios.
- Integración con plataformas externas de monitoreo.

---

## Boceto de la solución

La solución se apoyará en el logging estándar del backend para registrar arranque, errores y eventos relevantes del dominio. No se incorporarán herramientas externas de observabilidad en esta versión, pero la información generada debe ser suficiente para depuración local.

### Modelo

| Entidad | Atributo | Tipo | Restricciones |
|---------|----------|------|---------------|
| `EventoLog` | `nivel` | `enum` | `INFO`, `WARN`, `ERROR` |
| `EventoLog` | `mensaje` | `string` | Requerido |
| `EventoLog` | `contexto` | `string?` | Sin datos sensibles |

> leyenda: `#` para único, `?` para opcional (requerido por defecto)

### Back

- Emitir logs estándar de arranque y error usando la configuración habitual de Spring Boot.
- Registrar fallos técnicos y eventos de negocio relevantes sin incluir información sensible real.
- Mantener suficiente contexto en mensajes para facilitar soporte y depuración.

### Front

- Mostrar al usuario mensajes de error claros sin depender de herramientas externas de monitoreo.
- Facilitar la identificación visual de operaciones exitosas o fallidas durante las pruebas.

---

## Criterios de aceptación

> Formato EARS (en español)

- [ ] el sistema DEBE generar logs básicos de arranque y operación en el backend.
- [ ] CUANDO ocurra un error técnico o de negocio el sistema DEBE dejar evidencia trazable en logs y feedback visible en la interfaz.
- [ ] el sistema NO DEBE requerir plataformas externas de monitoreo para operar en el MVP.
- [ ] SI se registra contexto adicional ENTONCES el sistema DEBE evitar datos sensibles o reales en los logs.
