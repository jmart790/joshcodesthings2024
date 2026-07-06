# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Mega Man X-themed personal portfolio site ("joshcodesthings"). Each portfolio section (work history, art gallery, about, personal projects, jukebox) is styled as a game "stage" guarded by a boss character. Currently a desktop-first POC; responsive support is being added incrementally.

Despite the package name `nuxt-app` and Nuxt references in the README, this is **not a Nuxt app**. It is a plain Vue 3 + TypeScript + Vite SPA using vue-router. There is no file-based routing — routes are declared manually.

## Commands

```bash
npm install        # install dependencies
npm run dev        # Vite dev server (defaults to http://localhost:5173)
npm run build      # production build
npm run preview    # preview the production build
npx vue-tsc --noEmit   # type-check (no lint or test setup exists; vue-tsc is not wired to a script)
```

There is no test suite, linter, or CI in this repository.

## Gotchas

- **Both `vite.config.js` and `vite.config.ts` exist** (the `.js` is a compiled copy). Vite resolves `vite.config.js` first, so a change made only to `vite.config.ts` will silently not take effect — keep both in sync or edit the `.js`.
- **GSAP is listed in `dependencies` but is currently unused.** All animations are hand-written CSS (`@keyframes`, transitions, 3D transforms) in scoped SFC styles.
- CSS custom properties can't be used inside `@media` queries, so shared breakpoints are only *documented* in `src/styles/breakpoints.css` — component styles hard-code the pixel values. When adding responsive rules, mirror those values (desktop-lg 1600px, desktop 1200px, tablet 720px, mobile 420px, short-screen 620px height).

## Architecture

- **Entry**: `src/main.ts` → `src/App.vue`, which wraps `<router-view />` in `src/layouts/default.vue` (the retro green-grid background and Google font imports: 'Press Start 2P' for pixel text, 'Saira' for body text).
- **Routing**: `src/router/index.ts` holds the manual route table with lazy-loaded pages from `src/pages/`. It also owns two hooks central to the site's game mechanic:
  - `beforeEach` blocks `/mystery` (Mosh Man's stage) unless unlocked, redirecting to `/stage-select`.
  - `afterEach` calls `recordVisitedPage` to track stage-completion progress.
- **State**: `src/state/progress.ts` is the only shared state — a module-level Vue `ref` persisted to `localStorage` under the key `jct-progress`. No Pinia/Vuex. Mosh Man unlocks either by visiting all five `REQUIRED_MOSHMAN_PAGES` or by entering the correct code on `/password` (which calls `unlockMoshman()`). `src/pages/stage-select.vue` reads `moshmanUnlocked` to enable/disable his slot in the character slider.
- **Content as code**: page content lives in plain TS modules — `src/constants/characters.ts` (boss roster: name, image, target route, lore text), `src/constants/galleryImages.ts`, `src/data/projects.ts`, `src/data/workHistoryData.ts`. Images are referenced by absolute path into `public/` (e.g. `/computerman.webp`).
- **Components**: organized by the page they belong to (`src/components/stage-select/`, `art-gallery/`, `jukebox/`, etc.), plus `src/components/shared/` for the retro UI kit reused across pages — `RetroButton`, `RetroCard`, `DialogCard`, `ScrambleText`, `TypeWriter`, `RetroIcon`, `PixelArrowDown`.

## Conventions

- SFCs use `<script setup lang="ts">` with type-only `defineProps<{...}>()`, and `<style scoped>` — no CSS frameworks or preprocessors.
- The `@` alias maps to `src/` (configured in both Vite config and `tsconfig.json`), though most existing imports use relative paths.
- Heavy use of CSS variables within components for tuning animations/layout (rotation, scale, positioning) — recent work adjusts these per-breakpoint rather than restructuring markup.
- Visual style: pixel/retro aesthetic — gradient-filled text via `background-clip: text`, step-end blink animations, drop-shadow "pixel" borders. Match this style when adding UI.
