import React from 'react';

interface HouseDividerProps {
  index: number;
  angle: number;
  aspectAreaRadius: number;
  houseRadius: number;
  strokeColor: string;
}

export const HouseDivider: React.FC<HouseDividerProps> = ({
  index,
  angle,
  aspectAreaRadius,
  houseRadius,
  strokeColor
}) => {
  const x1 = Math.cos(angle) * aspectAreaRadius;
  const y1 = Math.sin(angle) * aspectAreaRadius;
  const x2 = Math.cos(angle) * houseRadius;
  const y2 = Math.sin(angle) * houseRadius;

  return (
    <line
      className="house-divider"
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={strokeColor}
      strokeWidth={1}
      opacity={0.6}
    />
  );
};
