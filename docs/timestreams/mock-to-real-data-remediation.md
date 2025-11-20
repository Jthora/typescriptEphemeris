# Timestream Mock-to-Real Data Remediation

Last updated: 2025-09-28
Owner: TBD (TD4 lead)
Status: In Progress (TD4.1–TD4.2 complete; mock provider wired via abstraction)

## Background
- The current `timestreamWorker.ts` still synthesizes planetary longitudes via `syntheticLongitude`, feeding mock FEAW (fire/earth/air/water) vectors into the renderer.
- UI visually responds correctly, but all colors reflect synthetic RGYB oscillations—not real ephemeris positions.
- TD4 in the tech-debt plan calls for a provider abstraction to unblock real data integration.

## Goals
1. Replace synthetic longitude generation with a pluggable ephemeris provider that can source real planetary data.
2. Preserve deterministic fixtures/tests via an explicit mock provider for CI and unit coverage.
3. Ensure production builds flag or prevent accidental use of mock data.

## Recommended Remediation Steps

### 1. Define Ephemeris Provider Contract (TD4.1) ✅
- Add `EphemerisProvider` interface to `src/timestream/types.ts`:
  - Methods like `getPlanetVector(planetId: string, timeMs: number): { longitudeDeg: number; retrograde: boolean }`.
  - Optional bulk API `getTileData(params)` that returns FEAW-ready buffers for performance.
- Include metadata (provider name, supportsRetrograde, etc.) so the UI/diag overlay can display current provider.

### 2. Implement MockProvider (TD4.2) ✅
- Port existing `syntheticLongitude` logic into `MockEphemerisProvider` that satisfies the new interface.
- Ensure deterministic seeds so tests and fixtures retain stability.
- Gate default provider selection via environment (`import.meta.env.DEV ? mock : real`).

### 3. Integrate RealProvider (TD4.3)
- Utilize `astronomy-engine` or existing ephemeris utilities to compute actual planet vectors.
- Handle time conversions (UTC ms → astro-engine times) and planetary retrograde detection (compare adjacent samples or rely on built-in functions).
- Map RA/Dec to zodiac longitude; confirm units align with existing FEAW mapping (degrees).

### 4. Update Worker Initialization (TD4.4)
- Extend `TimestreamWorkerClient` to send provider configuration during `init`.
- Worker loads provider module (mock or real) based on init payload; remove direct usage of `syntheticLongitude`.
- Introduce `providerId` so telemetry/diagnostics can record active source.

### 5. Deprecate Legacy Mock Helpers (TD4.5)
- Move `mockTile.ts` and `mockGenerateSamples` into a dedicated `providers/mock/` module.
- Update tests to import from the new provider rather than global mocks.
- Add lint rule or CI check preventing production bundle from importing mock providers.

### 6. Verification & Diagnostics (TD4.6)
- Enhance diagnostics overlay to display active provider name (`MockEphemerisProvider`, `AstronomyEngineProvider`, etc.).
- Add automated regression test comparing `RealProvider` output against known planetary longitudes for a fixed timestamp block.
- Flag dev builds when mock provider is active (e.g., banner or console warning).

- [x] Provider interfaces defined and exported.
- [x] Worker init handshake updated (tests passing).
- [x] Mock provider used in tests and fallback modes.
- [ ] Real provider compiled and validated against sample data.
- [ ] Diagnostics display provider info & warn on mock usage.
- [ ] TD plan updated (TD4) with completion log.

## Risks & Mitigations
| Risk | Description | Mitigation |
|------|-------------|------------|
| Provider latency | Real ephemeris calls may be slower than synthetic math | Cache computations per tile/time, consider WebAssembly or worker pooling |
| Unit test flakiness | Real data might rely on external libs/time zones | Keep deterministic mock provider for tests; only run real provider tests in integration suite |
| Retrograde detection errors | Real retrograde logic may differ from heuristic counts | Validate with astronomy references, add regression tests for known retrograde windows |
| Bundle size increase | Importing astronomy-engine may inflate build | Tree-shake unused functions, lazy-load provider modules |

## Next Steps
- Assign TD4 tasks to implementation owner.
- Schedule short design review: provider API shape, integration plan, testing strategy.
- Kick off TD4.1 immediately (interface + mock provider relocation) since it’s a prerequisite for real data.

---
For questions or updates, annotate this document and the main tech-debt tracker at `docs/dapp/timestream-tech-debt-plan.md`.
