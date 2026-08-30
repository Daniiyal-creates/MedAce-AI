---
kind: build_system
name: Next.js App Build & Dev Toolchain (npm scripts, TypeScript, ESLint, PostCSS/Tailwind)
category: build_system
scope:
    - '**'
source_files:
    - package.json
    - next.config.ts
    - tsconfig.json
    - eslint.config.mjs
    - postcss.config.mjs
    - .env.example
    - .gitignore
---

## What system/approach is used

The project is a Next.js 15 application built and shipped entirely through npm scripts. There are no Makefiles, Dockerfiles, CI pipelines, or custom build scripts — the build surface is `package.json` scripts that delegate to `next build`, `next dev`, and `next start`. Type checking, linting, CSS processing, and environment setup are handled by standard Next.js ecosystem tooling: TypeScript (`tsconfig.json`), ESLint via `eslint-config-next` (`eslint.config.mjs`), and Tailwind v4 via PostCSS (`postcss.config.mjs`).

## Key files and packages

- `package.json` — defines the app name (`medace-ai`), version (`0.1.0`), and the four npm scripts: `dev` (`next dev`), `build` (`next build`), `start` (`next start`), `lint` (`next lint`). Declares runtime dependencies (Next.js 15, React 19, Supabase, Drizzle ORM, Zod, TanStack Query, Google Generative AI) and dev dependencies (TypeScript, drizzle-kit, Tailwind v4, PostCSS, ESLint).
- `next.config.ts` — Next.js configuration; adds security headers (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`) for all routes.
- `tsconfig.json` — strict TypeScript with `noEmit: true` (types checked but not emitted by tsc; Next.js handles compilation), `moduleResolution: "bundler"`, path alias `@/* → ./src/*`, incremental builds, and the Next.js compiler plugin.
- `eslint.config.mjs` — Flat config that extends `next/core-web-vitals`; uses `@eslint/eslintrc.FlatCompat` to bridge legacy configs.
- `postcss.config.mjs` — registers `@tailwindcss/postcss` as the only PostCSS plugin (Tailwind v4 pipeline).
- `.env.example` — template for required environment variables consumed at build/runtime.
- `.gitignore` — excludes `node_modules/` and `.next/` from version control.

## Architecture and conventions

- **Build entry points**: All build/dev/start flows go through `npm run <script>` in `package.json`; there is no custom shell script layer.
- **TypeScript integration**: The project uses `noEmit: true` so tsc acts purely as a type checker; actual JS emission is delegated to Next.js's internal bundler/compiler. Path aliases (`@/*`) let source code import from `src/` using absolute paths.
- **Linting**: Linting is invoked via `next lint`, which under the hood runs ESLint configured by `eslint-config-next`; the flat config file exists only to extend that preset.
- **CSS pipeline**: Styles are processed through PostCSS with Tailwind v4 (`@tailwindcss/postcss`); no separate webpack or Vite CSS plugins are involved.
- **Security posture at build time**: Security-related HTTP headers are baked into the build output via `next.config.ts` `headers()` hook, applied to every route.
- **Versioning**: Version is declared once in `package.json` (`0.1.0`) and is private; no explicit release tagging or changelog process is present in the repo.

## Conventions and constraints

- Development workflow: `npm run dev` starts the Next.js dev server; `npm run build` produces the production bundle; `npm run start` serves the built output; `npm run lint` runs the linter. These are the only documented entry points.
- Source layout convention: All application source lives under `src/`, imported via the `@/*` path alias defined in `tsconfig.json`.
- Strict typing: `strict: true` is enabled in `tsconfig.json`, enforcing type safety across the codebase.
- No transpilation outside Next.js: With `noEmit: true`, developers should not expect `.js` artifacts from `tsc`; compilation is fully managed by Next.js.
- Environment variables: Required variables are templated in `.env.example`; the real `.env` file is gitignored and expected to be created locally.
- No containerization or CI: There are no `Dockerfile`, `docker-compose.yml`, GitHub Actions workflows, or other CI/build orchestration files in the repository. Deployment would rely on external hosting that understands Next.js/npm projects.