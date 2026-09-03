---
kind: business_term
name: Business Glossary
category: business_term
scope:
    - '**'
---

### MDCAT
- Definition：Medical and Dental College Admission Test — the standardized entrance exam that MedAce AI prepares students for; all generated MCQs, topics, and chapters are scoped to the MDCAT syllabus.

### RAG
- Definition：Retrieval-Augmented Generation used to ground Gemini-generated MCQs: textbook PDFs are chunked and embedded, then relevant chunks are retrieved via a Supabase vector search (`match_chunks` RPC) before prompting the LLM to create questions.
- Aliases：vector RAG

### Quiz Session
- Definition：A single run of generated MCQs identified by a UUID (`sessionId`); it records topic, chapter number, difficulty, total questions, status (`in-progress`), answers, and timing, and is persisted to the `quiz_sessions` table when the user is authenticated.
- Aliases：session

### Chapter Question Generator
- Definition：Local fallback generator in `lib/chapter-questions.ts` that produces MCQs from an embedded static dataset when the Gemini API key is not configured or the AI call fails; used as a safety net so quizzes still work offline.
- Aliases：chapter questions、fallback generator

### Textbook Reader
- Definition：Module (`lib/textbook-reader.ts`) that loads pre-extracted chapter text files from `rag/textbooks/` (one `.txt` per chapter) and concatenates them into context passed to Gemini for MCQ generation.
- Aliases：textbook context

### MedAce AI
- Definition：Internal product name of this project — a Next.js SaaS-style web application for MDCAT preparation that generates practice MCQs with bilingual (English/Urdu) explanations powered by Google Gemini and Supabase.
