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

// Define the mapping of zodiac signs to their element/modality classification
export const ZODIAC_COSMIC_SYMBOLS = {
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
export const ELEMENT_COLOR_MAP = {
  fire: '#FF5733',   // Red/orange
  earth: '#4CAF50',  // Green
  air: '#FFEB3B',    // Yellow
  water: '#2196F3',  // Blue
};

// Updated modality map according to new naming convention
export const MODALITY_MAP = {
  cardinal: 'active',
  fixed: 'static',
  mutable: 'reactive',
};

// Modality type descriptions for tooltips
export const MODALITY_TYPES = {
  cardinal: 'Active (Cardinal)',
  fixed: 'Static (Fixed)',
  mutable: 'Reactive (Mutable)',
};

// Cusps are the intersections between zodiac signs
// Base24 symbols represent these transitional points
export const CUSPS_COSMIC_SYMBOLS = [
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

export default ZODIAC_COSMIC_SYMBOLS;
