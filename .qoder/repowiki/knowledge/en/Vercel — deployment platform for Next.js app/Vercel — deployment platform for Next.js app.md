---
kind: external_dependency
name: Vercel — deployment platform for Next.js app
slug: vercel
category: external_dependency
category_hints:
    - vendor_identity
    - client_constraint
scope:
    - '**'
source_files:
    - Next-app/README.md
    - Next-app/package.json
---

MedAce AI is built as a Next.js 15+ application intended to be deployed on Vercel, which provides one-click GitHub-based deploys and environment variable injection for Supabase/Gemini secrets.
- The README includes the standard Vercel deploy instructions; the project has no custom build scripts beyond `next build/start`, making it Vercel-native.
- As a Next.js App Router project, runtime behavior (server components, API routes) maps directly onto Vercel Serverless Functions.
- No code changes are required to switch between dev and production environments beyond supplying the correct `.env` values.