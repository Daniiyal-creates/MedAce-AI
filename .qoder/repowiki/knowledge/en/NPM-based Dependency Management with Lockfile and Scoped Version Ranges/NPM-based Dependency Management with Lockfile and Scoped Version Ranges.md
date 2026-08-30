---
kind: dependency_management
name: NPM-based Dependency Management with Lockfile and Scoped Version Ranges
category: dependency_management
scope:
    - '**'
source_files:
    - package.json
    - package-lock.json
    - .gitignore
---

## System/Approach

This Next.js application uses **npm** as its package manager for dependency management. Dependencies are declared in `package.json` under `dependencies` (runtime) and `devDependencies` (build-time/tooling), and a `package-lock.json` lockfile is committed to the repository to pin exact transitive versions.

## Key Files

- `package.json` — single source of truth for declared dependencies, scripts (`dev`, `build`, `start`, `lint`), and project metadata (`name: medace-ai`, `private: true`).
- `package-lock.json` — npm v3 lockfile that pins every installed package and its transitive dependencies with resolved URLs and integrity hashes from the public npm registry.
- `.gitignore` — ensures `node_modules/` is not tracked; only manifests and lockfile are versioned.
- No vendored `node_modules`, no private registry configuration, no `.npmrc`, no `pnpm-lock.yaml` or `yarn.lock`.

## Architecture and Conventions

- **Version ranges**: All dependencies use caret (`^`) ranges (e.g. `next ^15.3.3`, `react ^19.1.0`, `zod ^3.24.4`), allowing minor/patch updates while blocking major-version bumps. This balances stability with access to newer features.
- **Lockfile-driven installs**: The presence of `package-lock.json` means `npm ci` / `npm install` will resolve against the lockfile rather than re-resolving semver ranges, ensuring reproducible builds across environments.
- **Private project**: `"private": true` prevents accidental publishing to the npm registry.
- **Scoped third-party packages**: External services/libraries are imported via scoped packages (`@supabase/supabase-js`, `@supabase/ssr`, `@tanstack/react-query`, `@google/generative-ai`, `@hookform/resolvers`, `@tailwindcss/postcss`, `@types/*`), keeping them grouped and identifiable.
- **No vendoring**: There is no `vendor/` directory and no local file references (`file:` or `link:`). All packages are fetched from the public npm registry at install time.
- **No private registry**: No `.npmrc`, `npm config set registry`, or `--registry` flags were found. The project relies entirely on the default public npm registry.

## Conventions and Constraints

- **Runtime vs. dev split**: Runtime-only libraries (Next.js, React, Supabase client, Drizzle ORM, Zod, React Hook Form, Lucide icons, Tailwind utilities) live under `dependencies`; tooling (TypeScript, ESLint, PostCSS, Tailwind compiler, Drizzle Kit, tsx, type definitions) lives under `devDependencies`. This keeps production bundles free of build-time tools.
- **Lockfile is authoritative**: Because `package-lock.json` is committed, any change to dependency versions must go through `npm install` / `npm update` which regenerates the lockfile; manual edits to either manifest or lockfile should be avoided.
- **Scripts gate dependency usage**: The `scripts` field exposes only `dev`, `build`, `start`, and `lint`, all of which delegate to installed binaries (`next dev`, `next build`, `next start`, `next lint`). New dependency-related commands should follow this pattern rather than invoking `node_modules/.bin/*` directly.
- **No postinstall hooks or native binary patches**: No `postinstall` script exists in `package.json`, so there are no platform-specific native rebuilds or custom installation steps beyond standard npm resolution.