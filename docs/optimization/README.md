# Performance and Memory Optimization Guide

This document explains the key optimizations implemented in the Astrology Chart app and how they work. It also includes guidance for extending them.

## Contents
- ThemeManager listener lifecycle
- HMR-safe singletons and timers
- Caching bounds and LRU eviction
- Production-safe asset handling (O1/O2)
- Prominence bar overflow fix
- Rendering/memoization improvements
- Optional workerization plan

---

## ThemeManager listener lifecycle

Problem: The theme system used `addEventListener('change', this.handleSystemThemeChange.bind(this))` and removed a different function reference in cleanup, causing listeners to accumulate across inits/HMR.

Fix: Store a pre-bound handler and use the same reference for add/remove.

Code: `src/theme-manager.ts`
- Added `boundSystemListener` initialized with `this.handleSystemThemeChange.bind(this)`.
- Use `mediaQuery.addEventListener('change', boundSystemListener)` in `initialize()`.
- Use `mediaQuery.removeEventListener('change', boundSystemListener)` in `cleanup()`.

Outcome: No more leaked listeners on HMR or re-init.

---

## HMR-safe singletons and timers

Problem: Module-level `setInterval` calls created duplicate timers on Hot Module Reload (HMR), leading to memory leaks and duplicate work.

Fix: Use global singletons and clear/reset intervals on reload.

Code:
- `src/utils/retrograde-cache.ts`
- `src/utils/aspect-optimizer.ts`

Approach:
- Expose singleton via `globalThis.__retrogradeCache__` / `globalThis.__aspectOptimizer__`.
- Guard interval with `globalThis.__...Interval__`:
  - Clear existing interval if present.
  - Create a new interval and store the ID.
- Add `import.meta.hot?.dispose(() => clearInterval(...))` to clean up on HMR.

Outcome: Only one timer runs; no duplicate cleanup loops.

---

## Caching bounds and LRU eviction

Problem: Caches could grow unbounded during long sessions with varied inputs.

Fix: Add `MAX_CACHE_ENTRIES` and evict the oldest when exceeding the cap.

Code:
- `retrograde-cache.ts`: `MAX_CACHE_ENTRIES = 1000`
- `aspect-optimizer.ts`: `MAX_CACHE_ENTRIES = 500`

Outcome: Memory remains bounded under heavy usage.

---

## Production-safe asset handling (O1/O2)

Problem: O1/O2 symbol images referenced with string paths like `/src/assets/...` break in production builds.

Fix: Import asset URLs from Vite-managed modules and use them directly.

Code:
- `assets/images/symbols/universal/index.ts` (already exports images)
- Updated:
  - `PlanetaryHarmonicsSidebar/components/ForceComparisonBar.tsx`
  - `PlanetaryHarmonicsSidebar/components/ForceIndicator.tsx`

Outcome: Symbols render in both dev and prod reliably.

---

## Prominence bar overflow fix

Problem: The 4th bar sometimes extended beyond its track.

Fix: Calculate left edge and width, clamp within [0, 100 - width]. Remove translateX.

Code: `PlanetaryHarmonicsSidebar/components/ForceComparisonBar.tsx`

Outcome: Prominence indicator always stays within bounds.

---

## Rendering/memoization improvements

- Wrapped `ForceComparisonBar` in `React.memo` to avoid re-renders when props are stable.
- Wrapped `DimensionalComparisons` in `React.memo` to avoid grid re-renders when inputs are unchanged.
- Replace DOM reads for theme in `ForceComparisonBar` with `themeManager.getActualTheme()`.

---

## Optional workerization plan

To further offload CPU-intensive work from the main thread:

1. Create a web worker (e.g., `workers/aspectWorker.ts`) that imports `aspect-optimizer` and exposes a `calculateAspectsOptimized` handler via `onmessage`/`postMessage`.
2. In `astrology.ts`, route aspect/retrograde computations to the worker and cache results by key.
3. Use an AbortController-like pattern to cancel stale requests when new inputs arrive.

---

## Development tips

- Gate verbose logs with `if (import.meta.env.DEV) ...`.
- Pause real-time intervals when `document.hidden`.
- Prefer CSS transforms/opacity over heavy box-shadows where possible.

---

If you need, run a quick checklist:
- One interval per cache? ✔
- Theme listener added/removed exactly once? ✔
- Symbols show in prod? ✔
- Prominence bar bounded? ✔
- Grid re-renders only on data change? ✔
