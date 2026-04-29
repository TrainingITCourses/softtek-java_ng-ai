---
description: "Usar cuando se creen o modifiquen pruebas e2e de Playwright en AstroBookings (front/back), incluyendo `e2e/tests/**/*.spec.ts` y `e2e/playwright.config.ts`. Define convenciones actuales de estructura, selectores, validaciones y limpieza de datos."
name: "Convenciones E2E Playwright AstroBookings"
applyTo: "e2e/tests/**/*.spec.ts, e2e/playwright.config.ts"
---
# Convenciones E2E Playwright (estado actual del repo)

## Estructura y alcance

- Mantener separación por proyecto Playwright:
  - `front`: UI con `page` y `baseURL` `http://localhost:4200`.
  - `back`: API con `request` y `baseURL` `http://localhost:8080`.
- Ubicar pruebas en `e2e/tests/front/**/*.spec.ts` y `e2e/tests/back/**/*.spec.ts`.
- Agrupar casos con `test.describe(...)` usando nombres funcionales claros (feature o endpoint).
- Nombrar tests en español, describiendo comportamiento observable.

## Estilo de pruebas Front (UI)

- Usar accesibilidad primero en selectores:
  - `getByRole(...)` para botones, headings, celdas, status.
  - `getByLabel(...)` para campos y selects.
- Evitar selectores frágiles (CSS acoplado a estructura visual) salvo necesidad real.
- Preparar estado inicial en `test.beforeEach` con navegación a ruta funcional, por ejemplo `await page.goto('/cohetes')`.
- Verificar estados de formulario antes de enviar:
  - Botones habilitado/deshabilitado (`toBeEnabled`, `toBeDisabled`).
  - Visibilidad de elementos (`toBeVisible`, `not.toBeVisible`).
- Confirmar feedback de usuario tras acciones relevantes (por ejemplo región `status`) y evidencia en UI persistida (filas/celdas).

## Estilo de pruebas Back (API)

- Definir constantes de endpoint y payload base al inicio del archivo.
- Cubrir al menos:
  - Caso inválido representativo (status y mensaje/estructura de error).
  - Límites de validación (ej. mínimo/máximo permitido).
  - Caso válido (status esperado de creación).
- Para recursos creados durante el test, realizar limpieza explícita (`DELETE`) para evitar acoplamiento entre ejecuciones.
- Cuando se necesiten datos únicos, generarlos de forma simple y legible, pero suficientemente robusta para ejecución paralela y estado persistido en memoria (por ejemplo sufijo corto derivado de tiempo + aleatorio, manteniendo los límites de validación del dominio).

## Asersiones y robustez

- Validar primero código de estado HTTP y luego contenido de respuesta cuando aplique.
- En respuestas de error, comprobar campos semánticos estables (`code`, `error`, `message`) en lugar de textos completos rígidos.
- Mantener cada test enfocado en un comportamiento principal.

## Configuración Playwright

- Preservar la segmentación por proyectos (`front` y `back`) y su `testMatch` dedicado.
- Mantener `trace: 'on-first-retry'` para facilitar diagnóstico en fallos intermitentes.
- Respetar estrategia actual de CI en config:
  - `forbidOnly` activo en CI.
  - `retries` mayor a cero en CI y cero en local.

## Scripts y ejecución

- Usar scripts existentes del paquete `e2e`:
  - `npm test` para todos.
  - `npm run test:front` para UI.
  - `npm run test:back` para API.
  - `npm run report` para reporte HTML.
- No introducir comandos alternativos si no aportan valor claro frente a estos scripts.

- Asegúrate de haber arrancado los servicios necesarios (frontend en `localhost:4200` y backend en `localhost:8080`) antes de ejecutar las pruebas.
- Al finalizar pruebas, cierra los procesos de prueba y limpia cualquier dato creado durante las pruebas para mantener un entorno limpio para futuras ejecuciones.
- Si una prueba fall, intenta arreglarla y vuelve a ejecutar para confirmar que el fallo se ha resuelto antes de continuar con otras tareas. PERO no lo hagas más de dos veces. Si el fallo persiste, documenta el error y avisa al equipo para revisión.
