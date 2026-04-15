# Feature Releasing Skill

To be executed after the implementation of a feature is completed and ready for release. 
This skill ensures that the feature is properly tested, documented, and released in a structured manner.

## Steps to follow:

## 1. Verify Implementation

- Run the application e2e.
- Perform manual testing using your browser tool.
- Mark the checklist of acceptance criteria that have been met.
  
## 2. Update Documentation

- Update AGENTS.md based on the current changes:
  - Add any necessary information that are relevant for agents to know.
  - Remove any information that is no longer relevant or accurate.

## 3. Git release

- Change any version numbers in the codebase to reflect the new release version.
- Ensure all changes are committed with clear and descriptive messages.
- Create a Git Tag for the new release following semantic versioning.
- Merge the feature branch into the main branch if not already done.
- Push the changes and the new tag to the remote repository.