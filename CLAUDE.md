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

**Promptlet** is a multi-page, client-side Next.js app (App Router) with View Transitions. The UI is split across two routes with shared weather and book components.

### Key files

- `app/page.tsx` — Home page: hero header + single bookshelf row with all 24 books. Marked `"use client"`.
- `app/library/page.tsx` — Library page: 3 themed shelves with Minecraft decorations inside a wooden bookcase frame. Marked `"use client"`.
- `app/books-data.ts` — Typed book data array shared between both pages.
- `app/components.tsx` — Shared UI components: BookSpine, OpenBook overlay, StarIcon, StarRating, InlineStars, and color helpers.
- `app/weather.tsx` — Weather system components: PixelCloud, SunnyWeather, NightWeather, RainWeather, SnowWeather, WeatherControls.
- `app/weather-provider.tsx` — WeatherShell context provider that wraps both pages with the weather background and controls.
- `app/globals.css` — Global styles, custom keyframe animations, View Transition CSS classes, and Tailwind 4 CSS theme variables.
- `app/layout.tsx` — Root layout: Google Fonts, metadata, WeatherShell wrapper, and `<ViewTransition>` with slide animation types for route navigation.
- `next.config.ts` — Config with `reactCompiler: true` and `experimental.viewTransition: true`.

### Animation system

Book opening uses a 4-phase state machine per book (stored in `useState`):
- `0` — at shelf (default)
- `1` — lifted off shelf
- `2` — centered on screen
- `3` — fully opened (cover flipped via CSS 3D Y-axis rotation)

Staggered entrance animations use a 0.04s delay per book index.

### Navigation

Route transitions between `/` (home) and `/library` use React's `<ViewTransition>` component with `addTransitionType` to trigger directional slide animations. The `navigate-forward` type slides content left, `navigate-back` slides right. Navigation is triggered via `startTransition` + `router.push` with `addTransitionType`.

### Data

Books are hard-coded as a typed array in `page.tsx`. Each book object has: `title`, `author`, `stars`, `colors` (background + text), `dimensions`, and typography metadata. No external data fetching.

### Styling

- Tailwind CSS 4 (PostCSS plugin) — utility classes for layout
- Custom CSS variables defined in `globals.css` under `@theme`
- 3D transforms and `writing-mode: vertical-rl` for spine text
- Three Google Fonts: Noto Serif (`font-headline`), Space Grotesk (`font-label`), Work Sans (`font-body`)
