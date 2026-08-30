---
kind: configuration_system
name: Next.js Environment-Based Configuration via .env and next.config.ts
category: configuration_system
scope:
    - '**'
source_files:
    - .env.example
    - next.config.ts
    - package.json
    - README.md
---

## What system/approach is used

The application uses Next.js's built-in environment variable configuration. There is no custom config loader, YAML/JSON config files, or feature-flag framework. Runtime configuration is provided entirely through `.env` files (with a `.env.example` template) and consumed via `process.env` / `NEXT_PUBLIC_*` variables, which Next.js injects at build time.

## Key files and packages

- `.env.example` — the single source of truth for required environment variables; documents every secret and public setting that must be copied into a local `.env` file.
- `next.config.ts` — Next.js runtime configuration file where server-level settings (security headers) are declared; it does not read env vars but is part of the app's configuration surface.
- `package.json` — defines scripts (`dev`, `build`, `start`, `lint`) that drive how the environment is loaded by Next.js during each phase.
- `README.md` (Environment Variables section, lines ~232–243) — documents the same set of variables as `.env.example` and explains their purpose.

## Architecture and conventions

### Variable categories

`.env.example` groups variables into four logical categories:

1. **Supabase** — `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (client-side), `SUPABASE_SERVICE_ROLE_KEY` (server-only).
2. **Database** — `DATABASE_URL` for Drizzle ORM connection to PostgreSQL.
3. **Google Gemini** — `GEMINI_API_KEY` for AI-powered MCQ generation.
4. **App** — `NEXT_PUBLIC_APP_URL` for client-facing URLs.

### Public vs. private variables

The project follows Next.js convention: any variable prefixed with `NEXT_PUBLIC_` is baked into the browser bundle and can be read from client code; all other variables remain server-only. This is the only mechanism used to distinguish client-accessible configuration from secrets.

### Build-time injection

Configuration is loaded by Next.js itself — there is no custom initialization in `src/`. The `dev`, `build`, and `start` scripts in `package.json` delegate to Next.js, which automatically reads `.env`, `.env.local`, `.env.development`, etc., based on the active script. No explicit `loadEnvConfig` or `dotenv` usage was found in the codebase.

### Server configuration

`next.config.ts` is the only place where non-env application behavior is configured. It sets security-related HTTP headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`) via the `headers()` hook. It contains no dynamic logic or env-var branching.

## Conventions and constraints

- All required environment variables are documented in `.env.example`; developers are expected to copy this file to `.env` before running the app.
- Secrets (service role key, database URL, Gemini API key) are never prefixed with `NEXT_PUBLIC_`, keeping them server-only by convention.
- Client-facing endpoints and base URLs use the `NEXT_PUBLIC_` prefix so they can be consumed in React components without additional indirection.
- There is no validation layer around environment variables (no Zod schemas applied to `process.env`); correctness relies on the developer providing correctly formatted values.
- There are no per-environment config files (e.g., `.env.production`, `.env.development`) present in the repo; the pattern supports them via Next.js defaults but none are committed.
- Application behavior beyond security headers is not configurable at runtime — features like Supabase, Drizzle, and Gemini integration are wired directly through their SDKs using env vars, with no feature flags or toggleable configuration.