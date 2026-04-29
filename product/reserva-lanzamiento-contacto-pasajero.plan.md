# Iniciativa: Creación de reserva de lanzamiento por operador

## Contexto
Se necesita habilitar al operador para crear una reserva asociada a un lanzamiento existente, siempre que el lanzamiento esté en estado permitido y tenga plazas disponibles. La reserva debe guardar los datos de contacto del pasajero (nombre, email y teléfono) para facilitar gestión y seguimiento.

## User stories
- Como operador de AstroBookings, quiero crear una reserva desde el detalle de un lanzamiento para registrar rápidamente a un pasajero.
- Como operador, quiero que solo se permitan reservas en lanzamientos PLANIFICADO o CONFIRMADO para respetar reglas del negocio.
- Como operador, quiero que el sistema bloquee la creación cuando no haya plazas para evitar sobreventa.
- Como operador, quiero capturar nombre, email y teléfono del pasajero para poder contactarlo.

## Boceto de solución (funcional)
- En la pantalla de detalle de lanzamiento se muestra la acción "Crear reserva".
- Al abrir la acción, se presenta un formulario simple con tres campos: nombre, email y teléfono.
- El sistema crea una reserva de 1 plaza fija por cada alta.
- Antes de confirmar, el sistema valida:
  - que el lanzamiento esté en PLANIFICADO o CONFIRMADO,
  - que existan plazas disponibles,
  - que los datos de contacto obligatorios sean válidos.
- Si la operación es válida, se guarda la reserva y se muestra confirmación al operador.
- Si la operación no es válida, se muestra mensaje claro y no se guarda reserva.

## Criterios de aceptación
- CA1: El operador puede crear una reserva desde el detalle de un lanzamiento en estado PLANIFICADO con plazas disponibles.
- CA2: El operador puede crear una reserva desde el detalle de un lanzamiento en estado CONFIRMADO con plazas disponibles.
- CA3: Si el lanzamiento está en estado distinto de PLANIFICADO o CONFIRMADO, la creación se rechaza con error funcional.
- CA4: Si no hay plazas disponibles, la creación se rechaza con mensaje claro y sin cambios en capacidad.
- CA5: Nombre, email y teléfono son obligatorios; email debe cumplir formato válido y teléfono debe aceptar formato básico (7 a 15 dígitos, con prefijo opcional +).
- CA6: Cada reserva creada descuenta exactamente 1 plaza disponible.
- CA7: Para MVP se permiten múltiples reservas con el mismo email/teléfono en un mismo lanzamiento.
- CA8: La reserva creada queda activa (sin flujo de pago en este alcance).

## Plan de implementación
1. Definir alcance funcional y contrato de reserva
- Confirmar campos obligatorios y validaciones de entrada (nombre, email, teléfono).
- Definir payload y respuesta de "crear reserva" para 1 plaza fija.
- Acordar códigos de error funcional para estado inválido y falta de plazas.

2. Implementar lógica de negocio en backend
- Crear caso de uso/servicio para alta de reserva ligada a lanzamiento.
- Validar estado permitido del lanzamiento (PLANIFICADO, CONFIRMADO).
- Validar plazas disponibles y descontar 1 plaza al confirmar alta.
- Persistir reserva con datos de contacto y estado activo.

3. Exponer endpoint y manejo de errores
- Publicar endpoint REST para crear reserva desde id de lanzamiento.
- Mapear errores de negocio a respuestas HTTP con estructura de error consistente.
- Garantizar mensajes funcionales claros para operador.

4. Implementar flujo UI en detalle de lanzamiento
- Añadir acción "Crear reserva" en vista de detalle de lanzamiento.
- Construir formulario reactivo con validaciones de nombre, email y teléfono.
- Consumir endpoint de creación y mostrar feedback de éxito/error.
- Refrescar visualmente plazas disponibles tras alta exitosa.

5. Pruebas unitarias e integración (back/front)
- Backend: tests de servicio para casos válido, estado no permitido y sin plazas.
- Backend: tests de integración de controlador para códigos HTTP y payload de error.
- Frontend: tests de formulario (validaciones, bloqueo de envío, envío válido).
- Frontend: tests de servicio HTTP para contrato de creación de reserva.

6. Pruebas e2e
- Cubrir flujo feliz: crear reserva desde detalle de lanzamiento PLANIFICADO con plazas y verificar confirmación + decremento de plazas.
- Cubrir flujo feliz en estado CONFIRMADO con plazas disponibles.
- Cubrir rechazo por estado no permitido y validar mensaje de error.
- Cubrir rechazo por falta de plazas y validar que no se crea reserva.
- Validar criterios CA1, CA2, CA3, CA4, CA5 y CA6 en escenarios e2e con evidencias de UI/API.
