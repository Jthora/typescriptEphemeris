# Share Upgrades Progress Tracker

Owner: GitHub Copilot
Last Updated: 2025-10-01

Use this tracker to monitor feature work for the configurable share dialog and enhanced post content.

## Milestone Checklist

| Task | Owner | Status | Notes |
| --- | --- | --- | --- |
| Draft share dialog UX and copy templates |  | ☑ | First-pass modal layout and copy preview implemented in code |
| Scaffold `ShareDialog` component with portal + accessibility |  | ☑ | Focus trap, ESC handling, and portal rendering shipped |
| Add share configuration state to `App.tsx` (options + persistence) |  | ☑ | LocalStorage-backed `ShareOptions` with memoized text builder |
| Extend capture pipeline for background color & overlay toggles |  | ☑ | `captureChart` now accepts background fills + hidden selectors |
| Generate share copy (angles, houses, key aspects) |  | ☑ | New formatter surfaces angles & top aspects with hashtag bundle |
| Integrate Web Share + download flow via dialog CTA |  | ☑ | Dialog CTA reuses share state machine with configurable options |
| Implement inline status messaging (success, errors, fallbacks) |  | ☑ | Dialog footer mirrors share states while keeping banner for global context |
| Outline responsive layout & theme-aligned background plan |  | ☑ | Plan captured in tracker; background presets mapped to theme tokens |
| Refactor dialog into modular subcomponents + responsive grid |  | ☑ | `ShareDialog` reorganized with cards, grid layout, compact toggles |
| Align background presets with live theme tokens & previews |  | ☑ | Background swatches resolve CSS variables; creative preset labeled |
| Tighten copy preview panel & clipboard UX |  | ☑ | Preview height constrained; copy feedback streamlined |
| Simplify appearance controls (two modes + compact resolution) |  | ☑ | Background picker reduced to Opaque vs Transparent; resolution buttons inline |
| Split dialog into Share + Settings tabs with platform actions |  | ☑ | Introduced tabbed layout, Post to X workflow, and explicit export CTA |
| QA across browsers & devices (Web Share support matrix) |  | ☐ | Document results in verification log |
| Capture before/after screenshots & update docs |  | ☐ | Needed for release notes + visual validation |

## Burndown Log

| Date | Update |
| --- | --- |
| 2025-10-01 | Tracker created; awaiting UX sign-off for modal structure. |
| 2025-10-01 | Implemented share dialog, configurable options, capture upgrades, and copy generator; ready for cross-browser QA. |
| 2025-10-01 | Rebuilt dialog layout with modular cards, theme-derived backgrounds, and compact preview. |
| 2025-10-01 | Slimmed appearance controls: two background options, inline resolution row, and no subtext. |
| 2025-10-01 | Split Share dialog into tabs, added Post to X helper, and renamed export flows. |

## Risks & Mitigations

- **Complexity Creep** – Clear scope boundaries (image tweaks, text tweaks) before coding. Consider flagging advanced features for future iterations.
- **Browser Limitations** – Web Share file support varies; ensure download fallback + clipboard copy cover gaps.
- **Asset Availability** – Background presets must be locally hosted to remain same-origin for capture.

## Next Actions

1. Capture screenshots of each background preset & overlay combo for QA doc.
2. Validate clipboard + download fallbacks on Safari/iOS and older Android devices.
3. Document responsive behavior and note outstanding design feedback loops.
4. Outline integration path for .ics attachment and additional social targets.
5. Triage post-launch enhancements (preset management, drag-to-reorder sections).
