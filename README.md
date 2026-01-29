# Articlify

**Modern blog platform built with Next.js 16, React 19, tRPC, and shadcn/ui**

---

## Architecture

This is a fully modernized Next.js application featuring:

- **Next.js 16** with App Router (full migration from Pages Router)
- **React 19** with Server Components
- **Auth.js v5 (NextAuth v5)** for authentication
- **tRPC** for end-to-end type-safe APIs
- **shadcn/ui** + **Tailwind CSS** for modern UI
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

### Backend
- tRPC for type-safe APIs
- Auth.js v5 (NextAuth)
- MongoDB with Mongoose
- Clean architecture (Routers → Services → Repositories)

### Infrastructure
- Docker Compose (MongoDB + MinIO)
- S3-compatible storage (MinIO local / AWS S3 production)
- Modern ESLint (flat config)
- Prettier with Tailwind plugin

## Features

- ✅ Article CRUD operations with rich-text editor (EditorJS)
- ✅ User authentication and authorization
- ✅ Role-based access control (user/admin)
- ✅ Image upload to S3/MinIO
- ✅ Article search and filtering
- ✅ Category-based organization
- ✅ Tag system
- ✅ Pagination
- ✅ Static Site Generation (SSG) with ISR for article pages
- ✅ Dark/light theme support
- ✅ Responsive design

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

```
articlify/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth route group (login, register)
│   ├── (protected)/         # Protected routes (dashboard, editor)
│   ├── api/                 # API routes
│   │   ├── auth/           # Auth.js handlers
│   │   └── trpc/           # tRPC endpoint
│   ├── layout.tsx          # Root layout with providers
│   └── page.tsx            # Home page
├── components/              # React components
│   ├── ui/                 # shadcn/ui components
│   ├── ArticleList/
│   ├── ArticleItem/
│   ├── Editor/             # EditorJS wrapper
│   └── ...
├── server/                  # tRPC backend
│   ├── routers/            # tRPC routers
│   ├── services/           # Business logic
│   └── repositories/       # Data access layer
├── lib/                     # Utilities and helpers
│   ├── server/             # Server-side utilities
│   │   └── storage/        # S3/MinIO abstraction
│   ├── trpc/               # tRPC client/server
│   └── ...
├── providers/              # React context providers
├── auth.ts                 # Auth.js configuration
├── middleware.ts           # Route protection
└── docker-compose.yml      # Local infrastructure
```

## tRPC API

The application uses tRPC for type-safe API communication. Example usage:

### Client-side

```typescript
'use client';
import { trpc } from '~/lib/trpc/client';

export function MyComponent() {
  const { data, isLoading } = trpc.article.list.useQuery({ page: 1 });
  const createMutation = trpc.article.create.useMutation();
  
  // ...
}
```

### Server-side

```typescript
import { createServerCaller } from '~/lib/trpc/server';

export default async function Page() {
  const caller = await createServerCaller();
  const articles = await caller.article.list({ page: 1 });
  
  return <div>{/* render articles */}</div>;
}
```

## Available Scripts

```bash
yarn dev          # Start development server
yarn build        # Build for production
yarn start        # Start production server
yarn lint         # Run ESLint
yarn lint:fix     # Fix ESLint errors
yarn format       # Format code with Prettier
yarn format:check # Check code formatting
yarn type-check   # Run TypeScript type checking
yarn docker:up    # Start Docker services
yarn docker:down  # Stop Docker services
yarn docker:logs  # View Docker logs
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

Or deploy to platforms like Vercel, Netlify, or AWS:

```bash
# Vercel
vercel deploy --prod

# Or configure your preferred deployment platform
```

## Migration Status

This project has been fully migrated from:
- Pages Router → App Router
- NextAuth v4 → Auth.js v5
- REST API → tRPC
- Custom components → shadcn/ui
- SCSS → Tailwind CSS
- Cloudinary → S3/MinIO

### Completed
- ✅ Docker infrastructure setup
- ✅ Modern ESLint + Prettier configuration
- ✅ Auth.js v5 with MongoDB adapter
- ✅ Middleware for route protection
- ✅ tRPC with clean architecture
- ✅ S3 storage abstraction (MinIO/AWS S3)
- ✅ shadcn/ui components
- ✅ App directory structure
- ✅ Core pages migration (home, login, register, dashboard)
- ✅ Component updates (SmartList, ArticleList, ArticleItem, TagsList)

### To Complete
- Editor page migration with EditorJS
- Article detail pages with SSG
- Category pages
- User articles page
- Header and Footer components migration
- UserMenu with shadcn DropdownMenu
- Complete SCSS removal
- Full testing and QA

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and formatting: `yarn lint:fix && yarn format`
5. Submit a pull request

## License

MIT

## Author

Built with ❤️ using modern Next.js stack
