# Calendar Downloads: Implementation Guide

This guide is a step-by-step build plan for the calendar downloads feature. Follow in order to avoid missing subtle integration points.

## 1) Utilities
- Create `src/utils/icsRepository.ts` with:
  - `fetchIcsIndex()` — GET the GitHub tree API, filter `.ics` under `calendars/`, return `{ path, size, downloadUrl, title }` sorted alphabetically.
  - `fetchAndCacheIcs(item)` — fetch raw URL, store `{ content, downloadedAt, size, path }` in `localStorage` (gracefully handle storage errors).
  - `loadIcsCache()`, `saveIcsCache()`, `removeCachedIcs()`, `getCachedIcsList()` helpers.
  - `formatBytes()` for display.
  - `makeIcsBlob()` if you need to generate `Blob` downloads from cached text.
  - `downloadViaBlob()` helper to fetch raw content (or reuse cache) and trigger a client-side download without navigating to GitHub.
  - `humanizeTitle()` to render friendly headings (e.g., `Space Force 2025 Calendar`) from file paths; prefer manifest-provided titles when available.
- Storage guard: probe `localStorage` with a try/catch; fall back to in-memory if unavailable.
- Path encoding: percent-encode each segment before composing the raw URL.

## 2) Routing and navigation
- Add routes in `src/App.tsx`:
  - `/calendar-downloads` → CalendarDownloadsPage.
  - `/calendar` → CalendarPage (the in-app calendar consumer view).
- Update `TopBar` props to include `onOpenCalendar`, `onOpenCalendarDownloads`, and active state flags.
- Wire navigation buttons into ChartExperience, TutorialPage, InfoPage so all surfaces can reach the calendar pages.

## 3) CalendarDownloadsPage (list + cache UI)
- Location: `src/pages/CalendarDownloadsPage.tsx`.
- Page layout:
  - TopBar with calendar downloads active.
  - Header with description, "Refresh index", repo link, cached count, and error surface.
  - Grid of cards built from `fetchIcsIndex()` results.
- Card content per `.ics` file:
    - Human-friendly title (manifest `title` or `humanizeTitle(path)`), with the source path shown in a subdued meta line.
    - Byte size (from index), cached badge if present, cached timestamp if present.
  - Actions:
    - Download via fetch→blob without leaving the page (cached copies should prefer cache-first; uncached can fetch + optionally cache then download).
    - Cache locally (or refresh cache if already cached) using `fetchAndCacheIcs`.
    - Download from cache (Blob) when cached.
    - Remove cached copy.
- State management:
  - `loadingIndex` for the tree fetch.
  - `busy[path]` map for per-item cache/refresh operations.
  - `error` string for user feedback.
- Sorting: alphabetical by path.
- Accessibility: label buttons and ensure focus styles remain.

## 4) CalendarPage (cached consumer view)
- Location: `src/pages/CalendarPage.tsx`.
- Purpose: operate on cached `.ics` files (download from cache, refresh from GitHub, remove) and display basic metadata for in-app calendar use.
- Behaviors:
  - Load cache on mount via `loadIcsCache()`.
  - Fetch index to enable refresh-from-GitHub buttons for cached items.
  - Show counts: cached vs missing-from-index.
  - Provide a "cache missing" bulk action (optional; current flow can loop through missing via handleSyncMissing).
  - Extract metadata from `.ics` (X-WR-CALNAME, X-WR-CALDESC, first SUMMARY) for quick labeling; fail soft if absent.
- Actions per cached item:
  - Download cached copy (Blob).
  - Refresh from GitHub if the item exists in index (uses `fetchAndCacheIcs`).
  - Remove cached copy.

## 5) Styling
- Shared stylesheet `src/pages/CalendarPages.css` for both pages.
- Patterns: grid cards, pills for meta, inline status banners, responsive `minmax(260px, 1fr)` columns.
- Reuse app color tokens; keep backgrounds consistent with tutorial/info pages.

## 6) Error handling and edge cases
- GitHub rate limits: show an error banner if index fetch fails; allow retry. Keep requests minimal.
- Storage unavailable: catch and warn; disable cache actions or show a message.
- Partial failures: do not block other files if one download fails; keep per-item busy flags.
- Offline: cached downloads must work; network-only actions should surface errors.

## 7) QA / validation pass
- See `QA_CHECKLIST.md` in this folder for detailed scenarios.
- Minimum manual flow:
  1) Refresh index.
  2) Cache one file.
  3) Download from cache while online and after toggling offline.
  4) Refresh cache to confirm overwrite succeeds.
  5) Remove cache and confirm UI updates.

## 8) Future-proofing hooks
- Optional static manifest: serve `calendar-manifest.json` from this repo to avoid GitHub API limits; fall back to tree API when manifest is absent.
- Service worker: prefetch cached items during install for offline-first.
- Telemetry: log index fetch duration, cache size, cache hits/misses (no PII).
- Toasts/status: surface download success/failure and cache refresh results with lightweight toasts.
