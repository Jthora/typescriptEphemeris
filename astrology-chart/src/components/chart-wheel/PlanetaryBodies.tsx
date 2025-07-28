import React from 'react';

interface PlanetaryBodiesProps {
  bodies: any[];
  houseRadius: number;
  aspectAreaRadius: number;
  width: number;
  fonts: any;
  primaryTextColor: string;
  surfaceColor: string;
  scaleImageSizeForViewport: (baseSize: number, width: number) => number;
  planetImages: any;
  cosmicSymbols: any;
  getThemeColor: (name: string) => string;
}

export const PlanetaryBodies: React.FC<PlanetaryBodiesProps> = ({
  bodies,
  houseRadius,
  aspectAreaRadius,
  width,
  fonts,
  primaryTextColor,
  surfaceColor,
  scaleImageSizeForViewport,
  planetImages,
  cosmicSymbols,
  getThemeColor
}) => {
  // Position planets inside the aspect area, near the edge but not on it
  const basePlanetRadius = aspectAreaRadius * 0.85;
  
  // Intelligent collision detection and radius adjustment
  const resolveCollisions = (bodies: any[], baseRadius: number, minSeparation: number = 18) => {
    const planetPositions = bodies.map((body, index) => {
      const angle = (body.longitude - 90) * (Math.PI / 180);
      return {
        index,
        body,
        angle,
        radius: baseRadius,
        x: Math.cos(angle) * baseRadius,
        y: Math.sin(angle) * baseRadius,
        layer: 0 // Track which radius layer this planet is on
      };
    });

    // Sort by longitude for easier collision detection
    planetPositions.sort((a, b) => a.body.longitude - b.body.longitude);

    // Multi-pass collision resolution for handling 3+ overlapping planets
    let maxIterations = 6;
    let hasCollisions = true;
    
    while (hasCollisions && maxIterations > 0) {
      hasCollisions = false;
      maxIterations--;
      
      for (let i = 0; i < planetPositions.length; i++) {
        for (let j = i + 1; j < planetPositions.length; j++) {
          const planet1 = planetPositions[i];
          const planet2 = planetPositions[j];
          
          // Calculate distance between planets
          const dx = planet1.x - planet2.x;
          const dy = planet1.y - planet2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < minSeparation) {
            hasCollisions = true;
            
            // Move the planet that's later in longitude order
            const planetToMove = planet2;
            planetToMove.layer++;
            
            // Use smaller, more refined layer offsets for tighter clustering
            const layerOffset = Math.ceil(planetToMove.layer / 2) * 12; // Reduced from 20 to 12
            const isInnerLayer = planetToMove.layer % 2 === 1;
            planetToMove.radius = baseRadius + (isInnerLayer ? -layerOffset : layerOffset);
            
            // Tighter minimum radius constraint to keep planets closer
            planetToMove.radius = Math.max(planetToMove.radius, baseRadius * 0.7); // Increased from 0.5 to 0.7
            
            // Recalculate position
            planetToMove.x = Math.cos(planetToMove.angle) * planetToMove.radius;
            planetToMove.y = Math.sin(planetToMove.angle) * planetToMove.radius;
          }
        }
      }
    }

    return planetPositions;
  };

  const resolvedPlanets = resolveCollisions(bodies, basePlanetRadius);

  return (
    <g className="planetary-bodies">
      {resolvedPlanets.map((planetData) => {
        const { body, x: bodyX, y: bodyY, index } = planetData;
        
        // Get planet name and image data
        const zodiacIndex = Math.floor(body.longitude / 30);
        const planetName = body.name.toLowerCase();
        const planetImage = planetImages[planetName];
        const baseSize = planetImage?.size || 32;
        const planetSize = scaleImageSizeForViewport(baseSize, width);

        // Get planet color based on classical element of zodiac sign
        const elementColors = {
          fire: '#ff4444',    // Red for Fire signs (Aries, Leo, Sagittarius)
          earth: '#44ff44',   // Green for Earth signs (Taurus, Virgo, Capricorn)
          air: '#ffff44',     // Yellow for Air signs (Gemini, Libra, Aquarius)
          water: '#4444ff'    // Blue for Water signs (Cancer, Scorpio, Pisces)
        };
        
        const elementMapping = [
          'fire',  // Aries
          'earth', // Taurus
          'air',   // Gemini
          'water', // Cancer
          'fire',  // Leo
          'earth', // Virgo
          'air',   // Libra
          'water', // Scorpio
          'fire',  // Sagittarius
          'earth', // Capricorn
          'air',   // Aquarius
          'water'  // Pisces
        ];
        
        const element = elementMapping[zodiacIndex] as keyof typeof elementColors;
        const planetColor = elementColors[element];

        // Calculate line endpoints for radial line to house ring edge
        const lineStartX = bodyX;
        const lineStartY = bodyY;
        const lineEndX = Math.cos(planetData.angle) * houseRadius;
        const lineEndY = Math.sin(planetData.angle) * houseRadius;
        
        // Create gradient for fading line
        const lineGradientId = `planet-line-gradient-${index}`;

        return (
          <g
            key={`${body.name}-${index}`}
            className="planetary-body"
            opacity={1.0}
          >
            {/* Gradient definition for planet radial line */}
            <defs>
              <linearGradient
                id={lineGradientId}
                x1={lineStartX}
                y1={lineStartY}
                x2={lineEndX}
                y2={lineEndY}
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor={planetColor} stopOpacity={0.8} />
                <stop offset="100%" stopColor={planetColor} stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Radial line from planet to house ring edge */}
            <line
              x1={lineStartX}
              y1={lineStartY}
              x2={lineEndX}
              y2={lineEndY}
              stroke={`url(#${lineGradientId})`}
              strokeWidth={1}
              opacity={0.6}
            />

            {/* Planet glow effect */}
            <circle
              cx={bodyX}
              cy={bodyY}
              r={8}
              fill={planetColor}
              stroke={surfaceColor}
              strokeWidth={1}
              opacity={0.8}
            />
            
            {/* Planet symbol */}
            {planetImage?.image ? (
              <g transform={`translate(${bodyX}, ${bodyY})`}>
                <image
                  href={planetImage.image}
                  x={-planetSize / 2}
                  y={-planetSize / 2}
                  width={planetSize}
                  height={planetSize}
                  style={{ transformOrigin: 'center' }}
                  onError={() => {
                    console.error(`Failed to load planet image for ${body.name}`);
                  }}
                />
              </g>
            ) : (
              <g transform={`translate(${bodyX}, ${bodyY})`}>
                <text
                  x={0}
                  y={0}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="12px"
                  fontFamily={fonts.display}
                  fill={surfaceColor}
                  fontWeight="bold"
                  style={{ transformOrigin: 'center' }}
                >
                  {body.symbol}
                </text>
              </g>
            )}

            {/* Retrograde indicator */}
            {body.retrograde && (
              <g transform={`translate(${bodyX + 12}, ${bodyY - 8})`}>
                <text
                  x={0}
                  y={0}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="8px"
                  fill={getThemeColor('warning') || '#ff6b00'}
                  style={{ transformOrigin: 'center' }}
                >
                  ℞
                </text>
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
};
