# MedAce AI

An adaptive prep coach for MDCAT (Medical and Dental College Admission Test), Pakistan's high-stakes pre-medical entrance exam. MedAce AI keeps the exam experience authentic — English interface, English MCQs — while adding an Urdu explanation layer for students who understand a concept better in Urdu than in English.

---

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

---

## Tech Stack

### Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                        STUDENT BROWSER                           │
│   Next.js 15 App (React 19 + Tailwind CSS v4 + Framer Motion)   │
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
| **Styling** | Tailwind CSS v4 | Utility-first CSS, glassmorphism design tokens, `@theme inline` |
| **Animations** | Framer Motion 13 | Spring physics, `AnimatePresence`, `layoutId` shared transitions |
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

---

## Project Structure

```
MedAce-AI/
├── rag/
│   └── textbooks/                  # Raw textbook .txt files (15 chapters)
├── scripts/
│   ├── check-chunks.ts             # Verify chunk integrity in pgvector
│   └── ingest-textbooks.ts         # End-to-end ingestion pipeline
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout (fonts, providers)
│   │   ├── page.tsx                # Landing page (animated hero, features, CTA)
│   │   ├── globals.css             # Tailwind v4 tokens + glass/glow utilities
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx      # Split-screen login with brand panel
│   │   │   └── signup/page.tsx     # Split-screen signup with brand panel
│   │   ├── dashboard/
│   │   │   └── page.tsx            # Animated stat cards, weak topics, recent sessions
│   │   ├── practice/
│   │   │   ├── page.tsx            # Topic selector with pill tabs, staggered cards
│   │   │   └── [session]/page.tsx  # Quiz player with AnimatePresence transitions
│   │   ├── results/
│   │   │   └── [session]/page.tsx  # Animated score ring, staggered stats
│   │   ├── study-plan/
│   │   │   └── page.tsx            # 7-day plan with staggered day cards
│   │   ├── profile/
│   │   │   └── page.tsx            # Profile header, stats, chapter performance bars
│   │   └── api/
│   │       ├── quiz/
│   │       │   ├── generate/       # RAG MCQ generation (Gemini + textbook context)
│   │       │   ├── save/           # Save quiz session results
│   │       │   └── history/        # Fetch quiz history
│   │       ├── dashboard/stats/    # User-specific performance stats
│   │       └── study-plan/generate/ # AI study plan generation
│   ├── components/
│   │   ├── ui/                     # Primitives (Button, Card, Modal, Tabs, etc.)
│   │   │   ├── Button.tsx          # motion.div whileHover/whileTap, glow prop
│   │   │   ├── Card.tsx            # glass variant, hoverable with motion lift
│   │   │   ├── Modal.tsx           # AnimatePresence + spring physics
│   │   │   ├── Tabs.tsx            # layoutId animated underline + pill variant
│   │   │   ├── Badge.tsx           # Spring entrance, gradient shimmer for AI
│   │   │   ├── Toast.tsx           # AnimatePresence slide-in, auto-dismiss bar
│   │   │   ├── Progress.tsx        # Spring-animated fill bar with glow
│   │   │   ├── Tooltip.tsx         # Spring scale with delay
│   │   │   ├── Skeleton.tsx        # Shimmer wave animation
│   │   │   ├── Input.tsx           # Glow focus shadow, icon color transitions
│   │   │   ├── Select.tsx          # Glow focus shadow
│   │   │   ├── Textarea.tsx        # Glow focus shadow
│   │   │   ├── Spinner.tsx         # Loading spinner
│   │   │   └── Avatar.tsx          # User avatar
│   │   ├── auth/
│   │   │   └── AuthProvider.tsx    # Dynamic Google OAuth + local session storage
│   │   ├── layout/
│   │   │   ├── Navbar.tsx          # Glassmorphism, compact-on-scroll, mobile overlay
│   │   │   ├── Sidebar.tsx         # Collapsible, layoutId active pill, tooltips
│   │   │   ├── Footer.tsx          # Multi-column SaaS footer, social icons
│   │   │   └── AppLayout.tsx       # Layout wrapper with mobile bottom navigation
│   │   └── Providers.tsx           # App-wide providers wrapper
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts           # Browser client
│   │   │   └── server.ts           # Server client
│   │   ├── ai/                     # Gemini AI integration
│   │   ├── validations/            # Zod schemas
│   │   ├── api-client.ts           # API client utilities
│   │   ├── chapter-questions.ts    # Randomized question generator
│   │   ├── mock-data.ts            # Topic catalog (clean baseline)
│   │   ├── progress-tracker.ts     # Real-time progress calculator
│   │   ├── study-plan-generator.ts # Weekly study plan generator
│   │   ├── textbook-reader.ts      # Read textbook chapters from rag/
│   │   └── utils.ts                # cn() helper + shared utilities
│   ├── types/
│   │   └── quiz.ts                 # MCQ, Session, Chunk TypeScript types
│   └── middleware.ts               # Auth middleware
├── supabase/
│   └── schema.sql                  # Full database schema
├── .env.example                    # Environment variable template
├── next.config.ts                  # Next.js configuration
├── postcss.config.mjs              # PostCSS + Tailwind config
├── eslint.config.mjs               # ESLint configuration
├── tsconfig.json                   # TypeScript configuration
└── package.json                    # Dependencies and scripts
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
    "next": "^15.3.3",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "@supabase/supabase-js": "^2.49.8",
    "@supabase/ssr": "^0.6.1",
    "drizzle-orm": "^0.36.4",
    "postgres": "^3.4.5",
    "@tanstack/react-query": "^5.75.5",
    "@google/generative-ai": "^0.21.0",
    "zod": "^3.24.4",
    "react-hook-form": "^7.56.3",
    "@hookform/resolvers": "^3.10.0",
    "lucide-react": "^0.469.0",
    "framer-motion": "^13.2.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.6.0"
  },
  "devDependencies": {
    "typescript": "^5.8.3",
    "drizzle-kit": "^0.28.1",
    "@tailwindcss/postcss": "^4.1.7",
    "tailwindcss": "^4.1.7",
    "postcss": "^8.5.4",
    "@types/react": "^19.1.4",
    "@types/react-dom": "^19.1.5",
    "@types/node": "^22.15.18",
    "tsx": "^4.19.4",
    "eslint": "^9.27.0",
    "eslint-config-next": "^15.3.3"
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
| Framer Motion over CSS-only animations | Spring physics, shared element transitions (`layoutId`), `AnimatePresence` for mount/unmount |
| Chunking by SLO codes | MDCAT tests by SLO — generating MCQs per SLO = direct syllabus coverage |

---

## Frontend Design System

### Design Language

MedAce AI uses a **dark premium medical aesthetic** with glassmorphism, gradient effects, and spring-physics animations powered by Framer Motion.

- **Glassmorphism surfaces** — `bg-glass` with `backdrop-blur-xl` and semi-transparent borders for navbar, sidebar, modals, and cards
- **Gradient accents** — `gradient-text` (teal → purple) for headings and CTAs; `gradient-border` for premium card borders
- **Glow effects** — `animate-pulse-glow` on active elements; `glow-primary` / `glow-accent` shadow utilities
- **Spring physics** — All modals, tooltips, and page transitions use `type: "spring"` with `stiffness` and `damping` for natural motion

### Animation Patterns

| Pattern | Implementation |
|---|---|
| Staggered entrance | `variants` with `custom` delay index × 0.08s |
| Question transitions | `AnimatePresence mode="wait"` + x-axis slide |
| Active nav indicator | `layoutId` for shared-element transition between tabs |
| Score ring reveal | `motion.circle` with `strokeDashoffset` SVG path animation |
| Scroll-triggered | `useInView` with `once: true` for section fade-ins |
| Navbar compact | `useScroll` + `useMotionValueEvent` to shrink on scroll |
| Hover lift | `whileHover={{ y: -4 }}` on cards |
| Tap feedback | `whileTap={{ scale: 0.97 }}` on buttons |

### Mobile-First Responsive

- **Mobile (< 1024px)**: Full-screen nav overlay, bottom navigation bar with animated active indicator, touch-optimized tap targets
- **Tablet (≥ 1024px)**: Sidebar navigation, responsive grid layouts
- **Desktop (≥ 1280px)**: Full sidebar with collapse/expand + tooltips, wider content areas

---

## Recent Feature Implementations

### Code Audit & Health Check

A comprehensive code audit was conducted across the codebase to ensure production quality:

1. **TypeScript Type Safety** — `npx tsc --noEmit` with 0 compilation errors on frontend code.
2. **Session State Consistency** — All pages (`/dashboard`, `/practice`, `/results`, `/study-plan`, `/profile`) dynamically render the logged-in user's name via `useAuth()` instead of hardcoded strings.
3. **Data Contract & Key Uniqueness** — Resolved all React duplicate key console warnings on list maps.
4. **Question Generator Integrity** — Verified that `/api/quiz/generate` successfully extracts textbook context from all 15 chapters and supports question ranges from 20 to 50 questions.

### Google OAuth & Dynamic User Sessions

- **OAuth PKCE Callback Handler** at `src/app/auth/callback/route.ts` for Supabase Google OAuth authorization code exchange
- **Dynamic AuthProvider** extracts real user metadata (`full_name`, `email`, `avatar_url`) from Google OAuth accounts, persists sessions via `localStorage`
- **Local Preview Google Sign-In** — Interactive Google Account detail modal in login and signup pages for local development without API keys
- All layout components (`Navbar`, `Sidebar`, `AppLayout`) display the logged-in user's actual name, avatar, and email

### Real-Time Progress Tracking

- **Progress Calculator** (`src/lib/progress-tracker.ts`) aggregates quiz history and computes:
  - Total questions attempted, weekly questions, overall accuracy rate
  - Completed sessions count, consecutive study streak days
  - Weak topics ranked by error rates and attempt counts
  - Chapter performance percentage breakdown
- **Automatic History Saving** — Completed quiz sessions are recorded into local history upon finish
- **Dashboard Stats API** returns user-specific performance statistics

### Clean Baseline & Dynamic Topic Catalog

- New users start with clean **0% / Not yet attempted** cards with a **New** badge
- Accuracy percentages and **Weak** badges update dynamically as chapters are completed
- No hardcoded static percentages or fake indicators in the initial topic catalog

### RAG-Powered Question Generation

- **Textbook Content Loader** (`src/lib/textbook-reader.ts`) reads extracted textbook text from all 15 chapter files
- **AI Question Generator** feeds textbook content to Gemini for subtopic-specific question generation
- **Randomized Question Sets** — Question orders and variants are randomized for variety across sessions

### Redesigned Study Plan

- **Current Week Dates** — Day selector shows real dates for the current calendar week (Monday–Sunday)
- **MDCAT Countdown Badge** — Displays remaining days until the MDCAT exam
- **7-Day Interactive Selector** — Click any day to view assigned topics and estimated study time
- **Customize Plan Modal** — Pick target exam dates and daily study goals (30m, 60m, 90m, 120m)
- **Direct Practice Buttons** — "Start Practice Quiz" buttons on daily focus cards

### Expanded Quiz Range (20–50 Questions)

- Quiz configuration modal supports: 20 (Standard), 30 (Extended), 40 (Intensive), 50 (Full Mock)
- Validation schema updated to allow up to 100 questions per session
- Study plan generator assigns 20–50 questions per daily session

---

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

# Ingest textbook content into vector store (one-time)
npx tsx scripts/ingest-textbooks.ts

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with hot-reloading |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint checks |

---

## Deployment

Deploy on [Vercel](https://vercel.com) — zero configuration needed for Next.js.

Make sure to add all environment variables in your Vercel project settings before deploying.

---

## License

Private — All rights reserved.
