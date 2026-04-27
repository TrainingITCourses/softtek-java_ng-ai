---
name: writing-plan
description: Crear o actualizar planes de implementación por physical-layer para una spec. Usar al preparar execution plans por tier (front, back, e2e) antes de codificar.
---

# Writing Plan

Crear un plan de implementación accionable por physical layer para una spec objetivo.

## Cuando Usar

- Al iniciar `/implement-spec`
- Cuando falta un tier plan, está desactualizado o es inconsistente con la spec actual
- Cuando el agent necesita tareas ordenadas antes del trabajo de implementación

## Entradas

- Archivo de la spec objetivo en `specs/`
- Archivos de plan existentes: `specs/<spec-slug>.<tier>.plan.md` (si hay)
- Technical constraints desde `/AGENTS.md` y `/project/ADR.md`

## Convenciones de Tier y Archivo

- Tiers permitidos: `front`, `back`, `e2e`
- Un archivo por tier: `specs/<spec-slug>.<tier>.plan.md`
- No crear planes duplicados para el mismo tier

## Estructura del Plan

Cada plan debe incluir:
- Contexto y alcance del tier
- Pasos ordenados
- Lista de tareas por paso
- Criterios de validación para ese tier
- Sección de estado del ciclo de vida:
  - `Plan Status`: `Pending` | `In Progress` | `Completed` | `Blocked` | `Failed`
  - Casillas de verificación de tareas (`- [ ]`, `- [x]`) como la fuente del estado de la tarea

## Política de Estado

- Un plan nuevo o refrescado comienza en `Pending`
- Pasar a `In Progress` cuando comience la ejecución de la primera tarea
- Marcar `Completed` sólo cuando todas las tareas estén hechas y la validación del tier pase
- Marcar `Blocked` cuando una dependencia externa impida el progreso
- Marcar `Failed` cuando la validación siga fallando tras los intentos de remediación acordados

## Procedimiento

### 1. Analizar el Alcance de la Spec
- [ ] Leer Problem/Solution/Verification en la spec objetivo.
- [ ] Determinar qué tiers son requeridos (`front`, `back`, `e2e`).
- [ ] Mapear los criterios de aceptación a los resultados de implementación por tier.

### 2. Construir o Actualizar los Planes por Tier
- [ ] Para cada tier requerido, crear/actualizar `specs/<spec-slug>.<tier>.plan.md`.
- [ ] Mantener tareas atómicas, ordenadas y verificables.
- [ ] Incluir dependencias y bloqueos explícitos por tier.

### 3. Inicializar Estados
- [ ] Poner cada plan `Plan Status` en `Pending` tras el draft o refresh.
- [ ] Asegurar que todas las nuevas tareas empiecen sin marcar (`- [ ]`).

### 4. Verificación de Consistencia
- [ ] Asegurar que las tareas del plan estén alineadas con la verificación de la spec.
- [ ] Asegurar que no existan planes duplicados o huérfanos por tier.
- [ ] Asegurar que la convención de nombres sea consistente para todos los tiers.

## Output

Un archivo de plan actualizado/creado por cada tier requerido, todos inicializados como `Pending` y listos para `implementing-plan`.
