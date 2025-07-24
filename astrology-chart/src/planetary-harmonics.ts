/**
 * Planetary Harmonics: Base-12 Circular Logic System Implementation
 * 
 * This module implements the complete mathematical framework for Planetary Harmonics Theory,
 * including quantum emotional mechanics, cosmic force calculations, and harmonics analysis.
 */

// ==============================================================================
// FUNDAMENTAL CONSTANTS & TYPES
// ==============================================================================

/** Base-12 system fundamental constant */
export const BASE_12 = 12;

/** Planck-like scaling constant for emotional dynamics */
export const HBAR = 1.0; // Simplified for emotional mechanics

/** Zodiacal degrees per sign */
export const DEGREES_PER_SIGN = 30;

/** Number of dimensional coordinates in the 15D space */
export const DIMENSIONAL_SPACE_SIZE = 15;

/** Cosmic Forces enumeration */
export const CosmicForce = {
  CORE: 'Core',      // Fire + Earth: Concentration, singularity
  VOID: 'Void',      // Water + Air: Expansion, matrix space
  ORDER: 'Order',    // Air + Earth: Structure, linear progression
  CHAOS: 'Chaos',    // Fire + Water: Transformation, wave motion
  ALPHA: 'Alpha',    // Fire + Air: Initiation, beginning
  OMEGA: 'Omega'     // Earth + Water: Completion, ending
} as const;

export type CosmicForce = typeof CosmicForce[keyof typeof CosmicForce];

/** Modality types with their wave characteristics */
export const Modality = {
  CARDINAL: 'Cardinal',  // Triangle wave: √3 frequency multiplier
  FIXED: 'Fixed',        // Square wave: 2.0 frequency multiplier
  MUTABLE: 'Mutable'     // Sine wave: 1.0 frequency multiplier
} as const;

export type Modality = typeof Modality[keyof typeof Modality];

/** Classical elements */
export const Element = {
  FIRE: 'Fire',
  EARTH: 'Earth',
  AIR: 'Air',
  WATER: 'Water'
} as const;

export type Element = typeof Element[keyof typeof Element];

// ==============================================================================
// ZODIACAL SYSTEM CONFIGURATION
// ==============================================================================

/** Zodiac sign configuration with cosmic force attribution */
export const ZODIAC_CONFIGURATION = [
  { name: 'Aries', element: Element.FIRE, modality: Modality.CARDINAL, primaryForce: CosmicForce.ALPHA },
  { name: 'Taurus', element: Element.EARTH, modality: Modality.FIXED, primaryForce: CosmicForce.CORE },
  { name: 'Gemini', element: Element.AIR, modality: Modality.MUTABLE, primaryForce: CosmicForce.VOID },
  { name: 'Cancer', element: Element.WATER, modality: Modality.CARDINAL, primaryForce: CosmicForce.OMEGA },
  { name: 'Leo', element: Element.FIRE, modality: Modality.FIXED, primaryForce: CosmicForce.CORE },
  { name: 'Virgo', element: Element.EARTH, modality: Modality.MUTABLE, primaryForce: CosmicForce.ORDER },
  { name: 'Libra', element: Element.AIR, modality: Modality.CARDINAL, primaryForce: CosmicForce.ALPHA },
  { name: 'Scorpio', element: Element.WATER, modality: Modality.FIXED, primaryForce: CosmicForce.CHAOS },
  { name: 'Sagittarius', element: Element.FIRE, modality: Modality.MUTABLE, primaryForce: CosmicForce.CHAOS },
  { name: 'Capricorn', element: Element.EARTH, modality: Modality.CARDINAL, primaryForce: CosmicForce.OMEGA },
  { name: 'Aquarius', element: Element.AIR, modality: Modality.FIXED, primaryForce: CosmicForce.ORDER },
  { name: 'Pisces', element: Element.WATER, modality: Modality.MUTABLE, primaryForce: CosmicForce.VOID }
];

/** Planetary orbital periods in days for frequency calculations */
export const PLANETARY_PERIODS = {
  Sun: 365.26,      // Using Earth's orbital period for geocentric perspective
  Moon: 27.32166,   // Sidereal month
  Mercury: 87.97,
  Venus: 224.70,
  Earth: 365.26,
  Mars: 686.98,
  Jupiter: 4332.59,
  Saturn: 10759.22,
  Uranus: 30688.5,
  Neptune: 60182,
  Pluto: 90560
};

// ==============================================================================
// QUANTUM EMOTIONAL STATE TYPES
// ==============================================================================

/** Complex amplitude for quantum emotional state */
export interface ComplexAmplitude {
  magnitude: number;  // A_i ∈ [0, 1]
  phase: number;      // θ_i ∈ [0, 2π), quantized to base-12
}

/** 15-dimensional emotional state vector */
export interface QuantumEmotionalState {
  amplitudes: ComplexAmplitude[];     // 15 complex amplitudes
  isNormalized: boolean;              // Normalization check
  timestamp: number;                  // Julian day
}

/** Dimensional coordinate in 15D space */
export interface DimensionalCoordinate {
  dimension: number;                  // Index 1-15
  force1: CosmicForce;               // First cosmic force
  force2: CosmicForce;               // Second cosmic force
  weight: number;                    // Coordinate weight
}

// ==============================================================================
// HARMONIC ANALYSIS TYPES
// ==============================================================================

/** Planetary harmonic data */
export interface PlanetaryHarmonics {
  planetName: string;
  baseFrequency: number;             // Hz
  orbitalPeriod: number;            // days
  currentPhase: number;             // degrees
  harmonicSeries: HarmonicComponent[];
  cosmicForceDistribution: CosmicForceDistribution;
}

/** Individual harmonic component */
export interface HarmonicComponent {
  order: number;                    // Harmonic number (1-12)
  frequency: number;               // Hz
  amplitude: number;               // 1/n decay
  phase: number;                   // degrees
}

/** Cosmic force distribution for a planetary position */
export interface CosmicForceDistribution {
  primary: CosmicForce;
  secondary?: CosmicForce;
  weights: Map<CosmicForce, number>;
  modalityWave: ModalityWaveData;
}

/** Modality wave function data */
export interface ModalityWaveData {
  modality: Modality;
  frequencyMultiplier: number;
  waveFunction: (t: number, omega: number) => number;
}

// ==============================================================================
// BASE-12 CIRCULAR ARITHMETIC UTILITIES
// ==============================================================================

/**
 * Normalize angle to base-12 circular system
 * Maps any angle to [0, 360) in 30-degree increments
 */
export function normalizeToBase12(angle: number): number {
  const normalized = ((angle % 360) + 360) % 360;
  return Math.floor(normalized / DEGREES_PER_SIGN) * DEGREES_PER_SIGN;
}

/**
 * Convert angle to base-12 phase index (0-11)
 */
export function angleToBase12Index(angle: number): number {
  return Math.floor(((angle % 360) + 360) % 360 / DEGREES_PER_SIGN);
}

/**
 * Quantize phase to base-12 increments
 * θ_i = (2π * k) / 12, where k = 0, 1, ..., 11
 */
export function quantizePhase(phase: number): number {
  const k = Math.round((phase * BASE_12) / (2 * Math.PI)) % BASE_12;
  return (2 * Math.PI * k) / BASE_12;
}

// ==============================================================================
// COSMIC FORCE CALCULATIONS
// ==============================================================================

/**
 * Calculate cosmic force distribution for a planetary longitude with enhanced precision
 */
/**
 * Calculate comprehensive cosmic force distribution across all 6 forces
 * Based on Planetary Harmonics Theory - each planetary position influences all cosmic forces
 */
export function calculateCosmicForces(longitude: number): CosmicForceDistribution {
  const normalizedLongitude = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(normalizedLongitude / DEGREES_PER_SIGN);
  const degreeInSign = normalizedLongitude % DEGREES_PER_SIGN;
  
  const currentSign = ZODIAC_CONFIGURATION[signIndex];
  const primaryForce = currentSign.primaryForce;
  
  // Initialize weights for all 6 cosmic forces
  const weights = new Map<CosmicForce, number>();
  const allForces = Object.values(CosmicForce);
  
  // Initialize all forces with base weights
  allForces.forEach(force => weights.set(force, 0));
  
  // Calculate elemental influences for the current sign
  const currentElement = currentSign.element;
  const currentModality = currentSign.modality;
  
  // Calculate force influences based on elemental combinations
  // Each force gets weight based on how much it relates to current element + adjacent elements
  const elementalInfluences = calculateElementalForceInfluences(currentElement, currentModality, degreeInSign);
  
  // Apply cusp influences from adjacent signs
  const cuspInfluences = calculateCuspInfluences(signIndex, degreeInSign);
  
  // Combine elemental and cusp influences
  allForces.forEach(force => {
    let totalWeight = elementalInfluences.get(force) || 0;
    totalWeight += cuspInfluences.get(force) || 0;
    weights.set(force, totalWeight);
  });
  
  // Normalize weights to ensure sum equals 1.0
  const totalWeight = Array.from(weights.values()).reduce((sum, w) => sum + w, 0);
  if (totalWeight > 0.001) {
    weights.forEach((weight, force) => weights.set(force, weight / totalWeight));
  } else {
    // Fallback: set primary force to 1.0
    weights.clear();
    allForces.forEach(force => weights.set(force, force === primaryForce ? 1.0 : 0));
  }
  
  // Determine secondary force (highest weight after primary)
  let secondaryForce: CosmicForce | undefined;
  let maxSecondaryWeight = 0;
  weights.forEach((weight, force) => {
    if (force !== primaryForce && weight > maxSecondaryWeight) {
      maxSecondaryWeight = weight;
      secondaryForce = force;
    }
  });
  
  return {
    primary: primaryForce,
    secondary: secondaryForce,
    weights,
    modalityWave: calculateModalityWave(currentSign.modality)
  };
}

/**
 * Calculate elemental force influences based on cosmic force definitions
 * Each force is a combination of two elements - calculate how current element relates
 */
function calculateElementalForceInfluences(
  currentElement: Element, 
  currentModality: Modality, 
  degreeInSign: number
): Map<CosmicForce, number> {
  const influences = new Map<CosmicForce, number>();
  
  // Distance from sign center affects purity (max influence at 15°)
  const distanceFromCenter = Math.abs(degreeInSign - 15);
  const centerPurity = Math.exp(-Math.pow(distanceFromCenter / 12, 2)); // Gaussian centered at sign middle
  const basePurity = 0.3 + 0.7 * centerPurity; // Range: [0.3, 1.0]
  
  // Modality strength multipliers
  const modalityMultipliers = {
    [Modality.CARDINAL]: 1.1,  // Stronger influence for cardinal signs
    [Modality.FIXED]: 1.0,     // Standard influence for fixed signs  
    [Modality.MUTABLE]: 0.9    // Slightly reduced for mutable signs
  };
  const modalityMult = modalityMultipliers[currentModality];
  
  // Calculate influence for each cosmic force based on elemental composition
  
  // Core (Fire + Earth): Concentration, manifestation
  if (currentElement === Element.FIRE || currentElement === Element.EARTH) {
    influences.set(CosmicForce.CORE, basePurity * modalityMult * 0.8); // Primary elemental match
  } else {
    influences.set(CosmicForce.CORE, basePurity * modalityMult * 0.2); // Secondary influence
  }
  
  // Void (Water + Air): Expansion, potential
  if (currentElement === Element.WATER || currentElement === Element.AIR) {
    influences.set(CosmicForce.VOID, basePurity * modalityMult * 0.8);
  } else {
    influences.set(CosmicForce.VOID, basePurity * modalityMult * 0.2);
  }
  
  // Order (Air + Earth): Structure, organization
  if (currentElement === Element.AIR || currentElement === Element.EARTH) {
    influences.set(CosmicForce.ORDER, basePurity * modalityMult * 0.8);
  } else {
    influences.set(CosmicForce.ORDER, basePurity * modalityMult * 0.2);
  }
  
  // Chaos (Fire + Water): Transformation, change
  if (currentElement === Element.FIRE || currentElement === Element.WATER) {
    influences.set(CosmicForce.CHAOS, basePurity * modalityMult * 0.8);
  } else {
    influences.set(CosmicForce.CHAOS, basePurity * modalityMult * 0.2);
  }
  
  // Alpha (Fire + Air): Initiation, beginning
  if (currentElement === Element.FIRE || currentElement === Element.AIR) {
    influences.set(CosmicForce.ALPHA, basePurity * modalityMult * 0.8);
  } else {
    influences.set(CosmicForce.ALPHA, basePurity * modalityMult * 0.2);
  }
  
  // Omega (Earth + Water): Completion, ending
  if (currentElement === Element.EARTH || currentElement === Element.WATER) {
    influences.set(CosmicForce.OMEGA, basePurity * modalityMult * 0.8);
  } else {
    influences.set(CosmicForce.OMEGA, basePurity * modalityMult * 0.2);
  }
  
  return influences;
}

/**
 * Calculate cusp influences from adjacent signs
 */
function calculateCuspInfluences(signIndex: number, degreeInSign: number): Map<CosmicForce, number> {
  const influences = new Map<CosmicForce, number>();
  const allForces = Object.values(CosmicForce);
  
  // Initialize all forces to zero
  allForces.forEach(force => influences.set(force, 0));
  
  const CUSP_ORBS = {
    strong: 3,   // 3° for strong cusp influence
    medium: 6,   // 6° for medium cusp influence
    weak: 10     // 10° for weak cusp influence
  };
  
  // Check for cusp influence at beginning of sign
  if (degreeInSign <= CUSP_ORBS.weak) {
    const prevSignIndex = (signIndex - 1 + 12) % 12;
    const prevSign = ZODIAC_CONFIGURATION[prevSignIndex];
    
    // Calculate cusp strength based on distance from sign boundary
    let cuspStrength = 0;
    if (degreeInSign <= CUSP_ORBS.strong) {
      cuspStrength = 0.4; // Strong influence
    } else if (degreeInSign <= CUSP_ORBS.medium) {
      cuspStrength = 0.25; // Medium influence
    } else {
      cuspStrength = 0.1; // Weak influence
    }
    
    // Smooth transition using sigmoid curve
    const progress = degreeInSign / CUSP_ORBS.weak;
    const smoothTransition = 1 / (1 + Math.exp(-8 * (progress - 0.5)));
    cuspStrength *= (1 - smoothTransition);
    
    // Add influence from previous sign's elemental composition
    const prevInfluences = calculateElementalForceInfluences(prevSign.element, prevSign.modality, 15);
    prevInfluences.forEach((influence, force) => {
      influences.set(force, (influences.get(force) || 0) + influence * cuspStrength);
    });
  }
  
  // Check for cusp influence at end of sign
  if (degreeInSign >= (DEGREES_PER_SIGN - CUSP_ORBS.weak)) {
    const nextSignIndex = (signIndex + 1) % 12;
    const nextSign = ZODIAC_CONFIGURATION[nextSignIndex];
    
    const distanceFromEnd = DEGREES_PER_SIGN - degreeInSign;
    
    // Calculate cusp strength
    let cuspStrength = 0;
    if (distanceFromEnd <= CUSP_ORBS.strong) {
      cuspStrength = 0.4;
    } else if (distanceFromEnd <= CUSP_ORBS.medium) {
      cuspStrength = 0.25;
    } else {
      cuspStrength = 0.1;
    }
    
    // Smooth transition
    const progress = distanceFromEnd / CUSP_ORBS.weak;
    const smoothTransition = 1 / (1 + Math.exp(-8 * (progress - 0.5)));
    cuspStrength *= (1 - smoothTransition);
    
    // Add influence from next sign's elemental composition
    const nextInfluences = calculateElementalForceInfluences(nextSign.element, nextSign.modality, 15);
    nextInfluences.forEach((influence, force) => {
      influences.set(force, (influences.get(force) || 0) + influence * cuspStrength);
    });
  }
  
  return influences;
}

/**
 * Calculate modality wave function data
 */
export function calculateModalityWave(modality: Modality): ModalityWaveData {
  switch (modality) {
    case Modality.CARDINAL:
      return {
        modality,
        frequencyMultiplier: Math.sqrt(3), // ≈ 1.732
        waveFunction: (t: number, omega: number) => 
          // Triangle wave: (4A/π) × Σ[(-1)ⁿ/(2n+1)] × sin((2n+1)ωt × √3)
          (4 / Math.PI) * Math.sin(omega * t * Math.sqrt(3))
      };
      
    case Modality.FIXED:
      return {
        modality,
        frequencyMultiplier: 2.0,
        waveFunction: (t: number, omega: number) =>
          // Square wave: (4A/π) × Σ[1/(2n+1)] × sin((2n+1)ωt × 2)
          (4 / Math.PI) * Math.sin(omega * t * 2)
      };
      
    case Modality.MUTABLE:
      return {
        modality,
        frequencyMultiplier: 1.0,
        waveFunction: (t: number, omega: number) =>
          // Sine wave: A × sin(ωt)
          Math.sin(omega * t)
      };
  }
}

// ==============================================================================
// PLANETARY FREQUENCY CALCULATIONS
// ==============================================================================

/**
 * Calculate base frequency for a planet
 * Base frequency = 1 / (orbital_period_in_seconds)
 */
export function calculateBaseFrequency(planetName: string): number {
  const periodDays = PLANETARY_PERIODS[planetName as keyof typeof PLANETARY_PERIODS];
  if (!periodDays) {
    throw new Error(`Unknown planet: ${planetName}`);
  }
  
  const periodSeconds = periodDays * 24 * 60 * 60;
  return 1.0 / periodSeconds; // Hz
}

/**
 * Calculate current orbital phase for a planet
 */
export function calculateOrbitalPhase(planetName: string, julianDay: number): number {
  const periodDays = PLANETARY_PERIODS[planetName as keyof typeof PLANETARY_PERIODS];
  if (!periodDays) {
    throw new Error(`Unknown planet: ${planetName}`);
  }
  
  const j2000Offset = julianDay - 2451545.0; // Days since J2000.0
  const orbitalCycles = j2000Offset / periodDays;
  const phaseAngle = (orbitalCycles - Math.floor(orbitalCycles)) * 360.0;
  
  return phaseAngle;
}

/**
 * Generate enhanced 12-harmonic series for planetary frequency with amplitude weighting
 */
export function generateHarmonicSeries(baseFrequency: number, currentPhase: number): HarmonicComponent[] {
  const harmonics: HarmonicComponent[] = [];
  
  // Enhanced amplitude calculation with musically/astrologically significant weighting
  for (let n = 1; n <= BASE_12; n++) {
    // Base amplitude follows 1/n decay but with enhanced harmonic emphasis
    let amplitude = 1.0 / n;
    
    // Enhanced harmonically significant orders with musical theory integration
    const harmonicResonance = {
      1: 1.0,    // Fundamental - perfect unity
      2: 0.75,   // Octave (strong harmonic, 2:1 ratio)
      3: 0.85,   // Perfect fifth (very harmonious, 3:2 ratio)
      4: 0.55,   // Double octave (4:1 ratio)
      5: 0.68,   // Major third (harmonious, 5:4 ratio) 
      6: 0.45,   // Tritone resolution (complex interval)
      7: 0.58,   // Minor seventh (mystical seventh, complex but important)
      8: 0.35,   // Triple octave (8:1 ratio)
      9: 0.48,   // Major ninth (9:8 ratio, compound interval)
      10: 0.25,  // Compound intervals (weaker)
      11: 0.38,  // Complex dissonance (11th harmonic, significant in modern theory)
      12: 0.28   // Full zodiacal return (12:1 ratio)
    };
    
    amplitude *= harmonicResonance[n as keyof typeof harmonicResonance] || (1.0 / (n * 1.5));
    
    // Enhanced phase calculation with harmonic phase relationships and base-12 modulation
    let harmonicPhase = (currentPhase * n) % 360;
    
    // Add sophisticated phase modulation based on base-12 zodiacal system
    const base12Modulation = (n - 1) * (360 / 12); // 30° increments per harmonic
    const resonancePhaseShift = harmonicResonance[n as keyof typeof harmonicResonance] * 15; // Extra phase for resonant harmonics
    
    // Combine phase components with slight non-linearity for naturalistic variation
    harmonicPhase = (harmonicPhase + base12Modulation * 0.15 + resonancePhaseShift) % 360;
    
    // Add subtle phase perturbation based on harmonic order (creates more organic phase relationships)
    const phaseNoise = Math.sin(n * Math.PI / 6) * 3; // ±3° variation based on harmonic position
    harmonicPhase = (harmonicPhase + phaseNoise) % 360;
    
    harmonics.push({
      order: n,
      frequency: baseFrequency * n,
      amplitude: amplitude,
      phase: harmonicPhase
    });
  }
  
  return harmonics;
}

/**
 * Calculate synodic period between two planets
 */
export function calculateSynodicPeriod(planet1: string, planet2: string): number {
  const period1 = PLANETARY_PERIODS[planet1 as keyof typeof PLANETARY_PERIODS];
  const period2 = PLANETARY_PERIODS[planet2 as keyof typeof PLANETARY_PERIODS];
  
  if (!period1 || !period2) {
    throw new Error(`Unknown planet(s): ${planet1}, ${planet2}`);
  }
  
  // Synodic period formula: 1/synodic = |1/period1 - 1/period2|
  return 1.0 / Math.abs(1.0 / period1 - 1.0 / period2);
}

// ==============================================================================
// QUANTUM EMOTIONAL MECHANICS IMPLEMENTATION
// ==============================================================================

/**
 * Create enhanced normalized quantum emotional state with improved amplitude distribution
 * |ψ⟩ = Σᵢ αᵢ |Dᵢ⟩, where Σᵢ |αᵢ|² = 1
 */
export function createQuantumEmotionalState(
  cosmicForceWeights: Map<CosmicForce, number>,
  timestamp: number
): QuantumEmotionalState {
  const amplitudes: ComplexAmplitude[] = [];
  
  // Generate 15 dimensional amplitudes from cosmic force pairs with enhanced algorithm
  const forces = Object.values(CosmicForce);
  let dimensionIndex = 0;
  
  for (let i = 0; i < forces.length; i++) {
    for (let j = i + 1; j < forces.length; j++) {
      const force1Weight = cosmicForceWeights.get(forces[i]) || 0;
      const force2Weight = cosmicForceWeights.get(forces[j]) || 0;
      
      // Enhanced magnitude calculation using weighted geometric mean with harmonic boost
      const geometricMean = Math.sqrt(force1Weight * force2Weight);
      const arithmeticMean = (force1Weight + force2Weight) / 2;
      const harmonicMean = force1Weight > 0 && force2Weight > 0 ? 
        2 / (1/force1Weight + 1/force2Weight) : 0;
      
      // Combine means for more balanced magnitude distribution
      const rawMagnitude = 0.5 * geometricMean + 0.3 * arithmeticMean + 0.2 * harmonicMean;
      
      // Enhanced dimensional hierarchy weighting with astrological significance
      const dimensionalHierarchy = {
        'Core-Void': 1.0,     // Fundamental polarity (Fire+Earth vs Water+Air)
        'Order-Chaos': 0.96,  // Dynamic balance (structure vs transformation)
        'Alpha-Omega': 0.92,  // Temporal axis (beginning vs completion)
        'Core-Order': 0.88,   // Structural manifestation
        'Core-Chaos': 0.88,   // Dynamic manifestation  
        'Void-Order': 0.84,   // Spatial structure
        'Void-Chaos': 0.84,   // Spatial dynamics
        'Core-Alpha': 0.80,   // Initiating concentration
        'Core-Omega': 0.80,   // Completing concentration
        'Void-Alpha': 0.76,   // Initiating expansion
        'Void-Omega': 0.76,   // Completing expansion
        'Order-Alpha': 0.72,  // Initiating structure
        'Order-Omega': 0.72,  // Completing structure
        'Chaos-Alpha': 0.68,  // Initiating transformation
        'Chaos-Omega': 0.68   // Completing transformation
      };
      
      const pairKey = `${forces[i]}-${forces[j]}`;
      const hierarchyWeight = dimensionalHierarchy[pairKey as keyof typeof dimensionalHierarchy] || 0.5;
      const magnitude = rawMagnitude * hierarchyWeight;
      
      // Enhanced phase calculation with sophisticated modulation
      const basePhase = (dimensionIndex * 2 * Math.PI) / DIMENSIONAL_SPACE_SIZE;
      
      // Enhanced cosmic force interaction phase with non-linear effects
      const forceInteraction = force1Weight * force2Weight;
      const forcePhaseModulation = Math.atan2(force2Weight - force1Weight, force1Weight + force2Weight);
      
      // Enhanced temporal modulation with multiple cycles
      const primaryTemporal = (timestamp % 12) * (Math.PI / 6); // Base-12 temporal cycle
      const secondaryTemporal = (timestamp % 7) * (Math.PI / 3.5); // Secondary 7-day cycle
      const tertiaryTemporal = (timestamp % 30) * (Math.PI / 15); // Monthly cycle
      
      // Phase modulation based on force interaction strength
      const interactionPhase = forceInteraction > 0.1 ? 
        Math.sin(forceInteraction * Math.PI) * (Math.PI / 4) : 0;
      
      const totalPhase = basePhase + forcePhaseModulation + primaryTemporal * 0.6 + 
                        secondaryTemporal * 0.3 + tertiaryTemporal * 0.1 + interactionPhase;
      const phase = quantizePhase(totalPhase);
      
      amplitudes.push({ magnitude, phase });
      dimensionIndex++;
    }
  }
  
  // Enhanced normalization with robust numerical stability
  const totalProbability = amplitudes.reduce((sum, amp) => sum + amp.magnitude * amp.magnitude, 0);
  
  let isNormalized = false;
  if (totalProbability > 1e-15) { // More stringent threshold for numerical stability
    const normalizationFactor = Math.sqrt(totalProbability);
    amplitudes.forEach(amp => {
      amp.magnitude /= normalizationFactor;
    });
    
    // Verify normalization with tighter tolerance
    const verifyNorm = amplitudes.reduce((sum, amp) => sum + amp.magnitude * amp.magnitude, 0);
    isNormalized = Math.abs(verifyNorm - 1.0) < 1e-12;
    
    // If normalization failed, apply secondary correction
    if (!isNormalized) {
      const correctionFactor = 1.0 / Math.sqrt(verifyNorm);
      amplitudes.forEach(amp => {
        amp.magnitude *= correctionFactor;
      });
      isNormalized = true;
    }
  } else {
    // Enhanced fallback: create weighted uniform distribution based on available forces
    const activeForces = Array.from(cosmicForceWeights.entries()).filter(([, weight]) => weight > 0);
    if (activeForces.length > 0) {
      // Weight based on actual force distribution
      const totalForceWeight = activeForces.reduce((sum, [, weight]) => sum + weight, 0);
      amplitudes.forEach((amp, index) => {
        const forceIndex = index % activeForces.length;
        const relativeWeight = activeForces[forceIndex][1] / totalForceWeight;
        amp.magnitude = Math.sqrt(relativeWeight / DIMENSIONAL_SPACE_SIZE);
      });
    } else {
      // Pure uniform distribution as last resort
      const uniformMagnitude = 1.0 / Math.sqrt(DIMENSIONAL_SPACE_SIZE);
      amplitudes.forEach(amp => {
        amp.magnitude = uniformMagnitude;
      });
    }
    isNormalized = true;
  }
  
  return {
    amplitudes,
    isNormalized,
    timestamp
  };
}

/**
 * Calculate emotional resonance between two quantum states
 * R = |⟨ψ₁|ψ₂⟩|² = |Σᵢ αᵢ₁* αᵢ₂|²
 */
export function calculateEmotionalResonance(
  state1: QuantumEmotionalState,
  state2: QuantumEmotionalState
): number {
  if (state1.amplitudes.length !== state2.amplitudes.length) {
    throw new Error('States must have same dimensionality');
  }
  
  let realPart = 0;
  let imagPart = 0;
  
  for (let i = 0; i < state1.amplitudes.length; i++) {
    const amp1 = state1.amplitudes[i];
    const amp2 = state2.amplitudes[i];
    
    // Complex conjugate of state1 amplitude times state2 amplitude
    const cosPhase1 = Math.cos(amp1.phase);
    const sinPhase1 = Math.sin(amp1.phase);
    const cosPhase2 = Math.cos(amp2.phase);
    const sinPhase2 = Math.sin(amp2.phase);
    
    // (a₁ - ib₁)(a₂ + ib₂) = a₁a₂ + b₁b₂ + i(a₁b₂ - b₁a₂)
    realPart += amp1.magnitude * amp2.magnitude * (cosPhase1 * cosPhase2 + sinPhase1 * sinPhase2);
    imagPart += amp1.magnitude * amp2.magnitude * (cosPhase1 * sinPhase2 - sinPhase1 * cosPhase2);
  }
  
  return realPart * realPart + imagPart * imagPart;
}

/**
 * Evolve quantum emotional state using time evolution operator
 * |ψ(t)⟩ = e^(-iĤt/ℏ) |ψ(0)⟩
 */
export function evolveEmotionalState(
  initialState: QuantumEmotionalState,
  hamiltonianWeights: { cosmic: number[], modality: number[], element: number[] },
  timeStep: number
): QuantumEmotionalState {
  const evolvedAmplitudes = initialState.amplitudes.map((amp, i) => {
    // Simplified Hamiltonian evolution
    const energyContribution = 
      hamiltonianWeights.cosmic[i % 6] * 0.5 +
      hamiltonianWeights.modality[i % 3] * 0.3 +
      hamiltonianWeights.element[i % 4] * 0.2;
    
    const phaseEvolution = energyContribution * timeStep / HBAR;
    const newPhase = quantizePhase(amp.phase + phaseEvolution);
    
    return {
      magnitude: amp.magnitude,
      phase: newPhase
    };
  });
  
  return {
    amplitudes: evolvedAmplitudes,
    isNormalized: initialState.isNormalized,
    timestamp: initialState.timestamp + timeStep
  };
}

// ==============================================================================
// 15-DIMENSIONAL SPACE NAVIGATION
// ==============================================================================

/**
 * Calculate 15-dimensional coordinates from cosmic force distribution
 */
export function calculate15DCoordinates(forceDistribution: CosmicForceDistribution): DimensionalCoordinate[] {
  const coordinates: DimensionalCoordinate[] = [];
  const forces = Object.values(CosmicForce);
  let dimensionIndex = 1;
  
  // Generate pairwise relationships: C(6,2) = 15 dimensions
  for (let i = 0; i < forces.length; i++) {
    for (let j = i + 1; j < forces.length; j++) {
      const force1 = forces[i];
      const force2 = forces[j];
      
      const weight1 = forceDistribution.weights.get(force1) || 0;
      const weight2 = forceDistribution.weights.get(force2) || 0;
      
      // Calculate dimensional weight as interaction strength
      const weight = Math.sqrt(weight1 * weight2) * forceDistribution.modalityWave.frequencyMultiplier;
      
      coordinates.push({
        dimension: dimensionIndex++,
        force1,
        force2,
        weight
      });
    }
  }
  
  return coordinates;
}

/**
 * Calculate harmonic convergence in 15D space
 */
export function calculateHarmonicConvergence(
  coordinates1: DimensionalCoordinate[],
  coordinates2: DimensionalCoordinate[]
): number {
  if (coordinates1.length !== coordinates2.length) {
    throw new Error('Coordinate arrays must have same length');
  }
  
  let convergence = 0;
  for (let i = 0; i < coordinates1.length; i++) {
    const coord1 = coordinates1[i];
    const coord2 = coordinates2[i];
    
    // Calculate Euclidean distance in this dimension
    const distance = Math.abs(coord1.weight - coord2.weight);
    convergence += distance * distance;
  }
  
  // Return normalized convergence (0 = perfect alignment, 1 = maximum divergence)
  return Math.sqrt(convergence) / Math.sqrt(coordinates1.length);
}

// ==============================================================================
// COMPREHENSIVE PLANETARY HARMONICS CALCULATOR
// ==============================================================================

/**
 * Main planetary harmonics calculator
 */
export class PlanetaryHarmonicsCalculator {
  /**
   * Calculate complete planetary harmonics for a given time
   */
  calculatePlanetaryHarmonics(
    planetName: string,
    julianDay: number,
    planetLongitude?: number
  ): PlanetaryHarmonics {
    // Calculate frequency domain
    const baseFrequency = calculateBaseFrequency(planetName);
    const orbitalPeriod = PLANETARY_PERIODS[planetName as keyof typeof PLANETARY_PERIODS];
    const currentPhase = calculateOrbitalPhase(planetName, julianDay);
    const harmonicSeries = generateHarmonicSeries(baseFrequency, currentPhase);
    
    // Calculate cosmic force distribution
    let cosmicForceDistribution: CosmicForceDistribution;
    if (planetLongitude !== undefined) {
      cosmicForceDistribution = calculateCosmicForces(planetLongitude);
    } else {
      // Default distribution if longitude not provided
      cosmicForceDistribution = {
        primary: CosmicForce.CORE,
        weights: new Map([[CosmicForce.CORE, 1.0]]),
        modalityWave: calculateModalityWave(Modality.MUTABLE)
      };
    }
    
    return {
      planetName,
      baseFrequency,
      orbitalPeriod,
      currentPhase,
      harmonicSeries,
      cosmicForceDistribution
    };
  }
  
  /**
   * Calculate unified harmonics for multiple planets
   */
  calculateUnifiedHarmonics(
    planetData: Array<{ name: string; longitude: number }>,
    julianDay: number
  ): {
    planetaryHarmonics: PlanetaryHarmonics[];
    quantumEmotionalState: QuantumEmotionalState;
    dimensionalCoordinates: DimensionalCoordinate[];
    synodicPeriods: Map<string, number>;
  } {
    const planetaryHarmonics: PlanetaryHarmonics[] = [];
    const allForceWeights = new Map<CosmicForce, number>();
    
    // Calculate harmonics for each planet
    for (const planet of planetData) {
      const harmonics = this.calculatePlanetaryHarmonics(planet.name, julianDay, planet.longitude);
      planetaryHarmonics.push(harmonics);
      
      // Accumulate force weights
      harmonics.cosmicForceDistribution.weights.forEach((weight, force) => {
        const existing = allForceWeights.get(force) || 0;
        allForceWeights.set(force, existing + weight);
      });
    }
    
    // Normalize accumulated force weights
    const totalWeight = Array.from(allForceWeights.values()).reduce((sum, w) => sum + w, 0);
    allForceWeights.forEach((weight, force) => {
      allForceWeights.set(force, weight / totalWeight);
    });
    
    // Create quantum emotional state
    const quantumEmotionalState = createQuantumEmotionalState(allForceWeights, julianDay);
    
    // Calculate unified cosmic force distribution
    const primaryForceEntry = Array.from(allForceWeights.entries())
      .reduce((max, current) => current[1] > max[1] ? current : max);
    
    const unifiedDistribution: CosmicForceDistribution = {
      primary: primaryForceEntry[0],
      weights: allForceWeights,
      modalityWave: calculateModalityWave(Modality.MUTABLE) // Default to mutable for unified
    };
    
    const dimensionalCoordinates = calculate15DCoordinates(unifiedDistribution);
    
    // Calculate synodic periods for all planet pairs
    const synodicPeriods = new Map<string, number>();
    for (let i = 0; i < planetData.length; i++) {
      for (let j = i + 1; j < planetData.length; j++) {
        const planet1 = planetData[i].name;
        const planet2 = planetData[j].name;
        try {
          const period = calculateSynodicPeriod(planet1, planet2);
          synodicPeriods.set(`${planet1}-${planet2}`, period);
        } catch (error) {
          console.warn(`Could not calculate synodic period for ${planet1}-${planet2}:`, error);
        }
      }
    }
    
    return {
      planetaryHarmonics,
      quantumEmotionalState,
      dimensionalCoordinates,
      synodicPeriods
    };
  }
  
  /**
   * Predict great conjunctions
   */
  predictGreatConjunction(planet1: string, planet2: string, currentJD: number): number {
    const synodicPeriod = calculateSynodicPeriod(planet1, planet2);
    return currentJD + synodicPeriod;
  }
  
  /**
   * Calculate Metonic cycle data
   */
  calculateMetonicCycle(julianDay: number): {
    metonicCycles: number;
    lunarPhase: number;
    solarAlignment: number;
  } {
    const METONIC_CYCLE_DAYS = 6939.6; // ~19 years
    const SYNODIC_MONTH = 29.530588853; // Average lunar month
    
    const j2000Offset = julianDay - 2451545.0;
    const metonicCycles = j2000Offset / METONIC_CYCLE_DAYS;
    
    const lunarCycles = j2000Offset / SYNODIC_MONTH;
    const lunarPhase = (lunarCycles - Math.floor(lunarCycles)) * 360.0;
    
    const solarCycles = j2000Offset / 365.25;
    const solarAlignment = (solarCycles - Math.floor(solarCycles)) * 360.0;
    
    return {
      metonicCycles,
      lunarPhase,
      solarAlignment
    };
  }
}

export default PlanetaryHarmonicsCalculator;
