---
applyTo: "front/src/app/**/*.ts,front/src/app/**/*.spec.ts,front/src/app/**/*.css"
---
# Convenciones Frontend Angular (extraidas de la implementacion actual)

Estas reglas reflejan el estilo y arquitectura ya usados en el proyecto. Prioriza consistencia con estos patrones antes que introducir nuevos enfoques.

## 1) Estructura y organizacion
- Agrupar por feature en `front/src/app/<feature>/`.
- Mantener juntos: modelo, servicio, componente(s), formularios y tests de la feature.
- Usar nombres en espanol alineados al dominio (`cohetes`, `lanzamientos`, `motivo`, `estado`).

## 2) Componentes
- Preferir componentes standalone con `imports` en el decorador `@Component`.
- Usar `ChangeDetectionStrategy.OnPush` por defecto.
- Estado local con `signal(...)`; evitar estado mutable disperso.
- Inyeccion con `inject(...)` en lugar de constructor cuando sea posible.
- En plantillas, usar sintaxis de control de flujo moderna (`@if`, `@for`, `@empty`).
- Para listas, usar `track` con un identificador estable (ej. `id`).

## 3) Formularios
- Usar Reactive Forms (`FormBuilder`, `Validators`).
- Exponer API de componente con `input(...)` y `output(...)`.
- Si el formulario es invalido al enviar, marcar controles (`markAllAsTouched`) y no emitir.
- En modo edicion, precargar valores en `ngOnInit` usando `setValue`.
- Mensajes de validacion en la plantilla con `role="alert"`.

## 4) Servicios HTTP
- Servicios con `@Injectable({ providedIn: 'root' })`.
- Definir `private readonly base = '/api/<recurso>'`.
- Metodos CRUD claros y tipados (`listar`, `obtener`, `crear`, `actualizar`, etc.).
- Devolver `Observable<T>` tipado; no transformar respuestas sin necesidad.

## 5) Modelos y tipos
- Declarar contratos en `*.model.ts` con `interface`/`type`.
- Para dominios cerrados (estados/rangos), usar unions string y constantes exportadas.
- Separar payloads de peticion del modelo principal (`EntidadPeticion`).

## 6) Errores y mensajes
- Centralizar adaptacion de errores de API en helpers por feature (ej. `*.error-adapter.ts`).
- Mostrar mensajes accionables para usuario con fallback por defecto.
- En UI, representar feedback con estructura consistente (ej. `{ texto, esError }`).

## 7) Tests
- Framework de pruebas: Vitest con TestBed Angular.
- Servicios HTTP: usar `provideHttpClient()` + `provideHttpClientTesting()` y `HttpTestingController`.
- Verificar metodo HTTP, URL y body en cada caso.
- Componentes/formularios: probar validaciones, emisiones y precarga en modo edicion.
- Mantener casos de error de servidor cubiertos (incluyendo adaptador de errores cuando aplique).

## 8) Estilo de codigo
- Preferir `readonly` para dependencias y propiedades no mutables.
- Mantener metodos pequenos y orientados a un caso de uso.
- Evitar introducir librerias o patrones globales nuevos sin necesidad del repo.
- Preservar idioma y terminologia del dominio ya existente.

## 9) Responsive en vistas tabulares
- Cuando una vista incluya tablas con identificadores largos o multiples acciones por fila, envolver el bloque contenedor con `overflow-x: auto` para evitar desbordes de pagina en movil.
- Aplicar `overflow-wrap: anywhere` (u opcion equivalente) a celdas con contenido variable para reducir roturas de layout en anchos pequenos.
