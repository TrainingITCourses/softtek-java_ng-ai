# F{n}. {Feature name}

## Problem definition

### Context

{Explain in 2 to 4 sentences the business need, who has the problem, and why this feature creates value.}

### User stories

- As a `{role}` I want to **{goal}** so that _{benefit}_
- As a `{role}` I want to **{goal}** so that _{benefit}_
- As a `{role}` I want to **{goal}** so that _{benefit}_

### Out of scope

- {What is explicitly excluded from this feature}
- {Restriction or case not included in the MVP}
- {Integration or process postponed for later}

---

## Solution outline

{Summarize the functional solution at a high level, without code-level detail.}

### Model

| Entity | Attribute | Type | Constraints |
|--------|-----------|------|-------------|
| `{Entity}` | `id` | `{type}` | {Generated, unique, optional, etc.} |
| `{Entity}` | `{attribute}` | `{type}` | {Range, length, enum, format, uniqueness, etc.} |
| `{Entity}` | `{attribute}` | `{type}` | {Relevant constraint} |

> legend: `#` unique, `?` optional (required by default)

### Back

- {Request handling and validation}
- {Persistence and business rules}
- {Expected response or error format}
- {Relevant states, transitions, or actions}

### Front

- {Main page or view}
- {Form, list, or available actions}
- {Client-side validations}
- {User feedback on success or failure}

---

## Acceptance criteria

> EARS format

- [ ] the system SHALL {mandatory behavior}
- [ ] WHEN {event or action} the system SHALL {expected result}
- [ ] IF {invalid or business condition} THEN the system SHALL {expected response}
- [ ] WHEN {state change or update} the system SHALL {expected behavior}
