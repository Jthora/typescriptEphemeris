import React from 'react';

interface ChartAnglesProps {
  chart: any;
  radius: number;
  fonts: any;
  primaryTextColor: string;
  strokeColor: string;
  cosmicSymbols: any;
  getThemeColor: (name: string) => string;
}

// Utility function for chart angles
const mapAngleNameToSymbol = (name: string): string => {
  if (name === 'ascendant') return 'ASC';
  if (name === 'descendant') return 'DSC'; 
  if (name === 'midheaven') return 'MC';
  if (name === 'imumCoeli') return 'IC';
  return name.toUpperCase();
};

export const ChartAngles: React.FC<ChartAnglesProps> = ({
  chart,
  radius,
  fonts,
  primaryTextColor,
  strokeColor,
  cosmicSymbols,
  getThemeColor
}) => {
  // Place angles even further out for maximum visibility
  const angleRadius = radius * 1.08; // Outermost rim (beyond zodiac symbols)

  if (!chart.angles) {
    return null;
  }

  return (
    <g className="chart-angles">
      {Object.entries(chart.angles).map(([key, angle]: [string, any]) => {
        const anglePos = (angle.longitude - 90) * (Math.PI / 180);
        const x = Math.cos(anglePos) * angleRadius;
        const y = Math.sin(anglePos) * angleRadius;
        
        // Map angle name to symbol code
        const symbolKey = mapAngleNameToSymbol(key);
        
        const angleSymbols = cosmicSymbols?.angles;
        const angleSymbol = angleSymbols?.[symbolKey as keyof typeof angleSymbols];
        
        if (!angleSymbol) {
          // Create a fallback symbol using theme colors
          let fallbackColor;
          if (key === 'ascendant') fallbackColor = getThemeColor('error'); // ASC
          else if (key === 'descendant') fallbackColor = getThemeColor('warning'); // DSC
          else if (key === 'midheaven') fallbackColor = getThemeColor('success'); // MC
          else if (key === 'imumCoeli') fallbackColor = getThemeColor('info'); // IC
          else fallbackColor = getThemeColor('primary'); // Default
          
          return (
            <g key={key} className="chart-angle fallback">
              {/* Draw a circle with theme-aware gradient */}
              <circle
                cx={x}
                cy={y}
                r={24}
                fill="url(#angleGradient)"
                stroke={strokeColor}
                strokeWidth={1}
              />
              
              {/* Add the angle text (ASC, DSC, MC, IC) */}
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="16px"
                fontWeight="bold"
                fill={fallbackColor}
              >
                {symbolKey}
              </text>
            </g>
          );
        }
        
        // Use the original color but make sure it's visible on both light and dark themes
        const textColor = angleSymbol.color || getThemeColor('primary');
        
        // Line start position for connecting line
        const lineStartRadius = radius * 0.95;
        const lineStartX = Math.cos(anglePos) * lineStartRadius;
        const lineStartY = Math.sin(anglePos) * lineStartRadius;

        return (
          <g key={key} className="chart-angle">
            {/* Add a circle background with theme-aware gradient */}
            <circle
              cx={x}
              cy={y}
              r={24}
              fill="url(#angleGradient)"
              stroke={strokeColor}
              strokeWidth={1}
            />
            
            {/* Render the angle text (ASC, DSC, MC, IC) */}
            <text
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={angleSymbol.fontSize || '16px'}
              fontWeight={angleSymbol.fontWeight || 'bold'}
              fill={textColor}
            >
              {angleSymbol.symbol}
            </text>
            
            {/* Add a line connecting from the wheel to the angle symbol */}
            <line
              x1={lineStartX}
              y1={lineStartY}
              x2={x}
              y2={y}
              stroke={textColor}
              strokeWidth={1.5}
              strokeDasharray="3,2"
              opacity={0.7}
            />
          </g>
        );
      })}
    </g>
  );
};
