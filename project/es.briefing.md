# AstroBookings Español

Sistema compuesto por una **API backend** y una **WebApp frontend** orientado a la gestión de reservas para viajes espaciales.

- Los cohetes disponen de capacidad de asientos limitada y un rango operativo específico.
- Los lanzamientos se programan asociándolos a un cohete en una fecha futura.
- Cada lanzamiento establece un precio por asiento y un umbral mínimo de ocupación requerida.
- El ciclo de vida de un lanzamiento contempla los estados secuenciales: `programado` → `confirmado` → `exitoso`.
- Un lanzamiento puede transicionar a `suspendido` por baja ocupación o a `cancelado` por causas técnicas.
- Los usuarios (identificados como operadores o pasajeros) se registran mediante su correo electrónico y nombre.
- Los operadores administran el registro de cohetes y lanzamientos, incluyendo la gestión de cancelaciones y suspensiones.
- Los pasajeros pueden formalizar reservas personales en lanzamientos con plazas disponibles.
- Los cobros y reembolsos (derivados de una suspensión o cancelación) se procesan a través de una pasarela transaccional simulada.

> [!WARNING]
> AstroBookings es una empresa ficticia de viajes espaciales.
> El sistema está diseñado con fines de demostración y formación. 
> No está pensado para uso en producción.
> No se requiere seguridad ni base de datos en la fase inicial.

---

- [Repositorio en GitHub](https://github.com/AlbertoBasaloLabs/astro-bookings)
- Rama por defecto: `main`

- **Autor**: [Alberto Basalo](https://albertobasalo.dev)
- **Ai Code Academy en Español**: [AI code Academy](https://aicode.academy)
- **Redes sociales**:
  - [X](https://x.com/albertobasalo)
  - [LinkedIn](https://www.linkedin.com/in/albertobasalo/)
  - [GitHub](https://github.com/albertobasalo)
