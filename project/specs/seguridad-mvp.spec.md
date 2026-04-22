# TR1. Seguridad del MVP

## Definición del problema

### Contexto

AstroBookings necesita una base mínima de seguridad coherente con un proyecto educativo y de uso interno. En esta fase, el objetivo no es implantar un sistema corporativo de identidad, sino evitar entradas inválidas, exponer reglas de dominio en backend y trabajar exclusivamente con datos ficticios.

### Historias de usuario

- Como `equipo técnico` quiero **centralizar las validaciones de dominio en backend** para _proteger la consistencia del sistema_
- Como `empleado interno` quiero **usar la aplicación sin fricción de login en el MVP** para _centrarme en la operativa y el aprendizaje_
- Como `equipo formador` quiero **evitar el uso de datos personales reales** para _reducir riesgos y mantener el entorno seguro_

### Fuera de scope

- Autenticación con usuario y contraseña.
- SSO corporativo, roles avanzados y autorización granular.
- Cifrado, auditoría regulatoria o hardening productivo.

---

## Boceto de la solución

La solución mantendrá el acceso sin autenticación para el MVP, pero exigirá validación de entrada y reglas de negocio en el backend como fuente de verdad. El sistema debe tratar la información como datos ficticios de entrenamiento y ofrecer errores claros ante peticiones inválidas.

### Back

- Validar payloads, parámetros y reglas de dominio en todas las operaciones críticas.
- Rechazar entradas inválidas con errores estructurados y mensajes comprensibles.
- No exigir autenticación ni sesión para el acceso al API durante el MVP.
- Mantener el sistema libre de dependencias de identidad corporativa en esta versión.

### Front

- No incluir pantallas de login, recuperación de contraseña ni gestión de sesión.
- Mostrar feedback inmediato cuando una petición sea inválida o incumpla reglas de negocio.
- Evitar almacenar credenciales o secretos en cliente, ya que no forman parte del alcance.

---

## Criterios de aceptación

- [ ] el sistema DEBE permitir el uso del MVP sin autenticación previa.
- [ ] SI una petición contiene datos inválidos ENTONCES el sistema DEBE rechazarla desde backend con un error estructurado.
- [ ] CUANDO el usuario introduzca datos inconsistentes el sistema DEBE mostrar mensajes claros de validación.
- [ ] el sistema DEBE operar únicamente con datos ficticios o de prueba en este entorno educativo.
