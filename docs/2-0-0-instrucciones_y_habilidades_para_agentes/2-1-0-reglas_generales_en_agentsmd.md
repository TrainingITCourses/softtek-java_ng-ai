---
title: Reglas generales en AGENTS.md
description: Un README para agentes; reglas generales que siempre deben seguir.
url: 2-1-0-reglas_generales_en_agentsmd
footer: 2. Instrucciones y habilidades para agentes. &copy; [AlbertoBasalo](https://albertobasalo.dev)@[AICode.Academy](https://aicode.academy) 
marp: true
theme: ab
---

[2. Instrucciones y habilidades para agentes](./2-0-0-instrucciones_y_habilidades_para_agentes.md)  
# 2.1. Reglas generales en AGENTS.md

- Un README para agentes; reglas generales que siempre deben seguir.

#### [Programación Inteligente](programacion_inteligente.md)  
> Por [Alberto Basalo](https://albertobasalo.dev)@[AICode.Academy](https://aicode.academy) 

---

## Conexión

- **¿Cómo hacer las cosas?**
  - Guías para que los agentes trabajen correctamente.
- **¿Cómo recordarlo?**
  - Usando ficheros que se agregan al contexto del agente.
  
---

## Conceptos

- **AGENTS.md** o **.github/copilot-instructions.md** o **CLAUDE.md** : 
  - Fichero donde se definen las reglas generales para los agentes.
- **Contexto**: 
  - El agente lo agrega SIEMPRE al contexto de sus peticiones.
- **Alcance**:
  - Aplica al proyecto completo, al usuario o a carpetas específicas.
- **Contenido**: 
  - Muy pocas instrucciones muy generales. (_Se envía siempre_).

---

## Concreción

- **¿Qué incluir?**
  - Descripción del proyecto.
  - Stack tecnológico.
  - Flujo de trabajo.
  - Estructura de carpetas.
  - Entorno de desarrollo.
---

## ¿Usar prompts de inicialización?

- Los agentes incluyen sus propios prompts de generación de reglas
- Suelen ser demasiado _verbosos_
- Mejor que lo hagas artesanlamente o tengas tu propia plantilla/prompt/skill

--- 

## Conclusión

- Guarda tus reglas generales en un fichero `AGENTS.md` (_o equivalente_).
- Cuida el contenido para que sea **útil** y relevante.
- Revisa y **actualiza** periódicamente.
  
#### [Programación Inteligente](programacion_inteligente.md).  
> _No es magia, es tecnología._  
> [**Alberto Basalo**](https://albertobasalo.dev)@[AICode.Academy](https://aicode.academy)