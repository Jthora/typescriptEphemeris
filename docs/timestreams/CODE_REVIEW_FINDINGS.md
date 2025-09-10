# Timestream / BottomDrawer Initial Code Review Findings (M0 Diagnostic Phase)

Date: 2025-08-30
Scope: `astrology-chart/src/components/BottomDrawer.tsx` + `src/timestream/*` (Canvas, Fallback, Hook, Worker, GL init, Shaders, Constants, Element Mapping) and related app integration. Focus on freeze/runaway risk, memory/CPU/GPU churn, architectural correctness.

## High-Risk Issues

1. Unbounded Request Key Growth
- File: `useTimestreamData.ts`
- `requestedKeysRef` accumulates every requested tile id and is never pruned when tiles are evicted (`tileMapRef` capped). Memory grows with panning/zooming. Set membership checks become slower, possible eventual freeze.

2. Hover-Induced Redraw Storm
- Files: `TimestreamCanvas.tsx`, `BottomDrawer.tsx`, `TimestreamFallbackCanvas.tsx`
- `onHoverTime` / `onHoverDetail` propagate to parent state each pointer move. Parent re-render triggers full pack & GPU upload (WebGL) or full repaint (fallback). Acts like an unthrottled animation loop doing heavy work; can lock UI.

3. Missing Worker & GL Resource Cleanup
- Worker created once, never terminated on unmount; remount (panel toggle / HMR) spawns duplicates → redundant tile generation.
- WebGL resources (textures, program, VAO) never deleted; repeated mounts leak GPU memory.

4. Fallback Renderer CPU Explosion
- Per re-render loops tiles→cols→rows issuing many `fillRect` calls (e.g. 36K per tile) triggered by hover state. Rapid pointer movement produces millions of draw calls per second.

5. Texture Packing Without Guard
- All visible tiles concatenated horizontally. No check vs `MAX_TEXTURE_SIZE`; potential GL errors, unpredictable behavior, repeated full uploads.

6. Row Mapping Null Safety Bug
- `rowMap` uses `tiles[0]?.bodies.indexOf(p)`; when `tiles` empty or body missing, `.indexOf` on undefined errors or returns -1 mapped to 0 (silent row duplication). Can crash or misrepresent data.

7. Continuous Full Buffer Re-Pack
- New `Uint8Array` allocated & uploaded each render even if underlying tile set unchanged (except hover). Causes memory churn & GC pressure.

8. `readPixels` Every Frame for Diagnostics
- Even small 4x4 region forces GPU→CPU sync; combined with hover storm magnifies stalls.

9. Adaptive Refinement Request Cascade
- Low variance thresholds can cause immediate finer tile batch requests; with unbounded request key set, memory + worker CPU escalate.

10. Coverage Metric Misleading
- Uses (renderEnd - renderStart) / window span; gaps or overlaps distort warning logic, may trigger watchdog noise while masking real stalls.

## Medium-Risk Issues

11. Eviction Policy Too Naïve
- Evicts oldest by start time ignoring LOD/refinement or proximity to current window; encourages thrash & re-requests.

12. LOD Computed From External `spanMs`
- LOD uses props while window state may already have updated → transient mismatches / redundant tile fetches.

13. Secondary Texture Always Full Upload
- No sub-image optimization; both textures uploaded in entirety each effect. Wastes bandwidth when unchanged.

14. Shader Blend Logic Potential Error
- `applyBlend(u_blendMode, base, base)` blending same input; modes like difference collapse to zero—not intended for cross-LOD or multi-source blend.

15. Diagnostic Global Mutation
- Reassigning `window.__timestreamDiag` each frame could interact poorly with external listeners (minor perf overhead).

16. Pointer Capture Cleanup Missing
- If unmount mid-drag, capture not explicitly released (edge case; potential sticky cursor perception).

17. RowMap Fallback to 0 Masks Data Issues
- Collapses missing planet rows to index 0; visually misleading.

18. Fallback Renderer Grayscale Only
- Loses semantic R/G/Y/B mapping; debugging accuracy impacted.

19. Variance-Based Refinement Assumptions Hard-Coded
- Assumes 4x subdivision (pow(4, lod)); any change in stepping breaks logic silently.

20. Lack of Invalidation Strategy for Buffered Packs
- No diff tracking or reuse; prevents future incremental optimization.

## Low-Risk / Cosmetic Issues

21. Repeated `new Date()` Conversions in Overlay
22. Highlight computation always runs even when disabled.
23. Minor potential micro-GC from constructing small arrays (e.g., `mapArr` each draw).

## Potential User-Facing Symptoms Linked to Above
- Gradual memory rise when panning long periods (unbounded keys) leading to eventual tab freeze.
- Immediate UI stutter / freeze when moving cursor across canvas (hover storm + pack/upload loops).
- Multiple workers causing CPU saturation after toggling BottomDrawer repeatedly.
- Black / empty canvas or stalled visuals if GL errors triggered by oversize texture.
- Incorrect or duplicated planet rows due to rowMap fallback / crash due to null bodies.

## Security / Stability Notes
- Diagnostic global should be gated in production builds.
- Worker synthetic longitude function placeholder: swap with accurate ephemeris could increase `genMs`; performance headroom needed post-optimizations.

## Key Metrics To Capture (Instrumentation Phase)
- requestedKeysRef.size over time
- redrawCount & distinct tileSet hash (to detect unnecessary frames)
- totalCols vs MAX_TEXTURE_SIZE
- average drawMs vs hover events frequency
- worker tile gen queue length

## Summary
Primary freeze risk is compounded interaction: hover-driven parent re-renders + full buffer repack + full texture upload + unbounded request bookkeeping + absence of cleanup. Addressing hover isolation, request key pruning, resource cleanup, and conditional rendering will likely eliminate runaway behavior while setting foundation for adaptive refinement stability.

---
Generated as part of initial diagnostic phase; see `ACTION_PLAN.md` for remediation roadmap.

## Addendum: Spec & Domain Gap Analysis (RGYB Time‑Map Alignment)

This section extends the initial findings with domain‑specific and specification compliance gaps discovered after reviewing `docs/dapp/rgyb-time-map.md`.

### A. Domain Semantics Deviations
1. Missing Background “Fold” Layer
	- Spec envisions a continuous background ColorTimeline stretched vertically plus discrete foreground planet lanes; implementation renders only a single packed planet texture (no distinct background sample). Blend modes therefore operate on `base` with itself.
2. Air (Yellow) Encoding Approximation
	- Internal buffer stores channels (Fire, Earth, Air, Water) in RGBA8, but fragment shader mixes Air at 0.5 weight into R and G: `r = fire + 0.5*air`, `g = earth + 0.5*air`. Spec implies Air should combine fully to produce vivid yellow (likely additive or weighted by normalization). Current weighting may under‑represent Air in composite.
3. Harmonic Highlight Semantics
	- Spec: highlight based on similarity between foreground and background (dot product normalized)^γ. Implementation uses custom "purity" / "balance" metrics unrelated to cross‑layer harmonic resonance.
4. Blend Mode Operand Misuse
	- `applyBlend(mode, base, base)` uses identical operands; difference / overlay semantics become degenerate; no true foreground vs background fusion.

### B. LOD & Temporal Resolution Gaps
1. Truncated LOD Ladder
	- Spec defines up to LOD7 (minutes → centuries). Implementation only distinguishes 0–2 based on window span, ignoring msPerPixel thresholds and long-range tiers.
2. Adaptive Variance Metric Divergence
	- Expectation: channel stddev over temporal samples within coarse interval. Implementation computes per‑column variance across planets (spatial across rows) of aggregated channel sums, not temporal variance—may refine the wrong regions and miss time variance (retrogrades) per planet.
3. Retrograde Handling Placeholder
	- Spec requires curvature / velocity inversion detection & interpolation; worker uses synthetic periodic retro toggle. Future replacement could shift variance distributions unpredictably relative to current thresholds.
4. Time Uniform Precision Risk
	- Passing absolute epoch milliseconds as 32‑bit floats risks precision loss in far-future / far-past zoom levels; spec implies multi‑century support. Need relative time normalization.

### C. Interaction & UI Gaps
1. Tooltip Content Deficit
	- Spec hover: should show planet, longitude, sign, variance flags, retrograde. Current `hoverDetail` only provides element vector + row index.
2. Planet Reorder Consistency
	- Reordering updates `rowMap`, but packed tiles maintain original `bodies` ordering. Without repacking or generating future tiles with new order, row remap may visually misattribute planets.
3. Missing Colorburn Blend Mode
	- Spec lists colorburn; not implemented.
4. Accessibility / Color Vision
	- No alternate palette or pattern overlay for users with red/green color blindness. Air represented indirectly as mixed R+G may reduce distinguishability.

### D. Performance & Architecture Deviations
1. Lack of Partial Upload Strategy for Secondary Texture
	- Spec calls for partial updates via `texSubImage2D` when feasible; secondary always re‑uploaded full.
2. Single Monolithic Texture Instead of Segmented Pages
	- Spec suggests limits (≤4 tiles per LOD resident) but implementation can pack an arbitrarily wide texture (risk exceeding `MAX_TEXTURE_SIZE`).
3. Missing Worker Transferables
	- Spec indicates using transferable buffers; current worker posts tiles with `Uint8Array` but no explicit transfer (minor overhead, but relevant at scale).

### E. Validation & Testing Gaps
1. No Assertions
	- Lacking runtime assertions for: `tile.buffer.length === rows*cols*4`, bodies length alignment, expected stepMs per LOD.
2. Element Vector Invariants
	- Not verifying cusp blend sum ≤ 1 and shape adherence per blend curve choice.
3. Coverage Accuracy
	- Coverage metric does not compute union of tile intervals (gaps, overlaps unhandled) contradicting continuous multi‑scale coverage intent.

### F. Observability Enhancements Needed
1. Element Purity Distribution Histogram
2. Refinement Hit Rate (coarse tiles replaced / total coarse)
3. Requested Key Set Growth Over Session Time
4. Frame Time Percentiles (p50 / p95 / max)
5. GL Error Frequency

### G. Prioritization Additions (Tie‑in to Action Plan)
Insert between Phase 1 & 2:
	- Normalize time uniforms (relative base) to eliminate precision drift.
Phase 2:
	- Implement true background layer & refactor blend to use distinct sources.
	- Correct Air composite weighting; define explicit color transform matrix.
Phase 3:
	- Replace highlight with similarity(domForeground, domBackground)^γ metric.
	- Expand tooltip to include longitude, sign, variance, retrograde, LOD.
Phase 4:
	- Segment textures & adopt partial upload per tile insertion.
Phase 5:
	- Add assertion suite & domain invariant tests.

### H. Risk if Unaddressed
- Misleading scientific/astrological interpretation due to incorrect color semantics and missing harmonic indicators.
- Future integration of accurate ephemeris may destabilize frame times (variance logic recalibrates) causing new freeze patterns if foundational optimizations not in place.

---
This addendum should be considered part of the authoritative findings; remediation tasks have corresponding expansions in `ACTION_PLAN.md` (update pending).
