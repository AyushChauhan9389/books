# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Lint with Biome
npm run format    # Auto-format with Biome
```

No test suite is configured.

## Architecture

**Promptlet** is a single-page, client-side Next.js app (App Router). The entire interactive UI lives in `app/page.tsx` — there are no API routes, no database, and no external integrations.

### Key files

- `app/page.tsx` — The entire app: book data array, animation state machine, and all React components. Marked `"use client"`.
- `app/globals.css` — Global styles, custom keyframe animations, and Tailwind 4 CSS theme variables (colors, fonts).
- `app/layout.tsx` — Root layout: Google Fonts loading, metadata, and conditional dev-tool script injection.
- `next.config.ts` — Minimal config; `reactCompiler: true` enables the React Compiler for auto-memoization.
- `biome.json` — Linting and formatting rules (2-space indent, git-aware, import organization).

### Animation system

Book opening uses a 4-phase state machine per book (stored in `useState`):
- `0` — at shelf (default)
- `1` — lifted off shelf
- `2` — centered on screen
- `3` — fully opened (cover flipped via CSS 3D Y-axis rotation)

Staggered entrance animations use a 0.04s delay per book index.

### Data

Books are hard-coded as a typed array in `page.tsx`. Each book object has: `title`, `author`, `stars`, `colors` (background + text), `dimensions`, and typography metadata. No external data fetching.

### Styling

- Tailwind CSS 4 (PostCSS plugin) — utility classes for layout
- Custom CSS variables defined in `globals.css` under `@theme`
- 3D transforms and `writing-mode: vertical-rl` for spine text
- Three Google Fonts: Noto Serif (`font-headline`), Space Grotesk (`font-label`), Work Sans (`font-body`)
