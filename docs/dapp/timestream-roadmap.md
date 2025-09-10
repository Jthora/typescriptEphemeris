# Timestream Visualization Roadmap & Execution Plan

Purpose: Keep development focused, iterative, and measurable for the RGYB Timestream (spectrogram / spectrograph) feature.

## 0. Guiding Principles
- MVP first (LOD0 ±12h, tiles, 2 blend modes) before advanced features.
- One new capability per milestone; restrict scope creep.
- Only optimize after profiling.
- Each milestone ends: stable build + doc update + commit.
- Maintain a single source of truth (this file + updated `rgyb-time-map.md`).

## 1. Milestones (Sequential)
| # | Milestone | Core Deliverable | Done When |
|---|-----------|------------------|-----------|
| M1 | Core Types & Element Mapping | Types, constants, cusp blending util, mock generator | Unit test / sample output logged |
| M2 | Worker Tile Generation | Web worker builds LOD0 tiles, progressive posting | Tiles appear (console) with correct dimensions |
| M3 | Tile Cache Hook | `useTimestreamData` manages tiles, prefetch, pan/zoom math | Pan loads new tiles; black gaps otherwise |
| M4 | WebGL Renderer Base | Single texture, lanes rendered, multiply & additive | Visual lanes visible, two modes switchable |
| M5 | Interaction Layer | Pan, zoom, time marker sync, tooltip stub | User can navigate ± window smoothly |
| M6 | Blend Modes + Highlight | All blend modes + harmonic similarity toggle | Modes switch in UI; highlight gain works |
| M7 | LOD Manager | Multi-resolution selection + crossfade | Zoom changes resolution without popping |
| M8 | Adaptive Sampling | Retrograde-aware refinement & variance tagging | High-variance intervals show smoother detail |
| M9 | Planet Reordering | Reorder planets; persistent; shader indirection | Reorder reflected without rebuild of raw tiles |
| M10 | Export & Perf | PNG capture, perf overlay, micro-optimizations | Export works; frame & gen metrics tracked |
| M11 | Fallback & A11y | Canvas fallback + keyboard nav & ARIA roles | Works without WebGL; basic accessibility |
| M12 | Advanced Modes (Optional) | Similarity / auto-correlation experimental view | Toggle alternate view |

## 2. Definition of Done (Per Milestone)
- Lint & type clean.
- Build passes (dev + fast build).
- Minimal smoke test scenario manual or scripted.
- Section appended to Changelog (bottom of this file).
- Open TODOs migrated to Backlog section (not left inline unless tagged). 

## 3. Backlog Buckets
- Core Data: sampling, tiling, LOD, adaptive.
- Rendering: shaders, blend modes, harmonic highlight, crossfades.
- Interaction: pan, zoom, tooltips, reorder, time sync.
- Performance: memory caps, upload diffs, worker balancing.
- UX & Access: settings UI, persistence, fallback, accessibility.
- Research / Future: similarity matrix, auto-correlation, variance overlays, IPFS export.

## 4. Issue / Task Template
```
Title: [M#] Concise action
Goal:
Acceptance Criteria:
Non-Goals:
Risks:
Test Notes:
```

## 5. Guardrails
- No UI control before its underlying logic exists.
- Avoid new deps without rationale line in PR/commit message.
- Split tasks > 1 day; log blockers > 2h and switch context.
- Keep shaders modular (mode switch via uniform + small helper macros).

## 6. Metrics & Health Checks
| Metric | Target / Note |
|--------|---------------|
| Tile gen speed | < 10ms per 1000 samples (LOD0 typical) |
| Frame budget | < 8ms render work under normal viewport |
| GPU resident tiles | ≤ configured max (default 4) |
| Memory (CPU tiles) | Bounded by eviction (expose debug count) |
| Upload fragmentation | Prefer batched `texSubImage2D` over full re-upload |

Debug Overlay (later): shows msPerPixel, active LOD, tiles loaded, pending requests, frame time.

## 7. Config Defaults (sync with spec)
- cuspWidthDeg: 3
- baseStepMs: 60_000
- tileCols: 3072 (range 2048–4096)
- maxResidentTiles: 4
- varianceThreshold (τ): 0.15
- highlightGain: 0.75, highlightGamma: 2.0

## 8. Risk Mitigation
| Risk | Mitigation |
|------|------------|
| Retrograde interpolation errors | Unit test element vectors across known retrograde span early (M2.5) |
| Shader complexity bloat | Implement baseline, then incremental blend modes with unified macro library |
| LOD popping artifacts | Crossfade textures (dual bind) before adding more LOD levels |
| Memory creep | Central tile registry enforcing eviction policy |
| Performance regressions | Record baseline perf after M4; compare after each milestone |

## 9. Workflow Loop (Daily)
1. Select highest-priority open task within current milestone.
2. Implement in isolation (pure util first, then integrate).
3. Run minimal test / log verification.
4. Update spec / roadmap (Changelog entry).
5. Commit: `feat(mX): short description`.

## 10. Planet Order Handling
- Stored once in user settings (localStorage initially).
- Row indirection array uniform for shader mapping to texture rows.
- Reordering triggers only metadata update + re-render, not tile regeneration.

## 11. Fallback Strategy
- If WebGL2 unsupported: build image row buffers and draw via `putImageData`.
- Limited to multiply + additive (others approximated later if needed).

## 12. Future Extensions (Defer Until ≥ M12)
- Similarity matrix (time vs time) heatmap.
- Auto-correlation lag view.
- Variance overlay stripes.
- IPFS raw tile export & manifest.
- Harmonic filter sets (aggregate selected planets before blending).

## 13. Immediate Next Steps (Pre-M1)
- Confirm defaults (accepted as specified unless changed).
- Implement M1: types, constants, element mapping util + simple mock generator (CPU) returning one synthetic tile.

## 14. Changelog
- (M1 INIT) Added core types & constants scaffolding: `src/timestream/{types,constants,elementMapping,mockTile}.ts` with mock tile generator & element blending utilities.
- (M1 DEV) Added development harness `src/timestream/__m1_dev_test.ts` logging mock tile summary.
- (M1 VAL) Added validation utilities `src/timestream/validateElementMapping.ts` for cusp continuity & dominance checks.
- (M1 COMPLETE) Integrated validation into dev harness. Ready to proceed to M2 (Worker Tile Generation).
- (M2 INIT) Added worker protocol, worker implementation stub, and main-thread client: `workerMessages.ts`, `timestreamWorker.ts`, `workerClient.ts`.
- (M2 TEST) Added worker integration harness `src/timestream/__m2_worker_test.ts` requesting single tile.
- (M3 INIT) Added tile cache hook skeleton `useTimestreamData.ts` (LOD0 coverage & prefetch).
- (M3 DEBUG) Added debug visualization component `TilstestreamDebug.tsx` for tile coverage inspection.
- (M3 REVISE) Added refined `TimestreamDebug.tsx` with pan/span controls; deprecated misspelled file.
- (M3 INTEGRATE) Mounted `TimestreamDebug` inside BottomDrawer body (temporary dev integration).
- (M4 INIT) Added basic WebGL shader pipeline (`gl/shaders.ts`, `gl/initGL.ts`) and `TimestreamCanvas` integrated into BottomDrawer.
- (M4 MODE) Added blend mode toggle UI in BottomDrawer enabling runtime switch between multiply and additive modes (Milestone M4 requirement satisfied).
- (M4 COMPLETE) Criteria met: lanes visible + two blend modes switchable. Deferred optimizations (incremental texSubImage2D, dual-sample path) moved to later milestones (Perf M10 / Blend Extensions M6).
- (M5 INIT) Began interaction layer: hover time mapping in `TimestreamCanvas` + display in BottomDrawer (foundation for pan/zoom + tooltip).
- (M5 PANZOOM) Added drag panning, wheel zoom with anchor preservation, hover vertical marker & span indicator.
- (M5 TOOLTIP) Added tooltip stub with longitude & element vector decoding (synthetic data) on hover.
- (M5 COMPLETE) Interaction milestone baseline met: pan, zoom, hover marker, tooltip stub, element vector readout.
- (M6 INIT) Extended fragment shader with screen/overlay/difference modes + highlight gain uniform & UI slider.
- (M6 BLEND) Wired new blend modes & highlight gain through canvas + UI; ready for harmonic similarity mask implementation.
- (M6 HIGHLIGHT) Added purity/balance highlight modes with gain scaling in fragment shader + UI selector.
- (M6 COMPLETE) Blend modes + highlight milestone satisfied (all planned modes + highlight behaviors implemented; dual-sample harmonic similarity deferred to later enhancement if needed).
- (M7 INIT) Added basic span-based LOD heuristic (levels 0/1/2) and LOD filtering in tile cache; UI now shows active LOD.
- (M7 LODPREFETCH) Prefetching adjacent LOD levels (lod-1,lod,lod+1) and exposing them for upcoming crossfade logic; UI shows counts.
- (M7 CROSSFADE) Dual-texture shader & canvas update with preliminary crossfade factor (static heuristic) between adjacent LODs.
- (M7 COMPLETE) LOD manager milestone baseline achieved (heuristic selection, adjacent prefetch, dual-texture crossfade). Dynamic adaptive thresholds deferred to M8.
- (M8 INIT) Added per-column variance computation & maxVariance tracking in worker tiles (fields variance[], maxVariance) to support adaptive sampling heuristic.
- (M8 VARIANCE) Adaptive sampling hook update: requests finer LOD tiles when coarse tile maxVariance ≥ τ; UI now displays refined tile count.
- (M8 SUBDIV) Subdivision refinement: request all finer subtiles for high-variance coarse tiles and replace coarse only when complete set present.
- (M8 RETRO) Retrograde-aware trigger: synthetic retrograde detection adds refinement even if variance below τ.
- (M8 COMPLETE) Adaptive sampling milestone achieved: variance tagging, full finer subdivision replacement, retrograde-aware refinement hooks integrated.
- (M9 INIT) Row indirection groundwork: shader uniform array u_rowMap added; canvas uploads identity mapping (prepares for reorder UI & persistence).
- (M9 UI) Basic reorder UI (up/down controls) updating in-memory planet order; rowMap uniform reflects new ordering without tile regeneration.
- (M9 PERSIST) Planet order persisted to localStorage with forward-compatible merge of new planets.
- (M9 COMPLETE) Planet reordering milestone achieved: shader indirection, live UI reorder, persistence without tile regeneration.
- (M10 INIT) Added PNG export button (canvas toDataURL) and basic perf stats (draw ms, tiles, rows, cols) via onStats callback.
- (M10 PERF) Incremental texture upload (texSubImage2D) when dimensions stable + extended stats (upload time & mode).
- (M10 OVERLAY) Exposed resident tile count & pending request metrics in hook (prep for perf overlay UI).
- (M10 OVERLAY UI) Added in-canvas performance overlay (frame ms, ms/px, LOD, render vs resident tiles, pending, upload stats).
- (M10 COMPLETE) Added tile generation timing (avg) and integrated into overlay; Export & Perf milestone criteria satisfied.
- (M11 INIT) Began fallback & accessibility milestone: planning canvas fallback structure and a11y roles.
- (M11 FALLBACK) Implemented 2D canvas fallback renderer with keyboard pan/zoom and WebGL feature detect banner.

---
Reference Spec: `docs/dapp/rgyb-time-map.md` (full technical details). This roadmap focuses on execution ordering and discipline.
