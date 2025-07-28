import React from 'react';

interface ZodiacDividerProps {
  index: number;
  houseRadius: number;
  radius: number;
  lineColor: string;
  dividerGradientId: string;
}

export const ZodiacDivider: React.FC<ZodiacDividerProps> = ({
  index,
  houseRadius,
  radius,
  lineColor,
  dividerGradientId
}) => {
  const angle = (index * 30 - 90) * (Math.PI / 180);
  const x1 = Math.cos(angle) * houseRadius;
  const y1 = Math.sin(angle) * houseRadius;
  const x2 = Math.cos(angle) * radius;
  const y2 = Math.sin(angle) * radius;

  return (
    <g className="zodiac-divider">
      <defs>
        <linearGradient
          id={dividerGradientId}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop
            offset="0%"
            stopColor={lineColor}
            stopOpacity={0.4}
          />
          <stop
            offset="100%"
            stopColor={lineColor}
            stopOpacity={0.9}
          />
        </linearGradient>
      </defs>
      
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={`url(#${dividerGradientId})`}
        strokeWidth={1.8}
        filter="url(#glow)"
      />
    </g>
  );
};
