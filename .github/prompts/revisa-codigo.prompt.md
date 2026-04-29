---
description: "Dado un plan con criterios de aceptación: crea pruebas E2E que los validen, luego revisa el código implementado eliminando code-smells y simplificando, y finalmente documenta los cambios en CHANGELOG y actualiza instrucciones si procede."
name: "Revisa Código"
argument-hint: "Ruta del plan (ej. product/mi-feature.plan.md)"
agent: "agent"
---

Objetivo: asegurar la calidad de una funcionalidad ya implementada siguiendo tres fases en orden: validar con E2E, refinar el código y documentar.

Entrada principal:
- Plan a validar: ${input}

---

## Fase 1 — Pruebas E2E para criterios de aceptación

1. Lee el plan completo e identifica cada criterio de aceptación.
2. Para cada criterio, crea al menos un test E2E en `e2e/tests/` que lo cubra:
   - Front (UI): en `e2e/tests/front/` usando `page` y `baseURL` `http://localhost:4200`.
   - Back (API): en `e2e/tests/back/` usando `request` y `baseURL` `http://localhost:8080`.
3. Sigue las convenciones del proyecto definidas en [e2e-playwright-convenciones.instructions.md](../instructions/e2e-playwright-convenciones.instructions.md):
   - Selectores por accesibilidad (`getByRole`, `getByLabel`).
   - Limpieza de datos creados (`DELETE`) en tests de API.
   - Nombres de test en español describiendo comportamiento observable.
4. Ejecuta los tests E2E (`npm test` desde `e2e/`) y confirma que todos pasan antes de continuar.

Salida de la fase:
- Lista de criterios de aceptación del plan.
- Tests E2E creados (archivo y nombre de cada test).
- Resultado de ejecución (ok / fallos con causa breve).

---

## Fase 2 — Revisión y refinamiento del código

Solo continuar si los tests E2E de la Fase 1 pasan.

Revisa el código implementado (front y back) buscando:

**Code-smells a eliminar:**
- Código duplicado o copy-paste entre clases/componentes.
- Métodos o funciones demasiado largas (> 20 líneas sin justificación).
- Nombres poco descriptivos o engañosos.
- Lógica de negocio mezclada en capa de presentación o controladores.
- Comentarios que explican código obvio (preferir código autoexplicativo).

**Oportunidades de simplificación y reutilización:**
- Extraer utilidades o helpers comunes ya presentes en el proyecto.
- Sustituir estructuras complejas por equivalentes más legibles del lenguaje/framework.
- Aplicar convenciones del proyecto (ver [backend.instructions.md](../instructions/backend.instructions.md) y [frontend-angular-convenciones.instructions.md](../instructions/frontend-angular-convenciones.instructions.md)).

Reglas:
- No cambiar comportamiento observable; los tests deben seguir pasando.
- Cada cambio debe ser mínimo y verificable.
- Ejecutar tests unitarios y E2E relevantes tras los cambios.

Salida de la fase:
- Lista de cambios realizados con justificación en una línea.
- Resultado de ejecución de tests tras el refinamiento.

---

## Fase 3 — Documentación y actualización de convenciones

1. **CHANGELOG**: crea o actualiza `CHANGELOG.md` en la raíz del proyecto con una entrada para esta funcionalidad:
   - Formato: `## [Unreleased] - YYYY-MM-DD` seguido de subsecciones `Added`, `Changed`, `Fixed` según aplique.
   - Incluye referencias a los criterios cubiertos y cambios de refactorización relevantes.

2. **Instrucciones y convenios**: revisa si algún patrón nuevo o decisión técnica tomada en las fases anteriores debería quedar registrado en:
   - `.github/instructions/` (convenciones de código o E2E).
   - `AGENTS.md` (guía para agentes).
   - Solo actualizar si el cambio es un patrón reutilizable y no estaba ya documentado.

Salida de la fase:
- Entrada de CHANGELOG generada.
- Archivos de instrucciones actualizados (o confirmación de que no era necesario).

---

## Comportamiento general

- Responder en español.
- Avanzar fase a fase; no comenzar la siguiente si la anterior tiene fallos.
- Si detectas ambigüedad en el plan, hacer una sola pregunta puntual antes de continuar.
- Priorizar cambios pequeños, justificados y fáciles de revisar.
