---
kind: dependency_management
name: Node.js Dependency Management via npm with Lockfile and Dual requirements.txt Manifest
category: dependency_management
scope:
    - '**'
source_files:
    - package.json
    - package-lock.json
    - requirements.txt
    - tsconfig.json
    - next.config.ts
---

## System / Approach

The repository uses **npm** as the package manager for a Next.js (App Router) application. Dependencies are declared in `package.json` under both `dependencies` and `devDependencies`, and a deterministic install is enforced by committing `package-lock.json`. The project also ships a `requirements.txt` file that mirrors the same JavaScript/TypeScript dependency versions, likely to document the runtime stack for environments or tooling that consume Python-style manifests (e.g., documentation generators or CI steps). There is no vendoring of third-party code — all packages are resolved from the public npm registry at build time.

## Key Files

- `package.json` — single source of truth for runtime and dev dependencies; scripts define `dev`, `build`, `start`, and `lint` using `next` CLI commands.
- `package-lock.json` — committed lockfile pinning exact transitive resolutions for reproducible installs.
- `requirements.txt` — human-readable version manifest duplicating key dependency versions (Next.js, React, Supabase, Drizzle, Zod, Tailwind, etc.) alongside environment variable notes.
- `tsconfig.json` — excludes `node_modules` from compilation and sets `moduleResolution: "bundler"`, which is compatible with modern bundler-based dependency resolution used by Next.js.
- `next.config.ts` — does not configure a private registry; relies on default npm registry behavior.
- `.gitignore` — implicitly ignores `node_modules/`, so dependencies are never checked into version control beyond the lockfile.

## Architecture and Conventions

- **Single-package monorepo**: All frontend and server-side (Next.js API routes) code lives in one package; there are no workspaces or sub-packages.
- **Version ranges use caret (`^`)**: Every dependency in `package.json` is pinned with a caret range (e.g., `"next": "^15.3.3"`, `"react": "^19.1.0"`), allowing minor/patch updates while blocking major bumps automatically. This balances flexibility with stability.
- **Lockfile-driven installs**: Because `package-lock.json` is present, `npm ci` or `npm install` will resolve to the exact versions recorded in the lockfile, ensuring consistent builds across environments.
- **No private registries or scoped packages**: All packages are pulled from the public npm registry; there are no `registry` overrides, `.npmrc` files, or private scope usage.
- **Dual manifest convention**: `requirements.txt` mirrors the JS/TS dependency versions found in `package.json` but uses `>=` ranges instead of `^`. This appears to be a documentation-only artifact rather than an active Python dependency resolver, since the project has no Python runtime dependencies.
- **Dev vs runtime separation**: UI/runtime libraries (React, Next.js, Supabase, Framer Motion, Lucide icons, Zod, TanStack Query) live under `dependencies`; tooling (TypeScript, ESLint, PostCSS, Tailwind CSS, drizzle-kit, tsx, type definitions) lives under `devDependencies`, keeping production bundles free of build-time tools.

## Conventions and Constraints

- **Install command**: The README references `npm install` as the setup step; no alternative package managers (pnpm, yarn, bun) are referenced or configured.
- **Strict TypeScript mode**: `tsconfig.json` enables `strict: true` and `skipLibCheck: true`, which affects how type declarations from dependencies are consumed during development but does not alter runtime dependency resolution.
- **Environment variables documented in `requirements.txt`**: The bottom of `requirements.txt` lists required `.env.local` keys (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`) — this is a convention for onboarding, not a runtime enforcement mechanism.
- **No vendoring or offline cache strategy**: The repo does not vendor `node_modules`, nor does it configure a local npm mirror or cache; reproducibility relies solely on the committed `package-lock.json`.
- **Security headers via Next config**: While not a dependency-management feature per se, `next.config.ts` applies security-related HTTP headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) globally, complementing the external dependency surface.