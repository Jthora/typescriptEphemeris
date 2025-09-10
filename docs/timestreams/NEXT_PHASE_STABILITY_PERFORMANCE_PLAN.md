# Timestream Stability & Performance Plan (Post-Ordering Integrity)

Status: Draft (v1)
Owner: TBD
Scope Window: Phases A–D (leak containment through spec alignment)
Cut Date: 2025-08-30

## Objectives
1. Eliminate memory / resource leaks (requested key growth, worker/GL lifecycle).
2. Harden adaptive & crossfade correctness (rounding, overlap, mismatch safeguards).
3. Improve metric fidelity (variance & retro triggers) and temporal precision.
4. Align visuals with spec (color semantics, harmonic highlight, extended LOD ladder).
5. Prepare maintainable, testable infrastructure (diagnostic gating, buffer pools, validation).

## Success Criteria (Measurable)
| Goal | Metric | Target |
|------|--------|--------|
| Requested key leak removed | requestedKeysRef.size - residentTileCount | <= resident + 10 buffer after 300 window shifts |
| Resource cleanup | Worker count & GL contexts after 3 remounts | Stable (no growth) |
| Adaptive stability | Refinement replacement misfires in test harness | 0 occurrences |
| Crossfade safety | Crossfade enabled only when intervals align & orders match | 100% compliance |
| Variance fidelity | New variance vs old (delta) | Documented & rationale approved |
| Color semantics | Mapping test snapshot | Pass & matches spec doc |
| Performance pack | Pack throughput scaling | Linear within 5% overhead baseline |
| Diagnostics noise | console.warn in production mode | 0 timestream warnings |

## Phase Breakdown

### Phase A: Containment & Safety (High Priority)
1. Requested Keys Pruning
   - Remove keys upon tile eviction.
   - Prune keys whose time interval lies >2 * windowSpan outside current window.
   - Instrument: record maxRequested, peakRatio.
   - Tests: Activate `leakGuard.test` (simulate 300 shifts). Add ratio assertion.
2. Lifecycle Cleanup
   - Add unmount effect: worker.shutdown(), cancel rAF, delete GL resources, clear diagnostics timers.
   - Test: mount/unmount harness 3x (mock Worker) => worker instance count constant.
3. Crossfade Overlap Guard
   - Compute coverage (start,end) for primary & secondary; disable (set 0.0) unless identical span.
   - Extend test: `crossfadeOverlap.test` partial coverage scenario.
4. Adaptive Rounding Fix
   - Replace `Math.round` needed computation with integer formula (coarseStep/fineStep) & tolerance.
   - Test: `adaptiveRounding.test` with epsilon perturbation.
5. Diagnostic Gating
   - Wrap global diagnostics creation in `if (import.meta.env.DEV)`.
   - Test: set NODE_ENV=production in vitest config override -> objects undefined.

### Phase B: Metric & Temporal Fidelity
6. Variance Metric Audit
   - Option: compute per-element variance then combine (weighted or max) – decide with spec.
   - Maintain legacy path behind flag for comparison.
   - Test: `varianceMetricChange.test` ensures monotonic relation & documents delta distribution.
7. Retro Trigger Refinement
   - Replace binary retroFactor with density (count/cols) threshold.
   - Test: patterns just below/above threshold refine only above.
8. Time Precision Normalization
   - Ensure startTimeMs and coverage boundaries remain multiples of base step.
   - Test: shift windows 500 times; assert no cumulative drift (difference < 1 ms & divisible).
9. Planet Add/Remove Robustness
   - Ensure signature mismatch path triggers clean skip of crossfade; sentinel rows safe.
   - Test: `planetAddRemove.test` progressive canonical list growth/shrink.

### Phase C: Spec Alignment & Visual Enhancements
10. Element Color Mapping Correction
    - Extract mapping to `elementColorMap.ts`; update encode path.
    - Test: `colorMapping.test` snapshot & known planet sample.
11. Harmonic Highlight / Foreground Fold
    - Introduce mask texture / uniform enabling highlight overlay.
    - Test: `harmonicHighlight.test` verifies highlight channel applied only to flagged rows.
12. Extended LOD Ladder
    - Configurable thresholds; add lod=3 (weekly) or lod= -1 (superfine) depending on zoom.
    - Test: `lodThresholds.test` spans at boundaries pick expected LOD.

### Phase D: Performance & Maintainability
13. Buffer Pool for Packing
    - Reuse one growable Uint8Array; allocate power-of-two expansions.
    - Test: `packPool.test` ensures identical data & fewer allocations (track via shimmed alloc counter).
14. Worker Message Validation
    - Guard unknown types / range check numeric fields.
    - Test: `workerValidateMessage.test` invalid payload logs warning not crash.
15. Diagnostic Snapshot API
    - Export `getTimestreamDiagnostics()` returning shallow copy for tests and devtools.
    - Test: `diagnosticsSnapshot.test` returns stable keys.
16. Planet Dynamic Ordering Stress
    - Fuzz test weaving add/remove/reorder + window shifts for 100 iterations, no thrown errors, invariants hold.

## Risk Matrix (Top 5)
| Risk | Phase | Mitigation |
|------|-------|-----------|
| Memory leak causes freeze | A | Aggressive pruning & test harness |
| Incorrect crossfade blends mismatched coverage | A | Overlap guard & test |
| Over/under refinement due to rounding error | A | Integer formula & test |
| New variance metric destabilizes thresholds | B | Dual-path comparison & documented delta |
| Visual spec drift (colors) confuses users | C | Central mapping + snapshot test |

## Test Plan Summary
- Activate and expand existing skipped tests (leakGuard).
- Add 11 new targeted test files across phases (named above).
- Maintain suite runtime < 10s (budget); mark heavier fuzz as `test.concurrent` with reduced iterations under CI env variable.

## Implementation Order & Branching Strategy
- Create feature branches per phase: `feat/timestream-phase-a`, etc.
- Merge sequentially; require tests + lint + size check (bundle impact) before merge.
- Document each phase completion with a short section appended to this file (Change Log).

## Telemetry / Diagnostics (Optional, Dev Only)
- Record counts: tileRequests, prunedKeys, evictions, refinementsAttempted, refinementsSucceeded, crossfadeSkipped(Order|Coverage).
- Provide simple `console.table` helper in dev to inspect snapshot.

## Change Log
- 2025-08-30 Phase A partial complete: requested key pruning, lifecycle cleanup, crossfade overlap guard, adaptive rounding fix, diagnostics gating. LeakGuard test remains skipped pending proper hook harness.
- 2025-08-30 Phase B initial: implemented per-channel variance aggregation (max channel variance) & retro density trigger (DEFAULT_RETRO_DENSITY_THRESHOLD); added varianceMetricChange test.
- 2025-08-30 Phase B update: time precision normalization helper added (normalizeTime) + timePrecision test.
- 2025-08-31 Phase B update: planet add/remove robustness implemented — crossfade disabled with body mismatch & dev warning; added planetAddRemove.test (3 tests passing).
- 2025-08-31 Phase B update: added refinementLogic helper + new tests (refinementLogic, retroDensityBoundary, timeNormalizationEdge) expanding Phase B coverage (variance, retro density thresholds, normalizeTime edges).
- 2025-08-31 Phase C initial: extracted unified element color mapping (elementColorMap.ts), shader updated to use uniform basis, added colorMapping.test (3 tests passing).
- 2025-08-31 Phase C update: implemented harmonic highlight (run-length resonance) with mode 'resonance', shader rowHighlight uniform, helper + tests (harmonicHighlight.test) passing.
- 2025-08-31 Phase C update: extended LOD ladder (computeLod with -1..3 tiers) + lodThresholds.test added; hook updated.
- 2025-09-09 Phase D: buffer pool for pack (packPool) integrated + tests; worker message validation helper + tests; diagnostics snapshot API added; dynamic planet stress test added.
- 2025-09-10 Hotfix: WebGL fragment shader compile error due to MAX_PLANETS define ordering. Moved `#define MAX_PLANETS 32` above uniform arrays (`u_rowHighlight`, `u_rowMap`).

---

Append feedback or adjustments below this line (review comments tracked inline):

> REVIEW NOTES:
> - TBD
