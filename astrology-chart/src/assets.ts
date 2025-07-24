/**
 * Asset exports for the astrology application
 * This file centralizes all assets for easy import
 */

// Export font assets
import fonts from './assets/fonts';

// Export image assets
import * as images from './assets/images';

// Export specific image groups for convenience
import { 
  cosmicAlignmentDisks, 
  cypherDisks, 
  animations, 
  customButtons 
} from './assets/images';

// Centralized asset exports
export {
  fonts,
  images,
  cosmicAlignmentDisks,
  cypherDisks,
  animations,
  customButtons
};

// Default export for all assets
export default {
  fonts,
  images,
  cosmicAlignmentDisks,
  cypherDisks,
  animations,
  customButtons
};
