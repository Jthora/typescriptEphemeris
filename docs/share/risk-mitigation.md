# Share Feature – Risk Mitigation Log

Stability and robustness guide every design choice. This log documents current risks, their mitigations, and follow-up actions.

## 1. Risk Register

| Risk ID | Description | Likelihood | Impact | Mitigation | Status |
| --- | --- | --- | --- | --- | --- |
| R1 | Browser lacks Web Share API with file support (desktop browsers, older mobile) | High | Medium | Provide download fallback + optional X tweet intent link. Detect API support before invoking. | Mitigated |
| R2 | Canvas becomes tainted due to cross-origin assets, breaking export | Medium | High | Ensure SVG `<image>` elements use same-origin URLs and `crossOrigin="anonymous"`. Catch errors and show user-friendly retry instructions. | Pending validation |
| R3 | Fonts not ready when capture occurs, causing incorrect glyph rendering | Medium | Medium | Await `document.fonts.ready` before first capture; cache readiness flag to prevent repeated waits. | Planned |
| R4 | Capture pipeline takes too long on large charts, leading to perceived hangs | Medium | Medium | Show spinner on share button, enforce timeout (e.g., 5s) after which we cancel and show message. Consider downscaling resolution if necessary. | Pending implementation |
| R5 | Users misinterpret fallback download as failure | Low | Medium | Display toast explaining fallback and listing next steps (“Image downloaded—attach it manually in X”). | Planned |
| R6 | Web Share invocation rejected due to insecure context or missing user gesture | Low | High | Ensure share button interaction counts as user gesture; disable feature on non-HTTPS origins (show tooltip). | Planned |

## 2. Decision Log
- **Fallback-first strategy (2025-10-01):** Web Share treated as optional improvement; download path considered canonical. Prevents functionality loss on unsupported browsers.
- **SVG capture vs. DOM screenshot:** Chosen to keep capture deterministic, smaller dependency surface, and less failure-prone than HTML rasterization libraries.

## 3. Monitoring & Alerts
- Log share attempts to console in development with `{ channel, outcome }` for manual review.
- Optional future enhancement: in-app analytics event `share_attempt` to quantify failure rates before expanding channels.

## 4. Future Work / Open Mitigation Tasks
- [ ] Validate asset loading in production build to guarantee same-origin status.
- [ ] Implement toast/notification system (if not already available) for fallback messaging.
- [ ] Add integration test covering intentional capture failure to confirm error path.

Keep this document updated whenever new risks are identified or mitigations change.
