---
kind: build_system
name: Next.js App Router Build & Dev Toolchain
category: build_system
scope:
    - '**'
source_files:
    - Next-app/package.json
    - Next-app/tsconfig.json
    - Next-app/next.config.ts
    - Next-app/drizzle.config.ts
    - Next-app/.env.local
    - Next-app/eslint.config.mjs
    - Next-app/postcss.config.mjs
---

## Build System Overview

This repository is a Next.js 15/16 App Router application built entirely with the standard Next.js toolchain. There are no custom Makefiles, Dockerfiles, shell build scripts, or CI pipelines in the repository — the build system is defined by package.json scripts and Next.js conventions.

## Build Tools and Scripts

The build surface is minimal and centered on Next-app/package.json:
- npm run dev -> next dev (development server)
- npm run build -> next build (production build output to .next/)
- npm run start -> next start (serve production build)
- npm run lint -> eslint (linting via eslint.config.mjs)

There are no custom build hooks, pre/post scripts, environment-specific build variants, or artifact publishing steps.

## TypeScript Compilation

TypeScript compilation is delegated to Next.js via the next tsconfig plugin (tsconfig.json, compilerOptions.plugins[0].name = "next"). Key settings:
- target: ES2017, module: esnext, moduleResolution: bundler
- strict: true, noEmit: true (Next.js emits its own output)
- Path alias @/* -> ./src/* for imports
- Incremental compilation enabled
- Includes generated types under .next/types/** and .next/dev/types/**

## Database Migration Build Step

Database schema management uses Drizzle Kit (drizzle-kit) configured in drizzle.config.ts:
- Schema source: ./src/lib/drizzle/schema.ts
- Output directory: ./drizzle/
- Dialect: postgresql
- Requires DATABASE_URL from environment at migration time

Migrations are run via drizzle-kit CLI commands (e.g., drizzle-kit generate, drizzle-kit migrate), not via npm scripts in this repo.

## Environment Configuration

Runtime configuration is expected in .env.local (gitignored) with these keys:
- NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY (client-facing Supabase config)
- SUPABASE_SERVICE_ROLE_KEY (server-side Supabase admin key)
- GOOGLE_GEMINI_API_KEY (AI model access)
- DATABASE_URL (PostgreSQL connection string for Drizzle)

No separate staging/production env files exist in the repo; environment variables are injected at runtime by the hosting platform.

## Linting and Styling Pipeline

- Linting: ESLint 9 via eslint.config.mjs with eslint-config-next preset
- CSS: Tailwind CSS v4 with PostCSS (postcss.config.mjs, @tailwindcss/postcss)
- No dedicated build step for styles — Tailwind processes CSS through Next.js's PostCSS integration during dev/build.

## Deployment Target

The project targets the Next.js standalone/serverless deployment model (no custom server). The .next/ build output is produced by next build. No Dockerfile or containerization exists in the repo. The README references Vercel as the intended host.

## Conventions Observed

- All build logic lives in package.json scripts; no external build orchestration.
- TypeScript is strictly enforced but compiled by Next.js, not tsc directly.
- Environment variables follow Next.js convention: NEXT_PUBLIC_* for client-exposed values, plain names for server-only secrets.
- Database schema and migrations are decoupled from the app build via Drizzle Kit.
- No version pinning of Node.js or Next.js major versions beyond what package.json specifies.