---
description: "Analiza un requerimiento de funcionalidad/bug/mejora, aclara requisitos y genera un plan de implementación guardado en product/{slug}.plan.md"
name: "Analiza Requerimiento"
argument-hint: "Describe brevemente la funcionalidad, bug o mejora"
agent: "agent"
---

Objetivo: convertir una idea de funcionalidad, bug o mejora en un plan accionable de implementación.

Entrada principal:
- Solicitud del usuario: ${input}

Flujo obligatorio:
1. Antes de planificar, haz las preguntas mínimas necesarias para entender bien el problema.
- Haz las preguntas una por una
- Propón un conjunto de respuestas cerradas
2. Enfoca las preguntas en tres artefactos:
- User stories (quién, qué, para qué).
- Boceto funcional de la solución esperada (sin profundidad técnica).
- Lista corta de criterios de aceptación verificables.
3. Cuando tengas suficiente contexto, sintetiza esos tres artefactos en español claro.
4. Después, construye un plan de implementación con pasos ordenados.
5. Cada paso del plan debe incluir una lista corta de tareas concretas.
6. Incluye siempre un paso extra dedicado a pruebas e2e, cubriendo explícitamente los criterios de aceptación/validación.
7. Genera un slug corto y legible a partir del tema (kebab-case, sin acentos ni caracteres especiales).
8. Guarda el resultado en un archivo con esta ruta exacta:
- product/{slug-id-nombre-corto}.plan.md

Formato requerido del archivo de salida:
- Título con nombre de la iniciativa.
- Sección "Contexto" (resumen del problema).
- Sección "User stories".
- Sección "Boceto de solución (funcional)".
- Sección "Criterios de aceptación".
- Sección "Plan de implementación" con pasos numerados.
- En cada paso: una lista corta de tareas.
- Último paso obligatorio: "Pruebas e2e" con tareas y criterios a validar.

Reglas:
- No entrar en diseño técnico profundo durante el boceto funcional.
- Si falta información crítica, no inventes: pregunta primero.
- Mantén el plan orientado a implementación incremental y verificable.
- Usa español.

Al finalizar:
- Confirma la ruta del archivo generado.
- Resume en 4-6 bullets qué se va a implementar y cómo se validará.