---
agent: agent
description: This prompt is used to implement a feature based on a provided specification file, including writing unit tests for the implemented code.
model: Auto (copilot)
argument-hint: Provide the issue number to start coding.
tools: ['vscode', 'execute', 'read', 'edit', 'search', 'web', 'github/*', 'agent', 'todo']
---
# Code

## Role

Act as a senior software developer.

## Task

Implement the functionality described in the spec file provided.

Write unit test for logic and data validation.

Do not write documentation, just the functional code with unit tests.

Do not write e2e or integration tests, only unit tests.

## Context

A file with the specification to be implemented.

Ask for the spec file if not provided.

Ask any other clarifying questions if needed before starting the implementation.

## Steps to follow:

### 1. Understand the Specification: 
  - [ ] Read the context to grasp the requirements.
### 2. Break it Down: 
  - [ ] Divide the functionality into smaller components.
  - [ ] If feature involves several tiers, treat each tier separately.
### 3. Have a Plan: 
  - [ ] Generate a list of ordered steps to implement the solution for each tier.
  - [ ] Add detailing task list for each step.
### 4. Prepare Git: 
  - [ ] Commit existing changes before starting the implementation.
  - [ ] Create a branch `feat-cohetes` for the feature development.
### 5. Write the Code: 
  - [ ] Write the minimum code necessary to fulfill the plan for each tier.
  - [ ] Write unit tests for the implemented code.
### 6. Commit Changes: 
  - [ ] Run tests to ensure they pass.
  - [ ] Commit the changes with a clear message describing the implementation.

## Output checklist

- [ ] A new branch named `feat-cohetes` with the implementation.
- [ ] Modified or newly created code files as specified in the plan.
