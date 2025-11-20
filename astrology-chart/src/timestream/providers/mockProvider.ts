/**
 * TD4 Mock ephemeris provider: reproduces existing synthetic longitude logic deterministically.
 */
import type { EphemerisProvider, EphemerisProviderMeta, EphemerisPlanetSample, EphemerisTileRequest, PlanetId } from '../types';
import { DEFAULT_PLANETS } from '../constants';

function syntheticLongitude(planetIndex: number, timeMs: number): number {
  const minutes = timeMs / 60000;
  const deg = (minutes * (0.2 + planetIndex * 0.05)) % 360;
  return (deg + 360) % 360;
}

function isRetrograde(planetIndex: number, timeMs: number): boolean {
  if (planetIndex < 5) return false;
  const minutes = timeMs / 60000;
  const phase = Math.floor(minutes / 2000);
  return (phase % 2) === 1;
}

const meta: EphemerisProviderMeta = {
  id: 'mock-synthetic',
  name: 'Mock Synthetic Provider',
  description: 'Deterministic synthetic oscillation used for tests and fallback.',
  source: 'internal:syntheticLongitude',
  isDeterministic: true,
  supportsRetrograde: true
};

function samplePlanet(planetId: PlanetId, timeMs: number): EphemerisPlanetSample {
  const planetIndex = MOCK_PLANETS.indexOf(planetId);
  const idx = planetIndex >= 0 ? planetIndex : 0;
  return {
    planetId,
    timeMs,
    longitudeDeg: syntheticLongitude(idx, timeMs),
    retrograde: isRetrograde(idx, timeMs)
  };
}

const MOCK_PLANETS: PlanetId[] = DEFAULT_PLANETS;

export class MockEphemerisProvider implements EphemerisProvider {
  readonly meta = meta;

  getPlanetSample(planetId: PlanetId, timeMs: number): EphemerisPlanetSample {
    return samplePlanet(planetId, timeMs);
  }

  getTileSamples(req: EphemerisTileRequest): EphemerisPlanetSample[][] {
    const planets = req.planets.length ? req.planets : MOCK_PLANETS;
    const rows: EphemerisPlanetSample[][] = [];
    planets.forEach((planetId) => {
      const planetIndex = MOCK_PLANETS.indexOf(planetId);
      const idx = planetIndex >= 0 ? planetIndex : 0;
      const row: EphemerisPlanetSample[] = [];
      for (let c = 0; c < req.cols; c++) {
        const t = req.startTimeMs + c * req.stepMs;
        row.push({
          planetId,
          timeMs: t,
          longitudeDeg: syntheticLongitude(idx, t),
          retrograde: isRetrograde(idx, t)
        });
      }
      rows.push(row);
    });
    return rows;
  }
}
