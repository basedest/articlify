# FSD in Articlify

> **Purpose**: This document defines strict architectural and coding rules for this repository.
> Cursor (and any coding agent) must follow these rules when modifying or adding code.
>
> The project is structured according to **Feature-Sliced Design (FSD) v2.1** with **Next.js App Router**.

NOTE: Views are the same as pages in FSD v2.1.
We use the term "Views" to avoid confusion with the term "pages" in Next.js.

---

## 1. High-level Architecture

### 1.1 Core Principles

* The codebase follows **Feature-Sliced Design (FSD) v2.1**
* Architecture is **layered and directional**
* Imports are allowed **only top → bottom**, never bottom → top
* Routing is separated from business logic
* No "shared dumping grounds"

---

## 2. Folder Structure (Canonical)

```
root/
  app/            # Next.js App Router (routing glue ONLY)

src/
  app/            # FSD app layer (providers, config, styles)
  views/          # Page-level composition (used by root/app)
  processes/      # Cross-page flows (optional, rare)
  widgets/        # Large UI blocks
  features/       # User actions / interactions
  entities/       # Domain models
  shared/         # Reusable, context-agnostic code
```

This structure is **mandatory**. New top-level folders are forbidden without architectural discussion.

---

## 3. Layer Responsibilities

### 3.1 `root/app` (Next.js)

**Purpose**: Routing and framework integration only.

Allowed:

* `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`
* Route params passing
* Minimal JSX composition

Forbidden:

* Business logic
* Data fetching logic
* State management
* Complex UI

**Rule**:

```tsx
// ✅ Correct
import { ArticlePage } from '@/views/article'

export default function Page(props) {
  return <ArticlePage {...props} />
}
```

---

### 3.2 `src/app` (FSD app layer)

**Purpose**: Application initialization.

Contains:

* Global providers (TRPC, theme, auth, i18n)
* Global styles
* App-level configuration

Rules:

* No business logic
* No domain-specific code
* Exports a single `AppProviders` composition

---

### 3.3 `views`

**Purpose**: Page-level orchestration.

Views:

* Fetch data
* Assemble widgets
* Use features
* Handle `params` / `searchParams`

Rules:

* Views are **not reusable**
* Views may be server or client components
* Views may call server actions

---

### 3.4 `widgets`

**Purpose**: Large UI composition blocks.

Examples:

* Header / Footer
* ArticleList
* Editor

Rules:

* Widgets may combine entities and features
* Widgets contain no business rules
* Widgets are reusable across Views

---

### 3.5 `features`

**Purpose**: User actions (verbs).

Examples:

* `auth/login`
* `article/create`
* `article/edit`

Structure:

```
feature-name/
  ui/
  model/
  api/ (optional)
```

Rules:

* Feature = **single user intent**
* Features may depend on entities and shared
* Features must NOT depend on Views or widgets

---

### 3.6 `entities`

**Purpose**: Domain representation (nouns).

Structure:

```
entity-name/
  model/   # types, schemas, state
  api/     # repositories, services, routers
  ui/      # entity-specific UI
```

Rules:

* Entities know nothing about features
* No cross-entity imports (unless justified)
* No UI composition logic

---

### 3.7 `shared`

**Purpose**: Context-agnostic reusable code.

Allowed subfolders:

```
shared/
  ui/
  lib/
  api/
  config/
  types/
```

Rules:

* Shared MUST NOT import from any other layer
* No domain knowledge
* No business rules

---

## 4. Import Rules (Strict)

Allowed dependency direction:

```
app
 ↓
views
 ↓
widgets
 ↓
features
 ↓
entities
 ↓
shared
```

Forbidden:

* Importing upward
* Importing sideways between slices on the same layer

---

## 5. Coding Rules

### 5.1 File Size & Complexity

* Views: ≤ ~150 LOC
* root/app files: ≤ ~30 LOC
* Components should do **one thing**

---

### 5.2 Naming

* Folders: `kebab-case`
* React components: `PascalCase`
* Hooks: `useXxx`
* Features and entities use **domain language**

---

## 6. What NOT to Do

❌ Add logic to `root/app`
❌ Create generic `components/` folder
❌ Put domain logic in `shared`
❌ Bypass layers "because it's faster"
❌ Introduce cross-layer shortcuts

---

## 7. When in Doubt

If unsure where code belongs:

1. Ask: **Is this a noun or a verb?**
2. Ask: **Is this reusable or page-specific?**
3. Prefer **moving code downward**, not upward
4. If still unclear — stop and ask for architectural review

---

## 8. Enforcement

* Architectural violations must be fixed, not justified
* New code must comply with this document
* This document is the **source of truth** for repo structure

---

✅ Following these rules keeps the codebase scalable, readable, and refactor-friendly.
