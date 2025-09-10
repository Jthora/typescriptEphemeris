/**
 * Constants & defaults for Timestream (Milestone M1)
 */
import type { PlanetOrderConfig, ElementMappingConfig, PlanetId } from './types';

export const DEFAULT_PLANET_ORDER: PlanetOrderConfig['defaultPlanets'] = [
  'Sun', 'Moon', 'Mercury', 'Venus', 'Mars',
  'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto',
  'Chiron', 'MeanNode'
];

export const DEFAULT_ELEMENT_MAPPING: ElementMappingConfig = {
  cuspWidthDeg: 3,
  curve: 'linear'
};

export const DEFAULT_HIGHLIGHT_GAIN = 0.75;
export const DEFAULT_HIGHLIGHT_GAMMA = 2.0;
export const DEFAULT_VARIANCE_THRESHOLD = 0.15;
// Retrograde refinement density threshold (fraction of columns with retro motion to trigger refinement)
export const DEFAULT_RETRO_DENSITY_THRESHOLD = 0.05;

export const DEFAULT_BASE_STEP_MS = 60_000; // 1 minute
export const DEFAULT_TILE_COLS = 3072; // target tile width
export const DEFAULT_MAX_RESIDENT_TILES = 4;

/** Planet to element mapping is dynamic via longitude; this table is for ordering only. */
export const PLANET_LABELS: Record<PlanetId, string> = Object.fromEntries(
  DEFAULT_PLANET_ORDER.map(p => [p, p])
);

// Zodiac sign boundaries (0 Aries, 30 Taurus, ...). Index -> start longitude.
export const SIGN_STARTS: number[] = Array.from({ length: 12 }, (_, i) => i * 30);

// Sign index -> elemental channel.
// Fire, Earth, Air, Water repeating every 4 signs starting with Aries=Fire.
export const SIGN_ELEMENT: ('fire' | 'earth' | 'air' | 'water')[] = [
  'fire',  // Aries
  'earth', // Taurus
  'air',   // Gemini
  'water', // Cancer
  'fire',  // Leo
  'earth', // Virgo
  'air',   // Libra
  'water', // Scorpio
  'fire',  // Sagittarius
  'earth', // Capricorn
  'air',   // Aquarius
  'water'  // Pisces
];
