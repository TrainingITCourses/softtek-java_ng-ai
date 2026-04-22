---
name: writing-prd
description: Usa esta skill para creear o actualizar un Product Requirements Document (PRD)  a partir de un briefing
---

# Crear un Documento de Requerimientos de Producto (PRD)

## Rol
Actúa como analista de negocio especializado en el **desarrollo de aplicaciones**. Tu objetivo es transformar el contexto de producto en un PRD estructurado.

## Tarea

Crea o actualiza el PRD basado en el briefing y el contexto de proyecto.

## Contexto

Debes comenzar desde un briefing. Si no existe un briefing claro, utiliza la habilidad [writing-briefing](../writing-briefing/SKILL.md) primero para crearlo.

### Modos de proyecto

#### Greenfield

Utiliza:
- idea proporcionada
- documento de briefing `{Project_Folder}/briefing.md`
- `{Root_Folder}/README.md` si está disponible

#### Brownfield

Analiza el sistema existente:

Focaliza en:
- `{Root_Folder}/README.md`
- `{Root_Folder}/CHANGELOG.md`
- `{Root_Folder}/docs`
- `{Root_Folder}/AGENTS.md`
- `{Project_Folder}/PRD.md`, `ADD.md`, specs
- estructura de codebase (solo alto nivel)

Objetivo: extraer el propósito + restricciones, no detalles de implementación.

## Pasos para crear el PRD:

### 1. Preguntas aclaratorias

Haz solo preguntas que afecten a las decisiones en el PRD.

Debes cubrir:

- Alcance funcional (qué debe hacer el sistema)
- Restricciones (qué límites existen)
- Lenguaje ubicuo (entidades y reglas de negocio)
- Reglas de negocio (invariantes, restricciones, máquinas de estados)
- Factores arquitectónicos (qué influirá en el diseño)

Si es posible, propón opciones iniciales y pide validación en lugar de preguntas abiertas.

### 2. Redacción del PRD

Genera el PRD siguiendo la plantilla basada en el idioma del usuario/briefing:
  
- Utiliza la plantilla [en español](es.PRD.template.md)
- Utiliza la plantilla [en inglés](en.PRD.template.md) 

Reglas:
- Mantén el documento conciso
- No repitas el briefing (el PRD es una ampliación)
- Céntrate en las decisiones, no en la narrativa
- Prefiere menos pero más fuertes requerimientos

Límites:
- 3–9 Requerimientos Funcionales (si la aplicación es compleja, haz los requerimientos menos específicos, porque serán detallados en futuros documentos de especificación)


## Verificación 

- [ ] Un PRD completo en `{Project_Folder}/PRD.md`.
- [ ] FRs son capacidades de negocio (no implementación)
- [ ] TRs son decisiones (no teoría)
- [ ] Las reglas de negocio son restricciones invariantes


