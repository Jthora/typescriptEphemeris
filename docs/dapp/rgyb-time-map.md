# RGYB Time‑Map (Spec)

Goal
- 2D shader map of bodies (Y) vs time (X), with elemental RGYB colors.

Data
- Grid: width=time steps, height=bodies
- Buffer: Uint8Array RGBA (R,G,Y,B in 0..255)
- Metadata: timeStartMs, timeStepMs, bodies[]

Generation
- Worker pool; tiled by time
- astronomy‑engine at coarse steps; interpolate longitudes between
- Map longitude→element weights with cusp crossfade; normalize per sample

Rendering
- WebGL2 RGBA8 texture, NEAREST_Y × LINEAR_X filtering
- Optional 1D temporal blur (3–5 taps) for stronger blending
- Overlay canvas/DOM for axes/labels and hover tooltip

Perf targets
- Tiles of 2048–8192 cols; keep ≤4 tiles in VRAM
- Progressive render as tiles arrive

Exports
- PNG capture of viewport; optional tile/bin save to IPFS
