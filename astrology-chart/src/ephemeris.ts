/**
 * TypeScript Ephemeris Calculator
 * High-performance astronomical calculations
 */

import * as Astronomy from 'astronomy-engine';

export interface CelestialBody {
  name: string;
  position: {
    ra: number;    // Right Ascension in hours
    dec: number;   // Declination in degrees
    distance: number; // Distance in AU
  };
  velocity: {
    ra: number;    // RA velocity in arcsec/year
    dec: number;   // Dec velocity in arcsec/year
    radial: number; // Radial velocity in km/s
  };
}

export interface EphemerisOptions {
  observer?: Astronomy.Observer;
  startDate: Date;
  endDate: Date;
  stepSize: number; // in days
  includeVelocity?: boolean;
}

export class EphemerisCalculator {
  public observer: Astronomy.Observer;

  constructor(latitude = 0, longitude = 0, elevation = 0) {
    this.observer = new Astronomy.Observer(latitude, longitude, elevation);
  }

  /**
   * Calculate ephemeris for a planet
   */
  calculatePlanetEphemeris(
    body: Astronomy.Body, 
    options: EphemerisOptions
  ): CelestialBody[] {
    const results: CelestialBody[] = [];
    const timeSpan = options.endDate.getTime() - options.startDate.getTime();
    const totalSteps = Math.floor(timeSpan / (options.stepSize * 24 * 60 * 60 * 1000));

    for (let i = 0; i <= totalSteps; i++) {
      const currentTime = new Date(
        options.startDate.getTime() + i * options.stepSize * 24 * 60 * 60 * 1000
      );
      
      const astroTime = Astronomy.MakeTime(currentTime);
      const position = Astronomy.Equator(body, astroTime, this.observer, true, true);
      
      const bodyData: CelestialBody = {
        name: body,
        position: {
          ra: position.ra,
          dec: position.dec,
          distance: position.dist
        },
        velocity: {
          ra: 0, // Will be calculated if includeVelocity is true
          dec: 0,
          radial: 0
        }
      };

      if (options.includeVelocity && i > 0) {
        // Calculate velocity by comparing with previous position
        const prevResult = results[i - 1];
        const timeDiff = options.stepSize; // days
        
        bodyData.velocity.ra = (position.ra - prevResult.position.ra) / timeDiff;
        bodyData.velocity.dec = (position.dec - prevResult.position.dec) / timeDiff;
      }

      results.push(bodyData);
    }

    return results;
  }

  /**
   * Calculate ephemeris for the Moon
   */
  calculateMoonEphemeris(options: EphemerisOptions): CelestialBody[] {
    return this.calculatePlanetEphemeris(Astronomy.Body.Moon, options);
  }

  /**
   * Calculate ephemeris for the Sun
   */
  calculateSunEphemeris(options: EphemerisOptions): CelestialBody[] {
    return this.calculatePlanetEphemeris(Astronomy.Body.Sun, options);
  }

  /**
   * Calculate rise, transit, and set times
   */
  calculateRiseTransitSet(
    body: Astronomy.Body, 
    date: Date
  ): { rise?: Date; transit?: Date; set?: Date } {    const astroTime = Astronomy.MakeTime(date);

    try {
      const rise = Astronomy.SearchRiseSet(body, this.observer, 1, astroTime, 1);
      const set = Astronomy.SearchRiseSet(body, this.observer, -1, astroTime, 1);
      const transit = Astronomy.SearchHourAngle(body, this.observer, 0, astroTime);

      return {
        rise: rise?.date,
        transit: transit?.time?.date,
        set: set?.date
      };
    } catch (error) {
      console.warn(`Could not calculate rise/set times for ${body}:`, error);
      return {};
    }
  }

  /**
   * Set observer location
   */
  setObserver(latitude: number, longitude: number, elevation = 0): void {
    this.observer = new Astronomy.Observer(latitude, longitude, elevation);
  }
}

// Utility functions
export const formatRA = (ra: number): string => {
  const hours = Math.floor(ra);
  const minutes = Math.floor((ra - hours) * 60);
  const seconds = ((ra - hours) * 60 - minutes) * 60;
  return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toFixed(1)}s`;
};

export const formatDec = (dec: number): string => {
  const sign = dec >= 0 ? '+' : '-';
  const absDec = Math.abs(dec);
  const degrees = Math.floor(absDec);
  const minutes = Math.floor((absDec - degrees) * 60);
  const seconds = ((absDec - degrees) * 60 - minutes) * 60;
  return `${sign}${degrees.toString().padStart(2, '0')}° ${minutes.toString().padStart(2, '0')}' ${seconds.toFixed(1)}"`;
};

export default EphemerisCalculator;
