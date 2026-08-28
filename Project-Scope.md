# Project Scope: MedAce AI

## One-Liner
An AI tutor that teaches and quizzes students for the Pakistani MDCAT exam in Urdu, adapting to each student's recurring mistakes.

## Problem Statement
Millions of MDCAT aspirants lack affordable, personalized tutoring. Quality tutoring is expensive and concentrated in urban centers. Most existing prep tools are English-only, excluding the majority of students who think and learn in Urdu. Students also lack visibility into *what* to study next and *why* they keep failing specific topics.

## Solution
A coaching assistant that:
- Explains MDCAT concepts in plain, conversational Urdu
- Generates unlimited practice questions aligned to the syllabus
- Tracks each student's weak areas over time and re-drills them specifically
- Produces a weekly "what to study next" plan that adapts as performance improves

**MVP wedge:** One exam (MDCAT), one subject (e.g., Biology), done thoroughly and accurately before expanding.

## Core Features (MVP)
1. Urdu-language concept explanations (text-first, voice as stretch goal)
2. Syllabus-grounded question generator with accuracy verification
3. Mistake-tracking engine (per-student weak-topic memory)
4. Adaptive quiz sessions that prioritize weak areas
5. Weekly personalized study plan

## Stretch Goals
- Voice interaction (speak questions/answers aloud)
- Multi-subject expansion after single-subject MVP validation
- Progress dashboards for parents/tutors


## Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Frontend + Backend | Next.js 15 (App Router) | One repo, API routes + UI in one place |
| Styling | Tailwind CSS | Rapid iteration, built-in RTL support for Urdu |
| Database + Auth | Supabase (Postgres + Auth + Storage) | Zero-config Postgres, free tier, instant auth |
| AI / LLM | Google Gemini API (or OpenAI) | Strong multilingual/Urdu performance, generous free tier |
| ORM | Drizzle ORM | Lightweight, type-safe, great DX with Postgres |
| State / Caching | TanStack Query (React Query) | Quiz session state, caching, retries |
| Deployment | Vercel | One-click deploy, free tier covers MVP traffic |
| Stretch: Voice | Web Speech API + ElevenLabs | Browser-native TTS/STT, high-quality Urdu voice |

## Key Risks / Watch-outs
- **Accuracy is trust:** Wrong answers can directly hurt a student's exam outcome — every generated question must be verified against the real syllabus before release.
- **Scope creep:** Resist covering multiple subjects/exams before one subject is proven to work well.
- **Language quality:** Urdu explanations must be natural and pedagogically clear, not just translated English.
