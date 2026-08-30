---
kind: frontend_style
name: Tailwind v4 Design System with Custom Dark Medical Theme
category: frontend_style
scope:
    - '**'
source_files:
    - src/app/globals.css
    - postcss.config.mjs
    - package.json
    - src/components/ui/index.ts
    - src/components/ui/Button.tsx
    - src/app/layout.tsx
    - src/components/layout/AppLayout.tsx
---

## What system/approach is used

The MedAce AI application uses **Tailwind CSS v4** (via `@tailwindcss/postcss` and `tailwindcss@^4.1.7`) as its styling framework, combined with a custom design token layer defined in `src/app/globals.css`. The project follows a component-driven UI architecture: shared visual primitives live under `src/components/ui/` (Button, Card, Input, Modal, Toast, etc.) and are composed into layout components (`AppLayout`, `Navbar`, `Sidebar`, `Footer`) that wrap page routes under `src/app/`. Typography is handled via Google Fonts — Inter for English and Noto Nastaliq Urdu for Urdu content — loaded through Next.js `next/font/google` and exposed as CSS variables.

## Key files and packages

- `src/app/globals.css` — central stylesheet defining the theme, fonts, base styles, utility classes, and keyframe animations.
- `postcss.config.mjs` — PostCSS config registering `@tailwindcss/postcss` (Tailwind v4 plugin).
- `package.json` — declares Tailwind v4, `tailwind-merge`, `clsx`, and `lucide-react` as dependencies; no CSS-in-JS or SCSS tooling.
- `src/components/ui/index.ts` — barrel re-export of all UI primitives, forming the public component surface.
- `src/components/ui/Button.tsx` — canonical example of how variants, sizes, and state are composed using `cn()` from `@/lib/utils`.
- `src/app/layout.tsx` — root layout that injects the Inter font variable and applies global body classes (`bg-bg text-text font-sans antialiased`).
- `src/components/layout/AppLayout.tsx` — composes Navbar + Sidebar + main content area using semantic tokens (`bg-bg`, `min-h-screen`).

## Architecture and conventions

### Design tokens via `@theme inline`
All colors, fonts, and semantic tokens are declared in `globals.css` inside a `@theme inline { ... }` block. This is the single source of truth for the visual identity:
- Background/surface palette: `--color-bg`, `--color-surface`, `--color-surface-hover`.
- Primary accent: teal (`--color-primary`, `--color-primary-light`, `--color-primary-dark`).
- AI accent: purple (`--color-accent`, `--color-accent-light`).
- Semantic states: `--color-success`, `--color-error`, `--color-warning`, `--color-info`.
- Text/border: `--color-text`, `--color-muted`, `--color-border`.
- Fonts: `--font-sans` (Inter) and `--font-urdu` (Noto Nastaliq Urdu).

These tokens are consumed throughout the app via Tailwind's arbitrary value syntax (e.g., `bg-bg`, `text-text`, `border-border`, `focus:ring-primary/30`), keeping component markup free of hardcoded hex values.

### Component composition pattern
Each UI primitive in `src/components/ui/` follows a consistent shape:
- Props define a finite set of `variant` and `size` enums (see `ButtonVariant = "primary" | "secondary" | "ghost" | "danger"`, `ButtonSize = "sm" | "md" | "lg"`).
- Class maps (`variantClasses`, `sizeClasses`) hold the Tailwind class strings per variant/size.
- `className` is merged with base classes via `cn(...)` (from `@/lib/utils`, which wraps `clsx` + `tailwind-merge`) so callers can override without breaking the design system.
- Icons come exclusively from `lucide-react` (e.g., `Loader2` for loading spinners).

### Layered CSS organization
`globals.css` is structured with clear sections:
1. `@import "tailwindcss"` at the top.
2. `@theme inline` for design tokens.
3. `@font-face` declarations for Inter and Noto Nastaliq Urdu (loaded from Google Fonts CDN).
4. `@layer base` for global resets (borders, body, headings, scrollbar theming).
5. `@layer utilities` for reusable helper classes like `.gradient-text`, `.glass-card`, and animation classes (`.animate-fade-in`, `.animate-slide-up`, `.animate-slide-down`).
6. Top-level `@keyframes` blocks for those animations.

### Layout and typography conventions
- The root `<html>` tag sets `lang="en" dir="ltr"` and applies the Inter font variable via `className={inter.variable}`.
- The `<body>` gets `bg-bg text-text font-sans antialiased min-h-screen` to establish the dark theme baseline.
- Page layouts use `AppLayout` which stacks a `Navbar` and `Sidebar` around a centered `<main>` constrained by `max-w-7xl px-4 sm:px-6 lg:px-8` for responsive padding.
- Urdu text is styled using the `--font-urdu` token, enabling bilingual typography within the same theme.

### Responsive strategy
Responsive behavior is expressed purely through Tailwind's built-in breakpoints (`sm:`, `lg:`) — there is no custom media query setup beyond what Tailwind provides. Spacing and widths scale across breakpoints (e.g., the main content container's padding changes from `px-4` on mobile to `px-6 lg:px-8` on large screens).

## Conventions and constraints

- **No CSS modules, no SCSS/SASS**: All styling lives in `globals.css` and inline Tailwind class strings; no preprocessor configuration exists.
- **Single source of color/typography truth**: New colors or fonts must be added to the `@theme inline` block in `globals.css`; components should never hardcode hex values.
- **Component API contract**: Every new UI primitive should expose typed `variant` and `size` enums with corresponding class maps, and merge user `className` via `cn()` to preserve overrideability.
- **Icon library lock-in**: Visual icons are sourced only from `lucide-react`; no other icon libraries are imported.
- **Animation tokens**: Reusable animations are defined once in `@layer utilities` (fade-in, slide-up, slide-down) and referenced by class name rather than duplicated.
- **Dark-theme-first**: The entire palette is designed around a dark background (`#0a0f1a`); light-mode support would require extending the theme rather than overriding individual components.