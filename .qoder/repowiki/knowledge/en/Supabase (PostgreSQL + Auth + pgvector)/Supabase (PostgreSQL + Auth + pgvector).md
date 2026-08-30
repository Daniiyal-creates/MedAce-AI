---
kind: external_dependency
name: Supabase (PostgreSQL + Auth + pgvector)
slug: supabase
category: external_dependency
category_hints:
    - vendor_identity
    - auth_protocol
scope:
    - '**'
---

### Supabase
- Role: Backend platform for MedAce AI — provides PostgreSQL database, authentication (Google OAuth), storage, and the pgvector extension used as the vector store for RAG retrieval of textbook chunks.
- Integration points: `src/lib/supabase/client.ts` (browser client), `src/lib/supabase/server.ts` (server client), Drizzle ORM schema under `src/lib/drizzle/schema.ts`, and the `textbook_chunks` table that holds chunked FSc Biology textbook content with embeddings.
- Durable usage model: Supabase is the single backend service; auth uses Google OAuth via Supabase Auth, data persistence goes through Drizzle against a Supabase-hosted PostgreSQL instance, and similarity search over textbook chunks uses pgvector cosine similarity to retrieve top-K relevant chunks before prompting Gemini.
- Secrets are injected via environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`).
- Verify exact API/params against official Supabase docs.