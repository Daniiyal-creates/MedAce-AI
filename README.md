# MedAce AI

An adaptive prep coach for MDCAT (Medical and Dental College Admission Test), Pakistan's high-stakes pre-medical entrance exam. MedAce AI keeps the exam experience authentic — English interface, English MCQs — while adding an Urdu explanation layer for students who understand a concept better in Urdu than in English.

## The Problem

Millions of students prepare for MDCAT every year, and the exam decides who gets into medical school in Pakistan. Despite the stakes, most students are left to prepare with:

- **Expensive, urban-concentrated tutoring.** Quality MDCAT coaching is clustered in major cities and priced out of reach for most families. Students outside these hubs get a fraction of the same support.
- **No real personalization.** Existing apps and question banks throw the same content at every student. Nobody tells a student *what* they keep getting wrong, *why*, or what to study next — so hours of practice go into topics they've already mastered while real gaps stay unaddressed.
- **A language gap that isn't the exam's fault, but is still real.** MDCAT is conducted entirely in English, and that's not going to change — nor should it. But many students, especially those from Urdu-medium schooling backgrounds, can read an English MCQ just fine yet lose precision when the *explanation* of a concept is also delivered in dense, academic English. The concept doesn't fully land, even when the question technically makes sense to them. Existing prep tools don't address this at all.

The result: students grind through generic practice with no feedback loop, no map of their own weaknesses, and — for a large segment — an explanation layer that isn't built for how they actually think through a hard concept.

## What We're Solving

MedAce AI is built to mirror the real exam experience, not abstract away from it — and to add exactly one high-leverage layer on top: understanding.

- **Same exam, same language.** The interface and every MCQ are in English, exactly as students will encounter on test day. No translation of exam content, no shortcuts that create a gap between practice and the real thing.
- **Explanations in plain, code-mixed Urdu — when a student needs them.** When a student is stuck or repeatedly getting a concept wrong, they can get the explanation broken down in the Urdu-English mix students actually think and study in (technical terms like "enzyme" or "osmosis" stay as-is; the reasoning around them is explained in Urdu). This isn't a language toggle for its own sake — it's there to build the underlying concept, not just help them memorize English phrasing.
- **Adaptive weak-spot tracking.** The app tracks where each student is actually going wrong — by topic, by concept, by pattern of mistakes — and directs future practice there instead of serving random questions. Struggling with a specific topic repeatedly can also be the trigger that surfaces the Urdu explanation, tying the language layer directly into the adaptive engine rather than treating it as a separate feature.

## Tech Stack

### Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                        STUDENT BROWSER                           │
│   Next.js 15 App (React 19 + Tailwind CSS v4 + RTL Support)     │
│   Auth: Supabase Auth (Google OAuth)                             │
│   State: TanStack Query v5                                      │
└─────────────┬─────────────────────────────┬──────────────────────┘
              │                             │
     ┌────────▼────────┐          ┌─────────▼─────────┐
     │   API Routes     │          │  Supabase Backend  │
     │  (Server Side)   │          │                    │
     └──┬─────┬─────┬──┘          │  ┌──────────────┐ │
        │     │     │              │  │ PostgreSQL   │ │
        │     │     │              │  │ + pgvector   │ │
        │     │     │              │  └──────────────┘ │
        │     │     └──Gemini──────│  ┌──────────────┐ │
        │     │       Embeddings   │  │ Auth (OAuth) │ │
        │     │                    │  └──────────────┘ │
        │     └────Drizzle ORM─────│  ┌──────────────┐ │
        │                          │  │ Storage      │ │
        │                          │  └──────────────┘ │
        ▼                          └────────────────────┘
┌───────────────────┐
│  Google Gemini API │
│  • gemini-2.0-flash│  ← MCQ generation + Urdu explanations
│  • text-embedding   │  ← Vectorize textbook chunks
│    -004             │
└───────────────────┘
```

### Layer-by-Layer Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 15 (App Router) | Full-stack framework — pages, API routes, server components |
| **UI Runtime** | React 19 | Server + Client components |
| **Language** | TypeScript 5 | End-to-end type safety |
| **Styling** | Tailwind CSS v4 | Utility-first CSS, RTL support, `@theme inline` tokens |
| **Class Merging** | clsx + tailwind-merge | Via `cn()` helper — conflict-free class composition |
| **Icons** | lucide-react | Lightweight, tree-shakeable icon set |
| **Auth** | Supabase Auth (Google OAuth) | Student sign-in, session management |
| **Database** | Supabase PostgreSQL | Users, quiz sessions, answers, weak topics, study plans |
| **Vector Store** | Supabase pgvector | Store textbook chunk embeddings for RAG retrieval |
| **ORM** | Drizzle ORM | Type-safe DB queries + migrations |
| **State / Data Fetching** | TanStack Query v5 | Cache API responses, optimistic updates, pagination |
| **AI — Generation** | Google Gemini 2.0 Flash | MCQ generation, Urdu explanations, study plan creation |
| **AI — Embeddings** | Google text-embedding-004 | Vectorize textbook chunks (768-dim, multilingual) |
| **Validation** | Zod | Schema validation for API inputs/outputs + Drizzle types |
| **Forms** | React Hook Form + Zod | Type-safe form handling |
| **Deployment** | Vercel | Zero-config Next.js deploys |
| **Monitoring** | Vercel Analytics | Web vitals + usage tracking |

### RAG Pipeline

MedAce AI generates MCQs using Retrieval-Augmented Generation (RAG) over FSc Biology textbook content. This ensures every question is grounded in the actual MDCAT syllabus rather than hallucinated by the LLM.

#### Data Source

- **15 chapters** of FSc 12th-grade Biology textbooks (Punjab curriculum)
- Covers all MDCAT Biology domains: Human Physiology (Ch 1–8), Modern Topics (Ch 9–14), Pharmacology (Ch 15)
- ~1.7 MB of text, ~420K tokens
- Each chapter structured with Student Learning Outcome (SLO) codes for natural topic boundaries

#### Build-Time Pipeline (Indexing)

```
rag/textbooks/*.txt
       ↓
[1] TEXT CLEANER  ── Strip watermarks, page markers, fix OCR artifacts
       ↓
[2] CHUNKER  ────── Split by SLO codes + headings (~400-600 tokens/chunk, 50-token overlap)
       ↓
[3] EMBEDDER  ───── Gemini text-embedding-004 → 768-dim vectors
       ↓
[4] UPLOADER  ──── INSERT into Supabase pgvector table (textbook_chunks)
```

#### Query-Time Pipeline (MCQ Generation)

```
Student selects topic / starts practice session
       ↓
[1] Embed the query (topic + difficulty context)
       ↓
[2] pgvector cosine similarity → top 5 relevant chunks
       ↓
[3] Build Gemini prompt:
       • System: "You are an MDCAT biology MCQ generator..."
       • Context: retrieved textbook chunks
       • Instruction: generate N MCQs with 4 options each
       • Output: JSON schema (question, options, answer, explanation_en, explanation_ur)
       ↓
[4] Gemini 2.0 Flash → structured MCQ JSON
       ↓
[5] Validate with Zod → store in DB → serve to student
```

### Database Schema

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│     users        │    │   quiz_sessions   │    │    questions         │
├─────────────────┤    ├──────────────────┤    ├─────────────────────┤
│ id (uuid, PK)   │───▶│ id (uuid, PK)    │───▶│ id (uuid, PK)       │
│ email            │    │ user_id (FK)     │    │ session_id (FK)     │
│ full_name        │    │ topic            │    │ question_text        │
│ created_at       │    │ difficulty       │    │ option_a/b/c/d       │
└─────────────────┘    │ num_questions    │    │ correct_answer       │
                       │ score            │    │ explanation_en       │
                       │ status           │    │ explanation_ur       │
                       │ created_at       │    │ source_chunk_id (FK) │
                       └──────────────────┘    │ difficulty           │
                                               └─────────────────────┘
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│  user_answers    │    │  weak_topics     │    │  textbook_chunks    │
├─────────────────┤    ├──────────────────┤    ├─────────────────────┤
│ id (uuid, PK)   │    │ id (uuid, PK)    │    │ id (uuid, PK)       │
│ user_id (FK)    │    │ user_id (FK)     │    │ chapter_num          │
│ question_id(FK) │    │ topic            │    │ slo_code             │
│ selected_answer  │    │ error_count      │    │ heading              │
│ is_correct       │    │ attempt_count    │    │ chunk_text           │
│ time_taken_ms    │    │ weakness_score   │    │ embedding (vector)   │
│ created_at       │    │ last_updated     │    │ token_count          │
└─────────────────┘    └──────────────────┘    └─────────────────────┘

┌─────────────────┐
│   study_plans    │
├─────────────────┤
│ id (uuid, PK)   │
│ user_id (FK)    │
│ plan_data (jsonb)│
│ week_number      │
│ created_at       │
└─────────────────┘
```

### Project Structure

```
MedAce-AI/
├── rag/
│   ├── textbooks/              # Raw textbook .txt files (15 chapters)
│   ├── scripts/
│   │   ├── clean.ts            # Text cleaner (strip OCR noise)
│   │   ├── chunk.ts            # Semantic chunker (by SLO/headings)
│   │   ├── embed.ts            # Embed chunks via Gemini
│   │   └── upload.ts           # Push vectors to Supabase pgvector
│   └── chunks/                 # Processed chunk JSON (intermediate)
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout (RTL, fonts)
│   │   ├── page.tsx            # Landing page
│   │   ├── globals.css         # Tailwind v4 tokens
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx        # Student dashboard + weak spots
│   │   ├── practice/
│   │   │   ├── page.tsx        # Topic selector
│   │   │   └── [session]/page.tsx  # MCQ player
│   │   ├── results/
│   │   │   └── [session]/page.tsx  # Session results + explanations
│   │   └── api/
│   │       ├── quiz/
│   │       │   └── generate/route.ts   # RAG MCQ generation
│   │       ├── explain/
│   │       │   └── route.ts            # Urdu explanation on demand
│   │       ├── study-plan/
│   │       │   └── route.ts            # Adaptive study plan
│   │       └── auth/
│   │           └── callback/route.ts   # OAuth callback
│   ├── components/
│   │   ├── ui/                 # Primitives (Button, Card, Input, etc.)
│   │   ├── auth/               # OAuthButtons, AuthForm
│   │   ├── quiz/               # MCQCard, Timer, ProgressBar, ScoreCard
│   │   └── dashboard/          # WeakSpotChart, TopicList, StudyPlanCard
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts       # Browser client
│   │   │   └── server.ts       # Server client
│   │   ├── gemini/
│   │   │   ├── client.ts       # Gemini API wrapper
│   │   │   └── prompts.ts      # MCQ + explanation prompt templates
│   │   ├── rag/
│   │   │   ├── retrieve.ts     # pgvector similarity search
│   │   │   └── generate.ts     # RAG-powered MCQ generation logic
│   │   ├── drizzle/
│   │   │   ├── schema.ts       # Table definitions
│   │   │   └── db.ts           # Drizzle client
│   │   └── utils.ts            # cn() helper + shared utilities
│   └── types/
│       └── quiz.ts             # MCQ, Session, Chunk TypeScript types
├── drizzle.config.ts
├── next.config.ts
├── tsconfig.json
├── .env.local
├── package.json
└── README.md
```

### Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Database (Drizzle ORM)
DATABASE_URL=...

# Google Gemini
GEMINI_API_KEY=...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Dependencies

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@supabase/supabase-js": "^2.45.0",
    "@supabase/ssr": "^0.5.0",
    "drizzle-orm": "^0.36.0",
    "postgres": "^3.4.0",
    "@tanstack/react-query": "^5.60.0",
    "@google/generative-ai": "^0.21.0",
    "zod": "^3.23.0",
    "react-hook-form": "^7.53.0",
    "@hookform/resolvers": "^3.9.0",
    "lucide-react": "^0.460.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.6.0"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "drizzle-kit": "^0.28.0",
    "@tailwindcss/postcss": "^4.0.0",
    "tailwindcss": "^4.0.0",
    "postcss": "^8.4.0",
    "@types/react": "^19.0.0",
    "@types/node": "^22.0.0",
    "tsx": "^4.19.0"
  }
}
```

### Why These Choices

| Decision | Rationale |
|---|---|
| Gemini 2.0 Flash over GPT-4o | Faster, cheaper, better Urdu/multilingual output, 1M token context window |
| text-embedding-004 over OpenAI embeddings | Same API key, multilingual support, 768-dim (smaller storage), generous free tier |
| pgvector over Pinecone/Weaviate | Already in Supabase — no extra service, no extra cost, SQL-native queries |
| Drizzle over Prisma | Lighter, faster cold starts on Vercel, better pgvector support |
| Zod | Single source of truth for runtime validation + TypeScript types |
| TanStack Query over Redux/SWR | Best DX for server state, caching, and optimistic updates in Next.js |
| Chunking by SLO codes | MDCAT tests by SLO — generating MCQs per SLO = direct syllabus coverage |

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your Supabase, Gemini, and DB credentials

# Run database migrations
npx drizzle-kit generate
npx drizzle-kit migrate

# Build RAG index (one-time)
npx tsx rag/scripts/clean.ts
npx tsx rag/scripts/chunk.ts
npx tsx rag/scripts/embed.ts
npx tsx rag/scripts/upload.ts

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Deployment

Deploy on [Vercel](https://vercel.com) — zero configuration needed for Next.js.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/medace-ai)

Make sure to add all environment variables in your Vercel project settings before deploying.
