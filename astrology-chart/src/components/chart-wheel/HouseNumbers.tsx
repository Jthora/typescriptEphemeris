import React from 'react';

interface HouseNumbersProps {
  houses: any[];
  houseRadius: number;
  aspectAreaRadius: number;
  fonts: any;
  secondaryTextColor: string;
}

export const HouseNumbers: React.FC<HouseNumbersProps> = ({
  houses,
  houseRadius,
  aspectAreaRadius,
  fonts,
  secondaryTextColor
}) => {
  const houseTextRadius = (houseRadius + aspectAreaRadius) / 2;

  return (
    <g className="house-numbers">
      {houses.map((house, index) => {
        // Get current house cusp and next house cusp
        const houseCusp = house.cusp;
        const nextCusp = houses[(index + 1) % 12].cusp;
        
        // Calculate the midpoint between the current house cusp and the next one,
        // taking into account the possible angle wrap-around
        let midpoint;
        
        // Handle the case where we cross the 0° mark
        if (nextCusp < houseCusp) {
          // We've crossed the 0° point, so we need to add 360 to nextCusp to get the correct midpoint
          midpoint = (houseCusp + (nextCusp + 360 - houseCusp) / 2) % 360;
        } else {
          midpoint = houseCusp + (nextCusp - houseCusp) / 2;
        }
        
        const houseAngle = (midpoint - 90) * (Math.PI / 180);
        const textX = Math.cos(houseAngle) * houseTextRadius;
        const textY = Math.sin(houseAngle) * houseTextRadius;
        
        return (
          <text
            key={index}
            x={textX}
            y={textY}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="14px"
            fontFamily={fonts.body}
            fill={secondaryTextColor}
          >
            {index + 1}
          </text>
        );
      })}
    </g>
  );
};
