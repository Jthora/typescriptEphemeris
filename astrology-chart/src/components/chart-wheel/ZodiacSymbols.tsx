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
        const symbolRadius = radius * 0.9; // Middle of zodiac ring (between outer radius and house radius)
        const symbolX = Math.cos(symbolAngle) * symbolRadius;
        const symbolY = Math.sin(symbolAngle) * symbolRadius;
        
        const signName = sign.name;
        const cosmicSymbolData = cosmicSymbols.zodiac[signName as keyof typeof cosmicSymbols.zodiac];
        
        // Make symbols 1.5x larger
        const baseSize = (cosmicSymbolData?.size || 48) * 1.5;
        const symbolSize = scaleImageSizeForViewport(baseSize, width);
        
        // Get element colors for glow effect
        const elementColors = {
          fire: '#ff4444',    // Red
          earth: '#44ff44',   // Green  
          air: '#ffff44',     // Yellow
          water: '#4444ff'    // Blue
        };
        
        const elementColor = elementColors[sign.element.toLowerCase() as keyof typeof elementColors] || '#ffffff';
        
        // Calculate the absolute longitude of this zodiac symbol
        const symbolLongitude = (i * 30) + 15; // Center of zodiac sign
        
        // Calculate opacity based on proximity to planets and other celestial bodies
        // Changed base opacity from 0.05 (5%) to 0.02 (2%)
        const symbolOpacity = calculateSymbolOpacity && allCelestialBodies ? 
          calculateSymbolOpacity(
            symbolLongitude,
            allCelestialBodies,
            0.02, // base opacity (changed from 0.05 to 0.02)
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
              <g>
                {/* Enhanced glow effect layers for elemental colors - 2x more prominent */}
                <image
                  href={imageUrl}
                  x={symbolX - symbolSize/2}
                  y={symbolY - symbolSize/2}
                  width={symbolSize}
                  height={symbolSize}
                  preserveAspectRatio="xMidYMid meet"
                  transform={`rotate(${rotationAngle}, ${symbolX}, ${symbolY})`}
                  opacity={symbolOpacity * 0.6}
                  filter={`drop-shadow(0 0 16px ${elementColor})`}
                />
                <image
                  href={imageUrl}
                  x={symbolX - symbolSize/2}
                  y={symbolY - symbolSize/2}
                  width={symbolSize}
                  height={symbolSize}
                  preserveAspectRatio="xMidYMid meet"
                  transform={`rotate(${rotationAngle}, ${symbolX}, ${symbolY})`}
                  opacity={symbolOpacity * 0.4}
                  filter={`drop-shadow(0 0 32px ${elementColor})`}
                />
                
                {/* Main symbol on top */}
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
              </g>
            ) : (
              <g>
                {/* Enhanced glow effect layers for text fallback - 2x more prominent */}
                <text
                  x={symbolX}
                  y={symbolY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="36px"
                  fontFamily={fonts.display}
                  fill={elementColor}
                  opacity={symbolOpacity * 0.6}
                  filter={`drop-shadow(0 0 16px ${elementColor})`}
                >
                  {sign.symbol}
                </text>
                <text
                  x={symbolX}
                  y={symbolY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="36px"
                  fontFamily={fonts.display}
                  fill={elementColor}
                  opacity={symbolOpacity * 0.4}
                  filter={`drop-shadow(0 0 32px ${elementColor})`}
                >
                  {sign.symbol}
                </text>
                
                {/* Main text on top */}
                <text
                  x={symbolX}
                  y={symbolY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="36px"
                  fontFamily={fonts.display}
                  fill={primaryTextColor}
                  opacity={symbolOpacity}
                >
                  {sign.symbol}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
};
