# Iniciativa: Suspension de lanzamiento por motivos climaticos o tecnologicos

## Contexto
El sistema ya permite cambiar un lanzamiento a estado Suspendido con motivo libre. Se requiere cerrar la brecha funcional para que la suspension quede alineada a operacion: solo personal de operaciones puede ejecutarla y el motivo obligatorio debe pertenecer al catalogo CLIMA o TECNOLOGIA. La suspension debe conservar reservas para reprogramacion manual posterior.

## User stories
- Como personal de operaciones, quiero suspender un lanzamiento por clima o por tecnologia para evitar ejecutar una mision en condiciones no seguras.
- Como personal de operaciones, quiero que al suspender se mantengan las reservas ya registradas para gestionar luego la reprogramacion sin perder informacion de pasajeros.
- Como personal de operaciones, quiero registrar el motivo de suspension de forma estandarizada para auditoria y seguimiento operativo.

## Boceto de solucion (funcional)
- En el detalle de un lanzamiento aparece la accion Suspender lanzamiento habilitada solo para operaciones.
- Al ejecutar la accion, el sistema solicita seleccionar un motivo obligatorio entre CLIMA y TECNOLOGIA; se mantiene un comentario opcional como contexto.
- Al confirmar, el lanzamiento cambia a estado SUSPENDIDO.
- Las reservas asociadas no se cancelan ni se eliminan; quedan vinculadas al lanzamiento suspendido.
- El sistema muestra confirmacion de suspension y deja visible el motivo registrado.
- La reprogramacion no se realiza automaticamente en este alcance; se gestiona despues con un flujo manual.

## Criterios de aceptacion
- CA1: Solo personal de operaciones puede ejecutar la suspension de un lanzamiento.
- CA2: El formulario de suspension exige motivo obligatorio con valores CLIMA o TECNOLOGIA.
- CA3: El comentario es opcional y no bloquea la operacion cuando viene vacio.
- CA4: Al confirmar una suspension valida, el estado del lanzamiento cambia a SUSPENDIDO.
- CA5: Al suspender, las reservas existentes se conservan sin cambios de estado.
- CA6: La UI muestra feedback de exito y el motivo de suspension registrado en el detalle.
- CA7: Si la operacion falla por validacion o estado invalido, se informa con mensaje funcional claro y no se aplican cambios parciales.

## Plan de implementacion
1. Alinear reglas funcionales y alcance operativo
- Confirmar matriz de permisos para accion de suspension (solo operaciones).
- Confirmar estados de lanzamiento desde los que se permite suspender para no romper transiciones vigentes.
- Definir catalogo de motivos permitidos (CLIMA, TECNOLOGIA) y contrato de entrada/salida para backend y frontend.

2. Implementar caso de uso de suspension en backend
- Ajustar validacion de cambio de estado para que Suspendido acepte solo CLIMA o TECNOLOGIA.
- Mantener validacion de transicion de estado y registrar motivo/comentario de suspension.
- Garantizar persistencia de reservas sin alterarlas al aplicar la suspension.

3. Exponer endpoint y manejo de errores
- Reutilizar endpoint de cambio de estado ya existente, adaptando validaciones de motivo catalogado.
- Mapear errores de permiso, validacion de motivo y transicion invalida a respuestas HTTP consistentes.
- Asegurar mensajes de error estables para consumo de frontend y pruebas.

4. Implementar flujo de suspension en frontend
- Restringir la accion de suspension en UI para operaciones.
- Cambiar modal de motivo libre a selector obligatorio CLIMA/TECNOLOGIA con comentario opcional.
- Consumir endpoint, refrescar estado del lanzamiento y mostrar feedback de exito/error.
- Mostrar motivo de suspension en el detalle tras confirmar la accion.

5. Pruebas unitarias e integracion (backend y frontend)
- Backend: cubrir transicion valida a SUSPENDIDO y rechazo por motivo invalido.
- Backend: cubrir que reservas permanecen intactas tras suspension.
- Backend: cubrir respuestas HTTP para errores de validacion/transicion.
- Frontend: cubrir validacion de formulario, envio valido y render de feedback.
- Frontend: cubrir visualizacion de motivo registrado tras suspension.

6. Pruebas e2e
- Escenario feliz: operaciones suspende por CLIMA y se valida estado SUSPENDIDO + motivo visible.
- Escenario feliz: operaciones suspende por TECNOLOGIA con comentario opcional.
- Escenario de validacion: intento sin motivo y bloqueo de envio con mensaje claro.
- Escenario de consistencia: tras suspension, reservas del lanzamiento siguen presentes sin cancelacion.
- Criterios a validar explicitamente: CA1, CA2, CA3, CA4, CA5, CA6 y CA7.
