---
name: committing-changes
description:  Commits pending changes. To be used for committing code changes in a git repository.
---

# Committing Changes Skill

When asked for committing changes, follow these steps:

## Steps to Commit Changes

### 1. Check for uncommitted changes:
  - Use `git status` to see if there are any uncommitted changes.
### 2. Group changes:
  - If there are multiple files changed, group them logically if possible.
  - For each group do the next two steps:
### 3. Stage grouped changes:
  - Stage the changes using `git add` for each group of files.
### 4. Commit grouped changes:
  - Commit the staged changes using meaningful [conventional commit messages](conventional-commits.md).