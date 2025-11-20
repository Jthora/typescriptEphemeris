# Timestream Mock → Real Data Progress Tracker

Owner: TBD (TD4 lead)  
Last Updated: 2025-09-28

Use this tracker to monitor delivery of the TD4 milestones that migrate Timestream from mock element data to real ephemeris sources.

## Milestone Checklist

| Phase | Task | Owner | Status | Notes |
|-------|------|-------|--------|-------|
| TD4.1 | Define `EphemerisProvider` interface + types | Copilot | ☑ | Interfaces + meta defined in `types.ts` |
| TD4.2 | Implement `MockEphemerisProvider` (deterministic) | Copilot | ☑ | New provider in `providers/mockProvider.ts`; deterministic oscillation |
| TD4.3 | Implement `AstronomyEngineProvider` (real data) | | ☐ | Use `astronomy-engine` for planetary longitudes; handle retrograde flag |
| TD4.4 | Update worker/client init handshake | Copilot | ☐ | Worker now accepts provider meta; swap to provider samples; real provider pending |
| TD4.5 | Relocate legacy mock helpers + add lint guard | | ☐ | Move `mockTile.ts`/`mockGenerateSamples` under providers; add prod guard |
| TD4.6 | Diagnostics & overlay provider indicator | | ☐ | Show active provider in overlay; warn in prod if mock active |
| TD4.7 | Regression + integration tests | | ☐ | Add deterministic mock tests + real provider smoke test |
| TD4.8 | Documentation updates | | ☐ | Update tech-debt plan, README, and remediation doc |

## Burndown Log

| Date | Update |
|------|--------|
| 2025-09-28 | Tracker created; TD4 tasks not yet started. |
| 2025-09-28 | TD4.1 & TD4.2 complete. Worker now reads tile samples from provider abstraction (Mock provider default). |

## Risks & Dependencies
- **Astronomy Engine dependency**: confirm library version, bundle size impact, and licensing.
- **Time conversions**: align UTC milliseconds with ephemeris time base (TDB/TT) to avoid drift.
- **Performance**: ensure real provider can keep up with tile throughput expectations or cache results.

## Todo Backlog
- [ ] Decide on provider selection mechanism (env flag, runtime toggle, config file).
- [ ] Plan fallback behavior when real provider fails (retry, drop to mock with banner, etc.).
- [ ] Coordinate with analytics/logging if provider changes need telemetry.

---
Keep this tracker updated as each task progresses. Link PRs, design notes, or QA findings in the Notes column for quick context.
