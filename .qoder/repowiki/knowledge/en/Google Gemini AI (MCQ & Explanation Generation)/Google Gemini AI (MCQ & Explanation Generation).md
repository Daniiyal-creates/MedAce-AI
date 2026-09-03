---
kind: external_dependency
name: Google Gemini AI (MCQ & Explanation Generation)
slug: google-gemini-ai
category: external_dependency
category_hints:
    - vendor_identity
    - sdk_real_api
scope:
    - '**'
---

Google's Generative AI SDK (`@google/generative-ai`) powers two flows:
- `generateEmbedding`: creates text embeddings used as query vectors for the Supabase `match_chunks` vector search.
- `generateJSON`: prompts Gemini-2.0-flash to produce structured JSON of MDCAT MCQs (question text, four options A–D, correct answer, English and Urdu explanations) from textbook context plus optional RAG chunks.
- If the API key is missing or the call fails, the route falls back to the local chapter-question generator in `lib/chapter-questions.ts`.
- Confirm the exact model name and prompt schema against the current Gemini SDK docs.