# Share Feature Upgrades

This document captures the next iteration of the share workflow for the astrology application. The goal is to evolve the current "one-click" capture into a configurable flow that produces richer social posts and reusable assets.

## Objectives

1. **Configurable Export** – Allow users to tailor the generated imagery (background, resolution, overlays) before sharing.
2. **Share Content Enrichment** – Surface contextual astrology insights alongside the image so posts carry meaningful text.
3. **User-Friendly Workflow** – Guide users through a modal dialog that previews results, explains options, and reports success/failure states clearly.
4. **Future-Proof Architecture** – Keep the capture pipeline modular so additional export modes (video, animated GIF, multi-chart) can plug in later.

## Proposed User Flow

1. **Trigger** – User clicks the `Share` hardware button in the top bar.
2. **Share Dialog Appears**
   - Displays the current chart metadata (name, date/time, locations).
   - Contains tabs or sections for `Image`, `Copy`, and `Advanced` settings.
3. **User Configures Options**
   - Chooses background style (transparent vs. themed color).
   - Picks output resolution (1× native, 2× retina, custom square size).
   - Toggles overlays (house labels, aspect lines) for the export image.
   - Edits the share copy template (auto-filled angles, aspects, planetary highlights).
4. **Preview Stage**
   - Shows live text preview and a static thumbnail referencing the current settings.
   - Provides validation warnings if external assets are missing or the browser cannot share files.
5. **Action Buttons**
   - `Share Now`: Executes capture + Web Share API or falls back to download.
   - `Copy Image`: Captures and copies PNG to clipboard (progressive enhancement).
   - `Cancel`: Closes dialog without running capture.
6. **Result Feedback**
   - Inline success banner (shared/downloaded/copied) with next-step tips.
   - Error banner with retry guidance and access to logs.

## Technical Considerations

- **Capture Pipeline Enhancements**
  - Accept a `backgroundColor` and `showOverlays` configuration before rasterizing.
  - Provide hooks to inject additional `<style>` rules for alternate themes.
  - Cache the last capture result to avoid redundant SVG serialization when only the text changes.

- **Modal Architecture**
  - Add a `ShareDialog` component rendered via portal to avoid z-index conflicts.
  - Trap focus, provide keyboard shortcuts (ESC to close, Enter to confirm).
  - Persist previous selections in `localStorage` so frequent sharers retain preferences.

- **Share Copy Generation**
  - Introduce helper utilities to summarize key angles, houses, and aspects.
  - Provide templated share strings with tokens (e.g., `{{ascSign}}`, `{{dominantElement}}`).
  - Support optional hashtags and user-supplied message appended to the auto summary.

- **Telemetry & Diagnostics**
  - Log capture duration, Web Share support, and fallback usage for prioritizing optimizations.
  - Flag missing assets (fonts/images) in the dialog before the user shares.

## Dependencies & Open Questions

- Do we need design assets for background options (e.g., gradient library)?
- Should the preview render a real-time canvas snapshot or simply describe the settings?
- How should the share copy handle daylight savings vs UTC conversions?
- Are there privacy concerns around auto-populating location data in share text?

## Next Steps

1. Finalize UX mockups for the modal and preview sections.
2. Break down implementation tasks (modal scaffolding, capture options integration, share copy helpers).
3. Update automated tests to cover new configuration states and capture permutations.
4. Conduct QA across browsers (Chrome, Safari, Firefox) and devices with different Web Share capabilities.

## Implementation Plan

### Phase 1 – Dialog Foundations
- Build a `ShareDialog` component rendered via portal with focus trapping and ESC-to-close.
- Wire the TopBar share button to open the dialog rather than kicking off capture immediately.
- Populate dialog with stub sections for Image Options, Share Copy, and Advanced settings to enable incremental delivery.

### Phase 2 – Image Configuration Controls
- Extend application state to track `ShareOptions` (background style, resolution, overlays) with persistence to `localStorage`.
- Update `captureChart` to accept `backgroundColor`, `includeOverlays`, and `scale` parameters, ensuring transparent export remains the default.
- Add UI controls (toggle + color picker + resolution presets) and surface validation messages for unsupported combinations (e.g., >4× scale).

### Phase 3 – Share Copy Generation
- Create formatting utilities to summarize angles (ASC/MC/DSC/IC), highlight key houses, and list notable aspects.
- Provide template-driven text with editable tokens and optional hashtags/user message field.
- Preview the final share text in the dialog and warn about character limits for common platforms.

### Phase 4 – Execution Flow Integration
- Reuse the existing share state machine within the dialog: show progress indicators, disable CTA while capturing/sharing, and display outcome banners.
- Invoke `captureChart` with user-selected options and feed the generated PNG + share text to `shareOrDownload`.
- Offer additional actions when Web Share is unavailable: download button, “Copy image” (clipboard API), and “Copy text” shortcuts.

### Phase 5 – Polish & QA
- Add inline analytics/logging hooks (capture duration, fallback usage) to inform future optimization.
- Conduct cross-browser/device QA focusing on Web Share availability, color accuracy, and clipboard features.
- Update docs, progress tracker, and risk log; capture learnings for future export modes (video, carousel).

Refer to the progress tracker in this folder for day-to-day updates and task ownership.
