# Calendar Downloads: Overview and Constraints

## Purpose
- Add web-first access to .ics files from the GitHub repo `jthora/planetaryAspectEventsCalendar` without bundling them into the Vite build.
- Support two experiences:
  1) **ICS Downloads page** – list, fetch, cache, and manage .ics files.
  2) **Calendar view** – consume cached .ics for in-app use and re-sync from GitHub when online.

## Data sources
- **Index**: GitHub Trees API — `https://api.github.com/repos/jthora/planetaryAspectEventsCalendar/git/trees/main?recursive=1`
  - Filter to `type === "blob"`, paths ending in `.ics`, and under `calendars/` only.
- **File download**: Raw GitHub URL — `https://raw.githubusercontent.com/jthora/planetaryAspectEventsCalendar/main/<path>`
- **Hosting expectation**: Repo must stay public and CORS-allow raw fetches from the production domain (`https://cosmiccypher.app`).

## Architectural boundaries
- **Dynamic fetch only**: No shipping .ics in the bundle; everything is pulled at runtime.
- **Local cache**: Use `localStorage` for cached .ics text + metadata. Do not rely on IndexedDB unless a future migration is approved.
- **Offline-first**: Cached copies must be downloadable without network; allow re-sync when network returns.
- **Rate limits**: GitHub API is unauthenticated and subject to low rate limits. Keep requests minimal (1 index fetch + targeted downloads). Consider adding a static JSON manifest fallback if limits are hit.
- **Resilience**: Handle storage unavailability (private browsing, quota), network errors, and partial failures gracefully.

## UX principles
- Clear, single-click actions: "Cache locally", "Download", "Refresh cache", "Remove".
- Downloads must stay in-app: prefer fetch→blob triggers over raw GitHub navigation.
- Status visibility: cached badge, byte size, cached timestamp, busy state per item, global index refresh state.
- Safety: allow removal of cached items; do not auto-persist without user action.
- Accessibility: buttons must be labeled, focusable; loading states announced.

## Telemetry / logging (optional)
- Light console logging for index fetch, cache hits/misses, and errors.
- No PII; only path names and byte counts.

## Future extensions (not required now)
- Bulk cache all missing files.
- Static manifest fallback served from this repo to avoid GitHub rate limits.
- Progress indicators for large downloads.
- Service worker integration for offline prefetch.
