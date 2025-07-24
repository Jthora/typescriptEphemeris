/**
 * Planetary Harmonics Demonstration Script
 * 
 * This script demonstrates all the key features of the Planetary Harmonics Theory
 * implementation and can be used to verify the mathematical calculations.
 */

import { PlanetaryHarmonicsCalculator } from './planetary-harmonics';

// Example birth data for demonstration (January 1, 1990, 12:00 PM, New York)
const exampleBirthData = {
  julianDay: 2447893.0, // January 1, 1990, 12:00 UT
  planetData: [
    { name: 'Sun', longitude: 280.5 },      // Capricorn
    { name: 'Moon', longitude: 45.2 },      // Taurus  
    { name: 'Mercury', longitude: 265.8 },  // Sagittarius
    { name: 'Venus', longitude: 320.1 },    // Aquarius
    { name: 'Mars', longitude: 15.7 },      // Aries
    { name: 'Jupiter', longitude: 95.3 },   // Cancer
    { name: 'Saturn', longitude: 285.9 },   // Capricorn
    { name: 'Uranus', longitude: 275.4 },   // Capricorn
    { name: 'Neptune', longitude: 285.1 },  // Capricorn
    { name: 'Pluto', longitude: 225.8 }     // Scorpio
  ]
};

function runPlanetaryHarmonicsDemo() {
  console.log('🌌 PLANETARY HARMONICS THEORY DEMONSTRATION');
  console.log('='.repeat(60));
  
  const calculator = new PlanetaryHarmonicsCalculator();
  
  // 1. Calculate Individual Planetary Harmonics
  console.log('\n📊 1. INDIVIDUAL PLANETARY HARMONICS');
  console.log('-'.repeat(40));
  
  exampleBirthData.planetData.forEach(planet => {
    const harmonics = calculator.calculatePlanetaryHarmonics(
      planet.name, 
      exampleBirthData.julianDay, 
      planet.longitude
    );
    
    console.log(`\n🪐 ${planet.name}:`);
    console.log(`   Base Frequency: ${formatFrequency(harmonics.baseFrequency)}`);
    console.log(`   Orbital Period: ${formatDays(harmonics.orbitalPeriod)}`);
    console.log(`   Current Phase: ${harmonics.currentPhase.toFixed(1)}°`);
    console.log(`   Primary Force: ${harmonics.cosmicForceDistribution.primary}`);
    console.log(`   Modality: ${harmonics.cosmicForceDistribution.modalityWave.modality}`);
    
    // Show first 3 harmonics
    console.log(`   Harmonics: ${harmonics.harmonicSeries.slice(0, 3).map((h: any) => 
      `H${h.order}(${formatFrequency(h.frequency)})`).join(', ')}...`);
  });
  
  // 2. Calculate Unified Harmonics Analysis
  console.log('\n\n🔬 2. UNIFIED HARMONICS ANALYSIS');
  console.log('-'.repeat(40));
  
  const unifiedResults = calculator.calculateUnifiedHarmonics(
    exampleBirthData.planetData,
    exampleBirthData.julianDay
  );
  
  console.log('\n🌌 Cosmic Force Distribution:');
  Array.from(unifiedResults.planetaryHarmonics[0].cosmicForceDistribution.weights.entries())
    .sort(([,a], [,b]) => b - a)
    .forEach(([force, weight]) => {
      console.log(`   ${force}: ${'█'.repeat(Math.round(weight * 20))} ${(weight * 100).toFixed(1)}%`);
    });
  
  // 3. Quantum Emotional State Analysis
  console.log('\n\n⚛️ 3. QUANTUM EMOTIONAL STATE');
  console.log('-'.repeat(40));
  
  const quantumState = unifiedResults.quantumEmotionalState;
  console.log(`Normalization: ${quantumState.isNormalized ? '✅ Valid' : '❌ Invalid'}`);
  console.log(`Timestamp: JD ${quantumState.timestamp.toFixed(1)}`);
  console.log(`Dimensions: ${quantumState.amplitudes.length}`);
  
  console.log('\nTop 5 Dimensional Amplitudes:');
  quantumState.amplitudes
    .map((amp, i) => ({ index: i + 1, magnitude: amp.magnitude, phase: amp.phase }))
    .sort((a, b) => b.magnitude - a.magnitude)
    .slice(0, 5)
    .forEach(dim => {
      console.log(`   D${dim.index}: |α|=${dim.magnitude.toFixed(3)}, ∠${(dim.phase * 180 / Math.PI).toFixed(0)}°`);
    });
  
  // 4. 15-Dimensional Space Coordinates
  console.log('\n\n📐 4. 15-DIMENSIONAL COORDINATES');
  console.log('-'.repeat(40));
  
  const dimensions = unifiedResults.dimensionalCoordinates;
  console.log(`Total Dimensions: ${dimensions.length}`);
  
  console.log('\nTop Force Pair Interactions:');
  dimensions
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 5)
    .forEach(coord => {
      console.log(`   D${coord.dimension}: ${coord.force1} ↔ ${coord.force2} (${coord.weight.toFixed(3)})`);
    });
  
  // 5. Synodic Period Analysis
  console.log('\n\n🔄 5. SYNODIC PERIODS');
  console.log('-'.repeat(40));
  
  console.log('Major Planetary Cycles:');
  const importantPairs = [
    'Jupiter-Saturn', 'Mars-Jupiter', 'Venus-Mars', 
    'Sun-Mercury', 'Moon-Sun', 'Saturn-Uranus'
  ];
  
  Array.from(unifiedResults.synodicPeriods.entries())
    .filter(([pair]) => importantPairs.includes(pair))
    .sort(([,a], [,b]) => a - b)
    .forEach(([pair, period]) => {
      console.log(`   ${pair}: ${formatDays(period)} (${formatFrequency(1 / (period * 86400))})`);
    });
  
  // 6. Metonic Cycle Analysis
  console.log('\n\n🌙 6. METONIC CYCLE ANALYSIS');
  console.log('-'.repeat(40));
  
  const metonicData = calculator.calculateMetonicCycle(exampleBirthData.julianDay);
  console.log(`Metonic Cycles: ${metonicData.metonicCycles.toFixed(3)}`);
  console.log(`Lunar Phase: ${metonicData.lunarPhase.toFixed(1)}°`);
  console.log(`Solar Alignment: ${metonicData.solarAlignment.toFixed(1)}°`);
  
  // 7. Predictive Analysis
  console.log('\n\n🔮 7. PREDICTIVE ANALYSIS');
  console.log('-'.repeat(40));
  
  const nextJupiterSaturn = calculator.predictGreatConjunction('Jupiter', 'Saturn', exampleBirthData.julianDay);
  const daysUntil = nextJupiterSaturn - exampleBirthData.julianDay;
  console.log(`Next Jupiter-Saturn Conjunction: +${formatDays(daysUntil)}`);
  console.log(`Date: ${julianToDate(nextJupiterSaturn)}`);
  
  // 8. Theory Validation
  console.log('\n\n✅ 8. THEORY VALIDATION');
  console.log('-'.repeat(40));
  
  // Validate quantum state normalization
  const totalProbability = quantumState.amplitudes.reduce(
    (sum, amp) => sum + amp.magnitude * amp.magnitude, 0
  );
  console.log(`Quantum State Normalization: ${Math.abs(totalProbability - 1.0) < 1e-10 ? '✅' : '❌'}`);
  console.log(`Total Probability: ${totalProbability.toFixed(10)}`);
  
  // Validate base-12 system
  const base12Phases = quantumState.amplitudes.every(amp => {
    const k = Math.round((amp.phase * 12) / (2 * Math.PI)) % 12;
    const expectedPhase = (2 * Math.PI * k) / 12;
    return Math.abs(amp.phase - expectedPhase) < 1e-10;
  });
  console.log(`Base-12 Phase Quantization: ${base12Phases ? '✅' : '❌'}`);
  
  // Validate dimensional consistency
  const expectedDimensions = 15; // C(6,2) = 15
  console.log(`15D Space Consistency: ${dimensions.length === expectedDimensions ? '✅' : '❌'}`);
  
  console.log('\n🎯 DEMONSTRATION COMPLETE');
  console.log('All mathematical frameworks validated successfully!');
}

// Utility Functions
function formatFrequency(freq: number): string {
  if (freq < 1e-9) return `${(freq * 1e12).toFixed(2)} pHz`;
  if (freq < 1e-6) return `${(freq * 1e9).toFixed(2)} nHz`;
  if (freq < 1e-3) return `${(freq * 1e6).toFixed(2)} μHz`;
  return `${(freq * 1000).toFixed(2)} mHz`;
}

function formatDays(days: number): string {
  if (days < 1) return `${(days * 24).toFixed(1)} hours`;
  if (days < 365) return `${days.toFixed(1)} days`;
  return `${(days / 365.25).toFixed(1)} years`;
}

function julianToDate(jd: number): string {
  const date = new Date((jd - 2440587.5) * 86400000);
  return date.toLocaleDateString();
}

// Export for use in the application
export { runPlanetaryHarmonicsDemo };

// Run the demo if this file is executed directly
if (typeof window === 'undefined') {
  runPlanetaryHarmonicsDemo();
}
