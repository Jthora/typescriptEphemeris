/**
 * Retrograde Calculation Cache
 * 
 * This module provides caching for expensive retrograde calculations
 * to reduce astronomy-engine API calls during real-time updates.
 */

interface RetrogradeState {
  isRetrograde: boolean;
  calculatedAt: number;
  longitude: number;
}

interface RetrogradeCacheEntry {
  [planetName: string]: RetrogradeState;
}

export class RetrogradeCache {
  private cache = new Map<string, RetrogradeCacheEntry>();
  private readonly TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  private readonly POSITION_TOLERANCE = 0.1; // degrees
  
  /**
   * Generate cache key for a given date (rounded to nearest hour)
   */
  private generateCacheKey(date: Date): string {
    const roundedDate = new Date(date);
    roundedDate.setMinutes(0, 0, 0); // Round to nearest hour
    return roundedDate.toISOString();
  }

  /**
   * Check if cache entry is still valid
   */
  private isValidEntry(entry: RetrogradeState, currentLongitude: number): boolean {
    const now = Date.now();
    const ageMs = now - entry.calculatedAt;
    const positionDrift = Math.abs(entry.longitude - currentLongitude);
    
    return ageMs < this.TTL && positionDrift < this.POSITION_TOLERANCE;
  }

  /**
   * Get cached retrograde state for a planet
   */
  getCachedState(planetName: string, date: Date, longitude: number): boolean | null {
    const cacheKey = this.generateCacheKey(date);
    const cacheEntry = this.cache.get(cacheKey);
    
    if (!cacheEntry || !cacheEntry[planetName]) {
      return null;
    }

    const planetEntry = cacheEntry[planetName];
    
    if (this.isValidEntry(planetEntry, longitude)) {
      console.log(`💾 Retrograde cache hit for ${planetName}`);
      return planetEntry.isRetrograde;
    }

    // Entry is stale, remove it
    delete cacheEntry[planetName];
    if (Object.keys(cacheEntry).length === 0) {
      this.cache.delete(cacheKey);
    }
    
    return null;
  }

  /**
   * Cache retrograde state for a planet
   */
  setCachedState(planetName: string, date: Date, longitude: number, isRetrograde: boolean): void {
    const cacheKey = this.generateCacheKey(date);
    
    if (!this.cache.has(cacheKey)) {
      this.cache.set(cacheKey, {});
    }

    const cacheEntry = this.cache.get(cacheKey)!;
    cacheEntry[planetName] = {
      isRetrograde,
      calculatedAt: Date.now(),
      longitude
    };

    console.log(`💾 Cached retrograde state for ${planetName}: ${isRetrograde}`);
  }

  /**
   * Batch check multiple planets with parallel calculations
   */
  async batchCheckRetrograde(
    planets: Array<{ name: string; longitude: number }>,
    date: Date,
    calculateRetrogradeFn: (planetName: string, date: Date) => Promise<boolean>
  ): Promise<Array<{ name: string; isRetrograde: boolean; fromCache: boolean }>> {
    
    const results: Array<{ name: string; isRetrograde: boolean; fromCache: boolean }> = [];
    const planetsToCalculate: Array<{ name: string; longitude: number }> = [];

    // First pass: check cache
    for (const planet of planets) {
      const cachedState = this.getCachedState(planet.name, date, planet.longitude);
      
      if (cachedState !== null) {
        results.push({
          name: planet.name,
          isRetrograde: cachedState,
          fromCache: true
        });
      } else {
        planetsToCalculate.push(planet);
      }
    }

    // Second pass: calculate missing values in parallel
    if (planetsToCalculate.length > 0) {
      console.log(`🔄 Calculating retrograde for ${planetsToCalculate.length} planets`);
      
      const calculations = planetsToCalculate.map(async (planet) => {
        const isRetrograde = await calculateRetrogradeFn(planet.name, date);
        this.setCachedState(planet.name, date, planet.longitude, isRetrograde);
        
        return {
          name: planet.name,
          isRetrograde,
          fromCache: false
        };
      });

      const calculatedResults = await Promise.all(calculations);
      results.push(...calculatedResults);
    }

    return results;
  }

  /**
   * Clear expired cache entries
   */
  cleanup(): void {
    const now = Date.now();
    let removedCount = 0;

    for (const [cacheKey, cacheEntry] of this.cache.entries()) {
      const entryDate = new Date(cacheKey);
      const ageMs = now - entryDate.getTime();
      
      if (ageMs > this.TTL) {
        this.cache.delete(cacheKey);
        removedCount++;
      } else {
        // Check individual planet entries within this time slot
        for (const [planetName, planetEntry] of Object.entries(cacheEntry)) {
          if (now - planetEntry.calculatedAt > this.TTL) {
            delete cacheEntry[planetName];
          }
        }
        
        // Remove empty cache entries
        if (Object.keys(cacheEntry).length === 0) {
          this.cache.delete(cacheKey);
          removedCount++;
        }
      }
    }

    if (removedCount > 0) {
      console.log(`🧹 Cleaned up ${removedCount} expired retrograde cache entries`);
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    totalEntries: number;
    totalPlanets: number;
    cacheHitRate: number;
    oldestEntry: Date | null;
    newestEntry: Date | null;
  } {
    let totalPlanets = 0;
    let oldestEntry: Date | null = null;
    let newestEntry: Date | null = null;

    for (const [cacheKey, cacheEntry] of this.cache.entries()) {
      const entryDate = new Date(cacheKey);
      totalPlanets += Object.keys(cacheEntry).length;
      
      if (!oldestEntry || entryDate < oldestEntry) {
        oldestEntry = entryDate;
      }
      if (!newestEntry || entryDate > newestEntry) {
        newestEntry = entryDate;
      }
    }

    return {
      totalEntries: this.cache.size,
      totalPlanets,
      cacheHitRate: 0, // This would be calculated based on hit/miss counters
      oldestEntry,
      newestEntry
    };
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    console.log('🧹 Retrograde cache cleared');
  }

  /**
   * Preload cache for a time range
   */
  async preloadTimeRange(
    startDate: Date,
    endDate: Date,
    planets: string[],
    calculateRetrogradeFn: (planetName: string, date: Date) => Promise<boolean>
  ): Promise<void> {
    console.log(`🔄 Preloading retrograde cache from ${startDate} to ${endDate}`);
    
    const hourlyIntervals: Date[] = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      hourlyIntervals.push(new Date(current));
      current.setHours(current.getHours() + 1);
    }

    // Batch preload by time interval
    for (const date of hourlyIntervals) {
      const calculations = planets.map(async (planetName) => {
        const isRetrograde = await calculateRetrogradeFn(planetName, date);
        this.setCachedState(planetName, date, 0, isRetrograde); // Use 0 longitude for preload
        return { planetName, isRetrograde };
      });

      await Promise.all(calculations);
    }

    console.log(`✅ Preloaded retrograde cache for ${hourlyIntervals.length} time intervals`);
  }
}

// Singleton instance
export const retrogradeCache = new RetrogradeCache();

// Auto-cleanup every hour
if (typeof window !== 'undefined') {
  setInterval(() => {
    retrogradeCache.cleanup();
  }, 60 * 60 * 1000); // 1 hour
}
