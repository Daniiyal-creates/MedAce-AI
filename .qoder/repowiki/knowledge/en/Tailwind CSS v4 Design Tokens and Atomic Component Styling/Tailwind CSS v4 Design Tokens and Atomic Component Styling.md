---
kind: frontend_style
name: Tailwind CSS v4 Design Tokens and Atomic Component Styling
category: frontend_style
scope:
    - '**'
source_files:
    - Next-app/src/app/globals.css
    - Next-app/postcss.config.mjs
    - Next-app/package.json
    - Next-app/src/lib/utils.ts
    - Next-app/src/components/ui/Button.tsx
    - Next-app/src/components/ui/index.ts
    - Next-app/src/app/layout.tsx
---

## System Overview

The MedAce AI Next.js app uses **Tailwind CSS v4** (via `@tailwindcss/postcss` in PostCSS) with the new CSS-first configuration model. There is no `tailwind.config.js`; all styling configuration lives in a single `src/app/globals.css` file using the `@theme inline` directive to define design tokens, and `@layer base` for global resets.

## Design Tokens and Theming

All visual tokens are declared as CSS custom properties inside `@theme inline` in `src/app/globals.css`:
- **Colors**: semantic palette (`--color-primary`, `--color-primary-light`, `--color-primary-dark`, `--color-accent`, `--color-accent-light`, `--color-bg`, `--color-surface`, `--color-text`, `--color-muted`, `--color-success`, `--color-error`, `--color-warning`, `--color-info`, `--color-border`).
- **Fonts**: `--font-urdu` (Noto Nastaliq Urdu + Noto Sans Arabic + Segoe UI fallback) and `--font-sans` (Inter + Segoe UI). The root `body` and headings use the Urdu font; Latin text falls back to Inter.
- **Typography defaults**: body line-height set to `2`, headings bold with `line-height: 1.6`.

Two `@font-face` blocks load Noto Nastaliq Urdu (weights 400/700) and Inter (weight range 100–900) from Google Fonts with `font-display: swap` and narrow `unicode-range` declarations for efficient loading.

Global base styles in `@layer base` apply border color to all elements, set background/text colors on `body`, and enforce the Urdu font family on headings.

## Tailwind Usage Pattern

Components compose utility classes directly via a `cn` helper in `src/lib/utils.ts`, which merges `clsx` and `tailwind-merge` — enabling conditional class composition and conflict resolution. Example from `Button.tsx`:
```tsx
className={cn(
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors ...",
  variantClasses[variant],
  sizeClasses[size],
  className
)}
```

Variants and sizes are defined as string maps (`variantClasses`, `sizeClasses`) rather than Tailwind config extensions, keeping them component-scoped.

## Component Library Structure

Reusable primitives live under `src/components/ui/` and are re-exported through `src/components/ui/index.ts`: Button, Card, Input, Badge, Modal, Select, Progress, Spinner, Toast, Skeleton. Each is a React component that composes Tailwind utilities with the shared token variables (e.g., `bg-primary`, `text-text`, `border-border`).

## Layout and RTL Support

The root layout (`src/app/layout.tsx`) sets `<html lang="ur" dir="rtl">`, making the entire app right-to-left by default to support Urdu content. Global styles and components rely on logical spacing where possible and Tailwind's built-in RTL-aware utilities.

## Conventions Observed

- All theme values go through CSS custom properties in `@theme inline`; components reference them via Tailwind's `var(--color-*)` mapping (e.g., `bg-primary`, `text-text`).
- Font families are referenced via CSS variable names (`var(--font-urdu)`, `var(--font-sans)`), not hardcoded strings in components.
- Class merging always goes through `cn()` from `@/lib/utils` — never raw `className` concatenation.
- No SCSS/Sass or preprocessors; plain CSS only.
- No external UI framework (no shadcn, radix, etc.); all primitives are hand-built.
- Icons come from `lucide-react` and are styled purely with Tailwind utility classes.