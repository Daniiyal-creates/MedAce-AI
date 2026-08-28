---
kind: error_handling
name: Next.js App Router API Error Handling with Supabase Auth and Gemini Integration
category: error_handling
scope:
    - '**'
source_files:
    - Next-app/src/middleware.ts
    - Next-app/src/lib/supabase/middleware.ts
    - Next-app/src/app/api/quiz/generate/route.ts
    - Next-app/src/app/api/quiz/history/route.ts
    - Next-app/src/app/api/quiz/submit/route.ts
    - Next-app/src/app/api/quiz/weak-topics/route.ts
    - Next-app/src/app/api/study-plan/route.ts
    - Next-app/src/lib/gemini/client.ts
    - Next-app/src/providers/AuthProvider.tsx
    - Next-app/src/components/ui/Toast.tsx
---

## Overview

This Next.js 15 App Router application uses a straightforward, per-route error handling pattern centered on `try/catch` blocks in server-side Route Handlers (`src/app/api/**/route.ts`). There is no centralized error class hierarchy, global error boundary for APIs, or custom error types — errors are handled inline at the point of failure.

## Server-Side Route Error Handling

Every API route follows the same shape:

- **Input validation**: Missing required fields return `NextResponse.json({ error: "..." }, { status: 400 })`. For example, `generate/route.ts` checks `topic` and `questionCount` and returns a 400 with an Urdu message.
- **Authentication guard**: Every protected route calls `createClient()` then `supabase.auth.getUser()`, returning `{ error: "غیر مجاز" }` (Unauthorized) with status 401 if no user is present. This pattern appears in `quiz/history`, `quiz/submit`, `quiz/weak-topics`, and `study-plan` routes.
- **Supabase query errors**: When Supabase returns an `{ data, error }` tuple, routes check `if (error)` and log via `console.error(...)`, then return a safe fallback (empty array `[]` or `null`) rather than propagating the error to the client.
- **Unhandled exceptions**: A top-level `try/catch` wraps each route body; caught errors are logged with `console.error("<context> error:", error)` and returned as `{ error: "..." }` with status 500. The error messages are localized in Urdu (e.g., "سوالات بنانے میں خرابی ہوئی", "نتائج محفوظ کرنے میں خرابی", "مطالعہ کا منصوبہ بنانے میں خرابی").

## External Service Errors

The Gemini client (`src/lib/gemini/client.ts`) throws plain `Error` instances:
- HTTP failures from `fetch` throw `new Error(\`Gemini API error: ${res.status} ${res.statusText}\`)` when `!res.ok`.
- Malformed LLM responses throw `new Error("Invalid response format from Gemini")` when JSON extraction fails.

These thrown errors bubble up to the calling route's `catch` block, which converts them into a 500 JSON response. No retry logic or circuit breaker is implemented.

## Middleware Authentication Flow

`src/middleware.ts` delegates to `updateSession` in `src/lib/supabase/middleware.ts`, which:
- Gracefully bypasses auth if Supabase env vars are missing/unconfigured (returns `NextResponse.next({ request })`).
- Redirects unauthenticated users away from protected paths (`/quiz`, `/study-plan`, `/history`, `/profile`) to `/login`.
- Redirects authenticated users away from auth pages (`/login`, `/signup`) to `/`.
- Uses `NextResponse.redirect(url)` — no explicit error responses here.

## Client-Side Error Presentation

There is no global toast/error notification system wired into the app. A reusable `Toast` component exists under `src/components/ui/Toast.tsx` supporting four types (`success`, `error`, `warning`, `info`) with auto-dismiss timers, but it is not used by any route handler or page in the codebase reviewed. Frontend components would need to consume this manually to surface API errors to users.

## Frontend Provider Error Handling

`AuthProvider` (`src/providers/AuthProvider.tsx`) wraps Supabase client initialization in a `try/catch`; if creation fails (e.g., missing env), it treats the user as unauthenticated and sets `isLoading = false` rather than crashing.

## Conventions Observed

1. **Per-route try/catch**: Every Route Handler wraps its entire body in `try/catch`.
2. **Localized error messages**: User-facing error strings are in Urdu; developer logs remain in English.
3. **Fail-open reads**: Read-only queries that fail (e.g., history fetch, weak topics fetch) return empty arrays/null instead of failing the whole response.
4. **Fail-closed writes**: Write operations (submit quiz, generate study plan) return 500 on error since partial success is not meaningful.
5. **Auth-first pattern**: Every protected route re-checks `supabase.auth.getUser()` even though middleware already redirects unauthenticated users — defense-in-depth at the API layer.
6. **No custom error classes**: All errors are either plain `Error` objects or ad-hoc string messages inside JSON responses.
7. **No global error boundary for APIs**: There is no `src/app/global-error.tsx` or similar for server-side routes; errors are handled locally per route.