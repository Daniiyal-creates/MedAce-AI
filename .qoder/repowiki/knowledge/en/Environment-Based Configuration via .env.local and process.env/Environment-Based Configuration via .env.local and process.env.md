---
kind: configuration_system
name: Environment-Based Configuration via .env.local and process.env
category: configuration_system
scope:
    - '**'
source_files:
    - Next-app/.env.local
    - Next-app/src/lib/supabase/client.ts
    - Next-app/src/lib/supabase/server.ts
    - Next-app/src/lib/supabase/middleware.ts
    - Next-app/src/lib/gemini/client.ts
    - Next-app/drizzle.config.ts
    - Next-app/next.config.ts
---

## Overview

The MedAce AI Next.js application uses a minimal, environment-variable-driven configuration system. There is no centralized config module or schema validator; instead, each integration layer reads `process.env` directly at startup or request time.

## Environment Variables

All runtime secrets and service endpoints are declared in `Next-app/.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase client URL and anonymous key (browser-accessible).
- `SUPABASE_SERVICE_ROLE_KEY` — server-side Supabase admin key (not prefixed `NEXT_PUBLIC_`).
- `GOOGLE_GEMINI_API_KEY` — Google Gemini API key for question/explanation/study-plan generation.
- `DATABASE_URL` — PostgreSQL connection string used by Drizzle Kit migrations.

The file ships with placeholder values (`your_supabase_url_here`, etc.) so developers must replace them before running.

## Where Config Is Consumed

- **Supabase clients** (`src/lib/supabase/client.ts`, `server.ts`, `middleware.ts`) read `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` directly from `process.env`. The browser client constructor validates that both variables are present and not the placeholder strings, throwing an explicit error instructing the developer to set them in `.env.local`.
- **Gemini client** (`src/lib/gemini/client.ts`) reads `GOOGLE_GEMINI_API_KEY` and appends it as a query parameter to the Gemini REST endpoint URL.
- **Drizzle CLI** (`drizzle.config.ts`) reads `DATABASE_URL` from `process.env` to connect to Postgres for schema migration/seed commands.
- **Next.js build config** (`next.config.ts`) is empty — no custom env-based options are injected at build time.

## Conventions Observed

1. **Public vs private env vars follow Next.js conventions**: anything consumed on the client side is prefixed with `NEXT_PUBLIC_`; server-only secrets like `SUPABASE_SERVICE_ROLE_KEY` and `DATABASE_URL` are not prefixed.
2. **No config abstraction layer**: there is no single `config.ts` or typed config object. Each module reads `process.env` where it needs it, which means the same variable can be referenced in multiple files without a central source of truth.
3. **Placeholder validation at runtime**: the Supabase browser client explicitly checks for the default placeholder value and throws a descriptive error if `.env.local` has not been configured, rather than failing silently.
4. **Hardcoded defaults for non-secret settings**: the Gemini API base URL (`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`) and all UI/business constants (subjects, difficulty levels, routes) live in `src/lib/constants.ts` as `as const` exports — they are not configurable at runtime.
5. **No feature flags or per-environment config files**: there are no separate `.env.production`, `.env.development`, or YAML/TOML config files. All variation is expected to come from different `.env.local` contents per deployment.

## Constraints & Gaps

- There is no schema validation (e.g., Zod) over environment variables beyond the one placeholder check in the Supabase client; missing or malformed env vars will surface as runtime errors deep in the call stack.
- `DATABASE_URL` is only consumed by the Drizzle CLI (`drizzle.config.ts`); it is not loaded into the application runtime code paths visible here, so its presence is enforced only when running `drizzle` commands.
- No build-time env injection is configured in `next.config.ts`, so all configuration is evaluated at runtime.