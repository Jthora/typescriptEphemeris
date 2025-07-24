/**
 * Maps zodiac signs to cosmic modality symbols
 */

// Import base12 cosmic symbols statically
// These imports are resolved at build time by Vite
import fireCardinal from './symbols/cosmic/base12-fire-active-256x-glow.png';
import fireFixed from './symbols/cosmic/base12-fire-static-256x-glow.png';
import fireMutable from './symbols/cosmic/base12-fire-reactive-256x-glow.png';
import earthCardinal from './symbols/cosmic/base12-earth-active-256x-glow.png';
import earthFixed from './symbols/cosmic/base12-earth-static-256x-glow.png';
import earthMutable from './symbols/cosmic/base12-earth-reactive-256x-glow.png';
import airCardinal from './symbols/cosmic/base12-air-active-256x-glow.png';
import airFixed from './symbols/cosmic/base12-air-static-256x-glow.png';
import airMutable from './symbols/cosmic/base12-air-reactive-256x-glow.png';
import waterCardinal from './symbols/cosmic/base12-water-active-256x-glow.png';
import waterFixed from './symbols/cosmic/base12-water-static-256x-glow.png';
import waterMutable from './symbols/cosmic/base12-water-reactive-256x-glow.png';

// Import base24 cusp symbols
import chaosActiveReactive from './symbols/cosmic/base24-chaos-active-reactive-256x-glow.png';
import chaosReactiveStatic from './symbols/cosmic/base24-chaos-reactive-static-256x-glow.png';
import chaosStaticActive from './symbols/cosmic/base24-chaos-static-active-256x-glow.png';
import coreActiveStatic from './symbols/cosmic/base24-core-active-static-256x-glow.png';
import coreReactiveActive from './symbols/cosmic/base24-core-reactive-active-256x-glow.png';
import coreStaticReactive from './symbols/cosmic/base24-core-static-reactive-256x-glow.png';
import orderActiveReactive from './symbols/cosmic/base24-order-active-reactive-256x-glow.png';
import orderReactiveStatic from './symbols/cosmic/base24-order-reactive-static-256x-glow.png';
import orderStaticActive from './symbols/cosmic/base24-order-static-active-256x-glow.png';
import voidActiveStatic from './symbols/cosmic/base24-void-active-static-256x-glow.png';
import voidReactiveActive from './symbols/cosmic/base24-void-reactive-active-256x-glow.png';
import voidStaticReactive from './symbols/cosmic/base24-void-static-reactive-256x-glow.png';

// Import base36 decan symbols - prime symbols align with zodiac signs
// Fire element decan symbols
import fireActivePrime from './symbols/cosmic/base36-fire-active-prime-256x-glow.png';
import fireActiveChaos from './symbols/cosmic/base36-fire-active-chaos-256x-glow.png';
import fireActiveCore from './symbols/cosmic/base36-fire-active-core-256x-glow.png';
import fireStaticPrime from './symbols/cosmic/base36-fire-static-prime-256x-glow.png';
import fireStaticChaos from './symbols/cosmic/base36-fire-static-chaos-256x-glow.png';
import fireStaticCore from './symbols/cosmic/base36-fire-static-core-256x-glow.png';
import fireReactivePrime from './symbols/cosmic/base36-fire-reactive-prime-256x-glow.png';
import fireReactiveChaos from './symbols/cosmic/base36-fire-reactive-chaos-256x-glow.png';
import fireReactiveCore from './symbols/cosmic/base36-fire-reactive-core-256x-glow.png';

// Earth element decan symbols
import earthActivePrime from './symbols/cosmic/base36-earth-active-prime-256x-glow.png';
import earthActiveCore from './symbols/cosmic/base36-earth-active-core-256x-glow.png';
import earthActiveOrder from './symbols/cosmic/base36-earth-active-order-256x-glow.png';
import earthStaticPrime from './symbols/cosmic/base36-earth-static-prime-256x-glow.png';
import earthStaticCore from './symbols/cosmic/base36-earth-static-core-256x-glow.png';
import earthStaticOrder from './symbols/cosmic/base36-earth-static-order-256x-glow.png';
import earthReactivePrime from './symbols/cosmic/base36-earth-reactive-prime-256x-glow.png';
import earthReactiveCore from './symbols/cosmic/base36-earth-reactive-core-256x-glow.png';
import earthReactiveOrder from './symbols/cosmic/base36-earth-reactive-order-256x-glow.png';

// Air element decan symbols
import airActivePrime from './symbols/cosmic/base36-air-active-prime-256x-glow.png';
import airActiveOrder from './symbols/cosmic/base36-air-active-order-256x-glow.png';
import airActiveVoid from './symbols/cosmic/base36-air-active-void-256x-glow.png';
import airStaticPrime from './symbols/cosmic/base36-air-static-prime-256x-glow.png';
import airStaticOrder from './symbols/cosmic/base36-air-static-order-256x-glow.png';
import airStaticVoid from './symbols/cosmic/base36-air-static-void-256x-glow.png';
import airReactivePrime from './symbols/cosmic/base36-air-reactive-prime-256x-glow.png';
import airReactiveOrder from './symbols/cosmic/base36-air-reactive-order-256x-glow.png';
import airReactiveVoid from './symbols/cosmic/base36-air-reactive-void-256x-glow.png';

// Water element decan symbols
import waterActivePrime from './symbols/cosmic/base36-water-active-prime-256x-glow.png';
import waterActiveChaos from './symbols/cosmic/base36-water-active-chaos-256x-glow.png';
import waterActiveVoid from './symbols/cosmic/base36-water-active-void-256x-glow.png';
import waterStaticPrime from './symbols/cosmic/base36-water-static-prime-256x-glow.png';
import waterStaticChaos from './symbols/cosmic/base36-water-static-chaos-256x-glow.png';
import waterStaticVoid from './symbols/cosmic/base36-water-static-void-256x-glow.png';
import waterReactivePrime from './symbols/cosmic/base36-water-reactive-prime-256x-glow.png';
import waterReactiveChaos from './symbols/cosmic/base36-water-reactive-chaos-256x-glow.png';
import waterReactiveVoid from './symbols/cosmic/base36-water-reactive-void-256x-glow.png';

// Chart angles will use font-based rendering instead of images
// No image imports needed for ASC/DSC/MC/IC

// Define the mapping of zodiac signs to their element/modality classification
const ZODIAC_COSMIC_SYMBOLS = {
  'Libra': {
    image: airCardinal,
    element: 'air',
    modality: 'cardinal',
    size: 48, // Default size for rendering
  },
  
  'Aquarius': {
    image: airFixed,
    element: 'air',
    modality: 'fixed',
    size: 48, // Default size for rendering
  },
  
  'Gemini': {
    image: airMutable,
    element: 'air',
    modality: 'mutable',
    size: 48, // Default size for rendering
  },
  
  'Capricorn': {
    image: earthCardinal,
    element: 'earth',
    modality: 'cardinal',
    size: 48, // Default size for rendering
  },
  
  'Taurus': {
    image: earthFixed,
    element: 'earth',
    modality: 'fixed',
    size: 48, // Default size for rendering
  },
  
  'Virgo': {
    image: earthMutable,
    element: 'earth',
    modality: 'mutable',
    size: 48, // Default size for rendering
  },
  
  'Aries': {
    image: fireCardinal,
    element: 'fire',
    modality: 'cardinal',
    size: 48, // Default size for rendering
  },
  
  'Leo': {
    image: fireFixed,
    element: 'fire',
    modality: 'fixed',
    size: 48, // Default size for rendering
  },
  
  'Sagittarius': {
    image: fireMutable,
    element: 'fire',
    modality: 'mutable',
    size: 48, // Default size for rendering
  },
  
  'Cancer': {
    image: waterCardinal,
    element: 'water',
    modality: 'cardinal',
    size: 48, // Default size for rendering
  },
  
  'Scorpio': {
    image: waterFixed,
    element: 'water',
    modality: 'fixed',
    size: 48, // Default size for rendering
  },
  
  'Pisces': {
    image: waterMutable,
    element: 'water',
    modality: 'mutable',
    size: 48, // Default size for rendering
  },
  
};

// Element and modality map for easy reference
const ELEMENT_COLOR_MAP = {
  fire: '#FF5733',   // Red/orange
  earth: '#4CAF50',  // Green
  air: '#FFEB3B',    // Yellow
  water: '#2196F3',  // Blue
};

// Updated modality map according to new naming convention
const MODALITY_MAP = {
  cardinal: 'active',
  fixed: 'static',
  mutable: 'reactive',
};

// Modality type descriptions for tooltips
const MODALITY_TYPES = {
  cardinal: 'Active (Cardinal)',
  fixed: 'Static (Fixed)',
  mutable: 'Reactive (Mutable)',
};

// Cusps are the intersections between zodiac signs
// Base24 symbols represent these transitional points
const CUSPS_COSMIC_SYMBOLS = [
  {
    image: chaosActiveReactive,
    force: 'chaos',
    combo: 'active-reactive',
    size: 40 // Slightly smaller than zodiac symbols
  },
  {
    image: chaosReactiveStatic,
    force: 'chaos',
    combo: 'reactive-static',
    size: 40
  },
  {
    image: chaosStaticActive,
    force: 'chaos',
    combo: 'static-active',
    size: 40
  },
  {
    image: coreActiveStatic,
    force: 'core',
    combo: 'active-static',
    size: 40
  },
  {
    image: coreReactiveActive,
    force: 'core',
    combo: 'reactive-active',
    size: 40
  },
  {
    image: coreStaticReactive,
    force: 'core',
    combo: 'static-reactive',
    size: 40
  },
  {
    image: orderActiveReactive,
    force: 'order',
    combo: 'active-reactive',
    size: 40
  },
  {
    image: orderReactiveStatic,
    force: 'order',
    combo: 'reactive-static',
    size: 40
  },
  {
    image: orderStaticActive,
    force: 'order',
    combo: 'static-active',
    size: 40
  },
  {
    image: voidActiveStatic,
    force: 'void',
    combo: 'active-static',
    size: 40
  },
  {
    image: voidReactiveActive,
    force: 'void',
    combo: 'reactive-active',
    size: 40
  },
  {
    image: voidStaticReactive,
    force: 'void',
    combo: 'static-reactive',
    size: 40
  }
];

// Decans are the 10° segments of the zodiac (36 total segments)
// Base36 symbols represent these segments with prime decans aligning with zodiac signs
const DECANS_COSMIC_SYMBOLS = [
  // Fire + Active (Aries) decans
  {
    image: fireActivePrime,
    element: 'fire',
    modality: 'active',
    force: 'prime',
    size: 36, // Slightly smaller than zodiac symbols
    degreesStart: 0, // 0° Aries
    zodiacSign: 'Aries',
    decanPosition: 0 // First decan
  },
  {
    image: fireActiveCore,
    element: 'fire',
    modality: 'active',
    force: 'core',
    size: 36,
    degreesStart: 10, // 10° Aries
    zodiacSign: 'Aries',
    decanPosition: 1 // Second decan
  },
  {
    image: fireActiveChaos,
    element: 'fire',
    modality: 'active',
    force: 'chaos',
    size: 36,
    degreesStart: 20, // 20° Aries
    zodiacSign: 'Aries',
    decanPosition: 2 // Third decan
  },
  
  // Earth + Static (Taurus) decans
  {
    image: earthStaticPrime,
    element: 'earth',
    modality: 'static',
    force: 'prime',
    size: 36,
    degreesStart: 30, // 0° Taurus
    zodiacSign: 'Taurus',
    decanPosition: 0
  },
  {
    image: earthStaticCore,
    element: 'earth',
    modality: 'static',
    force: 'core',
    size: 36,
    degreesStart: 40, // 10° Taurus
    zodiacSign: 'Taurus',
    decanPosition: 1
  },
  {
    image: earthStaticOrder,
    element: 'earth',
    modality: 'static',
    force: 'order',
    size: 36,
    degreesStart: 50, // 20° Taurus
    zodiacSign: 'Taurus',
    decanPosition: 2
  },
  
  // Air + Reactive (Gemini) decans
  {
    image: airReactivePrime,
    element: 'air',
    modality: 'reactive',
    force: 'prime',
    size: 36,
    degreesStart: 60, // 0° Gemini
    zodiacSign: 'Gemini',
    decanPosition: 0
  },
  {
    image: airReactiveOrder,
    element: 'air',
    modality: 'reactive',
    force: 'order',
    size: 36,
    degreesStart: 70, // 10° Gemini
    zodiacSign: 'Gemini',
    decanPosition: 1
  },
  {
    image: airReactiveVoid,
    element: 'air',
    modality: 'reactive',
    force: 'void',
    size: 36,
    degreesStart: 80, // 20° Gemini
    zodiacSign: 'Gemini',
    decanPosition: 2
  },
  
  // Water + Active (Cancer) decans
  {
    image: waterActivePrime,
    element: 'water',
    modality: 'active',
    force: 'prime',
    size: 36,
    degreesStart: 90, // 0° Cancer
    zodiacSign: 'Cancer',
    decanPosition: 0
  },
  {
    image: waterActiveVoid,
    element: 'water',
    modality: 'active',
    force: 'void',
    size: 36,
    degreesStart: 100, // 10° Cancer
    zodiacSign: 'Cancer',
    decanPosition: 1
  },
  {
    image: waterActiveChaos,
    element: 'water',
    modality: 'active',
    force: 'chaos',
    size: 36,
    degreesStart: 110, // 20° Cancer
    zodiacSign: 'Cancer',
    decanPosition: 2
  },
  
  // Fire + Static (Leo) decans
  {
    image: fireStaticPrime,
    element: 'fire',
    modality: 'static',
    force: 'prime',
    size: 36,
    degreesStart: 120, // 0° Leo
    zodiacSign: 'Leo',
    decanPosition: 0
  },
  {
    image: fireStaticCore,
    element: 'fire',
    modality: 'static',
    force: 'core',
    size: 36,
    degreesStart: 130, // 10° Leo
    zodiacSign: 'Leo',
    decanPosition: 1
  },
  {
    image: fireStaticChaos,
    element: 'fire',
    modality: 'static',
    force: 'chaos',
    size: 36,
    degreesStart: 140, // 20° Leo
    zodiacSign: 'Leo',
    decanPosition: 2
  },
  
  // Earth + Reactive (Virgo) decans
  {
    image: earthReactivePrime,
    element: 'earth',
    modality: 'reactive',
    force: 'prime',
    size: 36,
    degreesStart: 150, // 0° Virgo
    zodiacSign: 'Virgo',
    decanPosition: 0
  },
  {
    image: earthReactiveCore,
    element: 'earth',
    modality: 'reactive',
    force: 'core',
    size: 36,
    degreesStart: 160, // 10° Virgo
    zodiacSign: 'Virgo',
    decanPosition: 1
  },
  {
    image: earthReactiveOrder,
    element: 'earth',
    modality: 'reactive',
    force: 'order',
    size: 36,
    degreesStart: 170, // 20° Virgo
    zodiacSign: 'Virgo',
    decanPosition: 2
  },
  
  // Air + Active (Libra) decans
  {
    image: airActivePrime,
    element: 'air',
    modality: 'active',
    force: 'prime',
    size: 36,
    degreesStart: 180, // 0° Libra
    zodiacSign: 'Libra',
    decanPosition: 0
  },
  {
    image: airActiveOrder,
    element: 'air',
    modality: 'active',
    force: 'order',
    size: 36,
    degreesStart: 190, // 10° Libra
    zodiacSign: 'Libra',
    decanPosition: 1
  },
  {
    image: airActiveVoid,
    element: 'air',
    modality: 'active',
    force: 'void',
    size: 36,
    degreesStart: 200, // 20° Libra
    zodiacSign: 'Libra',
    decanPosition: 2
  },
  
  // Water + Static (Scorpio) decans
  {
    image: waterStaticPrime,
    element: 'water',
    modality: 'static',
    force: 'prime',
    size: 36,
    degreesStart: 210, // 0° Scorpio
    zodiacSign: 'Scorpio',
    decanPosition: 0
  },
  {
    image: waterStaticVoid,
    element: 'water',
    modality: 'static',
    force: 'void',
    size: 36,
    degreesStart: 220, // 10° Scorpio
    zodiacSign: 'Scorpio',
    decanPosition: 1
  },
  {
    image: waterStaticChaos,
    element: 'water',
    modality: 'static',
    force: 'chaos',
    size: 36,
    degreesStart: 230, // 20° Scorpio
    zodiacSign: 'Scorpio',
    decanPosition: 2
  },
  
  // Fire + Reactive (Sagittarius) decans
  {
    image: fireReactivePrime,
    element: 'fire',
    modality: 'reactive',
    force: 'prime',
    size: 36,
    degreesStart: 240, // 0° Sagittarius
    zodiacSign: 'Sagittarius',
    decanPosition: 0
  },
  {
    image: fireReactiveCore,
    element: 'fire',
    modality: 'reactive',
    force: 'core',
    size: 36,
    degreesStart: 250, // 10° Sagittarius
    zodiacSign: 'Sagittarius',
    decanPosition: 1
  },
  {
    image: fireReactiveChaos,
    element: 'fire',
    modality: 'reactive',
    force: 'chaos',
    size: 36,
    degreesStart: 260, // 20° Sagittarius
    zodiacSign: 'Sagittarius',
    decanPosition: 2
  },
  
  // Earth + Active (Capricorn) decans
  {
    image: earthActivePrime,
    element: 'earth',
    modality: 'active',
    force: 'prime',
    size: 36,
    degreesStart: 270, // 0° Capricorn
    zodiacSign: 'Capricorn',
    decanPosition: 0
  },
  {
    image: earthActiveCore,
    element: 'earth',
    modality: 'active',
    force: 'core',
    size: 36,
    degreesStart: 280, // 10° Capricorn
    zodiacSign: 'Capricorn',
    decanPosition: 1
  },
  {
    image: earthActiveOrder,
    element: 'earth',
    modality: 'active',
    force: 'order',
    size: 36,
    degreesStart: 290, // 20° Capricorn
    zodiacSign: 'Capricorn',
    decanPosition: 2
  },
  
  // Air + Static (Aquarius) decans
  {
    image: airStaticPrime,
    element: 'air',
    modality: 'static',
    force: 'prime',
    size: 36,
    degreesStart: 300, // 0° Aquarius
    zodiacSign: 'Aquarius',
    decanPosition: 0
  },
  {
    image: airStaticOrder,
    element: 'air',
    modality: 'static',
    force: 'order',
    size: 36,
    degreesStart: 310, // 10° Aquarius
    zodiacSign: 'Aquarius',
    decanPosition: 1
  },
  {
    image: airStaticVoid,
    element: 'air',
    modality: 'static',
    force: 'void',
    size: 36,
    degreesStart: 320, // 20° Aquarius
    zodiacSign: 'Aquarius',
    decanPosition: 2
  },
  
  // Water + Reactive (Pisces) decans
  {
    image: waterReactivePrime,
    element: 'water',
    modality: 'reactive',
    force: 'prime',
    size: 36,
    degreesStart: 330, // 0° Pisces
    zodiacSign: 'Pisces',
    decanPosition: 0
  },
  {
    image: waterReactiveVoid,
    element: 'water',
    modality: 'reactive',
    force: 'void',
    size: 36,
    degreesStart: 340, // 10° Pisces
    zodiacSign: 'Pisces',
    decanPosition: 1
  },
  {
    image: waterReactiveChaos,
    element: 'water',
    modality: 'reactive',
    force: 'chaos',
    size: 36,
    degreesStart: 350, // 20° Pisces
    zodiacSign: 'Pisces',
    decanPosition: 2
  }
];

// Chart angle symbols (ASC, DSC, MC, IC)
const ANGLE_COSMIC_SYMBOLS = {
  'ASC': {
    name: 'Ascendant',
    shortName: 'ASC',
    symbol: 'ASC', // Use the short name as the symbol
    element: 'fire',
    modality: 'cardinal',
    size: 56, // Larger than zodiac symbols for emphasis
    color: '#FF5733', // Fire color
    fontWeight: 'bold',
    fontSize: '16px', // Smaller font size for text
    description: 'The Ascendant represents the eastern horizon at birth, the first impression one makes on others'
  },
  'DSC': {
    name: 'Descendant',
    shortName: 'DSC',
    symbol: 'DSC', // Use the short name as the symbol
    element: 'air',
    modality: 'cardinal',
    size: 56,
    color: '#FFEB3B', // Air color
    fontWeight: 'bold',
    fontSize: '16px', // Smaller font size for text
    description: 'The Descendant represents the western horizon at birth, relationships with others'
  },
  'MC': {
    name: 'Midheaven',
    shortName: 'MC',
    symbol: 'MC', // Use the short name as the symbol
    element: 'earth',
    modality: 'cardinal',
    size: 56,
    color: '#4CAF50', // Earth color
    fontWeight: 'bold',
    fontSize: '16px', // Smaller font size for text
    description: 'The Midheaven represents the highest point in the chart, career and public reputation'
  },
  'IC': {
    name: 'Imum Coeli',
    shortName: 'IC',
    symbol: 'IC', // Use the short name as the symbol
    element: 'water',
    modality: 'cardinal',
    size: 56,
    color: '#2196F3', // Water color
    fontWeight: 'bold',
    fontSize: '16px', // Smaller font size for text
    description: 'The Imum Coeli represents the lowest point in the chart, home and private life'
  }
};

// Helper function to get the decan for a specific degree in the zodiac (0-359)
const getDecanByDegree = (degree: number) => {
  // Normalize degree to 0-359
  const normalizedDegree = ((degree % 360) + 360) % 360;
  
  // Find the decan that contains this degree
  return DECANS_COSMIC_SYMBOLS.find(decan => {
    const decanStart = decan.degreesStart;
    const decanEnd = (decan.degreesStart + 10) % 360;
    
    // Handle normal case
    if (decanEnd > decanStart) {
      return normalizedDegree >= decanStart && normalizedDegree < decanEnd;
    } 
    // Handle edge case for last decan of Pisces wrapping around to 0°
    else {
      return normalizedDegree >= decanStart || normalizedDegree < decanEnd;
    }
  }) || DECANS_COSMIC_SYMBOLS[0]; // Fallback to first decan
};

// Helper to group decans by zodiac sign (hardcoded to avoid circular dependencies)
const ZODIAC_NAMES = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 
  'Leo', 'Virgo', 'Libra', 'Scorpio', 
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const DECANS_BY_ZODIAC = ZODIAC_NAMES.reduce((acc: Record<string, typeof DECANS_COSMIC_SYMBOLS>, name: string, index: number) => {
  const signDecans = DECANS_COSMIC_SYMBOLS.filter(
    decan => decan.degreesStart >= index * 30 && decan.degreesStart < (index + 1) * 30
  );
  acc[name] = signDecans;
  return acc;
}, {} as Record<string, typeof DECANS_COSMIC_SYMBOLS>);

// Export all symbols and utilities
export { 
  ELEMENT_COLOR_MAP, 
  MODALITY_MAP, 
  MODALITY_TYPES, 
  CUSPS_COSMIC_SYMBOLS, 
  DECANS_COSMIC_SYMBOLS, 
  getDecanByDegree, 
  DECANS_BY_ZODIAC, 
  ANGLE_COSMIC_SYMBOLS 
 };

export default ZODIAC_COSMIC_SYMBOLS;