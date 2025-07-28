import React from 'react';

interface ZodiacRingProps {
  radius: number;
  houseRadius: number;
  strokeColor: string;
  outerRingGradientId: string;
}

export const ZodiacRing: React.FC<ZodiacRingProps> = ({
  radius,
  houseRadius,
  strokeColor,
  outerRingGradientId
}) => {
  return (
    <g className="zodiac-ring">
      {/* Outer zodiac circle (outer edge) */}
      <circle
        r={radius}
        fill="none"
        stroke={strokeColor}
        strokeWidth={2}
      />
      
      {/* Ring between zodiac and house wheels with gradient */}
      <path
        d={`M 0,${-houseRadius} A ${houseRadius},${houseRadius} 0 1,1 0,${houseRadius} A ${houseRadius},${houseRadius} 0 1,1 0,${-houseRadius} M 0,${-radius} A ${radius},${radius} 0 1,0 0,${radius} A ${radius},${radius} 0 1,0 0,${-radius}`}
        fill={`url(#${outerRingGradientId})`}
        opacity={0.9}
      />
    </g>
  );
};
