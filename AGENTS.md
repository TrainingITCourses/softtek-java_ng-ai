# AGENTS

Guía mínima para que un agente de código sea productivo en este repo.

## 1) Alcance del producto
- Proyecto formativo: AstroBookings (reservas/lanzamientos/cohetes) con backend Java y frontend Angular.
- Objetivo principal: practicar desarrollo asistido por IA y pruebas (unitarias, integración y e2e).
- Contexto general: ver [README](README.md).

## 2) Stack tecnológico
- Backend: Java 25, Spring Boot 4, Maven Wrapper.
- Frontend: Angular 21, TypeScript 5, RxJS, Vitest.
- E2E: Playwright.
- SO actual de trabajo: Windows (usar `mvnw.cmd` cuando sea necesario).

## 3) Carpetas principales
- `back/`: API Spring Boot.
- `back/src/main/java/academy/aicode/astrobookings/`: código backend.
- `back/src/test/java/academy/aicode/astrobookings/`: tests backend.
- `front/`: app Angular.
- `front/src/app/`: features UI (`cohetes`, `lanzamientos`, etc.).
- `e2e/`: pruebas Playwright para front y back.

## 4) Comandos de compilación, test y ejecución
### Backend (`back/`)
- Build: `./mvnw.cmd clean compile`
- Test: `./mvnw.cmd test`
- Run: `./mvnw.cmd spring-boot:run`

### Frontend (`front/`)
- Instalar: `npm install`
- Run (con proxy `/api` -> `http://localhost:8080`): `npm run start`
- Build: `npm run build`
- Test: `npm run test`

### E2E (`e2e/`)
- Instalar: `npm install`
- Test todos: `npm test`
- Solo front: `npm run test:front`
- Solo back: `npm run test:back`
- Reporte: `npm run report`

## 5) Flujo recomendado para agentes
1. Leer [README](README.md) y [front/README.md](front/README.md).
2. Si tocas API, ejecutar tests backend en `back/`.
3. Si tocas UI, ejecutar tests frontend en `front/`.
4. Si cambias contratos UI/API, validar también `e2e/`.

## 6) Convenciones y pitfalls
- No mezclar cambios no relacionados en el mismo commit/PR.
- Evitar reescrituras masivas de formato sin valor funcional.
- Backend requiere Java 25; si falla compilación, revisar `JAVA_HOME`.
- En frontend, usar `npm run start` (incluye proxy) en lugar de `ng serve` directo.
- Preferir cambios pequeños, verificables y con test cercano al cambio.
