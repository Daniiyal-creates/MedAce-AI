---
kind: external_dependency
name: Next.js 15 App Router Application
slug: nextjs
category: external_dependency
category_hints:
    - framework_behavior
scope:
    - '**'
---

The project is a Next.js 15 App Router application (`next dev` / `next build` / `next start` scripts). All pages live under `src/app/` using file-based routing, with a shared layout (`layout.tsx`) and a `middleware.ts` at the app root. API routes are implemented as Server Routes under `src/app/api/*`. Tailwind CSS v4 is configured via `@tailwindcss/postcss` and inline theme tokens in `globals.css`. Framer Motion is used extensively for page/component animations.