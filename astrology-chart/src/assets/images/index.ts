// Export all images
// This file is auto-generated

import * as uiImport from './ui';
import * as iconsImport from './icons';
import * as buttonsImport from './buttons';
import * as gradientsImport from './gradients';
import * as symbolsImport from './symbols';
import * as backgroundsImport from './backgrounds';
import ZODIAC_COSMIC_SYMBOLS, { ELEMENT_COLOR_MAP, MODALITY_TYPES, CUSPS_COSMIC_SYMBOLS, DECANS_COSMIC_SYMBOLS, getDecanByDegree, DECANS_BY_ZODIAC } from './cosmic-symbols';

// Import specific image assets
import cosmicAlignmentDiskAwesome from './CosmicAlignmentDisk_awesome1.png';
import cosmicAlignmentDiskChevronSFX from './CosmicAlignmentDisk_chevron_SFX1.png';
import cosmicAlignmentDiskChevronsFull from './CosmicAlignmentDisk_chevrons_fullColor.png';
import cosmicAlignmentDiskChevronsOutline from './CosmicAlignmentDisk_chevrons_outlineColor.png';
import cosmicAlignmentDiskDull from './CosmicAlignmentDisk_dull.png';
import cosmicAlignmentDiskRingColored from './CosmicAlignmentDisk_ring_colored.png';
import cosmicCypherMk2 from './CosmicCypher-Mk2.png';
import resonantFinderCircleButton from './ResonantFinder-CircleButton-PlanetSelect.png';
import starDiskFormationLoader from './StarDiskFormation-loaderAnim_1.gif';
import cypherDiskDifferentialPower from './cypherDisk_chevron36_differencial_power.png';
import cypherDiskDifferentialUnlockable from './cypherDisk_chevron36_differencial_unlockable.png';
import cypherDiskFormal from './cypherDisk_chevron36_formal.png';
import cypherDiskInformal from './cypherDisk_chevron36_informal.png';
import cypherDiskLinkRing from './cypherDisk_chevron36_linkRing.png';

// Re-export original imports with new names
export const ui = uiImport;
export const icons = iconsImport;
export const buttons = buttonsImport;
export const gradients = gradientsImport;
export const symbols = symbolsImport;
export const backgrounds = backgroundsImport;

// Grouped specific images
export const cosmicAlignmentDisks = {
  awesome: cosmicAlignmentDiskAwesome,
  chevronSFX: cosmicAlignmentDiskChevronSFX,
  chevronsFull: cosmicAlignmentDiskChevronsFull,
  chevronsOutline: cosmicAlignmentDiskChevronsOutline,
  dull: cosmicAlignmentDiskDull,
  ringColored: cosmicAlignmentDiskRingColored,
};

export const cypherDisks = {
  mk2: cosmicCypherMk2,
  differentialPower: cypherDiskDifferentialPower,
  differentialUnlockable: cypherDiskDifferentialUnlockable,
  formal: cypherDiskFormal,
  informal: cypherDiskInformal,
  linkRing: cypherDiskLinkRing,
};

export const animations = {
  starDiskLoader: starDiskFormationLoader,
};

export const customButtons = {
  resonantFinderCircle: resonantFinderCircleButton,
};

// Create composite objects for export
export const cosmicSymbols = {
  zodiac: ZODIAC_COSMIC_SYMBOLS,
  elementColors: ELEMENT_COLOR_MAP,
  modalityTypes: MODALITY_TYPES,
  cusps: CUSPS_COSMIC_SYMBOLS, // Export cusp symbols
  decans: DECANS_COSMIC_SYMBOLS, // Export decan symbols
  getDecanByDegree, // Utility function to get decan by degree
  decansByZodiac: DECANS_BY_ZODIAC // Decans grouped by zodiac sign
};
