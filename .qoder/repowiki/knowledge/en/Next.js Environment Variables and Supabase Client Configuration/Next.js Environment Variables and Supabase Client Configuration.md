---
kind: configuration_system
name: Next.js Environment Variables and Supabase Client Configuration
category: configuration_system
scope:
    - '**'
source_files:
    - .env.example
    - src/lib/supabase/client.ts
    - src/lib/supabase/server.ts
    - src/lib/supabase/admin.ts
    - scripts/ingest-textbooks.ts
    - scripts/check-chunks.ts
    - next.config.ts
    - src/middleware.ts
    - package.json
---

## What system/approach is used

MedAce AI uses a **plain `.env`-based configuration** driven by Next.js's built-in environment variable loading. There is no dedicated config module, YAML/JSON config files, or feature-flag library. All runtime configuration is supplied via `process.env`, with values declared in `.env.example` and consumed directly at the point of use (Supabase clients, API routes, CLI scripts). The project also ships a small custom `.env` loader for Node scripts that run outside Next.js.

## Key files and packages

- `.env.example` — single source of truth for all required environment variables; documents every secret and public key needed to run the app.
- `src/lib/supabase/client.ts` — browser-side Supabase client factory using `@supabase/ssr`'s `createBrowserClient`, reading `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- `src/lib/supabase/server.ts` — server-side Supabase client factory using `createServerClient`, wired to Next.js `cookies()` for session handling; reads the same `NEXT_PUBLIC_*` env vars.
- `src/lib/supabase/admin.ts` — admin client using `SUPABASE_SERVICE_ROLE_KEY`; disables session persistence and token refresh since it runs on the server.
- `scripts/ingest-textbooks.ts` and `scripts/check-chunks.ts` — Node scripts that implement their own `.env.local` / `.env` loader (`loadEnv()`) because they execute outside Next.js's automatic env injection.
- `next.config.ts` — Next.js build/runtime configuration (security headers); no env-driven toggles here.
- `src/middleware.ts` — route protection list is hard-coded; no env-based allow/deny lists.
- `package.json` — defines dev/build/start scripts but no env-specific script variants.

## Architecture and conventions

1. **Environment variable naming follows Next.js conventions.**
   - Public keys are prefixed `NEXT_PUBLIC_` so they are bundled into the browser client (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_APP_URL`).
   - Server-only secrets use plain names (`SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, `GEMINI_API_KEY`) and are only read inside server components, API routes, and scripts.

2. **Configuration is consumed at the boundary, not centralized.**
   - Each Supabase client file (`client.ts`, `server.ts`, `admin.ts`) reads `process.env` directly when constructing its client. There is no shared `config.ts` or `env.ts` module that parses or validates env vars before distribution.

3. **Fallback defaults are provided inline.**
   - When env vars are missing, code falls back to placeholder strings (e.g. `"https://placeholder.supabase.co"`, `"placeholder-key"`). This prevents crashes during development but means misconfiguration may surface as runtime errors rather than startup failures.

4. **CLI scripts load `.env` manually.**
   - `scripts/ingest-textbooks.ts` implements a `loadEnv()` helper that scans `.env.local` then `.env`, parses each line with a regex, strips surrounding quotes, and injects values into `process.env` if not already set. `scripts/check-chunks.ts` does the same pattern. This is necessary because these scripts are invoked via `tsx` outside the Next.js runtime.

5. **No runtime feature flags or layered config.**
   - There is no mechanism to toggle features per environment (dev/staging/prod) other than swapping `.env` files. Route protection logic in `src/middleware.ts` is hard-coded arrays of protected/public paths.

6. **Build-time vs runtime separation via `NEXT_PUBLIC_` prefix.**
   - Only variables prefixed `NEXT_PUBLIC_` are exposed to the browser bundle; secrets like `SUPABASE_SERVICE_ROLE_KEY` and `GEMINI_API_KEY` are intentionally kept server-only.

## Conventions and constraints

- **All required variables are documented in `.env.example`** — anyone setting up the project should copy this file and fill in values. It enumerates Supabase URL/anon/service-role keys, the PostgreSQL `DATABASE_URL`, `GEMINI_API_KEY`, and `NEXT_PUBLIC_APP_URL`.
- **Secrets must never be committed.** `.gitignore` excludes `.env*` files (inferred from standard practice and the presence of `.env.example`); the repo ships only the template.
- **Admin and user clients are separated by purpose.** `server.ts` uses the anon key with cookie/session support for authenticated requests; `admin.ts` uses the service role key with sessions disabled for privileged operations (used by the ingestion pipeline).
- **Missing env vars produce placeholder clients, not validation errors.** The code does not throw at import time if an env var is absent; instead it constructs clients with placeholder values, which will fail later when network calls are attempted. This is a soft constraint — there is no startup validation step.
- **Scripts rely on `process.cwd()` for locating `.env` files.** The custom loader resolves `.env.local` and `.env` relative to the current working directory, so scripts must be executed from the repository root.
- **Next.js security headers are statically defined.** `next.config.ts` sets `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy` for all routes; these are not configurable via env vars.