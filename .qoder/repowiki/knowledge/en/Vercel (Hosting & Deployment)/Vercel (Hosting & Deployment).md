---
kind: external_dependency
name: Vercel (Hosting & Deployment)
slug: vercel
category: external_dependency
category_hints:
    - vendor_identity
    - client_constraint
scope:
    - '**'
---

### Vercel
- Role: Zero-config deployment target for the Next.js 15 App Router application; also hosts Vercel Analytics for web vitals and usage tracking.
- Integration point: project root `package.json` with standard Next.js scripts (`dev`, `build`, `start`, `lint`); deployment is triggered by pushing to the repository linked in Vercel, which auto-detects Next.js and runs `next build`.
- Durable constraint: environment variables (`NEXT_PUBLIC_SUPABASE_*`, `GEMINI_API_KEY`, `DATABASE_URL`) must be configured in the Vercel project settings before deploy; the README explicitly instructs adding them there.
- No custom server or build steps beyond Next.js defaults.