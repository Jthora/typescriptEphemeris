import React from 'react';

interface ChartBackgroundProps {
  radius: number;
  gridPatternId: string;
}

export const ChartBackground: React.FC<ChartBackgroundProps> = ({
  radius,
  gridPatternId
}) => {
  return (
    <circle
      r={radius + 20}
      fill={`url(#${gridPatternId})`}
      opacity={0.8}
    />
  );
};
