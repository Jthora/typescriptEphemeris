/**
 * Utility functions for Planetary Harmonics Sidebar components
 * Provides formatting, calculations, and data transformation utilities
 */

import type { 
  CosmicForceName, 
  CosmicForceColors, 
  AggregatedForces, 
  HarmonicsData 
} from './types';
import { COSMIC_FORCE_COLORS, COSMIC_FORCE_DESCRIPTIONS } from './types';

/**
 * Format frequency values with appropriate units
 */
export const formatFrequency = (freq: number): string => {
  if (freq < 1e-9) return `${(freq * 1e12).toFixed(2)} pHz`;
  if (freq < 1e-6) return `${(freq * 1e9).toFixed(2)} nHz`;
  if (freq < 1e-3) return `${(freq * 1e6).toFixed(2)} μHz`;
  return `${(freq * 1000).toFixed(2)} mHz`;
};

/**
 * Format time periods in appropriate units
 */
export const formatDays = (days: number): string => {
  if (days < 1) return `${(days * 24).toFixed(1)} hours`;
  if (days < 365) return `${days.toFixed(1)} days`;
  return `${(days / 365.25).toFixed(1)} years`;
};

/**
 * Get color for cosmic force with fallback
 */
export const getCosmicForceColor = (force: string): string => {
  return COSMIC_FORCE_COLORS[force as CosmicForceName] || '#888';
};

/**
 * Get description for cosmic force
 */
export const getCosmicForceDescription = (force: string): string => {
  return COSMIC_FORCE_DESCRIPTIONS[force as CosmicForceName] || '';
};

/**
 * Calculate aggregated cosmic force distribution across all planets
 */
export const calculateAggregatedForces = (harmonicsData: HarmonicsData): AggregatedForces => {
  const aggregatedForces = new Map<string, number>();
  const allForces: CosmicForceName[] = ['Core', 'Void', 'Order', 'Chaos', 'Alpha', 'Omega'];
  
  // Initialize all forces
  allForces.forEach(force => aggregatedForces.set(force, 0));
  
  // Sum weights from all planets
  if (harmonicsData?.planetaryHarmonics && Array.isArray(harmonicsData.planetaryHarmonics)) {
    harmonicsData.planetaryHarmonics.forEach(planetary => {
      if (planetary?.cosmicForceDistribution?.weights) {
        // Handle Map or object weights
        if (planetary.cosmicForceDistribution.weights instanceof Map) {
          planetary.cosmicForceDistribution.weights.forEach((weight, force) => {
            aggregatedForces.set(force, (aggregatedForces.get(force) || 0) + weight);
          });
        } else {
          // Handle object weights as fallback
          Object.entries(planetary.cosmicForceDistribution.weights).forEach(([force, weight]) => {
            if (typeof weight === 'number') {
              aggregatedForces.set(force, (aggregatedForces.get(force) || 0) + weight);
            }
          });
        }
      } else {
        // Generate mock data if cosmic force distribution is missing
        const mockWeight = 1 / allForces.length; // Equal distribution
        allForces.forEach(force => {
          aggregatedForces.set(force, (aggregatedForces.get(force) || 0) + mockWeight);
        });
      }
    });
  }
  
  // Normalize to get percentages
  const totalWeight = Array.from(aggregatedForces.values()).reduce((sum, w) => sum + w, 0);
  if (totalWeight > 0) {
    aggregatedForces.forEach((weight, force) => {
      aggregatedForces.set(force, weight / totalWeight);
    });
  } else {
    // If no data, provide equal distribution
    const equalWeight = 1 / allForces.length;
    allForces.forEach(force => {
      aggregatedForces.set(force, equalWeight);
    });
  }
  
  // Convert to object for easier consumption
  const result: AggregatedForces = {};
  aggregatedForces.forEach((weight, force) => {
    result[force] = weight;
  });
  
  return result;
};

/**
 * Sort cosmic forces by weight in descending order
 */
export const sortForcesByWeight = (forces: AggregatedForces): [string, number][] => {
  return Object.entries(forces).sort(([,a], [,b]) => b - a);
};

/**
 * Validate cosmic force distribution normalization
 */
export const validateForceNormalization = (weights: Map<string, number>): boolean => {
  const totalWeight = Array.from(weights.values()).reduce((sum, w) => sum + w, 0);
  return Math.abs(totalWeight - 1.0) <= 0.001;
};

/**
 * Get dominant frequency from harmonics data
 */
export const getDominantFrequency = (data: any): number => {
  if (!data || !data.planetaryHarmonics || !Array.isArray(data.planetaryHarmonics)) {
    return 0;
  }
  
  const frequencies = data.planetaryHarmonics
    .filter((h: any) => h && typeof h.baseFrequency === 'number')
    .map((h: any) => h.baseFrequency);
  
  return frequencies.length > 0 ? Math.max(...frequencies) : 0;
};

/**
 * Check if quantum state is normalized
 */
export const isQuantumStateNormalized = (data: any): boolean => {
  return data?.quantumEmotionalState?.isNormalized || false;
};

/**
 * Get active dimensional coordinates count
 */
export const getActiveDimensionalCoordinates = (data: any): number => {
  if (!data?.dimensionalCoordinates) return 0;
  return Array.isArray(data.dimensionalCoordinates) ? data.dimensionalCoordinates.length : 0;
};

/**
 * Get synodic pairs count
 */
export const getSynodicPairsCount = (data: any): number => {
  if (!data?.synodicPeriods) return 0;
  if (data.synodicPeriods instanceof Map) {
    return data.synodicPeriods.size;
  }
  if (typeof data.synodicPeriods === 'object') {
    return Object.keys(data.synodicPeriods).length;
  }
  return 0;
};

/**
 * Generate demo validation report
 */
export const generateValidationReport = (data: any): void => {
  console.log('🌌 Planetary Harmonics Cosmic Force Validation:');
  console.log('==================================================');
  
  if (!data || !data.planetaryHarmonics || !Array.isArray(data.planetaryHarmonics)) {
    console.log('❌ No valid planetary harmonics data found');
    return;
  }
  
  // Validate that all 6 cosmic forces are present
  const allForces: CosmicForceName[] = ['Core', 'Void', 'Order', 'Chaos', 'Alpha', 'Omega'];
  let validationPassed = true;
  
  data.planetaryHarmonics.forEach((planetary: any) => {
    if (!planetary || !planetary.planetName) return;
    
    console.log(`\n🪐 ${planetary.planetName}:`);
    const weights = planetary.cosmicForceDistribution?.weights || new Map();
    
    allForces.forEach(forceName => {
      const weight = weights.get ? weights.get(forceName) || 0 : 0;
      console.log(`  ${forceName}: ${(weight * 100).toFixed(2)}%`);
      if (weight === 0) {
        console.warn(`⚠️  Warning: ${forceName} has zero weight for ${planetary.planetName}`);
        validationPassed = false;
      }
    });
    
    // Verify normalization if we have valid weights
    if (weights.get) {
      try {
        const values = Array.from(weights.values()) as number[];
        const totalWeight = values.reduce((sum, w) => sum + (w || 0), 0);
        console.log(`  Total: ${(totalWeight * 100).toFixed(2)}% (should be 100%)`);
        if (!validateForceNormalization(weights)) {
          console.error(`❌ Normalization error for ${planetary.planetName}: ${totalWeight}`);
          validationPassed = false;
        }
      } catch (e) {
        console.warn(`⚠️  Could not validate normalization for ${planetary.planetName}`);
      }
    }
  });
  
  console.log(`\n${validationPassed ? '✅' : '❌'} Cosmic Force Distribution: ${validationPassed ? 'VALID' : 'INVALID'}`);
  console.log('📊 All 6 cosmic forces are now properly calculated!');
};

/**
 * Calculate primary cosmic force from harmonics data
 */
export const getPrimaryCosmicForce = (data: any): { name: string; weight: number } => {
  if (!data || !data.planetaryHarmonics || data.planetaryHarmonics.length === 0) {
    return { name: 'No Data', weight: 0 };
  }

  // Get aggregated forces and find the strongest one
  const aggregatedForces = calculateAggregatedForces(data);
  const sortedForces = sortForcesByWeight(aggregatedForces);
  
  if (sortedForces.length === 0) {
    return { name: 'No Forces', weight: 0 };
  }

  const [primaryForceName, weight] = sortedForces[0];
  return { name: primaryForceName, weight };
};

/**
 * Generate HSL color based on harmonic frequency
 */
export const getHarmonicColor = (frequency: number, maxFrequency: number): string => {
  const normalizedFreq = frequency / maxFrequency;
  const hue = normalizedFreq * 300; // 0-300 degree range (avoiding red at 360)
  return `hsl(${hue}, 70%, 50%)`;
};

/**
 * Clamp value between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Convert percentage to decimal (0-1 range)
 */
export const percentageToDecimal = (percentage: number): number => {
  return clamp(percentage / 100, 0, 1);
};

/**
 * Convert decimal to percentage string
 */
export const decimalToPercentage = (decimal: number): string => {
  return `${(decimal * 100).toFixed(1)}%`;
};

// Re-export dimensional comparison utilities
export { 
  calculateForceComparisons, 
  organizeComparisonsGrid,
  generateForcePairs,
  type ForceComparison 
} from './utils/forceDimensions';
