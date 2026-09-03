---
kind: frontend_style
name: Tailwind CSS v4 Design Tokens + Custom UI Component Library
category: frontend_style
scope:
    - '**'
source_files:
    - src/app/globals.css
    - postcss.config.mjs
    - package.json
    - src/app/layout.tsx
    - src/components/ui/Button.tsx
    - src/components/ui/Card.tsx
    - src/components/ui/index.ts
---

## What system/approach is used

MedAce AI uses **Tailwind CSS v4** (via `@tailwindcss/postcss`) with the new `@theme inline` directive for design tokens, combined with a hand-built **internal component library** under `src/components/ui/`. The visual style is a **dark medical-premium theme** built on CSS custom properties (design tokens) rather than Tailwind's default color palette. Animations and micro-interactions are handled by **Framer Motion**, while iconography comes from **Lucide React**. Class composition is centralized through a shared `cn` utility (`clsx` + `tailwind-merge`).

## Key files and packages

- `src/app/globals.css` — single source of truth for all design tokens, base styles, utility classes, keyframes, and font faces.
- `postcss.config.mjs` — registers `@tailwindcss/postcss` (v4 plugin); no other PostCSS plugins are configured.
- `package.json` — declares `tailwindcss ^4.1.7`, `@tailwindcss/postcss ^4.1.7`, `framer-motion ^13.2.0`, `lucide-react ^0.469.0`, `clsx ^2.1.1`, `tailwind-merge ^2.6.0`.
- `src/app/layout.tsx` — injects Google Font `Inter` as a CSS variable (`--font-sans`) and applies root body classes (`bg-bg text-text font-sans antialiased min-h-screen`).
- `src/components/ui/*.tsx` — individual primitive components (Button, Card, Input, Textarea, Badge, Select, Progress, Spinner, Skeleton, Toast, Modal, Avatar, Tabs, Tooltip).
- `src/components/ui/index.ts` — barrel re-export of the entire UI kit.
- `src/lib/utils.ts` — provides the shared `cn(...)` helper used across every UI component for class merging.

## Architecture and conventions

### Design tokens via CSS variables
All colors, fonts, and effects are declared in a `@theme inline { ... }` block inside `globals.css` using CSS custom properties:
- Background/surface: `--color-bg`, `--color-surface`, `--color-surface-hover`
- Primary accent (teal): `--color-primary`, `--color-primary-light`, `--color-primary-dark`
- AI accent (purple): `--color-accent`, `--color-accent-light`
- Semantic states: `--color-success`, `--color-error`, `--color-warning`, `--color-info`
- Text/border: `--color-text`, `--color-muted`, `--color-border`
- Glass/glow: `--color-glass`, `--color-glow-primary`, `--color-glow-accent`
- Fonts: `--font-sans` (Inter), `--font-urdu` (Noto Nastaliq Urdu)

These tokens are consumed throughout the app via Tailwind arbitrary values or direct CSS references; the root layout applies them as semantic utility classes (`bg-bg`, `text-text`, `font-sans`).

### Base layer and utilities
Styles are organized into Tailwind layers:
- `@layer base` — global resets, scrollbar styling, select option dark-mode overrides, typography defaults.
- `@layer utilities` — reusable compound classes like `.gradient-text`, `.glass-card`, `.glass-nav`, `.gradient-border`, `.gradient-mesh`, `.shimmer`, glow helpers (`.glow-primary`, `.glow-accent`), and animation wrappers (`.animate-fade-in`, `.animate-slide-up`, `.animate-pulse-glow`, etc.).

### Component library pattern
Every UI primitive follows the same shape:
1. Props define a small set of variants and sizes as union types (e.g. `ButtonVariant = "primary" | "secondary" | "ghost" | "danger"`, `CardVariant = "default" | "elevated" | "bordered" | "glass"`).
2. Variant and size mappings are plain `Record<..., string>` objects holding Tailwind class strings that reference the design tokens (e.g. `bg-surface`, `text-text`, `border-border`).
3. Components use `forwardRef` and compose classes via `cn(...)` from `@/lib/utils`.
4. Interactive state is animated with Framer Motion (`whileHover`, `whileTap`) wrapped around a `<motion.div>` container.
5. Each file exports both the component and its props type.

The `index.ts` barrel centralizes imports so consumers do `import { Button, Card, ... } from "@/components/ui"`.

### Typography and fonts
- Inter is loaded via Next.js `next/font/google` and exposed as a CSS variable (`--font-sans`) applied at the root `<html>` element.
- Urdu support is provided by two `@font-face` declarations for Noto Nastaliq Urdu (regular and bold) referenced via `--font-urdu`.
- Global heading styles enforce `font-weight: 700` and `line-height: 1.2`.

### Animation strategy
Keyframes are defined inline in `globals.css` (`fadeIn`, `slideUp`, `slideDown`, `shimmer`, `gradientBorder`, `float`, `pulseGlow`, `tickerScroll`, `drawLine`, `countUp`, `spin-slow`) and exposed as utility classes under `@layer utilities`. Framer Motion handles prop-driven transitions at the component level; CSS keyframes handle persistent/repeating effects.

## Conventions and constraints

- **No CSS modules or SCSS** — the project uses a single `globals.css` with Tailwind v4; there is no per-component stylesheet convention.
- **Design tokens are the single source of truth** — colors, spacing, and fonts are accessed exclusively through the CSS variables declared in `@theme inline`; components never hardcode hex values for brand colors.
- **Components must be variant-driven** — each UI primitive exposes a typed `variant` prop mapped to predefined class sets; ad-hoc inline styling of primitives is avoided in favor of extending via the `className` prop merged through `cn()`.
- **Dark theme only** — all tokens and base styles target a dark background (`#0a0f1a`); no light-mode toggle or alternate theme exists in the codebase.
- **Glassmorphism and glow are first-class visual primitives** — `.glass-card`, `.glass-nav`, `.glow-primary`, `.glow-accent`, and gradient borders are reused consistently across cards, navbars, and hero sections.
- **Animations are split between Framer Motion and CSS keyframes** — user-triggered interactions (hover/tap) go through Framer Motion; looping/background effects (shimmer, float, pulse) go through CSS `@keyframes`.
- **Font loading uses `display: swap`** — both Inter and Noto Nastaki Urdu are loaded with `font-display: swap` to avoid FOIT.