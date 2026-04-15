---
title: Instrucciones particulares contextuales
description: El micro management de los agentes.
url: 2-2-0-instrucciones_particulares_contextuales
footer: 2. Instrucciones y habilidades para agentes.  &copy; [AlbertoBasalo](https://albertobasalo.dev)@[AICode.Academy](https://aicode.academy) 
marp: true
theme: ab
---

[2. Instrucciones y habilidades para agentes](./2-0-0-instrucciones_y_habilidades_para_agentes.md)  
# 2.2. Instrucciones particulares contextuales

- El micro management de los agentes

#### [Programación Inteligente](programacion_inteligente.md)  
> Por [Alberto Basalo](https://albertobasalo.dev)@[AICode.Academy](https://aicode.academy)

---

## Conexión

- **¿Cómo entrar en detalle sin sobrecargar el contexto?**
  - Escribiendo instrucciones adicionales para situaciones específicas.

---

## Conceptos

- **Instrucciones contextuales**: 
  - Reglas específicas para situaciones concretas.
- **Activación**: 
  - Manual o automática según un patrón de ficheros o carpetas.
- **Alcance**: 
  - Aplica a ficheros, carpetas o situaciones específicas.
- **Estándar**: 
  - En Cursor son `rules`, en Copilot `instructions` y pronto serán `skills`.

---

## Concreción

- **¿Qué incluir?**
  - Cabecera **YAML** con metadatos para definir el alcance.
  - Instrucciones detalladas para casos específicos.
    - Patrones de diseño: `controllers`, `factories`.
    - Buenas prácticas: `testing`, `error handling`.
    - Reglas de estilo: `naming`, `formatting`.

--- 

## Conclusión

- Debemos **detallar** las instrucciones para casos específicos.
- En ficheros separados para **no sobrecargar** el contexto general.
- La sintaxis depende del editor/agente, tendente a unificarse en **SKILLS**
  
#### [Programación Inteligente](programacion_inteligente.md).  
> _No es magia, es tecnología._  
> [**Alberto Basalo**](https://albertobasalo.dev)@[AICode.Academy](https://aicode.academy)