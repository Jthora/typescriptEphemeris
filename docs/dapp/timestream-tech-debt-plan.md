# Timestream Tech Debt Remediation & Diagnostic Plan (Post-M11 Transition)

Purpose: Establish a disciplined, high-signal process to surface, reproduce, diagnose, and resolve rendering + data integrity issues (e.g. flash-then-black, mock vs real data artifacts) while preparing for future real ephemeris integration.

Scope: Timestream tiles, WebGL renderer, fallback renderer, adaptive sampling, performance overlay, accessibility surface. Excludes M12 advanced modes until baseline is stable.

## Guiding Principles
- Evidence over intuition: add instrumentation first, then act.
- Determinism: tests run on fixed seeds & synthetic fixtures; flaky = failure.
- Layer isolation: diagnose at Worker, Pack, Render-Core, Hook, UI separately.
- Fast feedback: <5s for unit & packing tests; <20s for headless WebGL suite.
- Reversibility: small commits, feature flags for intrusive diagnostics.
- No silent failure: any zero-coverage / zero-tiles frame persists a visible warning + logs.

## Milestone Track (TD#)
| # | Name | Objective | Exit Criteria |
|---|------|-----------|---------------|
| TD1 | Observability Core | Capture structured frame & tile diagnostics | Overlay shows frame diag + downloadable JSON; watchdog banner triggers on loss-of-coverage |
| TD2 | Deterministic Fixtures & Retro-TDD | Lock in golden behaviors of worker + pack + adaptive | Test suite with >90% stmt coverage worker/pack; adaptive property tests pass |
| TD3 | Render Validation (Headless) | Prove GPU path correctness vs golden hashes | Headless harness produces stable hash set (<=1% variance runs) |
| TD4 | Data Provider Abstraction | Swap synthetic to provider interface | EphemerisProvider + MockProvider; all tests green with mock |
| TD5 | Refactor & Cleanup | Reduce complexity, remove duplicates | No duplicate files, LOD selection pure fn with tests |
| TD6 | Accessibility & Fallback Complete | Baseline a11y compliance | ARIA summary + keyboard doc + axe (or manual) pass (no critical issues) |
| TD7 | Performance Regression Guard | Automated perf budgets | Perf harness asserts drawMs p95 < threshold & tile gen avg stable |
| TD8 | (Optional) Real Data Dry Run | Validate real ephemeris integration readiness | Real provider returns sample tiles; diff tests within tolerance |

## Detailed Task Breakdown
### TD1 Observability Core
1. FrameDiag struct: {frameId, ts, tiles, packedCols, packedRows, lod, startMs, endMs, coveragePct, uploadMode, uploadMs, drawMs, glError, primaryTexDims, secondaryTexDims, hashSampleRGBA}.
2. Ring buffer (size 300) + export button (JSON download).
3. Add coverage calculation: (renderEnd - renderStart)/(endMs - startMs).
4. Texture sample hash: readPixels(0,0,min(4,w),min(4,h)) → xxhash32 or fallback simple rolling hash.
5. GL error capture after draw; non-zero triggers red badge.
6. Watchdog: if tiles>0 then next ≥3 frames tiles==0 OR coveragePct<0.05 → banner + automatic diag dump.
7. Planet row height check: if (canvasHeight/rows)<1 log WARN; include in diag.

### TD2 Deterministic Fixtures & Retro-TDD
1. Fixture factory: makeDeterministicTile(seed, rows, cols, stepMs) gradient pattern.
2. Worker tile variance verification test: recompute variance vs tile.variance within 1e-6.
3. Retrograde flag test: inject a pattern to simulate retro counts; assert maxRetrogradeCount.
4. packTiles tests: multiple tile list → packed buffer length & first/last col boundaries; hash matches golden.
5. Adaptive selection property tests: if (coarse.maxVariance ≥ τ && all finer complete) ⇒ coarse excluded.
6. Snapshot summary test: run hook in simulated environment (mock worker) for static window; capture JSON summary & compare to golden.

### TD3 Render Validation (Headless)
1. Create offscreen-canvas/headless WebGL harness (if OffscreenCanvas not available, fallback to jsdom + node-canvas-webgl shim or skip CI but keep local script).
2. Render tiny deterministic tiles; readPixels full surface; hash; compare to baseline stored hashes.json.
3. Introduce tolerance test: if mismatch → write diff artifact.

### TD4 Data Provider Abstraction
1. Define EphemerisProvider { getPlanetVector(planetId, timeMs): ElementVector }.
2. MockProvider uses deterministic sin/cos pattern; Worker consumes via provider injection (postMessage init config).
3. Add provider selection in main thread (for now only Mock).
4. Tests inject mock provider ensuring decoupling from syntheticLongitude.

### TD5 Refactor & Cleanup
1. Extract LOD heuristic into getLod(spanMs): number with unit tests.
2. Consolidate constants into constants.ts (ensure re-export index).
3. Remove duplicate accidental files (empty placeholder). Enforce via test scanning for '/src/src/'.
4. Split TimestreamCanvas draw effect into pure packTiles(tiles) util + side-effect WebGL draw.

### TD6 Accessibility & Fallback Complete
1. Implement produceAriaSummary(state) string; attach to canvas via aria-description or hidden <div>.
2. Keyboard help overlay (press '?').
3. Focus ring & skip-to-timespan control.
4. Fallback canvas parity: include hover detail arithmetic simplified.

### TD7 Performance Regression Guard
1. Perf harness (Node script) launches headless render N=50 frames with deterministic timeline.
2. Record median & p95 drawMs, upload distribution; store baseline perf-metrics.json.
3. Test compares new run vs baseline (+20% tolerance) else fail.

### TD8 Real Data Dry Run (Optional)
1. Implement AstronomyEngineProvider mapping real RA/Dec → element vectors (approx mapping stub).
2. Sanity test: selected timestamps yield non-zero diversity (entropy > threshold).
3. Compare mock vs real variance distribution (log only).

## Instrumentation & Data Structures
```ts
interface FrameDiag { frameId:number; ts:number; tiles:number; packedCols:number; packedRows:number; lod:number; startMs:number; endMs:number; coveragePct:number; uploadMode?:'full'|'sub'; uploadMs?:number; drawMs?:number; glError?:number; primaryTexDims?:[number,number]; secondaryTexDims?:[number,number]; sampleHash?:string; rowHeight:number; warnings:string[]; }
```
Ring buffer API: push(diag), getAll(), exportJSON(). Expose via window.__timestreamDiag for temporary manual inspection (gated dev only).

## Testing Layers Matrix
| Layer | Tooling | Golden Artifacts |
|-------|---------|------------------|
| Worker logic | Vitest | variance snapshot, retro counts |
| Packing | Vitest | buffer hash |
| Adaptive selection | Property tests | JSON snapshot |
| Render core | Headless GL script | pixel hash |
| Integration | Vitest + jsdom + mock worker | summary JSON |
| Perf | Node script | perf-metrics.json |
| Accessibility | Axe (manual fallback ok) | Report output |

## Commit Conventions
- feat(td1): add frame diagnostics ring buffer
- test(td2): add adaptive refinement property tests
- refactor(td5): extract getLod heuristic
- perf(td7): add perf harness baseline generation
- chore(a11y): aria summary overlay

## Risk & Mitigations
| Risk | Mitigation |
|------|------------|
| Headless GL instability CI | Allow skip via env; still run locally for hashes |
| Over-instrumentation perf cost | Feature flag DIAG_ENABLED; disable in prod build |
| Flaky hashes due to timer variance | Use deterministic fixtures & disable antialias; rely on exact pixel values |
| Golden creep | Only update golden after manual review & diff summary logged |

## Watchdog Logic
- Maintain lastGoodFrameId (tiles>0 & coveragePct>0.8).
- If currentFrameId - lastGoodFrameId > 10 → banner + dump.

## Success Metrics
- Black-frame bug reproducible as structured diag (tiles=0 or coveragePct<5%).
- All TD1–TD3 tests green before further functional changes.
- Median drawMs measured & locked pre-refactor compared post-refactor (<= baseline +10%).
- Accessibility: keyboard pan/zoom verified; screen reader announces summary.

## Execution Order (Strict)
1. TD1 steps 1–7
2. TD2 steps 1–6
3. TD3 steps 1–3
4. TD4 steps 1–3
5. TD5 steps 1–4
6. TD6 steps 1–4
7. TD7 steps 1–3
8. (Optional) TD8

## Daily Loop
1. Pick next atomic TD task.
2. Implement with instrumentation or test first.
3. Run relevant subset (unit, headless, perf if changed draw code).
4. Update roadmap / this plan (append TD log section if needed).
5. Commit & push.

## Immediate Next Action
Start TD4.3: implement AstronomyEngineProvider (real data) + selection toggle.

## TD Log
- 2025-08-18: TD3.1 stub added (headless-render.ts + npm script). OffscreenCanvas unavailable in current env so harness skips gracefully.
- 2025-09-28: TD3.2 harness upgraded to use real timestream shaders + deterministic tiles, baseline hash compare with UPDATE_HEADLESS_BASELINE opt-in.
- 2025-09-28: TD3.3 adds diff artifact emission on hash mismatch + CI runner script alias; next focus shifts to TD4 provider abstraction.
- 2025-09-28: TD4.1 (provider contract) + TD4.2 (mock provider) + partial TD4.4 (worker handshake) landed; worker now consumes provider samples with mock default.

---
This document is the binding plan until revised; deviations require an explicit rationale commit note.
