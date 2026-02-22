# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev           # Start development server
yarn build         # Build for production
yarn test          # Run tests (Vitest, jsdom env)
yarn test:watch    # Run tests in watch mode
yarn lint          # Run ESLint
yarn lint:fix      # Fix ESLint errors
yarn type-check    # TypeScript check (tsc --noEmit)
yarn docker:up     # Start MongoDB + MinIO via Docker Compose
yarn docker:down   # Stop Docker services
yarn email:dev     # Preview emails at localhost:3001
```

To run a single test file:
```bash
yarn vitest run src/path/to/file.test.ts
```

## Architecture

This is a **Next.js 16 App Router** app using **Feature-Sliced Design (FSD) v2.1**. The package manager is **Yarn 4**.

### Path aliases
- `~/*` → `./src/*`
- `app/*` → `./app/*`
- `i18n/*` → `./i18n/*`
- `server/*` → `./server/*`

### Layer map

```
root/app/        → Next.js routing glue ONLY (page.tsx, layout.tsx)
src/app/         → App init: global providers (tRPC, theme, i18n)
src/views/       → Page-level orchestration (data fetch + widget assembly)
src/widgets/     → Large reusable UI blocks (header, editor, smart-list)
src/features/    → User-action slices (auth, avatar, article CRUD)
src/entities/    → Domain slices: article, user, tag (model/api/ui)
src/shared/      → Context-agnostic: ui primitives, lib, config, types
server/          → tRPC root (context, procedures, appRouter)
```

**Import direction is strictly top → bottom.** No upward or sideways cross-slice imports. `shared` must not import from any other layer.

### FSD slice structure

Each entity/feature follows:
```
slice-name/
  model/   # types, schemas, Zod validators
  api/     # repository, service, tRPC router
  ui/      # React components for that slice
```

### Backend data flow

tRPC procedures in `server/` call `entities/<name>/api/<name>.router.ts` → `<name>.service.ts` → `<name>.repository.ts` (Mongoose).

Three procedure types in `server/trpc.ts`:
- `publicProcedure` — open
- `protectedProcedure` — requires `ctx.session`
- `adminProcedure` — requires `role === 'admin'`

tRPC app router is assembled at `server/routers/index.ts` (`article`, `user`).

### tRPC client usage

Client component:
```typescript
import { trpc } from '~/shared/api/trpc/client';
const { data } = trpc.article.list.useQuery({ page: 1 });
```

Server component:
```typescript
import { createServerCaller } from '~/shared/api/trpc/server';
const caller = await createServerCaller();
const articles = await caller.article.list({ page: 1 });
```

### Auth

**Better Auth** (`better-auth`) handles authentication. Config lives at `auth.ts` (root). API route at `app/api/auth/[...all]/`. Client helpers at `src/shared/api/auth-client.ts`.

### Environment config

Server env is validated with Zod at startup via `src/shared/config/env/server.ts` → `getServerConfig()`. All server code should use this instead of `process.env` directly. Required vars: `MONGODB_URI`, `BETTER_AUTH_SECRET`.

### Emails

React Email templates live in `src/shared/emails/`. The mailer package is `@basedest/mailer`. In development, `MAILER_PROVIDER=log` prints emails to the console; set `MAILER_PROVIDER=resend` with `RESEND_API_KEY` for real sending. Preview with `yarn email:dev`.

### i18n

`next-intl` with locale-based routing under `app/[locale]/`. Routing config in `i18n/`. All user-facing text must go through translation keys.

### Testing

Vitest with jsdom. Tests live alongside source as `*.test.ts(x)` inside `src/`. Setup file: `src/shared/test/setup.ts`. MSW is available for API mocking.

## Key conventions

- Folders: `kebab-case`. Components: `kebab-case` (older components may be `PascalCase`, but new ones should be `kebab-case`). Hooks: `useXxx`.
- Views: ≤ ~150 LOC. `root/app` files: ≤ ~30 LOC.
- All new business logic belongs in a service; routers only validate input and call services.
- Do not add logic to `root/app` pages — delegate to a `src/views` component.
- Do not create a generic `components/` folder; use the appropriate FSD layer.
- Commit messages follow Conventional Commits (enforced by commitlint).
