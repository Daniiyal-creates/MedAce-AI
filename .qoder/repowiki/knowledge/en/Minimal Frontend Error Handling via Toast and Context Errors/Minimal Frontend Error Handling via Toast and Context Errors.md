---
kind: error_handling
name: Minimal Frontend Error Handling via Toast and Context Errors
category: error_handling
scope:
    - '**'
source_files:
    - src/components/ui/Toast.tsx
    - src/middleware.ts
    - src/lib/utils.ts
    - src/components/auth/AuthProvider.tsx
    - src/app/(auth)/login/page.tsx
    - src/app/(auth)/signup/page.tsx
---

## What system/approach is used

This Next.js 15 frontend application has **no dedicated error-handling framework, custom error types, or server-side error middleware**. The only runtime error mechanism present is a client-side toast notification system (`src/components/ui/Toast.tsx`) that surfaces user-facing messages with three typed variants: `success`, `error`, and `info`. There are no `try/catch` blocks, no `.catch()` handlers, no thrown domain errors, no panic/recover equivalents, and no API-layer error codes anywhere in the codebase — the app currently runs entirely on mock data.

## Key files and packages

- `src/components/ui/Toast.tsx` — defines the `ToastType` union (`"success" | "error" | "info"`), a `ToastItem` interface, a React context (`ToastContext`), a `useToast` hook, and a `ToastProvider` component that renders auto-dismissing notifications after 4 seconds. It uses `lucide-react` icons (`CheckCircle`, `AlertCircle`, `Info`) and Tailwind utility classes for visual styling.
- `src/middleware.ts` — Next.js route middleware that currently performs only route protection gating (protected vs public routes). Error-related auth checks are commented out and not active; it returns `NextResponse.next()` unconditionally.
- `src/lib/utils.ts` — contains helper functions including `getScoreColor` / `getScoreBgColor` which map numeric scores to `text-error` / `bg-error` CSS classes, treating low scores as an "error" visual state rather than a runtime error.
- `src/components/auth/AuthProvider.tsx` — provides a mock authenticated user; no error state or failure paths exist yet.

## Architecture and conventions

- **No global error boundary**: There is no `ErrorBoundary` component wrapping the app tree, so unhandled promise rejections or render-time exceptions would surface as default Next.js error pages rather than being caught by application logic.
- **No custom error types**: No `errors/` directory, no `AppError` class, no discriminated-union error payloads. Errors are represented only as plain strings passed into the toast system.
- **Toast-driven user feedback**: When the app eventually wires up network calls or form submissions, the intended pattern is to call `toast("error", message)` from the toast context to inform users of failures. Success and informational messages use the same mechanism with different `ToastType` values.
- **Middleware is not an error handler**: The Next.js middleware exists purely for routing decisions and currently does nothing on the happy path. Auth failure redirects are present only as commented-out code awaiting Supabase integration.
- **CSS-level error signaling**: The design system reserves `text-error` and `bg-error` Tailwind classes (defined elsewhere in the theme) for presenting low-score or failure states visually, decoupling UI color semantics from runtime error propagation.

## Conventions and constraints

Observed patterns in this repo:
- User-visible failures are surfaced through the `useToast()` hook with a string message; there is no structured error object shape enforced at the call site.
- The `ToastType` is a closed union (`"success" | "error" | "info"`); adding new toast categories requires updating both the type and the `icons` / `borderColors` maps in `Toast.tsx`.
- Missing provider context throws a plain JavaScript `Error` (`throw new Error("useToast must be used within ToastProvider")`), which is the only explicit runtime assertion in the codebase.
- There is no convention for propagating backend or API errors because no API client layer exists yet; all data comes from `src/lib/mock-data.ts`.
- Form pages (`login/page.tsx`, `signup/page.tsx`) contain no submit handlers, validation, or error display — they are static UI shells awaiting backend wiring.

In short, error handling in this repository is **present only as a UI-level toast primitive** and is otherwise a stubbed-out area of the codebase, ready to be wired once Supabase authentication and Gemini-powered quiz generation are connected.