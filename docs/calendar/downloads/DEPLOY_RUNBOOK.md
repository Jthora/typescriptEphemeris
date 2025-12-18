# Calendar Downloads: Deploy Runbook

Use this checklist when preparing a build/deploy of the calendar downloads feature.

## 1) Manifest hosting (optional but recommended)
- Place `calendar-manifest.json` at site root (e.g., `public/calendar-manifest.json`) so the app can fetch it at `/calendar-manifest.json`.
- Ensure the manifest matches the schema in MANIFEST_FALLBACK.md and is regenerated when calendars change.
- Set response headers: `Cache-Control: public, max-age=86400` and include `ETag` or `Last-Modified` if possible.

## 2) CORS / network validation
- From the deployed domain (e.g., `https://cosmiccypher.app`), verify:
  - `GET https://raw.githubusercontent.com/jthora/planetaryAspectEventsCalendar/main/calendars/...ics` succeeds.
  - `GET https://api.github.com/repos/jthora/planetaryAspectEventsCalendar/git/trees/main?recursive=1` succeeds (if manifest is absent).
  - `GET /calendar-manifest.json` succeeds (if hosting manifest).
- Trigger an in-app download and confirm it saves via fetch→blob without opening a new tab.
- If any request is blocked, add a small proxy/redirect or rely on the manifest served from same origin.

## 3) QA smoke (minimal)
- Refresh index: confirm list loads and series filter shows Space Force / Zodiac Year.
- Cache one file: badge + timestamp appear.
- Download from cache: works offline after disabling network.
- Remove cached file: badge disappears; no stale entry in localStorage.

## 4) Mobile sanity
- Verify cards stack to single column, buttons remain readable/tappable, filters are accessible.

## 5) Performance spot-check
- Index/manifest fetch completes within a few seconds on broadband; no console errors.

## 6) Rollback guidance
- If GitHub rate limits or CORS issues occur, temporarily host a manifest and rely on cached copies; the app will fall back to tree API if manifest fails.
