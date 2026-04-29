---
applyTo: "back/**"
description: "Convenciones Spring Boot del proyecto AstroBookings. Úsalo al crear o editar código en back/."
---

# Backend – Convenciones Spring Boot

## Estructura de paquetes
- Paquete raíz: `academy.aicode.astrobookings`
- Cada feature tiene su propio subpaquete: `cohetes`, `lanzamientos`, etc.
- Dentro de cada feature viven Controller, Service, Repository, entidades y excepciones.

## Naming
| Clase | Sufijo | Ejemplo |
|---|---|---|
| Controlador REST | `Controller` | `CoheteController` |
| Servicio | `Service` | `CoheteService` |
| Repositorio | `Repository` | `CoheteRepository` |
| DTO de entrada | `Peticion` | `CohetePeticion` |
| DTO de salida | `Respuesta` | `ErrorRespuesta`, `SaludoRespuesta` |
| Entidad de dominio | (ninguno) | `Cohete`, `Lanzamiento` |
| Excepción no encontrado | `NoEncontradoException` | `CoheteNoEncontradoException` |
| Excepción validación | `ValidacionException` | `LanzamientoValidacionException` |
| Excepción duplicado | `NombreDuplicadoException` | `CoheteNombreDuplicadoException` |
| Excepción transición | `TransicionInvalidaException` | `LanzamientoTransicionInvalidaException` |

## Entidades y DTOs
- Usar **Java `record`** para entidades (inmutables) y DTOs.
- IDs: `UUID` generado en el dominio, nunca en el controlador.
- Sin JPA ni base de datos: almacenamiento **en memoria** (repositorio con `Map<UUID, T>`).

## Controladores REST
- `@RestController` + `@RequestMapping("/api/<feature>")`
- Inyección por **constructor** (sin `@Autowired` ni inyección de campo).
- `@ExceptionHandler` locales en el propio controlador (no `@ControllerAdvice` global).
- Errores siempre devuelven `ResponseEntity<ErrorRespuesta>` con `{code, error, message}`:
  - 404 → `"error": "not_found"`
  - 400 → `"error": "validation_failed"`
  - 409 → `"error": "conflict"`

## Servicios
- Validación de negocio en el Service, nunca en el Controller.
- Lanzar excepción de dominio específica; el Controller la atrapa y devuelve el HTTP correcto.
- Máquinas de estado con enum (`EstadoLanzamiento`); transiciones gestionadas en el Service.

## Tests
- **Unitarios** (`XxxServiceTest`): JUnit 5 + AssertJ. Sin contexto Spring. Instanciación manual en `@BeforeEach`.
- **Integración** (`XxxControllerIntegrationTest`): `MockMvc` vía `MockMvcBuilders.standaloneSetup(controller)`. Sin `@SpringBootTest`.
- Nombres de método en **español**, snake_case, describiendo comportamiento:
  `crear_lanzamiento_valido_devuelve_201_y_estado_programado`
- Assertions con `assertThat(…)` y `assertThatThrownBy(…)` de AssertJ.

## Dependencias activas (pom.xml)
- `spring-boot-starter-webmvc` (no WebFlux)
- `spring-boot-starter-webmvc-test` + `spring-boot-starter-test` (scope test)
- Sin Lombok, sin JPA, sin base de datos.
