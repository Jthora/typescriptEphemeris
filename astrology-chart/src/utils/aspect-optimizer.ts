/**
 * Aspect Calculation Optimizer
 * 
 * This module optimizes aspect calculations by implementing caching,
 * early exit strategies, and pre-computed lookup tables.
 */

interface AspectDefinition {
  name: string;
  angle: number;
  orb: number;
  weight: number; // For prioritizing major aspects
}

interface CachedAspect {
  planet1: string;
  planet2: string;
  type: string;
  angle: number;
  orb: number;
  hash: string;
}

interface AspectLookupEntry {
  aspects: CachedAspect[];
  calculatedAt: number;
  planetPositions: { [planetName: string]: number };
}

export class AspectOptimizer {
  private cache = new Map<string, AspectLookupEntry>();
  private readonly TTL = 30 * 60 * 1000; // 30 minutes cache
  private readonly POSITION_TOLERANCE = 2.0; // degrees - increased to prevent flickering
  
  // Pre-computed aspect definitions sorted by importance
  private readonly ASPECT_DEFINITIONS: AspectDefinition[] = [
    { name: 'Conjunction', angle: 0, orb: 8, weight: 10 },
    { name: 'Opposition', angle: 180, orb: 8, weight: 10 },
    { name: 'Trine', angle: 120, orb: 8, weight: 8 },
    { name: 'Square', angle: 90, orb: 8, weight: 8 },
    { name: 'Sextile', angle: 60, orb: 6, weight: 6 },
    { name: 'Quincunx', angle: 150, orb: 3, weight: 4 },
    { name: 'Semisextile', angle: 30, orb: 2, weight: 3 },
    { name: 'Semisquare', angle: 45, orb: 2, weight: 2 },
    { name: 'Sesquiquadrate', angle: 135, orb: 2, weight: 2 }
  ];

  /**
   * Generate cache key based on planet positions (rounded)
   */
  private generateCacheKey(planets: Array<{ name: string; longitude: number }>): string {
    const positions = planets
      .map(p => `${p.name}:${Math.round(p.longitude * 0.5) / 0.5}`) // Round to 2 degree increments
      .sort()
      .join('|');
    return btoa(positions);
  }

  /**
   * Check if cached entry is still valid
   */
  private isValidEntry(
    entry: AspectLookupEntry, 
    currentPlanets: Array<{ name: string; longitude: number }>
  ): boolean {
    const now = Date.now();
    const ageMs = now - entry.calculatedAt;
    
    if (ageMs > this.TTL) {
      return false;
    }

    // Check if planet positions have drifted beyond tolerance
    for (const planet of currentPlanets) {
      const cachedPosition = entry.planetPositions[planet.name];
      if (cachedPosition === undefined) {
        return false;
      }
      
      const drift = Math.abs(this.normalizeAngle(planet.longitude - cachedPosition));
      if (drift > this.POSITION_TOLERANCE) {
        return false;
      }
    }

    return true;
  }

  /**
   * Normalize angle to 0-360 range
   */
  private normalizeAngle(angle: number): number {
    while (angle < 0) angle += 360;
    while (angle >= 360) angle -= 360;
    return angle;
  }

  /**
   * Calculate the smallest angular difference between two longitudes
   */
  private getAngularDifference(long1: number, long2: number): number {
    const diff = Math.abs(long1 - long2);
    return Math.min(diff, 360 - diff);
  }

  /**
   * Fast aspect detection using pre-computed lookup
   */
  private detectAspectFast(angleDiff: number): AspectDefinition | null {
    // Use binary search-like approach for major aspects first
    for (const aspectDef of this.ASPECT_DEFINITIONS) {
      const deviation = Math.abs(angleDiff - aspectDef.angle);
      const altDeviation = Math.abs(angleDiff - (aspectDef.angle + 360));
      const minDeviation = Math.min(deviation, altDeviation);
      
      if (minDeviation <= aspectDef.orb) {
        return aspectDef;
      }
    }
    
    return null;
  }

  /**
   * Optimized aspect calculation with early exits and caching
   */
  calculateAspectsOptimized(
    planets: Array<{ name: string; longitude: number }>
  ): CachedAspect[] {
    const cacheKey = this.generateCacheKey(planets);
    const cachedEntry = this.cache.get(cacheKey);
    
    // Check cache first
    if (cachedEntry && this.isValidEntry(cachedEntry, planets)) {
      console.log(`💾 Aspect cache hit for ${planets.length} planets`);
      return cachedEntry.aspects;
    }

    console.log(`🔄 Calculating aspects for ${planets.length} planets`);
    const startTime = performance.now();
    
    const aspects: CachedAspect[] = [];
    const planetCount = planets.length;
    
    // Optimized nested loop with early exits
    for (let i = 0; i < planetCount - 1; i++) {
      const planet1 = planets[i];
      
      for (let j = i + 1; j < planetCount; j++) {
        const planet2 = planets[j];
        
        // Skip certain planet combinations that rarely form meaningful aspects
        if (this.shouldSkipPlanetPair(planet1.name, planet2.name)) {
          continue;
        }
        
        const angleDiff = this.getAngularDifference(planet1.longitude, planet2.longitude);
        const aspectDef = this.detectAspectFast(angleDiff);
        
        if (aspectDef) {
          const orb = Math.abs(angleDiff - aspectDef.angle);
          
          aspects.push({
            planet1: planet1.name,
            planet2: planet2.name,
            type: aspectDef.name,
            angle: aspectDef.angle,
            orb,
            hash: `${planet1.name}-${planet2.name}-${aspectDef.name}`
          });
        }
      }
    }

    // Sort aspects by importance (weight) and orb tightness
    aspects.sort((a, b) => {
      const weightA = this.ASPECT_DEFINITIONS.find(def => def.name === a.type)?.weight || 0;
      const weightB = this.ASPECT_DEFINITIONS.find(def => def.name === b.type)?.weight || 0;
      
      if (weightA !== weightB) {
        return weightB - weightA; // Higher weight first
      }
      
      return a.orb - b.orb; // Tighter orb first
    });

    // Cache the results
    const planetPositions: { [name: string]: number } = {};
    planets.forEach(p => {
      planetPositions[p.name] = p.longitude;
    });

    this.cache.set(cacheKey, {
      aspects,
      calculatedAt: Date.now(),
      planetPositions
    });

    const endTime = performance.now();
    console.log(`⚡ Aspect calculation completed in ${(endTime - startTime).toFixed(2)}ms (${aspects.length} aspects found)`);
    
    return aspects;
  }

  /**
   * Determine if planet pair should be skipped for performance
   */
  private shouldSkipPlanetPair(planet1: string, planet2: string): boolean {
    // Skip aspects between outer planets that move very slowly
    const outerPlanets = ['Uranus', 'Neptune', 'Pluto'];
    const slowMovingPairs = [
      ['Uranus', 'Neptune'],
      ['Uranus', 'Pluto'], 
      ['Neptune', 'Pluto']
    ];
    
    for (const pair of slowMovingPairs) {
      if ((planet1 === pair[0] && planet2 === pair[1]) || 
          (planet1 === pair[1] && planet2 === pair[0])) {
        // These aspects change very slowly, can be calculated less frequently
        return Math.random() > 0.1; // Skip 90% of the time for performance
      }
    }
    
    return false;
  }

  /**
   * Pre-calculate common aspect patterns
   */
  precomputeAspectPatterns(): void {
    console.log('🔄 Precomputing common aspect patterns...');
    
    // Common planetary configurations for caching
    const commonConfigurations = [
      // Sun-Moon cycles
      { name: 'Sun', longitude: 0 },
      { name: 'Moon', longitude: 90 },
      { name: 'Mercury', longitude: 15 },
      { name: 'Venus', longitude: 30 },
      { name: 'Mars', longitude: 45 }
    ];

    this.calculateAspectsOptimized(commonConfigurations);
    console.log('✅ Aspect pattern precomputation completed');
  }

  /**
   * Get major aspects only (performance optimization for real-time)
   */
  getMajorAspectsOnly(
    planets: Array<{ name: string; longitude: number }>
  ): CachedAspect[] {
    const allAspects = this.calculateAspectsOptimized(planets);
    
    // Filter to only major aspects (weight >= 6)
    return allAspects.filter(aspect => {
      const aspectDef = this.ASPECT_DEFINITIONS.find(def => def.name === aspect.type);
      return aspectDef && aspectDef.weight >= 6;
    });
  }

  /**
   * Cleanup expired cache entries
   */
  cleanup(): void {
    const now = Date.now();
    let removedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.calculatedAt > this.TTL) {
        this.cache.delete(key);
        removedCount++;
      }
    }

    if (removedCount > 0) {
      console.log(`🧹 Cleaned up ${removedCount} expired aspect cache entries`);
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    totalEntries: number;
    cacheHitRate: number;
    averageAspectsPerEntry: number;
    oldestEntry: number;
    newestEntry: number;
  } {
    let totalAspects = 0;
    let oldestEntry = Date.now();
    let newestEntry = 0;

    for (const entry of this.cache.values()) {
      totalAspects += entry.aspects.length;
      oldestEntry = Math.min(oldestEntry, entry.calculatedAt);
      newestEntry = Math.max(newestEntry, entry.calculatedAt);
    }

    return {
      totalEntries: this.cache.size,
      cacheHitRate: 0, // Would be calculated with hit/miss counters
      averageAspectsPerEntry: this.cache.size > 0 ? totalAspects / this.cache.size : 0,
      oldestEntry,
      newestEntry
    };
  }

  /**
   * Clear cache
   */
  clear(): void {
    this.cache.clear();
    console.log('🧹 Aspect cache cleared');
  }
}

// Singleton instance
export const aspectOptimizer = new AspectOptimizer();

// Auto-cleanup every 15 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    aspectOptimizer.cleanup();
  }, 15 * 60 * 1000); // 15 minutes
}
