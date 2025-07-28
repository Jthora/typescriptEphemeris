import React from 'react';
import { ZODIAC_SIGNS } from '../../astrology';

interface ZodiacSymbolsProps {
  radius: number;
  width: number;
  cosmicSymbols: any;
  scaleImageSizeForViewport: (baseSize: number, width: number) => number;
  fonts: any;
  primaryTextColor: string;
  calculateSymbolOpacity?: (
    symbolLongitude: number,
    bodies: Array<{longitude: number}>,
    baseOpacity?: number,
    maxOpacity?: number,
    orbSize?: number
  ) => number;
  allCelestialBodies?: Array<{longitude: number}>;
}

export const ZodiacSymbols: React.FC<ZodiacSymbolsProps> = ({
  radius,
  width,
  cosmicSymbols,
  scaleImageSizeForViewport,
  fonts,
  primaryTextColor,
  calculateSymbolOpacity,
  allCelestialBodies
}) => {
  return (
    <g className="zodiac-symbols">
      {ZODIAC_SIGNS.map((sign, i) => {
        const symbolAngle = ((i * 30) + 15 - 90) * (Math.PI / 180);
        const symbolRadius = radius * 0.95;
        const symbolX = Math.cos(symbolAngle) * symbolRadius;
        const symbolY = Math.sin(symbolAngle) * symbolRadius;
        
        const signName = sign.name;
        const cosmicSymbolData = cosmicSymbols.zodiac[signName as keyof typeof cosmicSymbols.zodiac];
        
        const baseSize = cosmicSymbolData?.size || 48;
        const symbolSize = scaleImageSizeForViewport(baseSize, width);
        
        // Calculate the absolute longitude of this zodiac symbol
        const symbolLongitude = (i * 30) + 15; // Center of zodiac sign
        
        // Calculate opacity based on proximity to planets and other celestial bodies
        const symbolOpacity = calculateSymbolOpacity && allCelestialBodies ? 
          calculateSymbolOpacity(
            symbolLongitude,
            allCelestialBodies,
            0.1, // base opacity
            1.0, // max opacity
            15   // orb size in degrees
          ) : 1.0;
        
        // Rotation angle for symbol
        const rotationAngle = ((i * 30) + 15 + 180 + 180) % 360;
        
        const imageUrl = cosmicSymbolData.image;
        
        return (
          <g
            key={signName}
            className="cosmic-symbol"
            data-sign={signName}
            data-element={cosmicSymbolData.element}
            data-modality={cosmicSymbolData.modality}
          >
            {imageUrl ? (
              <image
                href={imageUrl}
                x={symbolX - symbolSize/2}
                y={symbolY - symbolSize/2}
                width={symbolSize}
                height={symbolSize}
                preserveAspectRatio="xMidYMid meet"
                transform={`rotate(${rotationAngle}, ${symbolX}, ${symbolY})`}
                opacity={symbolOpacity}
                onError={() => {
                  console.error(`Failed to load image for ${signName}`);
                }}
              />
            ) : (
              <text
                x={symbolX}
                y={symbolY}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="24px"
                fontFamily={fonts.display}
                fill={primaryTextColor}
                opacity={symbolOpacity}
              >
                {sign.symbol}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
};
