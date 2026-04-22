# TR5. Arquitectura Standalone e Integraciones Aplazadas

## Definición del problema

### Contexto

El proyecto está pensado como una solución autónoma para formación, por lo que debe funcionar sin depender de terceros como pasarelas de pago, ERP o CRM. Esta decisión reduce complejidad, facilita el arranque local y mantiene el foco en las reglas de negocio principales del curso.

### Historias de usuario

- Como `equipo formador` quiero **ejecutar el sistema localmente sin servicios externos** para _simplificar talleres y prácticas_
- Como `equipo técnico` quiero **delimitar claramente las integraciones fuera de alcance** para _evitar ambigüedad en la implementación_
- Como `usuario interno` quiero **usar la operativa principal sin bloqueos por dependencias ajenas** para _mantener continuidad en el MVP_

### Fuera de scope

- Pasarelas de pago o facturación externa.
- Integración con ERP, CRM o sistemas aeronáuticos reales.
- Sincronización con proveedores, partners o servicios de terceros.

---

## Boceto de la solución

La solución operará como sistema standalone compuesto por frontend y backend propios, comunicados mediante el API interno del proyecto. Toda la funcionalidad del MVP debe estar disponible sin dependencia de proveedores externos, dejando las futuras integraciones como evolución posterior.

### Modelo

| Entidad | Atributo | Tipo | Restricciones |
|---------|----------|------|---------------|
| `ContextoIntegracion` | `modoOperacion` | `enum` | `standalone` |
| `ContextoIntegracion` | `dependenciasExternasObligatorias` | `boolean` | `false` |
| `ContextoIntegracion` | `apiInterna` | `string` | Requerida para comunicación front-back |

> leyenda: `#` para único, `?` para opcional (requerido por defecto)

### Back

- Exponer la funcionalidad necesaria mediante API REST propia.
- No depender de sistemas externos para completar altas, consultas, reservas o cambios de estado.
- Mantener contratos simples y estables para el frontend del proyecto.

### Front

- Consumir únicamente el backend del proyecto durante el desarrollo y las demos.
- Apoyarse en la configuración local y el proxy de desarrollo para evitar acoplamientos externos.
- Informar errores internos sin remitir al usuario a sistemas de terceros.

---

## Criterios de aceptación

> Formato EARS (en español)

- [ ] el sistema DEBE funcionar de extremo a extremo sin integraciones externas obligatorias.
- [ ] CUANDO se ejecute el entorno local el frontend DEBE comunicarse con el backend propio del proyecto.
- [ ] el sistema NO DEBE requerir pagos, ERP ni CRM para completar los casos de uso del MVP.
- [ ] SI una futura integración se plantea ENTONCES el sistema DEBE poder incorporarla sin afectar el alcance actual standalone.
