# RGYB Time‑Map (Timestream Visualization Spec)

Updated: Clarified multi‑scale spectrograph design, tiling, blending, and harmonic highlighting.

## 1. Purpose
A multi‑scale timestream spectrogram for planetary elemental dynamics. Visualizes how each planet’s zodiacal position (and thus elemental weighting) evolves across minutes → centuries. Enables detection of harmonic alignments via shader blending between a stretched background ColorTimeline and per‑planet foreground lanes.

## 2. Axes & Folding Concept
- X axis: Time (continuous, zoomable). Multi‑resolution.
- Y logical lanes: Ordered planets (reorderable by user). Each lane shows its own ColorStrip over time.
- Background “fold”: A single concatenated 1D ColorTimeline (planets stacked end‑to‑end once) stretched vertically to fill the viewport. Foreground sampling remaps Y to discrete planet lanes while background remains continuously stretched. Harmonic resonance appears where foreground lane color blends constructively with background color (mode dependent).

## 3. Planet Set & Order
Default order (modifiable):
`Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto, Chiron (optional), MeanNode`
Persist user custom ordering.

## 4. Element & Color Encoding
- Elements → Channels: Fire=R, Earth=G, Air=Y (treated as RGB (R+G) or stored in B? We store explicit Yellow via (R=1,G=1,B=0) composite at shader output, but internal buffer keeps distinct channel mapping as RG Y B for Fire, Earth, Air, Water). Practical storage: RGBA8 where channels = (Fire, Earth, Air, Water).
- At most two non‑zero elements near sign cusps; otherwise one dominant element (pure channel).
- Cusp blend width: default 3° (configurable). Blend curves selectable: `linear | smoothstep | cosine`.
- Normalization: Sum of active element weights ≤ 1 (strict =1 outside cusp where only one element active).

### Cusp Blending
Let Δ be angular distance to cusp center inside blend width W.
- Linear: w = 1 − Δ/W.
- Smoothstep: w = 1 − smoothstep(0,W,Δ).
- Cosine: w = 0.5*(1 + cos(π*Δ/W)).
Weights for adjacent signs cross‑fade: ElementA = w, ElementB = 1 − w.

## 5. Data Model
Each time sample t for planet p yields element vector E_p(t) ∈ [0,255]^4 (Uint8 after scaling). Core storage tile:
```
TimestreamTile {
  id: string
  lod: number              // 0 = finest
  startTimeMs: number
  stepMs: number           // sample spacing for this LOD
  cols: number             // time samples in tile
  rows: number             // = planet count
  bodies: string[]         // ordering for rows
  buffer: Uint8Array       // length = cols * rows * 4 (RGBA = Fire,Earth,Air,Water)
  variance?: Float32Array? // optional per-cell or per-column variance metrics
}
```
Missing/uncomputed samples are implicitly black (0,0,0,0).

## 6. Multi‑Scale LOD Strategy
Base minimal step: 1 minute.
LOD levels (default):
| Level | Time Domain Label | Step (approx) |
|-------|-------------------|---------------|
| 0     | Minutes (< 2 days window) | 1 min |
| 1     | Hours (≤ 1 week)  | 5 min |
| 2     | Days (≤ 1 month)  | 15 min |
| 3     | Weeks (≤ 3 months)| 1 hour |
| 4     | Months (≤ 2 years)| 6 hours |
| 5     | Years (≤ 10 years)| 1 day |
| 6     | Decades           | 7 days |
| 7     | Centuries         | 30 days |

LOD Selection: based on msPerPixel thresholds. Smooth crossfade when switching LOD to avoid popping.

Adaptive Refinement: If element vector variance inside a coarse interval exceeds τ (default channel stddev > 0.15) subdivide by on‑demand finer sampling to reduce aliasing (e.g., retrogrades).

## 7. Retrograde & Non‑Linear Motion Handling
- Coarse astronomy-engine samples at LOD step boundaries.
- Between coarse samples: linear interpolation of longitude unless curvature test fails: if |Δlongitude| over interval deviates > ε from linear expectation or sign change in velocity (retrograde inversion) occurs, insert intermediate samples.
- Downsampling: average element vectors rather than sample center to retain proportion of time spent near cusp.

## 8. Tiling
- Typical tile width: 2048–4096 columns (configurable; power-of-two friendly for alignment, though not required for WebGL2).
- Keep ≤4 tiles per LOD resident in GPU near viewport (LRU eviction).
- Prefetch: 1–2 tiles ahead in pan direction.

## 9. Worker Generation Pipeline
Workers receive `TimestreamRequest` (range, stepMs, bodies, lod, tileCols).
For each tile:
1. Compute planetary longitudes at coarse times using astronomy-engine.
2. Interpolate (& adaptively subdivide) for intermediate samples.
3. Map longitudes → sign → elements with cusp blending.
4. Write RGBA (Fire,Earth,Air,Water) Uint8.
5. Post `tile` message progressively.

## 10. Rendering Architecture
Single background texture (current viewport LOD) containing concatenated planet rows flattened to 1D then stretched vertically by shader mapping.
Foreground sampling uses same texture but with discrete row index for precise planetary lane color. No duplicate buffers.

### Coordinate Mapping
- Texture coordinates: u = (t - viewStart) / viewSpan.
- Background v_bg = continuous y normalized → rowFloat = yNorm * P → fractional sampling using NEAREST or LINEAR (choose) to create continuous gradient bands.
- Foreground row k: v_fg = (k + 0.5)/P (center of row) or small band.

## 11. Blending Modes (Shader selectable)
Let src = foreground color, dst = background color, all ∈ [0,1].
- multiply: src * dst
- screen: 1 - (1-src)(1-dst)
- additive: clamp(src + dst, 0, 1)
- overlay: mix(2*src*dst, 1 - 2*(1-src)(1-dst), step(0.5,dst)) (per channel)
- colorburn: 1 - min(1, (1 - dst)/max(src, ε))
- difference: |dst - src|

### Harmonic Highlight (Optional)
Similarity h = (dot(norm(src), norm(dst)))^γ (γ default 2.0). Final = baseBlend * (1 + gain*h) (gain default 0.75) when highlight enabled.

## 12. Interaction
- Pan: drag horizontally; request tiles for uncovered regions (uncalculated renders black until tile arrives).
- Zoom: wheel / pinch adjusts msPerPixel, drives LOD selection.
- Hover: planet lane + time → tooltip (planet, longitude, sign, element weights, LOD level, variance flag).
- Time Marker: vertical line for current chart time; clicking spectrogram sets chart time (optional sync).
- Planet Order UI: reordering persists; triggers reindex of row mapping (invalidate/rebuild textures or remap in shader with indirection uniform).

## 13. Performance & Memory
- GPU: One RGBA8 texture per active LOD viewport region (plus transitional texture when crossfading).
- CPU Workers: compute ahead; use transferable buffers.
- Partial Uploads: gl.texSubImage2D for fresh tile regions.
- Black Regions: shader treats zero vector as “no data” (optional dim grid overlay).

## 14. Fallback
If WebGL2 unavailable: Canvas2D raster path assembling ImageData per tile (lower performance, no advanced blending modes beyond software approximations).

## 15. Configuration Parameters
| Parameter | Default | Description |
|-----------|---------|-------------|
| cuspWidthDeg | 3 | Degrees for element crossfade at sign cusp |
| blendCurve | linear | One of linear|smoothstep|cosine |
| highlightGain | 0.75 | Multiplier for harmonic emphasis |
| highlightGamma | 2.0 | Exponent for similarity curve |
| varianceThreshold τ | 0.15 | Channel stddev threshold for adaptive refine |
| tileCols | 3072 | Target columns per tile |
| maxResidentTiles | 4 | Tiles per LOD kept in GPU |
| baseStepMs | 60000 | 1 minute base resolution |

## 16. Open / Future Extensions
- Similarity Matrix Mode: Time vs time self-similarity (auto‑correlation heatmap) as alternative visualization.
- Auto‑Correlation: Lag analysis to detect periodic recurrences in elemental patterns.
- Export: PNG of current viewport + raw tile binary; optional IPFS pin.
- Variance Overlay: separate alpha channel or stripes indicating high volatility intervals.
- Multi‑Body Harmonic Filters: user selects sets (e.g. Sun+Moon) to aggregate element vectors before blending stage.

## 17. Implementation Roadmap (High Level)
1. Types & constants (planet order, config).
2. Element mapping utility with cusp blending curves.
3. Worker + message protocol, tile generation at LOD0.
4. Tiling controller hook (fetch, cache, prefetch, LOD selection).
5. WebGL renderer: background + foreground sampling, blending mode uniform.
6. Harmonic highlight pass (integrated into fragment shader).
7. Interaction (pan/zoom, tooltips, time marker).
8. LOD pyramid & adaptive refinement.
9. Reordering planets (indirection mapping uniform).
10. Export & fallback.

## 18. Minimal Viable Product (MVP) Scope
- LOD0 only (1‑minute step) within ±12h window.
- Tiles of 2048 columns; no adaptive refinement.
- Linear cusp blending; multiply & additive modes.
- Pan/zoom basic; missing regions black.
- Single WebGL texture updated incrementally.

---
Original short description (superseded):
- 2D shader map of bodies (Y) vs time (X), with elemental RGYB colors.
- Worker‑tiled generation, progressive rendering.

This expanded spec fully supersedes the earlier minimal outline.
