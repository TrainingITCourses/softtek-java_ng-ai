# F{n}. {Nombre de la funcionalidad}

## Definición del problema

### Contexto

{Explica en 2 a 4 frases la necesidad de negocio, quién tiene el problema y por qué esta funcionalidad aporta valor.}

### Historias de usuario

- Como `{rol}` quiero **{objetivo}** para _{beneficio}_
- Como `{rol}` quiero **{objetivo}** para _{beneficio}_
- Como `{rol}` quiero **{objetivo}** para _{beneficio}_

### Fuera de scope

- {Lo que explícitamente no se cubre en esta funcionalidad}
- {Restricción o caso no incluido en el MVP}
- {Integración o proceso aplazado}

---

## Boceto de la solución

{Resume el enfoque funcional de la solución en pocas líneas, sin bajar a detalle técnico de código.}

### Modelo

| Entidad | Atributo | Tipo | Restricciones |
|---------|----------|------|---------------|
| `{Entidad}` | `id` | `{tipo}` | {Autogenerado, único, opcional, etc.} |
| `{Entidad}` | `{atributo}` | `{tipo}` | {Rango, longitud, enum, formato, unicidad, etc.} |
| `{Entidad}` | `{atributo}` | `{tipo}` | {Restricción relevante} |

> leyenda: `#` para único, `?` para opcional (requerido por defecto)

### Back

- {Recepción y validación de peticiones}
- {Persistencia y reglas de negocio}
- {Formato esperado de respuesta o errores}
- {Estados, transiciones o acciones relevantes}

### Front

- {Pantalla o vista principal}
- {Formulario, listado o acciones disponibles}
- {Validaciones previas al envío}
- {Feedback al usuario ante éxito o error}

---

## Criterios de aceptación

> Formato EARS (en español)

- [ ] el sistema DEBE {comportamiento obligatorio}
- [ ] CUANDO {evento o acción} el sistema DEBE {resultado esperado}
- [ ] SI {condición inválida o de negocio} ENTONCES el sistema DEBE {respuesta esperada}
- [ ] CUANDO {cambio de estado o actualización} el sistema DEBE {comportamiento esperado}
