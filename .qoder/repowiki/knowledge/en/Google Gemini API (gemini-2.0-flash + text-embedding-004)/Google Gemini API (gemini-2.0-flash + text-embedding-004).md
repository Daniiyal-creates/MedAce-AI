---
kind: external_dependency
name: Google Gemini API (gemini-2.0-flash + text-embedding-004)
slug: google-gemini-api
category: external_dependency
category_hints:
    - vendor_identity
    - sdk_real_api
scope:
    - '**'
---

### Google Gemini API
- Role: LLM provider for MedAce AI — `gemini-2.0-flash` generates MCQs, Urdu explanations, and adaptive study plans; `text-embedding-004` produces 768-dim vectors used by the RAG pipeline to embed textbook chunks stored in Supabase pgvector.
- Integration points: `src/lib/gemini/client.ts` (API wrapper), `src/lib/gemini/prompts.ts` (prompt templates for MCQ generation and Urdu explanation), and the RAG query-time flow that retrieves top-5 chunks from pgvector then prompts Gemini with retrieved context to produce structured MCQ JSON validated by Zod.
- Durable usage model: A single `GEMINI_API_KEY` env var powers both generation and embedding; the same key is reused across build-time indexing (`rag/scripts/embed.ts`) and runtime MCQ generation (`src/app/api/quiz/generate/route.ts`).
- The choice over GPT-4o is deliberate for faster/cheaper calls, multilingual (Urdu) output quality, and a large context window.
- Verify exact method/param names against the official @google/generative-ai SDK docs.