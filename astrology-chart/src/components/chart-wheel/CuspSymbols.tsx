import React from 'react';
import { ZODIAC_SIGNS } from '../../astrology';

interface CuspSymbolsProps {
  radius: number;
  width: number;
  cosmicSymbols: typeof import('../../assets').cosmicSymbols;
  scaleImageSizeForViewport: (originalSize: number, viewportWidth: number) => number;
  calculateSymbolOpacity: (
    symbolLongitude: number,
    bodies: Array<{longitude: number}>,
    baseOpacity?: number,
    maxOpacity?: number,
    orbSize?: number
  ) => number;
  allCelestialBodies: Array<{longitude: number}>;
}

// Helper function to find appropriate cusp symbol
const findAppropriateCuspSymbol = (
  cuspSymbols: any[], 
  currentModality: string, 
  nextModality: string,
  currentElement: string,
  nextElement: string,
  index: number
) => {
  // Convert astrology.ts quality terms to cosmic-symbols.ts modality terms
  const getModalityTerm = (quality: string) => {
    if (quality === 'cardinal') return 'active';
    if (quality === 'fixed') return 'static';
    if (quality === 'mutable') return 'reactive';
    return quality; // fallback
  };
  
  const currentModalityTerm = getModalityTerm(currentModality);
  const nextModalityTerm = getModalityTerm(nextModality);
  
  // Match by transition force based on elements
  let force = 'core'; // default
  
  // Determine appropriate force based on element transitions
  // According to the rules:
  // core = between fire and earth
  // void = between water and air
  // order = between earth and air
  // chaos = between fire and water
  
  // Fire transitions
  if (currentElement === 'fire' && nextElement === 'earth') force = 'core';
  if (currentElement === 'fire' && nextElement === 'air') force = 'order';
  if (currentElement === 'fire' && nextElement === 'water') force = 'chaos';
  
  // Earth transitions
  if (currentElement === 'earth' && nextElement === 'fire') force = 'core';
  if (currentElement === 'earth' && nextElement === 'air') force = 'order';
  if (currentElement === 'earth' && nextElement === 'water') force = 'void';
  
  // Air transitions
  if (currentElement === 'air' && nextElement === 'fire') force = 'order';
  if (currentElement === 'air' && nextElement === 'earth') force = 'order';
  if (currentElement === 'air' && nextElement === 'water') force = 'void';
  
  // Water transitions
  if (currentElement === 'water' && nextElement === 'fire') force = 'chaos';
  if (currentElement === 'water' && nextElement === 'earth') force = 'void';
  if (currentElement === 'water' && nextElement === 'air') force = 'void';
  
  // Same element transitions - use cycle position
  if (currentElement === nextElement) {
    const forces = ['core', 'order', 'chaos', 'void'];
    force = forces[index % 4];
  }
  
  // Look for a cusp symbol that matches the transition
  // First try to find perfect match for both modality transition and force
  const combo = `${currentModalityTerm}-${nextModalityTerm}`;
  let symbol = cuspSymbols.find(s => s.force === force && s.combo === combo);
  
  // If no exact match, try reversed combo
  if (!symbol) {
    const reversedCombo = `${nextModalityTerm}-${currentModalityTerm}`;
    symbol = cuspSymbols.find(s => s.force === force && s.combo === reversedCombo);
  }
  
  // Try with all possible modality combinations for this force
  if (!symbol) {
    // List all combos for modalities
    const modalities = ['active', 'static', 'reactive'];
    const possibleCombos = [];
    
    // Try all combinations of modalities with the correct force
    for (const m1 of modalities) {
      for (const m2 of modalities) {
        if (m1 !== m2) { // Different modalities
          possibleCombos.push(`${m1}-${m2}`);
        }
      }
    }
    
    // Find first matching force with any modality combo
    for (const possibleCombo of possibleCombos) {
      const possibleSymbol = cuspSymbols.find(s => s.force === force && s.combo === possibleCombo);
      if (possibleSymbol) {
        symbol = possibleSymbol;
        break;
      }
    }
  }
  
  // If still no match, just find one with the right force
  if (!symbol) {
    symbol = cuspSymbols.find(s => s.force === force);
  }
  
  // Final fallback to any symbol
  if (!symbol) {
    symbol = cuspSymbols[index % cuspSymbols.length];
  }
  
  return symbol;
};

export const CuspSymbols: React.FC<CuspSymbolsProps> = ({
  radius,
  width,
  cosmicSymbols,
  scaleImageSizeForViewport,
  calculateSymbolOpacity,
  allCelestialBodies
}) => {
  const houseRadius = radius * 0.8; // House radius
  const cuspRadius = houseRadius * 0.93; // Position cusp symbols a bit further inside the house rim

  return (
    <g className="cusp-symbols">
      {ZODIAC_SIGNS.map((_, i) => {
        // Get the current sign and the next sign
        const currentSign = ZODIAC_SIGNS[i];
        const nextSign = ZODIAC_SIGNS[(i + 1) % 12];
        
        // Get appropriate cusp symbol based on transitions between modalities and elements
        const currentModality = currentSign.quality.toLowerCase();
        const nextModality = nextSign.quality.toLowerCase();
        const currentElement = currentSign.element.toLowerCase();
        const nextElement = nextSign.element.toLowerCase();
        
        // Find the most appropriate cusp symbol
        const cuspData = findAppropriateCuspSymbol(
          cosmicSymbols.cusps, 
          currentModality, 
          nextModality, 
          currentElement, 
          nextElement, 
          i
        );
        
        // Position cusp symbol exactly between two zodiac signs
        const cuspAngle = ((i * 30) + 30 - 90) * (Math.PI / 180); // +30 to place between signs
        const cuspX = Math.cos(cuspAngle) * cuspRadius;
        const cuspY = Math.sin(cuspAngle) * cuspRadius;
        
        // Scale the cusp symbol size
        const cuspSize = scaleImageSizeForViewport(cuspData.size, width);
        
        // Cusp rotation angle - ensure it points outward like zodiac symbols
        const cuspRotationAngle = ((i * 30) + 30 + 180 + 180) % 360;
        
        // Calculate the absolute longitude of this cusp symbol
        const cuspLongitude = (i * 30) + 30; // Boundary between signs
        
        // Calculate opacity based on proximity to planets and other celestial bodies
        const cuspOpacity = calculateSymbolOpacity(
          cuspLongitude,
          allCelestialBodies,
          0.02, // base opacity (changed from 0.1 to 0.02)
          1.0, // max opacity
          15   // orb size in degrees
        );

        return (
          <g 
            key={`cusp-${i}`}
            className="cusp-symbol"
            data-force={cuspData.force}
            data-combo={cuspData.combo}
          >
            {/* Cusp symbol positioned at the outer edge of house rim */}
            <image
              href={cuspData.image}
              x={cuspX - cuspSize/2}
              y={cuspY - cuspSize/2}
              width={cuspSize}
              height={cuspSize}
              preserveAspectRatio="xMidYMid meet"
              transform={`rotate(${cuspRotationAngle}, ${cuspX}, ${cuspY})`}
              opacity={cuspOpacity}
              onError={() => {
                console.error(`Failed to load cusp image: ${cuspData.force}-${cuspData.combo}`);
              }}
            />
          </g>
        );
      })}
    </g>
  );
};
