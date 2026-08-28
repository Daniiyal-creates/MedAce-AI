---
kind: external_dependency
name: Google Gemini API — MDCAT question & explanation generator
slug: google-gemini-api
category: external_dependency
category_hints:
    - vendor_identity
    - sdk_real_api
scope:
    - '**'
source_files:
    - Next-app/src/lib/gemini/client.ts
    - Next-app/src/lib/gemini/prompts.ts
    - Next-app/src/app/api/quiz/generate/route.ts
---

The quiz engine calls Google's Gemini API to generate MDCAT Biology questions, explanations, and Urdu-language study plans.
- A dedicated Gemini client lives under `src/lib/gemini/client.ts` with prompt templates in `prompts.ts`; it is invoked from the `/api/quiz/generate` route handler.
- The conversation established Gemini over OpenAI because of strong multilingual/Urdu performance and a generous free tier for prototyping.
- API keys are expected via environment variables; the client must be guarded on the server side since LLM calls cannot run in the browser.
- Verify exact model name, streaming vs non-streaming call shape, and rate limits against the official Google AI / Gemini documentation.