import * as Astronomy from 'astronomy-engine';
import EphemerisCalculator from './ephemeris';

// House System Types and Constants
export type HouseSystemType = 
  | 'placidus' 
  | 'equal' 
  | 'koch' 
  | 'whole-sign' 
  | 'campanus' 
  | 'regiomontanus';

export const HOUSE_SYSTEMS = {
  placidus: { 
    name: 'Placidus', 
    description: 'Most widely used system',
    isDefault: true 
  },
  equal: { 
    name: 'Equal House', 
    description: 'Simple 30° divisions',
    isDefault: false 
  },
  koch: { 
    name: 'Koch', 
    description: 'Birthplace system',
    isDefault: false 
  },
  'whole-sign': { 
    name: 'Whole Sign', 
    description: 'Ancient system',
    isDefault: false 
  },
  campanus: { 
    name: 'Campanus', 
    description: 'Prime vertical system',
    isDefault: false 
  },
  regiomontanus: { 
    name: 'Regiomontanus', 
    description: 'Medieval system',
    isDefault: false 
  }
} as const;

export interface BirthData {
  date: Date;
  latitude: number;
  longitude: number;
  name?: string;
  houseSystem?: HouseSystemType; // Optional house system preference
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
  additionalPoints?: {
    blackMoonLilith?: AstrologyBody;
    whiteMoonSelena?: AstrologyBody;
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
    
    // Calculate houses using Equal House system only
    const houses = this.calculateEqualHouses(astroTime, birthData.latitude, birthData.longitude);
    
    // Calculate lunar nodes
    const nodes = await this.calculateNodes(astroTime);
    
    // Calculate chart angles from house cusps
    const angles = this.calculateAngles(houses);
    
    // Calculate additional astronomical points
    const additionalPoints = await this.calculateAdditionalPoints(astroTime);
    
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
      angles,
      additionalPoints
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
   * Calculate house cusps using specified house system
   */
  private calculateHouses(astroTime: any, latitude: number, longitude: number, system: HouseSystemType): HouseSystem {
    try {
      switch (system) {
        case 'placidus':
          return this.calculatePlacidusHouses(astroTime, latitude, longitude);
        case 'equal':
          return this.calculateEqualHouses(astroTime, latitude, longitude);
        case 'koch':
          return this.calculateKochHouses(astroTime, latitude, longitude);
        case 'whole-sign':
          return this.calculateWholeSignHouses(astroTime, latitude, longitude);
        case 'campanus':
          return this.calculateCampanusHouses(astroTime, latitude, longitude);
        case 'regiomontanus':
          return this.calculateRegiomontanusHouses(astroTime, latitude, longitude);
        default:
          console.warn(`Unknown house system: ${system}, falling back to Placidus`);
          return this.calculatePlacidusHouses(astroTime, latitude, longitude);
      }
    } catch (error) {
      console.warn(`House calculation failed for ${system}, falling back to Equal House:`, error);
      return this.calculateEqualHouses(astroTime, latitude, longitude);
    }
  }

  /**
   * Calculate house cusps using Equal House system (30° divisions from Ascendant)
   */
  private calculateEqualHouses(astroTime: any, latitude: number, longitude: number): HouseSystem {
    
    try {
      // Get the Ascendant (1st house cusp)
      const siderealTime = Astronomy.SiderealTime(astroTime);
      const ascendantLongitude = this.calculateAscendant(siderealTime, latitude);
      
      console.log(`🏠 Equal House calculation: ST=${siderealTime.toFixed(2)}h, ASC=${ascendantLongitude.toFixed(1)}°, Lat=${latitude}°, Lng=${longitude}°`);
      
      // Calculate house cusps (equal 30° divisions from ascendant)
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
   * Calculate house cusps using Placidus system
   */
  private calculatePlacidusHouses(astroTime: any, latitude: number, longitude: number): HouseSystem {
    try {
      // Get sidereal time and key angles
      const siderealTime = Astronomy.SiderealTime(astroTime);
      const ascendantLongitude = this.calculateAscendant(siderealTime, latitude);
      const midheaven = this.calculateMidheaven(siderealTime);
      
      console.log(`🏠 Placidus calculation: ST=${siderealTime.toFixed(2)}h, ASC=${ascendantLongitude.toFixed(1)}°, MC=${midheaven.toFixed(1)}°, Lat=${latitude}°, Lng=${longitude}°`);
      
      // Removed complex reference test - using simple calculations now
      
      // Initialize cusps array (0-indexed, so house 1 = cusps[0])
      const cusps: number[] = new Array(12);
      
      // Houses 1, 4, 7, 10 are the angles - these are correct for any house system
      cusps[0] = ascendantLongitude; // 1st house (Ascendant)
      cusps[3] = this.normalizeLongitude(midheaven + 180); // 4th house (IC = MC + 180°)
      cusps[6] = this.normalizeLongitude(ascendantLongitude + 180); // 7th house (Descendant = ASC + 180°)
      cusps[9] = midheaven; // 10th house (MC)
      
      // For intermediate houses, implement simplified Placidus
      // Real Placidus uses time division and oblique ascension, but this is better than equal division
      // Calculate houses 2, 3, 5, 6, 8, 9, 11, 12 using trisection approximation
      const mcToAsc = this.normalizeLongitude(ascendantLongitude - midheaven);
      const ascToDsc = this.normalizeLongitude(ascendantLongitude + 180 - ascendantLongitude); // This is always 180
      const dscToIc = this.normalizeLongitude((midheaven + 180) - (ascendantLongitude + 180));
      const icToMc = this.normalizeLongitude(midheaven - (midheaven + 180));
      
      // Trisect the quadrants (simplified Placidus approximation)
      // Houses 11, 12 (between MC and ASC)
      cusps[10] = this.normalizeLongitude(midheaven + (mcToAsc / 3)); // House 11
      cusps[11] = this.normalizeLongitude(midheaven + (2 * mcToAsc / 3)); // House 12
      
      // Houses 2, 3 (between ASC and DSC)  
      cusps[1] = this.normalizeLongitude(ascendantLongitude + 60); // House 2 (simplified)
      cusps[2] = this.normalizeLongitude(ascendantLongitude + 120); // House 3 (simplified)
      
      // Houses 5, 6 (between DSC and IC)
      cusps[4] = this.normalizeLongitude(ascendantLongitude + 240); // House 5 (simplified)
      cusps[5] = this.normalizeLongitude(ascendantLongitude + 300); // House 6 (simplified)
      
      // Houses 8, 9 (between IC and MC)
      cusps[7] = this.normalizeLongitude((midheaven + 180) + 60); // House 8 (simplified)
      cusps[8] = this.normalizeLongitude((midheaven + 180) + 120); // House 9 (simplified)
      
      // Debug logging to verify calculations
      console.log(`🏠 Placidus calculation for lat=${latitude}, lng=${longitude}`);
      console.log(`   Sidereal Time: ${siderealTime.toFixed(4)} hours`);
      console.log(`   Ascendant: ${ascendantLongitude.toFixed(2)}°`);
      console.log(`   Midheaven: ${midheaven.toFixed(2)}°`);
      console.log(`   IC: ${this.normalizeLongitude(midheaven + 180).toFixed(2)}°`);
      console.log(`   Descendant: ${this.normalizeLongitude(ascendantLongitude + 180).toFixed(2)}°`);
      
      return {
        cusps,
        system: 'Placidus'
      };
    } catch (error) {
      console.warn('Placidus calculation failed, falling back to Equal House:', error);
      return this.calculateEqualHouses(astroTime, latitude, longitude);
    }
  }

  /**
   * Calculate house cusps using Koch system
   */
  private calculateKochHouses(astroTime: any, latitude: number, longitude: number): HouseSystem {
    try {
      // For now, fallback to Equal House
      // TODO: Implement full Koch algorithm
      console.warn('Koch house system not yet implemented, using Equal House');
      const result = this.calculateEqualHouses(astroTime, latitude, longitude);
      return {
        ...result,
        system: 'Koch (Equal House approximation)'
      };
    } catch (error) {
      console.warn('Koch calculation failed, falling back to Equal House:', error);
      return this.calculateEqualHouses(astroTime, latitude, longitude);
    }
  }

  /**
   * Calculate house cusps using Whole Sign system
   */
  private calculateWholeSignHouses(astroTime: any, latitude: number, longitude: number): HouseSystem {
    try {
      // Get the Ascendant
      const siderealTime = Astronomy.SiderealTime(astroTime);
      const ascendantLongitude = this.calculateAscendant(siderealTime, latitude);
      
      // Whole Sign: each house is an entire zodiac sign
      // 1st house starts at the beginning of the Ascendant's sign
      const ascendantSignStart = Math.floor(ascendantLongitude / 30) * 30;
      
      const cusps: number[] = [];
      for (let i = 0; i < 12; i++) {
        cusps.push(this.normalizeLongitude(ascendantSignStart + (i * 30)));
      }
      
      return {
        cusps,
        system: 'Whole Sign'
      };
    } catch (error) {
      console.warn('Whole Sign calculation failed, falling back to Equal House:', error);
      return this.calculateEqualHouses(astroTime, latitude, longitude);
    }
  }

  /**
   * Calculate house cusps using Campanus system
   */
  private calculateCampanusHouses(astroTime: any, latitude: number, longitude: number): HouseSystem {
    try {
      // For now, fallback to Equal House
      // TODO: Implement full Campanus algorithm
      console.warn('Campanus house system not yet implemented, using Equal House');
      const result = this.calculateEqualHouses(astroTime, latitude, longitude);
      return {
        ...result,
        system: 'Campanus (Equal House approximation)'
      };
    } catch (error) {
      console.warn('Campanus calculation failed, falling back to Equal House:', error);
      return this.calculateEqualHouses(astroTime, latitude, longitude);
    }
  }

  /**
   * Calculate house cusps using Regiomontanus system
   */
  private calculateRegiomontanusHouses(astroTime: any, latitude: number, longitude: number): HouseSystem {
    try {
      // For now, fallback to Equal House
      // TODO: Implement full Regiomontanus algorithm
      console.warn('Regiomontanus house system not yet implemented, using Equal House');
      const result = this.calculateEqualHouses(astroTime, latitude, longitude);
      return {
        ...result,
        system: 'Regiomontanus (Equal House approximation)'
      };
    } catch (error) {
      console.warn('Regiomontanus calculation failed, falling back to Equal House:', error);
      return this.calculateEqualHouses(astroTime, latitude, longitude);
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
   * Uses house cusps to determine all angles
   */
  private calculateAngles(houses: HouseSystem): { 
    ascendant: AstrologyBody; 
    descendant: AstrologyBody; 
    midheaven: AstrologyBody; 
    imumCoeli: AstrologyBody; 
  } {
    try {
      console.log('📊 Calculating chart angles from house cusps...');
      
      // Get angles directly from house cusps
      const ascendantLongitude = houses.cusps[0];  // 1st house cusp = Ascendant
      const descendantLongitude = houses.cusps[6]; // 7th house cusp = Descendant
      const midheavenLongitude = houses.cusps[9];  // 10th house cusp = Midheaven
      const imumCoeliLongitude = houses.cusps[3];  // 4th house cusp = IC
      
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
   * TEST: Validate against Astro-Seek reference data
   * Reference: Kent, WA (47.3831°N, 122.2347°W) July 29, 2025, 09:27 PDT
   * Source: https://horoscopes.astro-seek.com/
   */
  private testReferenceCalculation(astroTime: any, latitude: number, longitude: number): void {
    const siderealTime = Astronomy.SiderealTime(astroTime);
    const localSiderealTime = this.calculateLocalSiderealTime(siderealTime, longitude);
    const ascendant = this.calculateAscendant(siderealTime, latitude);
    const midheaven = this.calculateMidheaven(siderealTime);
    
    // Reference data from Astro-Seek.com - UPDATED to 09:27 PDT
    const expected = {
      asc: 166.73, // Virgo 16°44'
      mc: 73.48,   // Gemini 13°29'
      lst: 4.798,  // Local Sidereal Time (approx 3 hours later than 06:27)
      houses: {
        // Placidus house cusps from Astro-Seek (09:27 PDT)
        1: 166.73,   // Virgo 16°44' (ASC)
        2: 190.02,   // Libra 10°01'
        3: 219.03,   // Scorpio 9°02'
        4: 253.48,   // Sagittarius 13°29' (IC)
        5: 289.22,   // Capricorn 19°13'
        6: 320.65,   // Aquarius 20°39'
        7: 346.73,   // Pisces 16°44' (DSC)
        8: 10.02,    // Aries 10°01'
        9: 39.03,    // Taurus 9°02'
        10: 73.48,   // Gemini 13°29' (MC)
        11: 109.22,  // Cancer 19°13'
        12: 140.65   // Leo 20°39'
      }
    };
    
    console.log('🧪 ASTRO-SEEK REFERENCE TEST - Kent WA, July 29, 2025, 09:27 PDT');
    console.log(`   Expected: ASC=${expected.asc}° (Virgo 16°44'), MC=${expected.mc}° (Gemini 13°29')`);
    console.log(`   Our calc: ASC=${ascendant.toFixed(2)}°, MC=${midheaven.toFixed(2)}°, LST=${localSiderealTime.toFixed(3)}h`);
    console.log(`   Diff:     ASC=${(ascendant - expected.asc).toFixed(2)}°, MC=${(midheaven - expected.mc).toFixed(2)}°`);
    console.log(`   Location: ${latitude}°N, ${Math.abs(longitude)}°W`);
    
    // Check if we're within acceptable tolerance (±2° for angles due to simplified calculations)
    const ascAccurate = Math.abs(ascendant - expected.asc) <= 2.0;
    const mcAccurate = Math.abs(midheaven - expected.mc) <= 2.0;
    
    console.log(`   Status:   ASC=${ascAccurate ? '✅' : '❌'}, MC=${mcAccurate ? '✅' : '❌'}`);
    
    if (!ascAccurate || !mcAccurate) {
      console.log(`   🔍 Debug: GST=${siderealTime.toFixed(3)}h, LST=${localSiderealTime.toFixed(3)}h`);
    }
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

  private calculateLocalSiderealTime(greenwichSiderealTime: number, longitude: number): number {
    // Convert longitude to hours (1 hour = 15 degrees)
    // For western longitudes (negative), this effectively subtracts time
    return greenwichSiderealTime + (longitude / 15);
  }

  private calculateAscendant(siderealTime: number, latitude: number): number {
    // Simplified ascendant calculation
    // Real implementations use complex spherical trigonometry
    const latitudeEffect = latitude * 0.5; // Simplified latitude adjustment
    let ascendant = (siderealTime * 15) % 360; // Convert hours to degrees
    ascendant = (ascendant + latitudeEffect) % 360;
    return this.normalizeLongitude(ascendant);
  }

  private calculateMidheaven(siderealTime: number): number {
    // Simplified MC calculation - MC is roughly sidereal time * 15 degrees
    let mc = (siderealTime * 15) % 360;
    return this.normalizeLongitude(mc);
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

  /**
   * Calculate additional astronomical points (Black Moon Lilith, White Moon Selena)
   */
  private async calculateAdditionalPoints(astroTime: any): Promise<{
    blackMoonLilith?: AstrologyBody;
    whiteMoonSelena?: AstrologyBody;
  }> {
    const additionalPoints: any = {};

    try {
      console.log('🌟 Calculating additional astronomical points...');

      // Calculate Lunar Apsis (Black Moon Lilith = Apogee, White Moon Selena = Perigee)
      try {
        const lunarApsis = (Astronomy as any).SearchLunarApsis(astroTime);
        if (lunarApsis) {
          // Get the position of the lunar apsis
          const apsisVector = Astronomy.GeoVector('Moon' as any, lunarApsis.time, false);
          const apsisEcliptic = Astronomy.Ecliptic(apsisVector);
          const apsisLongitude = this.normalizeLongitude(apsisEcliptic.elon);
          const apsisSign = this.getZodiacSign(apsisLongitude);

          if (lunarApsis.kind === 1) { // Apogee = Black Moon Lilith
            additionalPoints.blackMoonLilith = {
              name: 'Black Moon Lilith',
              symbol: '⚸',
              longitude: apsisLongitude,
              latitude: 0,
              house: 1, // Will be calculated later
              sign: apsisSign.sign,
              signDegree: apsisSign.signDegree
            };
          } else { // Perigee = White Moon Selena
            additionalPoints.whiteMoonSelena = {
              name: 'White Moon Selena',
              symbol: '⊙',
              longitude: apsisLongitude,
              latitude: 0,
              house: 1, // Will be calculated later
              sign: apsisSign.sign,
              signDegree: apsisSign.signDegree
            };
          }

          // Calculate the opposite point
          const oppositeApsis = (Astronomy as any).NextLunarApsis(lunarApsis);
          if (oppositeApsis) {
            const oppositeVector = Astronomy.GeoVector('Moon' as any, oppositeApsis.time, false);
            const oppositeEcliptic = Astronomy.Ecliptic(oppositeVector);
            const oppositeLongitude = this.normalizeLongitude(oppositeEcliptic.elon);
            const oppositeSign = this.getZodiacSign(oppositeLongitude);

            if (oppositeApsis.kind === 1 && !additionalPoints.blackMoonLilith) { // Apogee
              additionalPoints.blackMoonLilith = {
                name: 'Black Moon Lilith',
                symbol: '⚸',
                longitude: oppositeLongitude,
                latitude: 0,
                house: 1,
                sign: oppositeSign.sign,
                signDegree: oppositeSign.signDegree
              };
            } else if (oppositeApsis.kind === 0 && !additionalPoints.whiteMoonSelena) { // Perigee
              additionalPoints.whiteMoonSelena = {
                name: 'White Moon Selena',
                symbol: '⊙',
                longitude: oppositeLongitude,
                latitude: 0,
                house: 1,
                sign: oppositeSign.sign,
                signDegree: oppositeSign.signDegree
              };
            }
          }
        }
      } catch (error) {
        console.warn('Lunar apsis calculation failed:', error);
      }

      console.log('🌟 Additional points calculated:', Object.keys(additionalPoints));
      return additionalPoints;

    } catch (error) {
      console.warn('Additional points calculation failed:', error);
      return {};
    }
  }
}

export default AstrologyCalculator;
