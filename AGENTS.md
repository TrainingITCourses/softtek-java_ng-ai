# AGENTS example

You are a coding agent configured at `/.github/` folder.

## Product Overview

Un sistema de reservas de viajes espaciales ficticio. 
Proyecto de entrenamiento para el curso de IA de Softtek Java/Angular.

## Technical Implementation

Es un mono repositorio con dos aplicaciones independientes:

### Frontend

Una aplicación Angular 21 SPA usando TypeScript 5.9 y Vitest para pruebas.

#### Tech Stack

- **Lenguaje**: TypeScript 5.9
- **Framework**: Angular 21
- **Testing**: Vitest
- **Build**: Vite

#### Workflow Commands

```bash
# Para iniciar el servidor de desarrollo (con proxy al backend en :8080)
npm start
# Para ejecutar las pruebas
npm test
# Para construir la aplicación para producción
npm run build
```

> El archivo `front/proxy.conf.json` redirige `/api/*` → `http://localhost:8080` en desarrollo.
> Necesario para evitar errores CORS al consumir la API de Spring Boot desde `ng serve`.

### Backend

Una API REST construida con Spring Boot 4.0 usando Java 25 y Maven.

#### Tech Stack
- **Lenguaje**: Java 25
- **Framework**: Spring Boot 4.0  
- **Build**: Maven
- **Testing**: JUnit

#### Workflow Commands

```bash 
# Para iniciar el servidor de desarrollo
./mvnw spring-boot:run
# Para ejecutar las pruebas
./mvnw test
# Para construir el JAR de producción
./mvnw clean package
```

### Folder structure

```txt
/ (root)
├── AGENTS.md             # Descripción de los agentes configurados
├── .github/              # Configuraciones de GitHub Copilot y agentes
├── README.md             # Descripción general del proyecto
├── project/              # Especificaciones de características
├── back/                 # Backend Spring Boot app
│   └── .../cohetes/      # Gestión de cohetes: Cohete, CoheteService, CoheteController, CoheteRepository
├── front/                # Frontend Angular app
│   └── .../cohetes/      # Gestión de cohetes: CohetesService, CohetesComponent, CoheteFormComponent
├── e2e/                  # Playwright E2E tests (front + back)
│   ├── playwright.config.ts
│   └── tests/
│       ├── front/        # Tests del frontend (:4200)
│       └── back/         # Tests del backend (:8080)
└── docs/                 # Material didáctico para los alumnos del curso
```

## Features implementadas

### F1 — Gestión de Cohetes (`v1.0.0`)
- API REST CRUD en `/api/cohetes` (GET, POST, PUT, DELETE)
- Soft delete (borrado lógico con campo `activo`)
- Validaciones: nombre [3..10] chars, capacidad [1..9], rango enum {Tierra, Luna, Marte}
- Errores estructurados: `{ code, error, message }`
- Frontend Angular: listado, formulario reactivo de alta/edición, baja con feedback al usuario

### E2E Testing

Pruebas de extremo a extremo con Playwright, organizadas por proyecto (`front` / `back`).

#### Workflow Commands

```bash
# Instalar Playwright (solo la primera vez)
cd e2e && npm install && npx playwright install --with-deps
# Ejecutar todos los tests E2E
npm test
# Ejecutar solo tests del frontend
npm run test:front
# Ejecutar solo tests del backend
npm run test:back
# Ver reporte HTML
npm run report
```

> Requiere que front (`:4200`) y back (`:8080`) estén arrancados previamente.

## Environment

- [Repositorio](https://github.com/TrainingITCourses/softtek-java_ng-ai) 
- Rama principal: `main`
- Terminal: Powershell (Windows) 
  
### Behavior Guidelines

- Responde en el idioma del prompt del usuario.
- Genera variables y métodos con nombres descriptivos en español.
- Sé muy conciso en tus respuestas, incluso a costa de la gramática.
- Cuando uses plantillas, reemplaza los {placeholders} con valores reales.

### Naming Conventions  

Use slugs with hyphens for any identifiers: `add-task`, `fix-bug`, `update-deps`.

