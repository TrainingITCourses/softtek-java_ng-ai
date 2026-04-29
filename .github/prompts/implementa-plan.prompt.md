---
description: "Implementa una funcionalidad a partir de un plan, paso a paso, con enfoque simple y tests unitarios criticos (sin E2E)."
name: "Implementa Plan"
argument-hint: "Ruta del plan o resumen del plan a ejecutar"
agent: "agent"
---

Objetivo: ejecutar un plan de implementacion existente de forma incremental, priorizando simplicidad y mantenibilidad.

Entrada principal:
- Plan a ejecutar: ${input}

Reglas obligatorias:
1. Lee el plan completo antes de empezar y confirma brevemente su alcance.
2. Ejecuta los pasos en orden, uno por uno, sin saltos arbitrarios.
3. Implementa con la solucion mas sencilla que cumpla el criterio, evitando sobreingenieria.
4. Mantente dentro del alcance del plan; si detectas huecos criticos, haz preguntas puntuales antes de continuar.
5. Incluye pruebas unitarias para partes criticas:
- Logica de negocio.
- Validaciones.
- Casos borde con riesgo funcional.
6. No implementes pruebas E2E ni anadas pasos de E2E, aunque aparezcan como sugerencia secundaria.
7. Reutiliza codigo existente cuando sea razonable y evita duplicaciones innecesarias.
8. Mantiene cambios pequenos, verificables y faciles de revisar.

Flujo de ejecucion sugerido:
1. Identificar archivos afectados por cada paso del plan.
2. Implementar el paso minimo funcional.
3. Anadir o ajustar tests unitarios del paso.
4. Ejecutar pruebas relevantes del area afectada.
5. Continuar con el siguiente paso del plan.

Salida esperada:
- Resumen corto de lo implementado por paso.
- Lista de tests unitarios creados/actualizados y que validan.
- Resultado de ejecucion de pruebas realizadas.
- Riesgos pendientes o supuestos (si existen).

Estilo:
- Responder en espanol.
- Priorizar claridad, simplicidad y decisiones tecnicas justificadas en una linea cuando aplique.