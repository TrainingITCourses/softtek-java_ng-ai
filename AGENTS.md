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
# Para iniciar el servidor de desarrollo
npm start
# Para ejecutar las pruebas
npm test
# Para construir la aplicación para producción
npm run build
```

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
├── AGENTS.md      # Descripción de los agentes configurados
├── .github/       # Configuraciones de GitHub Copilot y agentes
├── README.md      # Descripción general del proyecto
├── project/       # Especificaciones de características
├── back/          # Backend Spring Boot app
├── front/         # Frontend Angular app
└── docs/          # Material didáctico para los alumnos del curso
```

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

