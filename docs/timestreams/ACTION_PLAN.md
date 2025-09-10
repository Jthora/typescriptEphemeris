# Timestream Remediation Action Plan (Post Initial Review)
Date: 2025-08-30
Objective: Stabilize BottomDrawer Timestream visualization by eliminating runaway CPU/GPU/memory behavior, ensuring predictable performance baseline for future feature work.

## Guiding Principles
1. Stop the bleeding first (no new runaway allocations or uncontrolled redraw loops).
2. Instrument to measure; optimize only with data.
3. Prefer incremental, reversible changes (each step verifiable).
4. Keep UX functional during refactor (avoid large rewrites).

## Phase Overview
| Phase | Goal | Key Fixes | Exit Criteria |
|-------|------|----------|---------------|
| P1 | Contain runaways | Hover isolation, worker & GL cleanup, request key pruning, rowMap guard | No freeze after 2 min aggressive hover/pan; memory stable < +10% |
| P2 | Reduce per-frame cost | Conditional redraw, pack reuse, throttled diagnostics | Hovering keeps FPS > 55 on baseline machine |
| P3 | Improve data correctness | Accurate coverage metric, smarter eviction, LOD alignment | Diagnostic warnings reflect real gaps only |
| P4 | Scalability prep | Texture segmentation, adaptive refinement tuning, highlight fast-path | Can expand span / refinement without spikes |
| P5 | Hardening & Docs | Production gating, test coverage, regression suites | CI green & perf budget documented |

## Detailed Tasks
### Phase 1 (Containment)
1. Hover State Refactor
   - Internalize `hoverTime` & `hoverDetail` inside `TimestreamCanvas` using refs.
   - Emit debounced updates (e.g., 60ms) to parent only if needed.
   - Avoid causing React re-render per pointer move.
2. RowMap Safety
   - If `!tiles.length`, set rowMap to empty and skip shader draw early.
   - Preserve -1 sentinel for missing bodies; map to transparent fragment (skip blend) instead of forcing 0.
3. Worker & GL Cleanup
   - Add `useEffect` cleanup in `useTimestreamData` to send shutdown; null workerRef.
   - Add cleanup in `TimestreamCanvas` to delete textures, program, VAO if context alive.
4. Request Key Pruning
   - When evicting tiles, remove corresponding ids from `requestedKeysRef`.
   - Add size cap (e.g., 200) on keys; prune keys outside `[windowStartMs - 2*tileSpan, windowEndMs + 2*tileSpan]`.
5. Diagnostics Sampling
   - Move `readPixels` to every Nth frame (N=30) or when tiles changed.
6. Guard Null Access
   - Fix `rowMap` derivation to avoid `.indexOf` on undefined.
7. Minimal Instrumentation
   - Add `window.__timestreamMon` with counters: redrawCount, lastPackBytes, requestedKeyCount.

### Phase 2 (Per-frame Cost Reduction)
1. Conditional Redraw
   - Track hash of tile ids + props influencing draw; skip effect if unchanged since last draw (hover excluded).
2. Pack Buffer Reuse
   - Cache last packed primary buffer; only repack when tile list or order changes.
   - Maintain incremental append if new tile appended at either end.
3. Secondary Texture Optimization
   - If dimensions unchanged & new secondaryPack differs < X% columns, use `texSubImage2D` partial update.
4. Diagnostic Toggle
   - Add prop/env to disable diagnostics & sampleHash for perf testing.
5. Hover Overlay Layer
   - Render vertical hover line via absolutely positioned div or lightweight second canvas (no full redraw needed).

### Phase 3 (Correctness & Caching)
1. Coverage Metric Rewrite
   - Merge tile intervals clipped to window; compute union length / span.
2. Smart Eviction
   - Score = distanceFromCenter + LODWeight (coarser less costly) + age; evict worst scores beyond capacity.
3. LOD Determination Internal
   - Base LOD on internal windowSpan state to avoid race with external props.
4. Adaptive Refinement Validation
   - Ensure all fine subtiles share same step & contiguous coverage before replacement; fallback robustly.
5. Row Indirection Transparency
   - Provide explicit color for missing rows (e.g., fully transparent) to highlight data gaps.

### Phase 4 (Scalability Enhancements)
1. Texture Segmentation
   - Break large timeline into fixed-width pages (e.g., 4096 cols). Render with instanced quads or multi-draw.
2. Async Packing
   - Move pack operation into a Web Worker (transfer buffers) to avoid main thread blocking.
3. Highlight Fast Path
   - Precompute highlight scalar per row when highlightMode ≠ off; supply via uniform array to cut per-fragment branching.
4. Adaptive Throttling
   - If frame > targetBudget (e.g., 16ms), defer refinement requests or lower diagnostics frequency.
5. Memory Budget Enforcer
   - Expose config to cap total packed bytes; gracefully degrade (skip secondary, reduce refinement) when exceeded.

### Phase 5 (Hardening & Documentation)
1. Production Gating
   - Strip diagnostics & global exposure behind `process.env.NODE_ENV !== 'production'` or Vite define.
2. Tests
   - Unit: eviction ordering, refinement replacement logic, coverage metric.
   - Integration: simulated pan/zoom ensuring bounded worker requests.
3. Performance Regression Script
   - Headless render + scripted hover to assert frame time percentiles.
4. Developer Docs
   - Update README section: lifecycle, packing strategy, extension points, perf guidelines.
5. SLO & Budget
   - Frame budget < 16.6ms for idle hover; initial tile load < 250ms; memory < 20MB for tile buffers.

## Prioritization Rationale
- Containment tasks directly remove primary freeze culprits (hover storms, unbounded sets, leaks) with minimal risk.
- Cost reduction ensures we have headroom for accurate ephemeris integration.
- Correctness tasks prevent subtle logic discrepancies from masking performance regressions.
- Scalability tasks future-proof for extended spans & high-resolution modes.
- Hardening establishes safety net against regressions.

## Rollout & Verification Checklist
For each phase:
1. Implement changes behind optional feature flags where practical.
2. Run local stress script (simulated pan + hover) capturing:
   - Average drawMs, 95th percentile drawMs
   - requestedKeys size after test
   - Memory snapshot (performance.memory if available)
3. Compare against baseline metrics; ensure no regressions in correctness (tile coverage stable, no missing rows).
4. Update docs & commit incremental changes.

## Risk Mitigation
- Use small, well-defined commits per bullet to ease rollback.
- Add runtime asserts (dev only) for invariants: non-negative tile coverage, texture dims <= MAX_TEXTURE_SIZE.
- Avoid premature optimization: Only implement segmentation if MAX_TEXTURE_SIZE reached in real spans.

## Open Questions / Clarifications Needed
- Target maximum time span & zoom ranges (affects segmentation strategy).
- Expected maximum planet count (affects rowMap/uniform sizing; current MAX_PLANETS=32).
- Acceptable memory ceiling for resident tiles on typical devices.

## Success Indicators
- No reproducible freeze after 5-minute aggressive interaction session.
- CPU usage during hover < 30% of single core (typical laptop) with diagnostics off.
- Worker request rate stabilizes (no continual growth in request key count after steady pan).
- GL error count remains zero across typical interactions.

---
This action plan operationalizes the issues raised in `CODE_REVIEW_FINDINGS.md`. Implement Phase 1 immediately to restore stability, then iterate sequentially while collecting metrics.
