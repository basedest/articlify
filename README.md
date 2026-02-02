# Articlify

**Modern blog platform built with Next.js 16, React 19, tRPC, and shadcn/ui**

---

## Architecture

This is a fully modernized Next.js application featuring:

- **Next.js 16** with App Router
- **React 19** with Server Components
- **Auth.js v5 (NextAuth v5)** for authentication
- **tRPC** for end-to-end type-safe APIs
- **shadcn/ui** + **Tailwind CSS** for UI
- **Feature-Sliced Design (FSD)** for code organization 
- **next-intl** for internationalization (i18n)
- **MongoDB** for data storage
- **S3-compatible storage** (MinIO for local, AWS S3 for production)
- **Docker Compose** for local infrastructure

## Tech Stack

### Frontend
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui components
- React Hook Form + Zod validation
- **Tiptap** for rich-text editing (replaces EditorJS)
- next-intl for i18n
- next-themes for dark/light theme

### Backend
- tRPC for type-safe APIs
- Auth.js v5 (NextAuth)
- MongoDB with Mongoose
- Clean architecture (Routers → Services → Repositories)

### Infrastructure
- Docker Compose (MongoDB + MinIO)
- S3-compatible storage (MinIO local / AWS S3 production)
- ESLint (flat config)
- Prettier with Tailwind plugin
- Vitest for tests
- Husky + lint-staged + commitlint

## Features

- ✅ Article CRUD with rich-text editor (Tiptap)
- ✅ User authentication and authorization
- ✅ Role-based access control (user/admin)
- ✅ Image upload to S3/MinIO
- ✅ Article search and filtering (SmartList)
- ✅ Category-based organization
- ✅ Tag system
- ✅ Pagination
- ✅ Internationalization (i18n)
- ✅ Dark/light theme support
- ✅ Responsive design
- ✅ User avatar upload

## Getting Started

### Prerequisites

- Node.js 18+ and Yarn 4.x
- Docker and Docker Compose
- MongoDB (via Docker)
- MinIO (via Docker) or AWS S3 credentials

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd articlify
```

2. **Install dependencies**

```bash
yarn install
```

3. **Set up environment variables**

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and configure:

```bash
# Database
MONGODB_URI=mongodb://root:password@localhost:27017/articlify?authSource=admin

# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-generate-with-openssl-rand-base64-32

# Storage (Local Development - MinIO)
STORAGE_PROVIDER=minio
S3_ENDPOINT=http://localhost:9000
S3_REGION=us-east-1
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET=articlify-images
S3_PUBLIC_URL=http://localhost:9000/articlify-images
S3_FORCE_PATH_STYLE=true
```

4. **Start Docker services**

```bash
yarn docker:up
```

This starts:
- MongoDB on port 27017
- MinIO on port 9000 (API) and 9001 (Console)

5. **Run the development server**

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000)

### Docker Services

**MongoDB**: `mongodb://root:password@localhost:27017`
**MinIO Console**: http://localhost:9001 (credentials: minioadmin/minioadmin)
**MinIO API**: http://localhost:9000

To stop services:

```bash
yarn docker:down
```

To view logs:

```bash
yarn docker:logs
```

## Project Structure

The codebase follows **Feature-Sliced Design (FSD)**. High-level layout:

```
articlify/
├── app/                          # Next.js App Router (routing glue only)
│   ├── [locale]/                 # Locale-based routes (i18n)
│   │   ├── (auth)/               # Login, register
│   │   ├── (protected)/         # Dashboard, editor (auth required)
│   │   ├── [category]/          # Category listing and article by slug
│   │   ├── articles/            # Articles list, user articles by author
│   │   ├── layout.tsx
│   │   └── page.tsx             # Home
│   ├── api/                      # API routes
│   │   ├── auth/[...nextauth]/  # Auth.js
│   │   ├── trpc/[trpc]/         # tRPC endpoint
│   │   └── user/avatar/         # Avatar upload
│   ├── layout.tsx
│   └── not-found.tsx
├── src/
│   ├── app/                      # App init (providers, global styles)
│   ├── views/                    # Page orchestration (dashboard, editor, article, etc.)
│   ├── widgets/                  # Large UI blocks (header, footer, smart-list, editor, article-list)
│   ├── features/                 # User actions (auth, login, register, user-menu, avatar, i18n)
│   ├── entities/                 # Domain (article, tag, user) — API, model, UI
│   └── shared/                   # Utilities, trpc client/server, UI primitives, config
├── server/                       # tRPC root (context, trpc instance, auth router)
├── i18n/                         # next-intl (routing, request, navigation)
├── docker/
├── auth.ts                       # Auth.js config (when used from root)
├── middleware.ts
└── docker-compose.yml
```

For layer rules and where to put new code, see [AGENTS.md](./AGENTS.md).

## tRPC API

The application uses tRPC for type-safe API communication.

### Client-side

```typescript
'use client';
import { trpc } from '~/shared/api/trpc/client';

export function MyComponent() {
  const { data, isLoading } = trpc.article.list.useQuery({ page: 1 });
  const createMutation = trpc.article.create.useMutation();
  // ...
}
```

### Server-side

```typescript
import { createServerCaller } from '~/shared/api/trpc/server';

export default async function Page() {
  const caller = await createServerCaller();
  const articles = await caller.article.list({ page: 1 });
  return <div>{/* render articles */}</div>;
}
```

## Available Scripts

```bash
yarn dev           # Start development server
yarn build         # Build for production
yarn start         # Start production server
yarn test          # Run tests (Vitest)
yarn test:watch    # Run tests in watch mode
yarn lint          # Run ESLint
yarn lint:fix      # Fix ESLint errors
yarn type-check    # TypeScript check
yarn docker:up     # Start Docker services
yarn docker:down   # Stop Docker services
yarn docker:logs   # View Docker logs
```

## Production Deployment

### AWS S3 Setup

For production, update your `.env`:

```bash
STORAGE_PROVIDER=s3
S3_REGION=us-east-1
S3_ACCESS_KEY=<your-aws-access-key>
S3_SECRET_KEY=<your-aws-secret-key>
S3_BUCKET=articlify-production
S3_PUBLIC_URL=https://articlify-production.s3.amazonaws.com
S3_FORCE_PATH_STYLE=false
```

### Build and Deploy

```bash
yarn build
yarn start
```

Or deploy to Vercel, Netlify, or other platforms (e.g. `vercel deploy --prod`).

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting: `yarn lint:fix`
5. Run tests: `yarn test`
6. Submit a pull request

## License

MIT

## Author

Built with ❤️ using modern Next.js stack
