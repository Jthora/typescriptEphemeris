import React from 'react';

interface AspectAreaProps {
  aspectAreaRadius: number;
  strokeColor: string;
  centerGradientId: string;
  houseData: Array<{
    index: number;
    cusp: number;
    angle: number;
  }>;
}

export const AspectArea: React.FC<AspectAreaProps> = ({
  aspectAreaRadius,
  strokeColor,
  centerGradientId,
  houseData
}) => {
  // Lines extend all the way to center, but fade starts at edge and reaches zero at halfway point

  return (
    <g className="aspect-area">
      {/* Background circle with gradient */}
      <circle
        r={aspectAreaRadius}
        fill={`url(#${centerGradientId})`}
        stroke={strokeColor}
        strokeWidth={1.5}
        opacity={1}
      />

      {/* Fading house lines extending into center */}
      {houseData.map((house) => {
        const gradientId = `house-fade-gradient-${house.index}`;
        
        return (
          <g key={`house-fade-${house.index}`}>
            {/* Create a unique gradient for each house line */}
            <defs>
              <linearGradient
                id={gradientId}
                x1={Math.cos(house.angle) * aspectAreaRadius}
                y1={Math.sin(house.angle) * aspectAreaRadius}
                x2="0"
                y2="0"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor={strokeColor} stopOpacity={0.5} />
                <stop offset="50%" stopColor={strokeColor} stopOpacity={0} />
                <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Line extending from edge all the way to center */}
            <line
              x1={Math.cos(house.angle) * aspectAreaRadius}
              y1={Math.sin(house.angle) * aspectAreaRadius}
              x2={0}
              y2={0}
              stroke={`url(#${gradientId})`}
              strokeWidth={house.index % 3 === 0 ? 2 : 1} // Thicker lines for angular houses (1, 4, 7, 10)
            />
          </g>
        );
      })}
    </g>
  );
};
