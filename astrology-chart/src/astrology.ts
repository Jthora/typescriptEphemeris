import * as Astronomy from 'astronomy-engine';
import EphemerisCalculator from './ephemeris';

export interface BirthData {
  date: Date;
  latitude: number;
  longitude: number;
  name?: string;
}

export interface AstrologyBody {
  name: string;
  symbol: string;
  longitude: number; // Ecliptic longitude in degrees
  latitude: number;  // Ecliptic latitude in degrees
  house: number;     // House number (1-12)
  sign: string;      // Zodiac sign name
  signDegree: number; // Degree within sign (0-30)
  retrograde?: boolean;
}

export interface HouseSystem {
  cusps: number[]; // 12 house cusp longitudes in degrees
  system: string;  // House system name
}

export interface AstrologyChart {
  birthData: BirthData;
  bodies: AstrologyBody[];
  houses: HouseSystem;
  aspects: Aspect[];
  nodes: {
    northNode: AstrologyBody;
    southNode: AstrologyBody;
  };
  angles: {
    ascendant: AstrologyBody;
    descendant: AstrologyBody;
    midheaven: AstrologyBody;
    imumCoeli: AstrologyBody;
  };
}

export interface Aspect {
  body1: string;
  body2: string;
  type: string;
  orb: number;
  angle: number;
}

// Zodiac signs with their symbols and elements
export const ZODIAC_SIGNS = [
  { name: 'Aries', symbol: '♈', element: 'Fire', quality: 'Cardinal' },
  { name: 'Taurus', symbol: '♉', element: 'Earth', quality: 'Fixed' },
  { name: 'Gemini', symbol: '♊', element: 'Air', quality: 'Mutable' },
  { name: 'Cancer', symbol: '♋', element: 'Water', quality: 'Cardinal' },
  { name: 'Leo', symbol: '♌', element: 'Fire', quality: 'Fixed' },
  { name: 'Virgo', symbol: '♍', element: 'Earth', quality: 'Mutable' },
  { name: 'Libra', symbol: '♎', element: 'Air', quality: 'Cardinal' },
  { name: 'Scorpio', symbol: '♏', element: 'Water', quality: 'Fixed' },
  { name: 'Sagittarius', symbol: '♐', element: 'Fire', quality: 'Mutable' },
  { name: 'Capricorn', symbol: '♑', element: 'Earth', quality: 'Cardinal' },
  { name: 'Aquarius', symbol: '♒', element: 'Air', quality: 'Fixed' },
  { name: 'Pisces', symbol: '♓', element: 'Water', quality: 'Mutable' }
];

// Planet symbols and meanings
export const PLANET_SYMBOLS = {
  Sun: { symbol: '☉', name: 'Sun', color: '#FFA500' },
  Moon: { symbol: '☽', name: 'Moon', color: '#C0C0C0' },
  Mercury: { symbol: '☿', name: 'Mercury', color: '#FFA500' },
  Venus: { symbol: '♀', name: 'Venus', color: '#00FF00' },
  Mars: { symbol: '♂', name: 'Mars', color: '#FF0000' },
  Jupiter: { symbol: '♃', name: 'Jupiter', color: '#FF6600' },
  Saturn: { symbol: '♄', name: 'Saturn', color: '#0000FF' },
  Uranus: { symbol: '♅', name: 'Uranus', color: '#00FFFF' },
  Neptune: { symbol: '♆', name: 'Neptune', color: '#0000FF' },
  Pluto: { symbol: '♇', name: 'Pluto', color: '#800080' }
};

// Major aspects with their angles and orbs
export const ASPECTS = {
  Conjunction: { angle: 0, orb: 8, symbol: '☌', color: '#FF0000' },
  Opposition: { angle: 180, orb: 8, symbol: '☍', color: '#FF0000' },
  Trine: { angle: 120, orb: 6, symbol: '△', color: '#00FF00' },
  Square: { angle: 90, orb: 6, symbol: '□', color: '#FF0000' },
  Sextile: { angle: 60, orb: 4, symbol: '⚹', color: '#00FF00' },
  Quintile: { angle: 72, orb: 2, symbol: 'Q', color: '#0000FF' },
  SemiSquare: { angle: 45, orb: 2, symbol: '∠', color: '#FFA500' },
  Sesquiquadrate: { angle: 135, orb: 2, symbol: '⚼', color: '#FFA500' }
};

export class AstrologyCalculator {
  private ephemeris: EphemerisCalculator;

  constructor() {
    this.ephemeris = new EphemerisCalculator();
  }

  /**
   * Calculate a complete astrology chart
   */
  async calculateChart(birthData: BirthData): Promise<AstrologyChart> {
    // Set observer location
    this.ephemeris.setObserver(birthData.latitude, birthData.longitude);
    
    const astroTime = Astronomy.MakeTime(birthData.date);
    
    // Calculate planetary positions
    const bodies = await this.calculateBodies(astroTime);
    
    // Calculate houses
    const houses = this.calculateHouses(astroTime, birthData.latitude, birthData.longitude);
    
    // Calculate lunar nodes
    const nodes = await this.calculateNodes(astroTime);
    
    // Calculate chart angles
    const angles = this.calculateAngles(astroTime, birthData.latitude);
    
    // Add house assignments to bodies
    const bodiesWithHouses = bodies.map(body => ({
      ...body,
      house: this.getHouseNumber(body.longitude, houses.cusps)
    }));
    
    // Calculate aspects
    const aspects = this.calculateAspects(bodiesWithHouses);
    
    return {
      birthData,
      bodies: bodiesWithHouses,
      houses,
      aspects,
      nodes,
      angles
    };
  }

  /**
   * Calculate positions of all major planets
   */
  private async calculateBodies(astroTime: any): Promise<AstrologyBody[]> {
    const bodies: AstrologyBody[] = [];
    const planetNames = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
    
    for (const planetName of planetNames) {
      try {
        // Get equatorial coordinates first, then convert to ecliptic
        const equatorial = Astronomy.GeoVector(planetName as any, astroTime, false);
        const ecliptic = Astronomy.Ecliptic(equatorial);
        
        // Convert to astrology format
        const longitude = this.normalizeLongitude(ecliptic.elon);
        const { sign, signDegree } = this.getZodiacSign(longitude);
        
        const body: AstrologyBody = {
          name: planetName,
          symbol: PLANET_SYMBOLS[planetName as keyof typeof PLANET_SYMBOLS]?.symbol || planetName[0],
          longitude,
          latitude: ecliptic.elat,
          house: 1, // Will be calculated later
          sign,
          signDegree,
          retrograde: await this.isRetrograde(planetName, astroTime)
        };
        
        bodies.push(body);
      } catch (error) {
        console.warn(`Failed to calculate ${planetName}:`, error);
      }
    }
    
    return bodies;
  }

  /**
   * Calculate house cusps using Placidus system
   */
  private calculateHouses(astroTime: any, latitude: number, _longitude: number): HouseSystem {
    // Simplified house calculation - in a full implementation, you'd use 
    // proper house calculation algorithms like Placidus, Koch, etc.
    
    try {
      // Get the Ascendant (1st house cusp)
      const siderealTime = Astronomy.SiderealTime(astroTime);
      const ascendantLongitude = this.calculateAscendant(siderealTime, latitude);
      
      // Calculate house cusps (simplified equal house system for demo)
      const cusps: number[] = [];
      for (let i = 0; i < 12; i++) {
        cusps.push(this.normalizeLongitude(ascendantLongitude + (i * 30)));
      }
      
      return {
        cusps,
        system: 'Equal House'
      };
    } catch (error) {
      console.warn('House calculation failed, using default:', error);
      // Default house cusps starting at 0° Aries
      const cusps = Array.from({ length: 12 }, (_, i) => i * 30);
      return { cusps, system: 'Equal House (Default)' };
    }
  }

  /**
   * Calculate lunar nodes
   */
  private async calculateNodes(astroTime: any): Promise<{ northNode: AstrologyBody; southNode: AstrologyBody }> {
    try {
      // Find the nearest lunar node
      const lunarNode = Astronomy.SearchMoonNode(astroTime);
      
      if (lunarNode) {
        // Get the position of the node
        const nodeVector = Astronomy.GeoVector('Moon' as any, lunarNode.time, false);
        const nodePosition = Astronomy.Ecliptic(nodeVector);
        const nodeLongitude = this.normalizeLongitude(nodePosition.elon);
        
        // North node longitude
        const northNodeLongitude = nodeLongitude;
        const southNodeLongitude = this.normalizeLongitude(northNodeLongitude + 180);
        
        const northSign = this.getZodiacSign(northNodeLongitude);
        const southSign = this.getZodiacSign(southNodeLongitude);
        
        const northNode: AstrologyBody = {
          name: 'North Node',
          symbol: '☊',
          longitude: northNodeLongitude,
          latitude: 0,
          house: 1, // Will be calculated later
          sign: northSign.sign,
          signDegree: northSign.signDegree
        };
        
        const southNode: AstrologyBody = {
          name: 'South Node',
          symbol: '☋',
          longitude: southNodeLongitude,
          latitude: 0,
          house: 1, // Will be calculated later
          sign: southSign.sign,
          signDegree: southSign.signDegree
        };
        
        return { northNode, southNode };
      }
    } catch (error) {
      console.warn('Node calculation failed:', error);
    }
    
    // Default nodes if calculation fails
    const defaultNorth: AstrologyBody = {
      name: 'North Node',
      symbol: '☊',
      longitude: 0,
      latitude: 0,
      house: 1,
      sign: 'Aries',
      signDegree: 0
    };
    
    const defaultSouth: AstrologyBody = {
      name: 'South Node',
      symbol: '☋',
      longitude: 180,
      latitude: 0,
      house: 7,
      sign: 'Libra',
      signDegree: 0
    };
    
    return { northNode: defaultNorth, southNode: defaultSouth };
  }

  /**
   * Calculate chart angles (Ascendant, Descendant, Midheaven, Imum Coeli)
   */
  private calculateAngles(astroTime: any, latitude: number): { 
    ascendant: AstrologyBody; 
    descendant: AstrologyBody; 
    midheaven: AstrologyBody; 
    imumCoeli: AstrologyBody; 
  } {
    try {
      console.log('📊 Calculating chart angles...');
      // Calculate Ascendant (already have this from house calculation)
      const siderealTime = Astronomy.SiderealTime(astroTime);
      const ascendantLongitude = this.calculateAscendant(siderealTime, latitude);
      
      // Descendant is opposite the Ascendant (180° away)
      const descendantLongitude = this.normalizeLongitude(ascendantLongitude + 180);
      
      // Simplified Midheaven calculation based on sidereal time
      // In a real implementation, you'd use proper astronomical formulas
      const midheavenLongitude = this.normalizeLongitude((siderealTime * 15) + 270) % 360;
      
      // Imum Coeli is opposite the Midheaven (180° away)
      const imumCoeliLongitude = this.normalizeLongitude(midheavenLongitude + 180);
      
      // Get zodiac signs for each angle
      const ascSign = this.getZodiacSign(ascendantLongitude);
      const descSign = this.getZodiacSign(descendantLongitude);
      const mcSign = this.getZodiacSign(midheavenLongitude);
      const icSign = this.getZodiacSign(imumCoeliLongitude);
      
      // Create AstrologyBody objects for each angle
      const ascendant: AstrologyBody = {
        name: 'Ascendant',
        symbol: 'ASC',
        longitude: ascendantLongitude,
        latitude: 0,
        house: 1,
        sign: ascSign.sign,
        signDegree: ascSign.signDegree
      };
      
      const descendant: AstrologyBody = {
        name: 'Descendant',
        symbol: 'DSC',
        longitude: descendantLongitude,
        latitude: 0,
        house: 7,
        sign: descSign.sign,
        signDegree: descSign.signDegree
      };
      
      const midheaven: AstrologyBody = {
        name: 'Midheaven',
        symbol: 'MC',
        longitude: midheavenLongitude,
        latitude: 0,
        house: 10,
        sign: mcSign.sign,
        signDegree: mcSign.signDegree
      };
      
      const imumCoeli: AstrologyBody = {
        name: 'Imum Coeli',
        symbol: 'IC',
        longitude: imumCoeliLongitude,
        latitude: 0,
        house: 4,
        sign: icSign.sign,
        signDegree: icSign.signDegree
      };
      
      const angles = { ascendant, descendant, midheaven, imumCoeli };
      console.log('📐 Chart angles calculated:', angles);
      return angles;
    } catch (error) {
      console.warn('Angle calculation failed, using defaults:', error);
      
      // Default values if calculation fails
      return {
        ascendant: {
          name: 'Ascendant',
          symbol: 'ASC',
          longitude: 0,
          latitude: 0,
          house: 1,
          sign: 'Aries',
          signDegree: 0
        },
        descendant: {
          name: 'Descendant',
          symbol: 'DSC',
          longitude: 180,
          latitude: 0,
          house: 7,
          sign: 'Libra',
          signDegree: 0
        },
        midheaven: {
          name: 'Midheaven',
          symbol: 'MC',
          longitude: 270,
          latitude: 0,
          house: 10,
          sign: 'Capricorn',
          signDegree: 0
        },
        imumCoeli: {
          name: 'Imum Coeli',
          symbol: 'IC',
          longitude: 90,
          latitude: 0,
          house: 4,
          sign: 'Cancer',
          signDegree: 0
        }
      };
    }
  }

  /**
   * Calculate aspects between bodies
   */
  private calculateAspects(bodies: AstrologyBody[]): Aspect[] {
    const aspects: Aspect[] = [];
    
    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const body1 = bodies[i];
        const body2 = bodies[j];
        
        const angle = this.getAspectAngle(body1.longitude, body2.longitude);
        
        // Check for major aspects
        for (const [aspectName, aspectData] of Object.entries(ASPECTS)) {
          const orb = Math.abs(angle - aspectData.angle);
          if (orb <= aspectData.orb) {
            aspects.push({
              body1: body1.name,
              body2: body2.name,
              type: aspectName,
              orb,
              angle
            });
            break;
          }
        }
      }
    }
    
    return aspects;
  }

  /**
   * Utility functions
   */
  private normalizeLongitude(longitude: number): number {
    while (longitude < 0) longitude += 360;
    while (longitude >= 360) longitude -= 360;
    return longitude;
  }

  private getZodiacSign(longitude: number): { sign: string; signDegree: number } {
    const signIndex = Math.floor(longitude / 30);
    const signDegree = longitude % 30;
    return {
      sign: ZODIAC_SIGNS[signIndex]?.name || 'Unknown',
      signDegree
    };
  }

  private getHouseNumber(longitude: number, cusps: number[]): number {
    for (let i = 0; i < 12; i++) {
      const currentCusp = cusps[i];
      const nextCusp = cusps[(i + 1) % 12];
      
      if (nextCusp > currentCusp) {
        if (longitude >= currentCusp && longitude < nextCusp) {
          return i + 1;
        }
      } else {
        // Handle wrap around at 360°/0°
        if (longitude >= currentCusp || longitude < nextCusp) {
          return i + 1;
        }
      }
    }
    return 1; // Default to first house
  }

  private calculateAscendant(siderealTime: number, _latitude: number): number {
    // Simplified ascendant calculation
    // In a real implementation, you'd use proper astronomical formulas
    
    // Simplified formula (this is not astronomically accurate)
    const ascendant = (siderealTime * 15) % 360;
    return ascendant;
  }

  private getAspectAngle(long1: number, long2: number): number {
    let angle = Math.abs(long1 - long2);
    if (angle > 180) angle = 360 - angle;
    return angle;
  }

  private async isRetrograde(planetName: string, astroTime: any): Promise<boolean> {
    // Simplified retrograde detection
    // In a real implementation, you'd compare velocities over time
    try {
      const futureTime = Astronomy.MakeTime(new Date(astroTime.date.getTime() + 24 * 60 * 60 * 1000));
      const currentVector = Astronomy.GeoVector(planetName as any, astroTime, false);
      const futureVector = Astronomy.GeoVector(planetName as any, futureTime, false);
      const currentPos = Astronomy.Ecliptic(currentVector);
      const futurePos = Astronomy.Ecliptic(futureVector);
      
      let currentLong = this.normalizeLongitude(currentPos.elon);
      let futureLong = this.normalizeLongitude(futurePos.elon);
      
      // Handle wrap-around
      if (futureLong < currentLong && (currentLong - futureLong) > 180) {
        futureLong += 360;
      } else if (currentLong < futureLong && (futureLong - currentLong) > 180) {
        currentLong += 360;
      }
      
      return futureLong < currentLong;
    } catch (error) {
      return false;
    }
  }
}

export default AstrologyCalculator;
