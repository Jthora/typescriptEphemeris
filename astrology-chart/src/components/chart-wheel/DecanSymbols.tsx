import React from 'react';
import { ZODIAC_SIGNS } from '../../astrology';

interface DecanSymbolsProps {
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

export const DecanSymbols: React.FC<DecanSymbolsProps> = ({
  radius,
  width,
  cosmicSymbols,
  scaleImageSizeForViewport,
  calculateSymbolOpacity,
  allCelestialBodies
}) => {
  const decanRadius = radius * 0.55; // Just outside the AspectArea rim (AspectArea is at 0.5, so 0.55 puts it just outside)

  return (
    <g className="decan-symbols">
      {ZODIAC_SIGNS.map((_, i) => {
        // Each sign has 3 decans at 0°, 10°, and 20° of the sign
        return Array.from({ length: 3 }, (_, decanIndex) => {
          // Calculate the absolute degree for this decan (0-359), with 5-degree adjustment
          const decanDegree = (i * 30) + (decanIndex * 10);
          
          // Get the appropriate decan data from our cosmic symbols
          const decanData = cosmicSymbols.getDecanByDegree(decanDegree);
          
          // Position the decan symbol with 5-degree adjustment
          // 0° decan aligns with zodiac sign, others are placed at their respective positions
          // Place on inner rim (Base36)
          const decanAngle = ((i * 30) + (decanIndex * 10) + 5 - 90) * (Math.PI / 180); // +5 to adjust offset
          const decanX = Math.cos(decanAngle) * decanRadius;
          const decanY = Math.sin(decanAngle) * decanRadius;
          
          // Scale the decan symbol size (slightly smaller than zodiac symbols)
          const decanSize = scaleImageSizeForViewport(decanData.size, width);
          
          // Decan rotation angle - ensure it points outward like other symbols
          // Adjusted by 5 degrees to match the position adjustment
          const decanRotationAngle = ((i * 30) + (decanIndex * 10) + 5 + 180 + 180) % 360;
          
          // Calculate the absolute longitude of this decan symbol
          // Each decan is 10° wide, centered at 5°, 15°, 25° within each sign
          const decanLongitude = (i * 30) + (decanIndex * 10) + 5;
          
          // Calculate opacity based on proximity to planets and other celestial bodies
          // For decans, use a 8-degree orb (larger for easier activation)
          const decanOpacity = calculateSymbolOpacity(
            decanLongitude,
            allCelestialBodies,
            0.02, // base opacity (changed from 0.05 to 0.02)
            1.0,  // max opacity (increased to allow full opacity)
            8     // orb size in degrees (increased from 5 to 8 for easier activation)
          );

          return (
            <g 
              key={`decan-${i}-${decanIndex}`}
              className="decan-symbol"
              data-element={decanData.element}
              data-modality={decanData.modality}
              data-force={decanData.force}
              data-zodiac-sign={decanData.zodiacSign}
              data-decan-position={decanData.decanPosition}
            >
              <image
                href={decanData.image}
                x={decanX - decanSize/2}
                y={decanY - decanSize/2}
                width={decanSize}
                height={decanSize}
                preserveAspectRatio="xMidYMid meet"
                transform={`rotate(${decanRotationAngle}, ${decanX}, ${decanY})`}
                opacity={decanOpacity}
                onError={() => {
                  console.error(`Failed to load decan image: ${decanData.element}-${decanData.modality}-${decanData.force}`);
                }}
              />
            </g>
          );
        });
      }).flat()}
    </g>
  );
};
