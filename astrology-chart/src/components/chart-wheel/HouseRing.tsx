import React from 'react';

interface HouseRingProps {
  houseRadius: number;
  aspectAreaRadius: number;
  strokeColor: string;
  houseRingGradientId: string;
}

export const HouseRing: React.FC<HouseRingProps> = ({
  houseRadius,
  aspectAreaRadius,
  strokeColor,
  houseRingGradientId
}) => {
  return (
    <g className="house-ring">
      {/* Inner circle (house wheel) edge */}
      <circle
        r={houseRadius}
        fill="none"
        stroke={strokeColor}
        strokeWidth={1.5}
      />
      
      {/* Ring between house wheel and aspect area with gradient */}
      <path
        d={`M 0,${-aspectAreaRadius} A ${aspectAreaRadius},${aspectAreaRadius} 0 1,1 0,${aspectAreaRadius} A ${aspectAreaRadius},${aspectAreaRadius} 0 1,1 0,${-aspectAreaRadius} M 0,${-houseRadius} A ${houseRadius},${houseRadius} 0 1,0 0,${houseRadius} A ${houseRadius},${houseRadius} 0 1,0 0,${-houseRadius}`}
        fill={`url(#${houseRingGradientId})`}
        opacity={0.9}
      />
    </g>
  );
};
