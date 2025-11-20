/**
 * Timestream core type definitions (Milestone M1)
 */

export type PlanetId = string; // e.g. 'Sun'

/** Element vector in normalized floating range [0,1]. */
export interface ElementVector {
  fire: number;
  earth: number;
  air: number;
  water: number;
}

/** Encoded RGBA (Fire, Earth, Air, Water) byte layout. */
export type ElementEncoded = [number, number, number, number];

export interface TimestreamTile {
  id: string;
  lod: number;           // 0 = finest resolution
  startTimeMs: number;   // start of first column
  stepMs: number;        // spacing between columns
  cols: number;          // number of time samples (x dimension)
  rows: number;          // number of planets (y dimension)
  bodies: PlanetId[];    // row ordering
  buffer: Uint8Array;    // length = cols * rows * 4
  variance?: Float32Array; // optional future extension
  maxVariance?: number;    // (M8) cached max variance value for adaptive sampling
  retrogradeCounts?: Uint8Array; // (M8) per-column count of planets in retrograde
  maxRetrogradeCount?: number;   // (M8) maximum planets retrograde in any column
  genMs?: number; // (M10) tile generation time (ms) for perf metrics
}

export interface MockTileParams {
  startTimeMs: number;
  cols?: number;
  stepMs?: number;
  lod?: number;
  planets?: PlanetId[];
  cuspWidthDeg?: number;
  curve?: BlendCurveType;
}

export type BlendCurveType = 'linear' | 'smoothstep' | 'cosine';

export interface ElementMappingConfig {
  cuspWidthDeg: number; // degrees either side of cusp center for blending window
  curve: BlendCurveType;
}

export interface PlanetOrderConfig {
  defaultPlanets: PlanetId[];
}

export interface ElementComputationResult {
  longitude: number; // raw ecliptic longitude degrees 0..360
  vector: ElementVector;
  encoded: ElementEncoded;
}

/** Utility shape returned by mock generator for debugging. */
export interface MockTileDebugMeta {
  sampleLongitudes: number[][]; // [planetIndex][col] = longitude
}

// TD4 Ephemeris provider contracts
export interface EphemerisProviderMeta {
  id: string;
  name: string;
  description?: string;
  source?: string;
  isDeterministic: boolean;
  supportsRetrograde: boolean;
  version?: string;
}

export interface EphemerisPlanetSample {
  planetId: PlanetId;
  timeMs: number;
  longitudeDeg: number;
  retrograde: boolean;
}

export interface EphemerisTileRequest {
  startTimeMs: number;
  cols: number;
  stepMs: number;
  planets: PlanetId[];
}

export interface EphemerisProvider {
  readonly meta: EphemerisProviderMeta;
  getPlanetSample(planetId: PlanetId, timeMs: number): EphemerisPlanetSample;
  getTileSamples?(req: EphemerisTileRequest): EphemerisPlanetSample[][];
}
