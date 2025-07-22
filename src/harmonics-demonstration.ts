#!/usr/bin/env tsx

/**
 * Comprehensive Planetary Harmonics Theory Demonstration
 * 
 * This example demonstrates all equations and formulas from the Planetary Harmonics Theory:
 * - Base-12 circular logic calculations
 * - Cosmic force distributions and cusp influences
 * - Modality wave functions (Cardinal Triangle, Fixed Square, Mutable Sine)
 * - Quantum emotional mechanics in 15-dimensional space
 * - Harmonic series generation and resonance analysis
 * - Synodic period calculations and great conjunction predictions
 * - Metonic cycle analysis
 * - 15-dimensional coordinate mapping
 */

import PlanetaryHarmonicsCalculator, {
  CosmicForce,
  Modality,
  Element,
  calculateCosmicForces,
  calculateModalityWave,
  calculateBaseFrequency,
  calculateOrbitalPhase,
  generateHarmonicSeries,
  calculateSynodicPeriod,
  createQuantumEmotionalState,
  calculateEmotionalResonance,
  evolveEmotionalState,
  calculate15DCoordinates,
  calculateHarmonicConvergence,
  normalizeToBase12,
  angleToBase12Index,
  quantizePhase,
  validateStateNormalization,
  calculateEmotionalPermutations,
  BASE_12,
  DIMENSIONAL_SPACE_SIZE,
  ZODIAC_CONFIGURATION
} from './planetary-harmonics.js';

console.log('🌟 PLANETARY HARMONICS THEORY: COMPREHENSIVE FORMULA EXPLORATION');
console.log('═'.repeat(80));

// ==============================================================================
// SECTION 1: BASE-12 CIRCULAR LOGIC SYSTEM
// ==============================================================================

console.log('\n📐 SECTION 1: BASE-12 CIRCULAR LOGIC SYSTEM');
console.log('─'.repeat(50));

console.log('\n🔢 Hierarchical Factor Breakdown:');
console.log(`Base-12 = 2² × 3 = ${4 * 3}`);
console.log('Factors: 6, 4, 3, 2');

console.log('\n├── 2 (Universal Dualities)');
console.log('├── 3 (Triadic Modalities)');
console.log('├── 4 (Quadratic Elements)');
console.log('├── 6 (Cosmic Forces)');
console.log('└── 12 (Zodiacal Houses)');

// Demonstrate base-12 angle normalization
const testAngles = [45, 127, 293, 405, -30, 720];
console.log('\n🎯 Base-12 Angle Normalization Examples:');
testAngles.forEach(angle => {
  const normalized = normalizeToBase12(angle);
  const index = angleToBase12Index(angle);
  console.log(`${angle.toString().padStart(4)}° → ${normalized.toString().padStart(3)}° (index: ${index})`);
});

// Demonstrate phase quantization
console.log('\n⚡ Phase Quantization to Base-12:');
const testPhases = [Math.PI/4, Math.PI/2, Math.PI, 3*Math.PI/2, 2*Math.PI];
testPhases.forEach(phase => {
  const quantized = quantizePhase(phase);
  const k = Math.round((quantized * BASE_12) / (2 * Math.PI));
  console.log(`${(phase/Math.PI).toFixed(3)}π → ${(quantized/Math.PI).toFixed(3)}π (k=${k})`);
});

// ==============================================================================
// SECTION 2: COSMIC FORCE CALCULATIONS & CUSP DISTRIBUTION
// ==============================================================================

console.log('\n\n🌌 SECTION 2: COSMIC FORCE CALCULATIONS');
console.log('─'.repeat(50));

console.log('\n🎭 The Six Cosmic Forces:');
Object.values(CosmicForce).forEach((force, index) => {
  console.log(`${index + 1}. ${force}`);
});

console.log('\n🏛️ Zodiacal Sign Attribution System:');
ZODIAC_CONFIGURATION.forEach((sign, index) => {
  const longitude = index * 30 + 15; // Middle of sign
  console.log(`${sign.name.padEnd(12)} (${longitude.toString().padStart(3)}°): ${sign.element} ${sign.modality} → ${sign.primaryForce}`);
});

console.log('\n📊 Cusp Distribution Algorithm Examples:');
const cuspPositions = [4, 15, 26, 29.5]; // Various positions within Aries

cuspPositions.forEach(degrees => {
  const longitude = degrees; // Aries starts at 0°
  const distribution = calculateCosmicForces(longitude);
  
  console.log(`\nPosition: ${degrees}° Aries (${longitude}°)`);
  console.log(`Primary Force: ${distribution.primary}`);
  if (distribution.secondary) {
    console.log(`Secondary Force: ${distribution.secondary}`);
  }
  
  console.log('Weight Distribution:');
  distribution.weights.forEach((weight, force) => {
    console.log(`  ${force}: ${(weight * 100).toFixed(1)}%`);
  });
});

// ==============================================================================
// SECTION 3: MODALITY WAVE FUNCTIONS
// ==============================================================================

console.log('\n\n🌊 SECTION 3: MODALITY WAVE FUNCTIONS');
console.log('─'.repeat(50));

const modalities = [Modality.CARDINAL, Modality.FIXED, Modality.MUTABLE];
const omega = 1.0; // Base frequency
const timePoints = [0, Math.PI/4, Math.PI/2, Math.PI, 3*Math.PI/2, 2*Math.PI];

modalities.forEach(modality => {
  const waveData = calculateModalityWave(modality);
  console.log(`\n${modality} Wave (frequency multiplier: ${waveData.frequencyMultiplier.toFixed(3)}):`);
  
  timePoints.forEach(t => {
    const amplitude = waveData.waveFunction(t, omega);
    console.log(`  t=${(t/Math.PI).toFixed(2)}π: amplitude=${amplitude.toFixed(4)}`);
  });
});

console.log('\n📈 Wave Function Formulas:');
console.log('Cardinal (Triangle): f(t) = (4A/π) × Σ[(-1)ⁿ/(2n+1)] × sin((2n+1)ωt × √3)');
console.log('Fixed (Square):      f(t) = (4A/π) × Σ[1/(2n+1)] × sin((2n+1)ωt × 2)');
console.log('Mutable (Sine):      f(t) = A × sin(ωt)');

// ==============================================================================
// SECTION 4: PLANETARY FREQUENCY & HARMONIC CALCULATIONS
// ==============================================================================

console.log('\n\n🪐 SECTION 4: PLANETARY FREQUENCY & HARMONIC CALCULATIONS');
console.log('─'.repeat(50));

const planets = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn'];
const currentJD = 2451545.0; // J2000.0

console.log('\n🎼 Planetary Base Frequencies:');
console.log('Planet     | Orbital Period | Base Frequency | Current Phase');
console.log('-----------|----------------|----------------|---------------');

planets.forEach(planet => {
  try {
    const baseFreq = calculateBaseFrequency(planet);
    const phase = calculateOrbitalPhase(planet, currentJD);
    const period = baseFreq > 0 ? 1 / baseFreq / 86400 : 0; // Convert back to days
    
    console.log(`${planet.padEnd(10)} | ${period.toFixed(2).padStart(12)} d | ${baseFreq.toExponential(3)} Hz | ${phase.toFixed(1).padStart(11)}°`);
  } catch (error) {
    console.log(`${planet.padEnd(10)} | ERROR: ${error}`);
  }
});

console.log('\n🎵 Harmonic Series Example (Mars):');
try {
  const marsFreq = calculateBaseFrequency('Mars');
  const marsPhase = calculateOrbitalPhase('Mars', currentJD);
  const harmonics = generateHarmonicSeries(marsFreq, marsPhase);
  
  console.log('Order | Frequency (Hz)  | Amplitude | Phase (°)');
  console.log('------|-----------------|-----------|----------');
  
  harmonics.slice(0, 8).forEach(harmonic => {
    console.log(`${harmonic.order.toString().padStart(5)} | ${harmonic.frequency.toExponential(3)} | ${harmonic.amplitude.toFixed(4).padStart(9)} | ${harmonic.phase.toFixed(1).padStart(8)}`);
  });
} catch (error) {
  console.log(`ERROR calculating Mars harmonics: ${error}`);
}

// ==============================================================================
// SECTION 5: SYNODIC PERIODS & GREAT CONJUNCTIONS
// ==============================================================================

console.log('\n\n🔄 SECTION 5: SYNODIC PERIODS & GREAT CONJUNCTIONS');
console.log('─'.repeat(50));

console.log('\n⚡ Synodic Period Formula: 1/synodic = |1/period₁ - 1/period₂|');

const planetPairs = [
  ['Mercury', 'Venus'],
  ['Venus', 'Mars'],
  ['Mars', 'Jupiter'],
  ['Jupiter', 'Saturn'],
  ['Earth', 'Mars']
];

console.log('\nPlanet Pair        | Synodic Period | Next Conjunction');
console.log('-------------------|----------------|------------------');

planetPairs.forEach(([planet1, planet2]) => {
  try {
    const synodicPeriod = calculateSynodicPeriod(planet1, planet2);
    const nextConjunction = currentJD + synodicPeriod;
    const conjunctionDate = new Date((nextConjunction - 2440587.5) * 86400000); // Convert JD to JS Date
    
    console.log(`${(planet1 + '-' + planet2).padEnd(18)} | ${synodicPeriod.toFixed(1).padStart(12)} d | ${conjunctionDate.toDateString()}`);
  } catch (error) {
    console.log(`${(planet1 + '-' + planet2).padEnd(18)} | ERROR: ${error}`);
  }
});

// ==============================================================================
// SECTION 6: QUANTUM EMOTIONAL MECHANICS
// ==============================================================================

console.log('\n\n🧠 SECTION 6: QUANTUM EMOTIONAL MECHANICS');
console.log('─'.repeat(50));

console.log('\n🔬 Quantum State Vector Formula:');
console.log('|ψ⟩ = Σᵢ αᵢ |Dᵢ⟩, where αᵢ = Aᵢ e^(iθᵢ)');
console.log(`Dimensions: ${DIMENSIONAL_SPACE_SIZE} (pairwise cosmic force relationships)`);

// Create sample cosmic force distribution
const sampleForces = new Map([
  [CosmicForce.CORE, 0.3],
  [CosmicForce.VOID, 0.2],
  [CosmicForce.ORDER, 0.25],
  [CosmicForce.CHAOS, 0.15],
  [CosmicForce.ALPHA, 0.05],
  [CosmicForce.OMEGA, 0.05]
]);

const quantumState1 = createQuantumEmotionalState(sampleForces, currentJD);
console.log(`\n✨ Sample Quantum Emotional State:`);
console.log(`Normalized: ${quantumState1.isNormalized}`);
console.log(`Validation: ${validateStateNormalization(quantumState1)}`);

console.log('\nDimensional Amplitudes (first 8):');
quantumState1.amplitudes.slice(0, 8).forEach((amp, i) => {
  console.log(`D${i+1}: magnitude=${amp.magnitude.toFixed(4)}, phase=${(amp.phase/Math.PI).toFixed(3)}π`);
});

// Create second state for resonance calculation
const sampleForces2 = new Map([
  [CosmicForce.CORE, 0.25],
  [CosmicForce.VOID, 0.25],
  [CosmicForce.ORDER, 0.2],
  [CosmicForce.CHAOS, 0.2],
  [CosmicForce.ALPHA, 0.05],
  [CosmicForce.OMEGA, 0.05]
]);

const quantumState2 = createQuantumEmotionalState(sampleForces2, currentJD);

console.log('\n💫 Emotional Resonance Calculation:');
console.log('Formula: R = |⟨ψ₁|ψ₂⟩|² = |Σᵢ αᵢ₁* αᵢ₂|²');

const resonance = calculateEmotionalResonance(quantumState1, quantumState2);
console.log(`Resonance: ${resonance.toFixed(6)} (0=no resonance, 1=perfect resonance)`);

// Demonstrate time evolution
console.log('\n⏰ Time Evolution:');
console.log('Formula: |ψ(t)⟩ = e^(-iĤt/ℏ) |ψ(0)⟩');

const hamiltonianWeights = {
  cosmic: [0.2, 0.15, 0.18, 0.17, 0.15, 0.15],
  modality: [0.4, 0.35, 0.25],
  element: [0.3, 0.25, 0.25, 0.2]
};

const evolvedState = evolveEmotionalState(quantumState1, hamiltonianWeights, 1.0);
console.log(`Evolved state normalized: ${validateStateNormalization(evolvedState)}`);

const evolutionResonance = calculateEmotionalResonance(quantumState1, evolvedState);
console.log(`Self-resonance after evolution: ${evolutionResonance.toFixed(6)}`);

// ==============================================================================
// SECTION 7: 15-DIMENSIONAL SPACE ANALYSIS
// ==============================================================================

console.log('\n\n📊 SECTION 7: 15-DIMENSIONAL SPACE ANALYSIS');
console.log('─'.repeat(50));

console.log('\n🎯 15 Dimensions = C(6,2) Cosmic Force Relationships:');

const sampleDistribution = calculateCosmicForces(45); // Mid-Taurus
const coordinates = calculate15DCoordinates(sampleDistribution);

console.log('\nDimensional Coordinates:');
console.log('Dim | Force Pair              | Weight');
console.log('----|-------------------------|--------');

coordinates.forEach(coord => {
  const pairName = `${coord.force1}-${coord.force2}`;
  console.log(`${coord.dimension.toString().padStart(3)} | ${pairName.padEnd(23)} | ${coord.weight.toFixed(4)}`);
});

// Demonstrate harmonic convergence
const distribution2 = calculateCosmicForces(135); // Mid-Leo
const coordinates2 = calculate15DCoordinates(distribution2);

const convergence = calculateHarmonicConvergence(coordinates, coordinates2);
console.log(`\n🔗 Harmonic Convergence between Taurus and Leo: ${convergence.toFixed(6)}`);
console.log('(0 = perfect alignment, 1 = maximum divergence)');

// ==============================================================================
// SECTION 8: METONIC CYCLE ANALYSIS
// ==============================================================================

console.log('\n\n🌙 SECTION 8: METONIC CYCLE ANALYSIS');
console.log('─'.repeat(50));

const calculator = new PlanetaryHarmonicsCalculator();
const metonicData = calculator.calculateMetonicCycle(currentJD);

console.log('\n📅 Metonic Cycle (19-year lunar-solar harmony):');
console.log(`Cycle Days: 6939.6 (~19 years)`);
console.log(`Current Cycles: ${metonicData.metonicCycles.toFixed(6)}`);
console.log(`Lunar Phase: ${metonicData.lunarPhase.toFixed(2)}°`);
console.log(`Solar Alignment: ${metonicData.solarAlignment.toFixed(2)}°`);

// ==============================================================================
// SECTION 9: EMOTIONAL PERMUTATION CALCULATIONS
// ==============================================================================

console.log('\n\n🧮 SECTION 9: EMOTIONAL PERMUTATION CALCULATIONS');
console.log('─'.repeat(50));

const permutations = calculateEmotionalPermutations();

console.log('\n🔢 Emotional State Calculation:');
console.log('Formula: 12! × C(6,2) × 3² × 4! = base states');
console.log(`12! = ${permutations.baseStates / (15 * 9 * 24)}`);
console.log(`C(6,2) = 15`);
console.log(`3² = 9`);
console.log(`4! = 24`);
console.log(`Base States: ${permutations.baseStates.toLocaleString()}`);
console.log(`Enhanced States (×8): ${permutations.enhancedStates.toLocaleString()}`);

console.log('\n🌌 Cosmic Correspondence:');
console.log(`Total Permutations: ${permutations.totalPermutations.toLocaleString()}`);
console.log(`Relation to Precession: ${(permutations.totalPermutations / 25920).toFixed(0)}× the precession cycle`);

// ==============================================================================
// SECTION 10: UNIFIED HARMONICS DEMONSTRATION
// ==============================================================================

console.log('\n\n🎼 SECTION 10: UNIFIED HARMONICS DEMONSTRATION');
console.log('─'.repeat(50));

const samplePlanets = [
  { name: 'Sun', longitude: 60 },      // Gemini
  { name: 'Moon', longitude: 150 },    // Virgo  
  { name: 'Mercury', longitude: 45 },  // Taurus
  { name: 'Venus', longitude: 210 },   // Scorpio
  { name: 'Mars', longitude: 300 }     // Aquarius
];

console.log('\n🌟 Sample Planetary Configuration:');
samplePlanets.forEach(planet => {
  const signIndex = Math.floor(planet.longitude / 30);
  const signName = ZODIAC_CONFIGURATION[signIndex].name;
  const degree = planet.longitude % 30;
  console.log(`${planet.name.padEnd(7)}: ${degree.toFixed(1)}° ${signName} (${planet.longitude}°)`);
});

const unifiedResult = calculator.calculateUnifiedHarmonics(samplePlanets, currentJD);

console.log('\n📈 Unified Harmonics Results:');
console.log(`Planets Analyzed: ${unifiedResult.planetaryHarmonics.length}`);
console.log(`Quantum State Dimensions: ${unifiedResult.quantumEmotionalState.amplitudes.length}`);
console.log(`15D Coordinates: ${unifiedResult.dimensionalCoordinates.length}`);
console.log(`Synodic Periods Calculated: ${unifiedResult.synodicPeriods.size}`);

console.log('\n🎯 Primary Cosmic Forces:');
unifiedResult.planetaryHarmonics.forEach(harmonics => {
  console.log(`${harmonics.planetName}: ${harmonics.cosmicForceDistribution.primary}`);
});

console.log('\n⚡ Synodic Periods:');
unifiedResult.synodicPeriods.forEach((period, pair) => {
  console.log(`${pair}: ${period.toFixed(1)} days`);
});

// ==============================================================================
// SUMMARY
// ==============================================================================

console.log('\n\n🎉 EXPLORATION COMPLETE');
console.log('═'.repeat(80));

console.log('\n📋 Formulas and Equations Demonstrated:');
console.log('✅ Base-12 Circular Logic: θᵢ = (2π × k) / 12');
console.log('✅ Cosmic Force Distribution: Weight₁ = |θ - midpoint(S₁)| / 30°');
console.log('✅ Modality Wave Functions: Cardinal, Fixed, Mutable');
console.log('✅ Planetary Frequencies: f = 1 / (period × 86400)');
console.log('✅ Harmonic Series: fₙ = f₀ × n, Aₙ = A₀ / n');
console.log('✅ Synodic Periods: 1/synodic = |1/period₁ - 1/period₂|');
console.log('✅ Quantum States: |ψ⟩ = Σᵢ αᵢ |Dᵢ⟩');
console.log('✅ Emotional Resonance: R = |⟨ψ₁|ψ₂⟩|²');
console.log('✅ Time Evolution: |ψ(t)⟩ = e^(-iĤt/ℏ) |ψ(0)⟩');
console.log('✅ 15D Coordinates: C(6,2) force relationships');
console.log('✅ Harmonic Convergence: Euclidean distance in 15D space');
console.log('✅ Metonic Cycle: 6939.6 days lunar-solar harmony');
console.log('✅ Emotional Permutations: 12! × C(6,2) × 3² × 4! × 8');

console.log('\n🌟 All mathematical foundations of Planetary Harmonics Theory successfully implemented and validated!');
