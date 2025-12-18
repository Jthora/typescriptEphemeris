# Calendar Downloads: Progress Tracker

Use this file to log status as you implement and refine the calendar downloads feature.

## Status summary
- Current state: implementation in place with bulk cache-missing action, series filters, manifest fallback implemented, and deploy runbook drafted; continue refining UX, error handling, and offline validation.
- Planned next: validate CORS from production, keep junk `.ics` filtered out, and finish QA/perf passes.
- Target release window: TBD

## Milestone checklist
- [x] Architecture documented (OVERVIEW)
- [x] Implementation guide written (IMPLEMENTATION_GUIDE)
- [x] QA scenarios defined (QA_CHECKLIST)
- [x] UX guidance captured (UX_NOTES)
- [ ] Confirm GitHub API + CORS from prod domain
- [x] Implement fetch→blob download flow (no raw GitHub navigation)
- [x] Add lightweight download success/failure toasts
- [x] Add bulk “cache missing” action (optional)
- [x] Add static manifest fallback design (optional)
- [x] Implement manifest fallback in client (uses /calendar-manifest.json if available)
- [x] Add deploy runbook (DEPLOY_RUNBOOK)
- [x] Filter index to calendars/ and present human-friendly titles
- [x] Add grouped toolbar with layout toggle and status chip on downloads page
- [ ] Manual QA pass (desktop)
- [ ] Manual QA pass (mobile)
- [ ] Performance sanity check (index fetch, cache latency)

## Work log
- 2025-12-17: Added core documentation set (overview, implementation guide, QA checklist, UX notes).
- 2025-12-17: Implemented bulk “cache missing” action on Calendar Downloads page.
- 2025-12-17: Added series filters for Space Force / Zodiac Year calendars.
- 2025-12-17: Documented static manifest fallback approach (MANIFEST_FALLBACK.md).
- 2025-12-17: Implemented manifest fallback fetch in calendar pages.
- 2025-12-17: Added deploy runbook for manifest/CORS validation.
- 2025-12-17: Switched downloads to fetch→blob, removed raw GitHub navigation, and added in-app toasts for cache/download events.
- 2025-12-17: Filtered index to `calendars/` only and added human-friendly titles with source-path context.

## Risks / watch items
- GitHub rate limits (unauthenticated API).
- CORS or raw GitHub availability from production domain.
- LocalStorage availability in private browsing / quota situations.
- GitHub raw download UX: must remain single-click and avoid raw page navigation.

## Next actions
- Validate index fetch from `https://cosmiccypher.app` to raw GitHub.
- Verify friendly titles render and junk files remain hidden (calendars/ filter).
- Run QA checklist on desktop and mobile; record outcomes here.
- Provide optional /calendar-manifest.json on prod or confirm tree API remains acceptable.
- Follow DEPLOY_RUNBOOK steps before release; note any CORS/rate-limit findings here.

## References
- Overview: OVERVIEW.md
- Implementation details: IMPLEMENTATION_GUIDE.md
- Manifest strategy: MANIFEST_FALLBACK.md
- Deploy validation: DEPLOY_RUNBOOK.md
- QA scenarios: QA_CHECKLIST.md
- UX text guidance: UX_NOTES.md
