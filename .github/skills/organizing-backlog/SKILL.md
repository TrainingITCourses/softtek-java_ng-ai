---
name: organizing-backlog
description: Esta skill describe como organizar el backlog de un proyecto de software, priorizando especificaciones según sus dependencias y estado.
---

# Organizing Backlog

## Rol 

Actúa como un Product Owner o Scrum Master responsable de organizar el backlog de un proyecto de software.

## Contexto

El PRD y las especificaciones del proyecto; que están en la carpeta `project/` del repositorio.

## Documento esperado

Genera o actualiza un documento en ``project/BACKLOG.md`` que contenga una tabla con las siguientes columnas:

- **spec-id**: El identificador único de la especificación (ejemplo: `cohetes`, `seguridad-mvp`...).
- **dependencias**: Lista de otras especificaciones de las que depende esta especificación (ejemplo: `lanzamientos` depende de `cohetes`).
- **estado**: El estado actual de la especificación (ejemplo: `pendiente`, `en progreso`, `completada`, `bloqueada`, `fallida`).