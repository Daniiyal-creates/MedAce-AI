---
kind: build_system
name: Next.js App Router Build, Scripts & Vercel Deployment
category: build_system
scope:
    - '**'
source_files:
    - package.json
    - next.config.ts
    - tsconfig.json
    - postcss.config.mjs
    - eslint.config.mjs
    - scripts/ingest-textbooks.ts
    - scripts/check-chunks.ts
    - supabase/schema.sql
    - requirements.txt
    - README.md
---

## What system/approach is used

The project is a single Next.js (App Router) application built and deployed via the standard Next.js toolchain. There is no custom Makefile, Dockerfile, or CI pipeline in the repository; build, lint, dev, and start commands are defined as npm scripts in `package.json` and rely on `next build`, `next dev`, and `next start`. Deployment is documented as **Vercel** — zero-config Next.js deployment — with environment variables configured through Vercel's project settings.

A small set of Node/TypeScript CLI scripts under `scripts/` (`ingest-textbooks.ts`, `check-chunks.ts`) are executed directly with `tsx` to perform RAG data ingestion from `rag/textbooks/*.txt` into Supabase using Gemini embeddings. These scripts load `.env.local` / `.env` at runtime rather than relying on Next.js env injection.

## Key files and packages

- `package.json` — defines the four npm scripts (`dev`, `build`, `start`, `lint`) and pins all runtime and dev dependencies (Next.js 15, React 19, TypeScript 5, Tailwind CSS 4, Drizzle ORM, Supabase JS, Zod, Framer Motion, etc.).
- `next.config.ts` — configures Next.js security headers (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation()`) applied to all routes via an async `headers()` hook.
- `tsconfig.json` — strict TypeScript configuration targeting ES2017, `noEmit: true` (Next.js handles compilation), `moduleResolution: bundler`, path alias `@/* → ./src/*`, and includes generated types under `.next/types`.
- `postcss.config.mjs` and `eslint.config.mjs` — PostCSS/Tailwind and ESLint configuration for the build pipeline.
- `scripts/ingest-textbooks.ts` — CLI that reads chapter `.txt` files from `rag/textbooks/`, cleans text, chunks it (~2500 chars with 400-char overlap), calls Gemini embedding API with retry/backoff on 429 rate limits, sleeps 1.5s between chunks, and upserts records into the `textbook_chunks` Supabase table.
- `scripts/check-chunks.ts` — minimal CLI that connects to Supabase and prints the row count of `textbook_chunks`.
- `supabase/schema.sql` — database schema provisioned alongside the app (used by Drizzle migrations).
- `requirements.txt` — lists the same dependency versions as `package.json` plus environment variable names; serves as a human-readable manifest of the tech stack and required env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`).
- `README.md` — documents Vercel as the deployment target and lists required environment variables.

## Architecture and conventions

- **Build pipeline**: `npm run build` invokes `next build`, which compiles the App Router pages/API routes, generates static assets, and emits the production bundle. `npm run dev` runs the development server with hot reload. `npm run start` serves the built output. `npm run lint` runs Next's built-in ESLint integration.
- **TypeScript compilation**: `noEmit: true` means TypeScript only type-checks; actual emit is delegated to Next.js. Path aliases (`@/*`) map to `src/*`, so imports use absolute paths like `@/lib/...`.
- **Security headers convention**: All routes receive the same set of restrictive security headers via `next.config.ts` `headers()`, centralizing CSP-related policy decisions.
- **CLI scripts convention**: Data-pipeline scripts live under `scripts/`, are written in TypeScript, and load their own `.env.local` / `.env` at startup using a shared pattern that parses key=value lines (with optional quoting). They exit with non-zero status on fatal errors.
- **RAG ingestion convention**: Textbook chapters follow a strict filename convention `Chapter_<N>_<Name>_extracted.txt` placed under `rag/textbooks/`; the ingestion script parses chapter numbers and names from filenames, splits content by paragraph boundaries, and stores each chunk with `chapter`, `chapter_num`, `chunk_index`, `content`, `token_count`, and `embedding` fields.
- **Environment management**: Runtime secrets are expected in `.env.local` (or `.env`) and are consumed both by Next.js (prefixed `NEXT_PUBLIC_*` for client-side access) and by CLI scripts loaded manually. The README and `requirements.txt` enumerate required variables.

## Conventions and constraints

- **No custom build scripts**: The repo does not contain `Makefile`, `Dockerfile`, `docker-compose.yml`, or GitHub Actions workflows. Build and deploy are entirely handled by Next.js/Vercel conventions.
- **Deployment target**: Per `README.md`, the intended deployment platform is **Vercel**, described as "Zero-config Next.js deploys". Environment variables must be added in Vercel project settings before deploying.
- **Strict TypeScript**: `strict: true` and `isolatedModules: true` enforce type safety and module isolation across the codebase during builds.
- **Path aliasing**: All source imports should use the `@/` alias pointing to `src/`; this is enforced by the `paths` mapping in `tsconfig.json`.
- **Security header policy**: Every route automatically receives the same deny/nosniff/referrer/permissions policy headers — new routes do not need to opt in.
- **Ingestion rate-limiting**: The textbook ingestion script hard-codes a 1.5-second delay between chunks and retries on HTTP 429 responses, reflecting a constraint tied to the free-tier Gemini API quota.
- **Version pinning**: Both `package.json` and `requirements.txt` pin major/minor versions (e.g., Next.js `^15.3.3`, React `^19.1.0`, TypeScript `^5.8.3`), keeping the two manifests in sync as a de-facto version contract.