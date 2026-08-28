---
kind: external_dependency
name: Supabase — Postgres + Auth + Storage backend
slug: supabase
category: external_dependency
category_hints:
    - vendor_identity
    - auth_protocol
scope:
    - '**'
source_files:
    - Next-app/src/lib/supabase/client.ts
    - Next-app/src/lib/supabase/server.ts
    - Next-app/src/lib/supabase/middleware.ts
    - Next-app/drizzle.config.ts
---

MedAce AI uses Supabase as the unified backend for authentication, PostgreSQL database, and file storage.
- Client is split into browser (`src/lib/supabase/client.ts`) and server (`src/lib/supabase/server.ts`) instances via `@supabase/ssr`, consumed by Next.js App Router pages and API routes.
- Authentication is handled through Supabase Auth with Google OAuth buttons in `src/components/auth/OAuthButtons.tsx`; a custom `AuthProvider` wraps the app and a `middleware.ts` enforces route-level auth guards.
- Database access goes through Drizzle ORM against the Sup postgres instance configured in `drizzle.config.ts` (dialect: `postgresql`, schema at `src/lib/drizzle/schema.ts`).
- Secrets are injected via environment variables; the client is made resilient to missing config so the project builds without real credentials.
- Verify exact Supabase client initialization and RLS policy setup against the official Supabase JS SDK docs.