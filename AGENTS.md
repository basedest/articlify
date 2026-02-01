# Articlify Repository

> **Audience**: AI coding agents (Cursor, Copilot, ChatGPT, etc.) and human contributors.
>
> **Purpose**: Define global rules, expectations, and guardrails for working in this repository.
> This is a **broad, high-level contract**. Detailed architectural rules live in internal Cursor configuration.`

---

## 1. Project Overview

Articlify is a **Next.js (App Router)** application structured using **Feature-Sliced Design (FSD) v2.1**.

Key goals of the architecture:

* Long-term scalability
* Clear ownership of code
* Safe parallel development
* Predictable refactoring

Agents must **preserve architectural intent** at all times.

---

## 2. Golden Rules (Non-negotiable)

1. **Do not break architectural boundaries**
2. **Do not introduce new global patterns without discussion**
3. **Do not mix responsibilities in one file**
4. **Do not add logic to framework glue layers**
5. **Prefer moving code, not rewriting it**

If unsure — stop and ask for clarification.

---

## 3. Repository Structure (Conceptual)

```
root/app/        → Next.js routing glue ONLY
src/app/         → App initialization (providers, config)
src/views/       → Page orchestration
src/widgets/     → Large reusable UI blocks
src/features/    → User actions
src/entities/    → Domain models
src/shared/      → Reusable, context-agnostic code
```

Agents must **not invent new top-level folders**.

---

## 4. Responsibilities by Layer (Simplified)

### `root/app`

* Routing only
* No business logic
* Minimal JSX

### `src/views`

* Data fetching
* Page composition
* Route params handling

### `src/widgets`

* UI composition
* No business rules

### `src/features`

* User interactions
* State + side effects

### `src/entities`

* Domain representation
* Data models, APIs, entity UI

### `src/shared`

* Generic utilities
* No domain knowledge

> Detailed constraints are defined in `.cursor/rules/fsd.md`.

---

## 5. How to Decide Where Code Goes

Ask these questions **in order**:

1. Is this **routing / framework glue**? → `root/app`
2. Is this **page-specific orchestration**? → `src/views`
3. Is this a **large UI block**? → `src/widgets`
4. Is this a **user action (verb)**? → `src/features`
5. Is this a **domain concept (noun)**? → `src/entities`
6. Is this **fully generic**? → `src/shared`

If none apply — reassess the design.

---

## 6. Allowed Changes for Agents

Agents MAY:

* Move files to correct layers
* Split large files by responsibility
* Improve naming and clarity
* Add missing types
* Reduce coupling

Agents MUST NOT:

* Change business behavior unintentionally
* Perform large rewrites without instruction
* Introduce new abstractions casually
* Collapse layers "for convenience"

---

## 7. Coding Expectations

* Prefer clarity over cleverness
* Keep files focused and small
* Avoid premature abstractions
* Follow existing patterns in the codebase

Style consistency > personal preference.

---

## 8. Imports & Dependencies (High-level)

* Dependencies flow **from top layers to bottom layers**
* Shared code must stay dependency-free
* Cross-slice imports on the same layer are discouraged

Exact rules are enforced by internal architectural constraints.

---

## 9. When in Doubt

If an agent is uncertain:

1. Pause
2. Re-read this document
3. Check the architectural rules
4. Ask for clarification before proceeding

Silently guessing is considered a violation.

---

## 10. Source of Truth

* **AGENTS.md** → behavioral and architectural intent
* **.cursor/rules/fsd.md** → strict enforcement rules

If documents conflict:

* `.cursor/rules/fsd.md` wins on structure
* Human clarification wins over both

---

✅ Following these rules ensures Articlify stays maintainable and agent-friendly.
