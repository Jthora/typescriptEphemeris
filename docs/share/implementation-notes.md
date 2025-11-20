# Sharing Feature – Implementation Notes

Technical reference for developers implementing or extending the chart sharing capability.

## 1. High-Level Architecture
```
TopBar Share Button
        │
        ▼
ShareController (App.tsx)
        │ captureChart()
        ▼
Capture Pipeline
  ├─ Ensure fonts ready
  ├─ Serialize SVG (ChartWheel)
  ├─ Draw onto canvas (2× scale optional)
  ├─ Convert to Blob/File
        │
        ├─ Web Share API (if available)
        └─ Download fallback + Tweet intent
```

## 2. Key Components & Responsibilities
- **TopBar.tsx**
  - Receives `onShare`, `shareDisabled`, `shareState`, and optional status message.
  - Maintains hardware button styling while exposing loading/success/error visual states and a status banner.

- **App.tsx**
  - Holds chart availability state (`chart`, `isCalculating`).
  - Manages refs to the chart SVG/viewport via `BirthChartVisualization`.
  - Orchestrates the share flow and surfaces share-state messaging (`ShareState` union).

- **BirthChartVisualization.tsx / ChartWheelPure.tsx**
  - Expose forwarded refs (preferably to the `<svg>` element).
  - Optional: Provide utility for retrieving current pixel size.

- **captureChart util (implemented)**
  - `async function captureChart({ svg, width, height, scale?, fileName?, fontReadyTimeoutMs? }): Promise<File>`
  - Handles font readiness, SVG serialization (inlines custom fonts and image assets), canvas drawing, blob creation, and cleanup.
  - Throws `CaptureError` with codes (`'svg-missing'`, `'fonts-timeout'`, `'canvas-unsupported'`, `'image-load'`, `'canvas-blob-failed'`).

- **shareBridge util (implemented)**
  - `async function shareOrDownload({ file, title, text, downloadFileName }): Promise<'shared' | 'downloaded' | 'dismissed' | 'unsupported'>`
  - Uses Web Share API when available (secure context + `navigator.canShare`) and falls back to automatic PNG download.
  - Returns explicit outcome enum so the controller can tailor user messaging.

## 3. SVG Capture Details
- **Fonts:** Await `document.fonts.ready` once before first capture; cache result.
- **Cross-Origin Assets:** Ensure `<image>` tags inside the SVG specify `crossOrigin="anonymous"` when referencing local assets. All assets must be same-origin.
- **Canvas Setup:**
  - Create an offscreen canvas sized to the desired output (e.g., `width * devicePixelRatio`).
  - Set `ctx.drawImage(svgImage, 0, 0, canvas.width, canvas.height)`.
- **Cleanup:** Revoke object URLs and null references promptly to prevent memory leaks.

## 4. Web Share Integration
- Feature detect only when running in a secure context (`window.isSecureContext`).
- `navigator.canShare({ files: [file] })` is the gatekeeper.
- Provide informative catch blocks:
  - User canceled: treat as graceful exit with no toast.
  - API rejected: log error and fall back.

## 5. Download Fallback
- Create a temporary anchor element with `download` attribute.
- Use `URL.createObjectURL(blob)` and click programmatically.
- Revoke the URL in a `setTimeout` to avoid revoking before the download completes.
- Optional: After download, `window.open('https://x.com/intent/tweet?...', '_blank', 'noopener')`.

## 6. State Management
- App-level share state suggestions:
  ```ts
  type ShareState = 'idle' | 'capturing' | 'sharing' | 'fallback' | 'error';
  const [shareState, setShareState] = useState<ShareState>('idle');
  const [shareMessage, setShareMessage] = useState<string | null>(null);
  ```
- Reflect state in the button (spinner/disabled) and optional toast component.

## 7. Testing Strategy
- **Unit Tests:**
  - captureChart util with mocked SVG (jsdom) to ensure blob creation.
  - shareBridge util verifying branching logic for `navigator.share` support.
- **Integration Smoke:**
  - In-browser manual test capturing real chart (dev mode) to confirm fonts, assets, and fallback.
- **Regression Protection:**
  - Add a playwright/cypress script to ensure the button toggles disabled state when `isCalculating` changes.

## 8. Extensibility
- Additional platforms (e.g., Facebook, LinkedIn) should hooked into `shareBridge` while respecting stability criteria:
  - Only enable behind feature flags until tested thoroughly.
  - Document new risk mitigations before shipping.

## 9. Outstanding Questions / TODOs
- Where to surface success/error toasts (global vs. TopBar inline message)?
- Need i18n support for share text?
- Should we allow the user to customize share text prior to invoking the Web Share API?

Refer to the [Risk Mitigation Log](./risk-mitigation.md) before making changes that could impact stability.
