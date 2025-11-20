# Share Feature Progress Tracker

Owner: _TBD_
Last Updated: 2025-10-02

Use this tracker to monitor engineering + documentation work for the share feature. Update status as tasks land.

## Milestone Checklist

| Task | Owner | Status | Notes |
| --- | --- | --- | --- |
| Wire share button into `TopBar` with loading/disabled states | Copilot | ☑ | Added hardware-style button with busy/success/error indicators |
| Expose chart SVG ref via `BirthChartVisualization` / `ChartWheelPure` | Copilot | ☑ | Forward refs wired, size callback plumbed |
| Build capture utility (SVG → canvas → PNG File) | Copilot | ☑ | `captureChart` util added with font and error handling |
| Implement share controller with Web Share + download fallback | Copilot | ☑ | Share orchestration in `App.tsx` with capture + fallback |
| Add user feedback (spinner + toast messaging) |  | ☐ | Decide on toast mechanism |
| Update documentation set (README, workflow, implementation, risks) | Copilot | ☑ | Initial docs drafted 2025-10-01 |
| Manual QA pass across supported browsers |  | ☐ | Schedule post-implementation |

## Burndown Log

| Date | Update |
| --- | --- |
| 2025-10-01 | Documentation scaffold created; engineering tasks pending kickoff. |
| 2025-10-02 | captureChart util implemented; share controller work unblocked. |
| 2025-10-02 | Share controller + TopBar button integrated with fallback download path. |
| 2025-10-02 | Inlined cosmic symbol assets during capture so PNG output retains imagery. |
| 2025-10-02 | Embedded Aldrich/Iceberg font resources in capture pipeline for accurate typography. |
| 2025-10-02 | Applied Aldrich font styling to house numbers and angle labels in capture output. |

## Next Actions
- Assign engineering owner(s) for remaining tasks.
- Validate same-origin asset assumptions during QA for cross-browser capture.
- Decide on toast/notification approach for fallback messaging.

## Risks & Follow-ups
- Monitor items in the [Risk Mitigation Log](./risk-mitigation.md); ensure mitigations are implemented before additional platforms are added.
