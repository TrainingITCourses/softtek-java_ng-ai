# Create Agents Instructions

## Role

Act as a software engineer.

## Task

Create a set of instructions for AI agents to understand the project.

## Context
Browse and read the project files to gather context.

### Instructions Template
Ensure a short file (<= 100 sentences) and short sentences (<= 100 characters).
Follow this template and save in a markdown file `AGENTS.md`:

````markdown
# Agents Instructions

- **Root_Folder**: `/`
- **Agents_Folder**: `/.github`
- **Agents_file**: `/AGENTS.md`
- **Project_Folder**: `/project`

## Product Overview

{Short description of the product}

## Technical Implementation

### Tech Stack

- **Language**: {language and version}
- **Framework**: {framework and version}
- **Database**: {database}
- **Security**: {security strategy}
- **Testing**: {testing framework }
- **Logging**: {logging tool }

### Development workflow

```bash
# Set up the project
{install command}

# While developing, watch for changes and run tests automatically
# Watch and compile the project while developing
{dev command}
# Watch and run unit tests while writing tests
{test:dev command}
# Static linting and type checking after writing code
{lint command}

# Run unit tests
{test:unit command}
# Run end-to-end tests
{test:e2e command}

# Run all tests before merging or publishing
{test command}

# Build/Compile the project for production
{build command}
# Run the project as a production server
{start command}
```

### Folder structure
```text
.                         # Project root
├── AGENTS.md             # Agent instructions for this repository
├── {Agents_Folder}/      # Agents skills and prompts
│   └── skills/           # Agent skills for specific tasks
├── {Project_Folder}/     # Project-specific documentation
│   ├── ADD.md            # Architecture Design Document
│   ├── PRD.md            # Product Requirements Document
│   └── specs/            # Project specifications
├── README.md             # Project overview
└── other_files/          # Other relevant files and folders 
```

## Environment
- **OS dev**: {operating system}
- **Terminal**: {terminal}
- **Default branch**: {default branch}
- **Git remote**: {git remote URL}

### Behavior Guidelines

- Code and documentation must be in {language}.
- Chat responses must be in the language of the user prompt.
- Sacrifice grammar for conciseness when needed to fit response limits.
- When using templates, replace {placeholders} with concrete values.
- Always lint with {lint command} before staging and committing changes.

### Naming Conventions

Use slugs with hyphens for any identifiers: `add-task`, `fix-bug`, `update-deps`.


````

## Steps to follow:

1. **Product Overview**: 
  - Summarize the product in 2-3 short sentences.
2. **Technical Implementation**:
  - Tech Stack: List main technologies used.
  - Development workflow: Commands to set up, build, run, test, and deploy.
  - Folder structure: Outline main folders and files.
  - Environment: List relevant environment details and copy default section.
3. **Write the Instructions**: 
  - Follow the template and keep it concise.

## Output Checklist

- [ ] The output should be a markdown file named `AGENTS.md`.
