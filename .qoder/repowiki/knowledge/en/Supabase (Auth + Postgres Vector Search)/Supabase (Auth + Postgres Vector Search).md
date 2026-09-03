---
kind: external_dependency
name: Supabase (Auth + Postgres Vector Search)
slug: supabase
category: external_dependency
category_hints:
    - vendor_identity
    - sdk_real_api
scope:
    - '**'
---

Supabase is used as both the authentication provider and the managed PostgreSQL database with vector search.
- Auth: client-side auth via `@supabase/supabase-js` (`createClient`) in server routes; SSR helper via `@supabase/ssr`; Google OAuth callback handled in `src/app/auth/callback/route.ts`.
- Database: admin client (`supabaseAdmin`) writes quiz sessions and questions into `quiz_sessions`, `quiz_questions` tables; a Supabase RPC `match_chunks` performs vector similarity search against an embeddings table for RAG-backed question generation.
- The DB schema lives under `supabase/schema.sql` and is managed via Drizzle ORM (`drizzle-orm`, `drizzle-kit`).
- Verify exact table/column names and RPC signature against the deployed Supabase project.