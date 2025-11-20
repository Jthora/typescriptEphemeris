# Share Workflow & UX Overview

This document captures the end-to-end experience for the chart sharing feature, highlighting state transitions, fallback flows, and QA checkpoints.

## 1. Entry Point
- **Location:** Top bar, to the right of the theme toggle.
- **Visible States:**
  - **Idle:** Share icon button enabled when a chart is available and not calculating.
  - **Disabled:** Button grayed out while chart is computing, fonts not ready, or capture/export is already running.
  - **Busy:** Spinner overlay on the button during image generation or native share activity.

## 2. Primary Flow (Web Share API)
1. User clicks the share button.
2. Fonts readiness & chart availability are confirmed.
3. SVG capture runs, producing a PNG blob (see implementation notes).
4. If `navigator.canShare({ files: [...] })` returns `true`:
   - Call `navigator.share` with:
     - `title`: "Cosmic Cypher Birth Chart"
     - `text`: Optional short message (configurable).
     - `files`: `[birthChart.png]`
   - Success: show a lightweight confirmation toast.
   - Failure (user cancels or API rejects): fall back to the download flow (next section).

## 3. Fallback Flow (Universal Download)
Triggered when:
- Web Share API with files is unsupported.
- Native share call throws/gets rejected.
- Capture succeeds but user agent cannot re-share.

Steps:
1. Generate the PNG blob (shared code path with primary flow).
2. Trigger a download via `<a download>` / `URL.createObjectURL`.
3. Optionally open `https://x.com/intent/tweet` in a new tab with pre-filled share text prompting the user to attach the downloaded image manually.
4. Display a toast explaining what happened and why ("Native sharing unavailable; image downloaded instead").

## 4. Error Handling UX
- **Capture Failure (fonts/assets):**
  - Show inline error (“We couldn’t capture the chart image. Please reload or try again.”).
  - Log diagnostic details (asset failing, CORS issues) to the console for debugging.
- **Download Failure:**
  - Show a toast if the Blob creation fails.
  - Provide instructions to take a manual screenshot as a last resort.
- **Web Share Not Allowed (security context):**
  - Explain that HTTPS context or user gesture is required and suggest the download fallback.

## 5. QA Checklist
- [ ] Share button hidden/disabled when no chart or during calculation.
- [ ] Spinner visible while capture is in progress.
- [ ] Successful Web Share on at least one supported mobile browser (Chrome Android or Safari iOS).
- [ ] Download fallback triggered on desktop Chrome/Firefox.
- [ ] Error message surfaces when DOM capture is intentionally broken (e.g., remove asset or taint canvas).
- [ ] Tweet intent opens with prefilled text after fallback.

## 6. Analytics / Telemetry (Optional Future Work)
- Event: `share_attempt` with fields `{ channel: 'web-share' | 'download', outcome: 'success' | 'fallback' | 'error', errorReason? }`.
- Use to monitor failure rate before enabling new channels.

## 7. Known Limitations
- Only X.com is pre-integrated. Additional networks require further design/validation.
- Web Share API support varies. Desktop browsers rarely support file sharing; fallback is the primary path.
- Large charts may take noticeable time to render; spinner is essential.

## 8. References
- [Implementation Notes](./implementation-notes.md)
- [Risk Mitigation Log](./risk-mitigation.md)
