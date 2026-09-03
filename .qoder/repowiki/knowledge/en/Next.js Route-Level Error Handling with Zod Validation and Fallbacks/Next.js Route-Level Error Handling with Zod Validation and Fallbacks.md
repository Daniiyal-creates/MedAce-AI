---
kind: error_handling
name: Next.js Route-Level Error Handling with Zod Validation and Fallbacks
category: error_handling
scope:
    - '**'
source_files:
    - src/lib/validations/schemas.ts
    - src/app/api/quiz/generate/route.ts
    - src/app/api/quiz/explain/route.ts
    - src/app/api/quiz/submit/route.ts
    - src/app/api/study-plan/generate/route.ts
    - src/app/api/dashboard/stats/route.ts
    - src/middleware.ts
    - src/lib/supabase/admin.ts
---

## Overview

This Next.js App Router application handles errors primarily at the API route level using a consistent try/catch pattern, combined with runtime input validation via Zod schemas. There is no centralized error class hierarchy, custom error types, or global error middleware — each route independently validates input, catches failures, and returns structured JSON responses.

## Input Validation (Zod)

All incoming request bodies are validated through `src/lib/validations/schemas.ts`, which defines Zod schemas for every API contract:
- `QuizGenerateSchema` — chapter/topic/difficulty/count
- `QuizSubmitSchema` + `QuizAnswerSubmissionSchema` — session answers
- `QuizExplainSchema` — question text, options, correct answer
- `StudyPlanGenerateSchema` — target exam date, weak topics

When validation fails, routes return a `400 Bad Request` with a uniform shape: `{ error: string, details: z.ZodError.format() }`. This is the only place in the codebase where client-facing validation errors are produced.

## Route-Level Try/Catch Pattern

Every API route (`quiz/generate`, `quiz/submit`, `quiz/explain`, `study-plan/generate`, `dashboard/stats`) wraps its body in a single `try { ... } catch (error) { ... }` block that follows an identical structure:

```ts
catch (error) {
  console.error("Error <verb> <noun>:", error);
  return NextResponse.json(
    { error: "Internal Server Error", message: error instanceof Error ? error.message : String(error) },
    { status: 500 }
  );
}
```

The response envelope is consistent across all routes: an `error` field plus a `message` field containing the thrown error's message (or coerced string). The HTTP status is always `500` for unhandled exceptions.

## Graceful Degradation / Fallbacks

Rather than propagating upstream failures, the code uses targeted `try/catch` blocks around optional third-party calls to degrade gracefully:

- **Vector search fallback** (`quiz/explain/route.ts`, `quiz/generate/route.ts`): If embedding generation or Supabase vector RPC fails, the route falls back to a hardcoded textbook reference string instead of failing the whole request.
- **AI generation fallback** (`quiz/generate/route.ts`): If Gemini JSON generation throws, the route logs a warning and falls back to the local `getQuestionsForChapter()` mock database generator.
- **Unauthenticated dashboard** (`dashboard/stats/route.ts`): Returns a full demo dataset when no user is authenticated, rather than returning an auth error.

These are opt-in per-operation fallbacks, not a general retry or circuit-breaker mechanism.

## Authentication & Authorization Errors

There is no enforced server-side authorization. The `middleware.ts` file declares protected/public route lists but contains commented-out auth checks; it currently allows all requests through. Authenticated operations inside routes use `createClient().auth.getUser()` and simply skip DB writes when no user is present — they do not throw or return auth errors.

## No Global Error Middleware

There is no `src/app/error.ts` boundary component, no `unhandledrejection` handler, and no Express-style error middleware. Uncaught errors in page components or client-side code are not centrally captured by this codebase.

## Scripts and CLI

Standalone scripts under `scripts/` handle errors differently: `ingest-textbooks.ts` uses `console.error` for directory-not-found and chunk-embedding failures, and attaches a top-level `.catch(err => console.error(...))` to the main async function. These are operational scripts, not part of the web request pipeline.

## Key Files

- `src/lib/validations/schemas.ts` — single source of truth for input validation and error messages
- `src/app/api/quiz/generate/route.ts` — most complex error flow (validation → vector search fallback → AI fallback → DB write)
- `src/app/api/quiz/explain/route.ts` — vector search fallback pattern
- `src/app/api/quiz/submit/route.ts` — validation + DB error handling
- `src/app/api/study-plan/generate/route.ts` — validation + AI error handling
- `src/app/api/dashboard/stats/route.ts` — unauthenticated fallback + generic catch
- `src/middleware.ts` — placeholder auth guard (currently disabled)
- `src/lib/supabase/admin.ts` — lazy Supabase client via Proxy; connection errors surface as caught exceptions in routes

## Conventions Observed

1. **Validate first, process second**: Every POST route calls `schema.safeParse(req.json())` before any business logic.
2. **Uniform 400 shape**: Validation failures return `{ error, details }` with status 400.
3. **Uniform 500 shape**: Unhandled exceptions return `{ error: "Internal Server Error", message }` with status 500.
4. **Optional upstream calls are wrapped individually**: Vector search and AI calls are isolated in their own try/catch so one failure doesn't break the entire route.
5. **No custom error classes**: Errors are raw `Error` objects; no domain-specific error types are defined.
6. **No panic/recover**: TypeScript/Node does not use `throw new Error` in normal control flow — failures are returned via `NextResponse.json`.
7. **Auth is best-effort**: Missing authentication results in skipping persistence, not in an error response.