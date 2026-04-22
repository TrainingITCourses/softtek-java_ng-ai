---
name: writing-spec
description: "Usa esta skill para crear o actualizar una especificación funcional de una feature a partir del PRD, el briefing y el contexto del proyecto."
---

# Crear un documento de especificación funcional

## Rol
Actúa como analista funcional de software. Tu objetivo es convertir un requerimiento del PRD en una spec clara, implementable y concisa.

## Tarea

Crea o actualiza la especificación funcional de una feature concreta.

No escribas código ni tests, solo la especificación.

## Contexto

Debes comenzar desde un PRD o desde una feature claramente identificada dentro del PRD.

Utiliza como base:
- la feature o FR indicada por el usuario
- `/project/PRD.md`
- `/project/briefing.md` si existe
- `/README.md` y `/AGENTS.md` si aportan restricciones
- specs existentes en `/project/specs/` para mantener consistencia

Si no existe un PRD claro, utiliza primero la skill [writing-prd](../writing-prd/SKILL.md).

## Pasos para crear la spec

### 1. Acotar la funcionalidad

Haz solo preguntas que afecten al contenido de la especificación.

Debes concretar:
- qué FR o subfuncionalidad del PRD se va a detallar
- qué actores intervienen
- qué reglas de negocio y validaciones aplican
- qué queda fuera de alcance
- si existe flujo o ciclo de vida de estados

Si es posible, propone una interpretación inicial y pide validación en lugar de hacer preguntas abiertas.

### 2. Extraer decisiones del PRD

Identifica y resume:
- entidades y atributos relevantes
- restricciones, unicidad y validaciones
- estados y transiciones, si aplica
- expectativas de front y back
- errores de negocio que deben quedar visibles

La spec debe ampliar el PRD, no repetirlo.

### 3. Redactar la especificación

Genera la spec siguiendo la plantilla basada en el idioma del usuario:
- utiliza la plantilla [en español](es.spec.template.md)
- utiliza la plantilla [en inglés](en.spec.template.md)

Reglas:
- mantén el documento conciso y accionable
- enfoca una sola feature por documento
- usa de 1 a 4 historias de usuario
- define claramente el fuera de scope
- usa criterios de aceptación en formato EARS
- detalla el modelo y el boceto de solución a alto nivel, sin entrar en código

### 4. Guardar el documento

Guárdalo en `/project/specs/<feature-slug>.spec.md`.

Usa slugs con guiones según la convención del proyecto.

## Verificación

- [ ] Existe un documento completo en `/project/specs/<feature-slug>.spec.md`
- [ ] La spec deriva de un FR o subconjunto real del PRD
- [ ] Problema, alcance y fuera de scope están claros
- [ ] Los criterios de aceptación están en EARS y son verificables
- [ ] El documento no contiene detalles de implementación innecesarios
