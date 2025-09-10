# Timestream Tile Ordering & Planet Reorder Integrity Plan
Date: 2025-08-30
Status: Draft (Pre-Implementation)
Author: Automated Code Audit

## 1. Purpose
Ensure that user planet reordering never corrupts, mislabels, duplicates, or visually blends incorrect planetary rows within the Timestream visualization across all LODs, refinement tiles, and fallback rendering paths.

## 1.1 Scope & Change Control (Focus Guardrails)
This plan is deliberately narrow. It addresses ONLY ordering integrity (tile body order vs user planet reorder) and its direct safety/instrumentation. It does NOT expand into broader performance, color semantics, adaptive refinement, or rendering architecture changes except where strictly necessary to:
1. Prevent semantic corruption (wrong planet mapped to lane, duplicate lanes, blended mismatches).
2. Provide minimal diagnostics to verify invariants (order signature, rowMap validity, mismatch detection).
3. Render invalid/missing rows transparently (no silent duplication).

Allowed Minor Adjustments:
- Small implementation tweaks discovered during instrumentation (e.g., adjusting a validation log format) that do not add new feature surface area.
- Additional assertion lines if they directly reinforce an existing invariant (INV1–INV7).

Out of Scope (Defer to other plans):
- Redesign of blending, highlight similarity metrics, or color transforms.
- Performance optimizations unrelated to ordering (packing reuse, texture segmentation, hover throttling).
- Adaptive refinement metric changes beyond order validation.
- Accessibility palette alternates.

Change Control:
- Any proposed change outside scope requires a brief addendum (≤5 lines) appended to a new "Change Log" section and explicit acknowledgment before implementation.
- If an out-of-scope blocker is encountered (cannot complete an in-scope step without touching broader systems), note it under "Blockers" with a one-line recommended deferral path.

Success Definition (Strict):
- After implementation, reordering planets cannot produce duplicated, swapped, or stale rows; invalid planets display as empty lanes; crossfade & refinement never blend mismatched planet rows.
- Diagnostics confirm zero mismatches over a 2‑minute pan/zoom/reorder stress test.

## 2. Current State Summary
- Worker emits tiles with static `bodies = DEFAULT_PLANET_ORDER`.
- UI maintains `planetOrder` (user reorder) and builds `rowMap` each render.
- Texture packing preserves worker order; shader remaps rows via `u_rowMap`.
- No validation that all resident tiles share the same `bodies` ordering.
- Fallback renderer ignores reorder (no row indirection) and assumes uniform row ordering.
- Adaptive refinement & crossfade logic assume identical ordering across LOD chains.

## 3. Intended Invariants
| ID | Invariant | Rationale |
|----|-----------|-----------|
| INV1 | All resident tiles share identical `bodies` array | Prevent semantic row drift across time |
| INV2 | `rows === bodies.length` for every tile | Structural correctness |
| INV3 | `rowMap.length === planetOrder.length` | Complete mapping coverage |
| INV4 | Every rowMap entry either valid index or sentinel -1 | Explicit handling of missing bodies |
| INV5 | Secondary (crossfade) tiles ordering matches primary ordering | Blend correctness |
| INV6 | Adaptive refined tiles share order with replacement coarse tile | Seamless substitution |
| INV7 | Fallback renderer respects same mapping semantics | Consistent UX |

## 4. Risk Matrix (Edge Cases)
| Scenario | Current Behavior | Impact | Severity | Likelihood |
|----------|------------------|--------|----------|------------|
| First render before tiles | rowMap built from undefined | Crash or duplication | High | Medium |
| Missing planet in bodies | rowMap coerces to 0 | Silent duplication | High | Low (now) |
| Mixed order tiles (future) | Unchecked | Corrupted colors | Critical | Medium (future) |
| Reorder mid-session | Immediate remap only | Potential mismatch with future tiles | Medium | High |
| Crossfade LOD mismatch | Not detected | Blended different planets | Critical | Low now |
| Fallback ignore reorder | Incorrect row labeling | UX confusion | Medium | Medium |
| Planet count > uniform size | Truncation | Data loss | Medium | Low |

## 5. Instrumentation Plan (Phase I)
Add lightweight dev-only diagnostics:
- orderSig = `bodies.join('|')` for first tile; verify all tiles share it.
- mismatchedOrderTiles[] logged into `window.__timestreamDiag` frame entry (once per change).
- rowMapValidation: collect counts of -1, out-of-range, duplicate mapped indices.
- fallbackWarningFlag if reorder active but fallback path hides it.
- Expose `window.__timestreamMon.orderStats = { orderSig, mismatchCount, lastMismatchTs }`.

## 6. Sentinel Strategy
- Keep canonical worker order always.
- rowMap entries with index -1 produce transparent output (no color) rather than duplicating a row.
- Shader modification: if `srcRow < 0` branch sets `outColor = vec4(0.0)`.
- Provide parallel `u_rowValidMask` (bitmask or int array) OR encode invalid by mapping to row 0 but gating with a `u_invalidRows` array; choose simpler int sentinel with condition.

## 7. Remediation Phases
| Phase | Changes |
|-------|---------|
| P1 | Safe rowMap construction + instrumentation + early draw skip if no tiles |
| P2 | Shader support for -1 sentinel; stop forced 0 mapping; fallback warns user |
| P3 | Refactor fallback to use same rowMap; unify packing interface |
| P4 | Crossfade guard (skip secondary upload if orderSig mismatch) |
| P5 | Assertion & test suite; remove noisy logs (keep counters) |

## 8. Proposed Code Adjustments
### RowMap Builder (P1)
```
const bodies = tiles.length ? tiles[0].bodies : [];
const rowMap = planetOrder.map(p => bodies.indexOf(p)); // -1 allowed
```
Guard: If `tiles.length === 0` or `bodies.length === 0` => skip draw effect (clear canvas only).

### Validation Helper (P1)
```
function validateTileOrders(tiles){
  if(!tiles.length) return { ok:true };
  const sig = tiles[0].bodies.join('|');
  const mismatched = tiles.filter(t => t.bodies.join('|') !== sig).map(t => t.id);
  return { ok: mismatched.length===0, sig, mismatched };
}
```

### Shader (P2)
Add uniform `int u_hasInvalidRows;` or just conditional with: if (srcRow < 0) { outColor = vec4(0.0); return; }

## 9. Test Matrix (Later)
| Test | Setup | Expectation |
|------|-------|-------------|
| T1 | Basic reorder | Visual rows re-arranged; tile hash unchanged |
| T2 | Inject missing planet | Lane transparent; warning emitted |
| T3 | Crossfade mismatch simulated | Secondary skipped; primary stable |
| T4 | Fallback reorder | Matches WebGL order after implementation |
| T5 | Stress reorder sequence (20 rapid changes) | No crash; keys/pruned; stable memory |

## 10. Performance Considerations
- Validation O(nTiles * rows) negligible (< 4 * 16).
- Sentinel handling cost: single branch per fragment—minimal vs full shader cost.
- Transparent rows reduce overdraw; negligible overhead.

## 11. Metrics / Exit Criteria
| Metric | Target |
|--------|--------|
| order mismatches in normal usage | 0 |
| duplicate rowMap indices (excluding -1) | 0 |
| crash rate on early reorder | 0 |
| average drawMs overhead from validation | < 0.05 ms |

## 12. Open Questions
- Will future dynamic planet inclusion (user toggles) require tile regeneration? Likely yes; adopt explicit invalidation path.
- Need maximum planet count commitment (keep uniform size 32?).

## 13. Rollback Strategy
- Feature-flag instrumentation & sentinel logic via `import.meta.env.DEV` and a local `ENABLE_ORDER_VALIDATION` constant.

## 14. Implementation Task List (Actionable)
Status (2025-08-30): All tasks 1–5 implemented.
1. ✅ Validation helper integrated (`orderIntegrity.ts` + canvas diagnostics).
2. ✅ Safe rowMap with sentinel preservation & diagnostics.
3. ✅ Sentinel (-1) handling in fragment shader (transparent rows).
4. ✅ Fallback renderer now applies rowMap + sentinel transparency.
5. ✅ Minimal tests (`orderMap.test.ts`, `orderIntegrity.test.ts`).

## 15. Risks After Remediation
- If canonical order ever changes (adding planets) previously cached tiles become stale; requires versioned order signature (include length + names).
 - Future extension: ensure additional tests cover mixed LOD refinement once real data sources vary.

---
This plan supports the broader stabilization effort; proceed with Phase 1 items first before heavier rendering optimizations.
