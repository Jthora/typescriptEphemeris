# Static Manifest Fallback (Design)

Goal: avoid GitHub tree API rate limits and reduce latency by optionally serving a prebuilt manifest from this repo (or CDN). The app should prefer the manifest when available, falling back to the GitHub tree API if not.

## Manifest shape
```json
{
  "version": 1,
  "generatedAt": "2025-12-17T00:00:00Z",
  "items": [
    {
      "path": "calendars/space_force_2025.ics",
      "size": 12345,
      "sha256": "<hex>",
      "title": "Space Force 2025 Calendar",
      "series": "Space Force",
      "year": "2025"
    }
    // ... more entries
  ]
}
```

Fields:
- `path`: relative path under repo root.
- `size`: byte size (optional but recommended for UI display).
- `sha256`: optional integrity; enables cache validation.
- `title`: optional human-friendly name; if present, UI prefers it over derived titles.
- `series` / `year`: optional hints to avoid regex classification on the client.
- `version`: bump when schema changes.

## Hosting options
- Serve `calendar-manifest.json` from this repo under `docs/` or `public/` on the deployed site.
- CDN-friendly: set long cache with `Cache-Control: public, max-age=86400` and include `ETag`/`Last-Modified`.

## Client resolution order
1. Try fetching manifest (`/calendar-manifest.json` on same origin or a known absolute URL).
2. If manifest 404s or fails, fall back to GitHub tree API.
3. If both fail, show an error and allow retry.

## Client logic changes (minimal)
- Add `fetchIcsManifest(manifestUrl)` helper returning the same shape as `fetchIcsIndex()`.
- Merge paths: manifest result replaces the tree result; keep `downloadUrl` derivation using raw GitHub unless manifest supplies a direct URL.
- Optional: verify `sha256` after download when present.

## Operational steps to generate manifest
1. Run a script (node) that:
   - Calls GitHub tree API (or local checkout) to list `.ics` files under `calendars/`.
   - Records size, path, series/year hints (regex or directory-based), and optional sha256 of file content.
   - Writes `calendar-manifest.json` to `docs/calendar/downloads/` (or `public/`).
2. Commit the manifest when calendars are updated; regenerate on change.

## Pros / Cons
- Pros: fewer GitHub API calls; predictable payload; friendlier to offline-first; can pre-label series/year.
- Cons: Requires regeneration when calendars change; risk of stale data if not updated; sha256 adds cost if computed every time.

## Rollout suggestion
- Phase 1: Implement manifest fetch with graceful fallback; host initial manifest.
- Phase 2: Add integrity check (optional) and telemetry for manifest vs tree usage.
- Phase 3: Automate manifest generation in CI when calendar repo updates (future).
