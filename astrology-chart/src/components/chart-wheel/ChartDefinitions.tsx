import React from 'react';

interface ChartDefinitionsProps {
  strokeColor: string;
  primaryTextColor: string;
  secondaryTextColor: string;
  surfaceColor: string;
  baseDarkColor: string;
  baseMediumColor: string;
}

export const ChartDefinitions: React.FC<ChartDefinitionsProps> = ({
  strokeColor,
  primaryTextColor,
  secondaryTextColor,
  surfaceColor,
  baseDarkColor,
  baseMediumColor
}) => {
  return (
    <defs>
      {/* Outer ring gradient (zodiac wheel) */}
      <radialGradient
        id="outerRingGradient"
        cx="50%"
        cy="50%"
        r="50%"
        fx="50%"
        fy="50%"
      >
        <stop offset="0%" stopColor={baseMediumColor} stopOpacity={0.8} />
        <stop offset="70%" stopColor={baseMediumColor} stopOpacity={0.7} />
        <stop offset="100%" stopColor={baseDarkColor} stopOpacity={0.6} />
      </radialGradient>

      {/* House wheel gradient */}
      <radialGradient
        id="houseRingGradient"
        cx="50%"
        cy="50%"
        r="50%"
        fx="50%"
        fy="50%"
      >
        <stop offset="0%" stopColor={baseMediumColor} stopOpacity={0.9} />
        <stop offset="80%" stopColor={baseDarkColor} stopOpacity={0.8} />
      </radialGradient>

      {/* Center area gradient */}
      <radialGradient
        id="centerGradient"
        cx="50%"
        cy="50%"
        r="50%"
        fx="50%"
        fy="50%"
      >
        <stop offset="0%" stopColor={surfaceColor} stopOpacity={1} />
        <stop offset="85%" stopColor={baseMediumColor} stopOpacity={0.95} />
        <stop offset="100%" stopColor={baseDarkColor} stopOpacity={0.9} />
      </radialGradient>

      {/* Angle gradient for chart angles background */}
      <radialGradient
        id="angleGradient"
        cx="50%"
        cy="50%"
        r="50%"
        fx="50%"
        fy="50%"
      >
        <stop offset="0%" stopColor={surfaceColor} stopOpacity={0.9} />
        <stop offset="70%" stopColor={baseMediumColor} stopOpacity={0.7} />
        <stop offset="100%" stopColor={baseDarkColor} stopOpacity={0.5} />
      </radialGradient>

      {/* Grid pattern for chart background */}
      <pattern
        id="gridPattern"
        width="20"
        height="20"
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M 0 10 H 20"
          stroke={strokeColor}
          strokeWidth="0.5"
          opacity="0.25"
        />
        <path
          d="M 10 0 V 20"
          stroke={strokeColor}
          strokeWidth="0.5"
          opacity="0.25"
        />
      </pattern>

      {/* Glow filter for highlights */}
      <filter
        id="glow"
        x="-50%"
        y="-50%"
        width="200%"
        height="200%"
      >
        <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* Simple cusp shadow gradient - reusable */}
      <radialGradient
        id="cuspShadow"
        cx="50%"
        cy="50%"
        r="50%"
        gradientUnits="objectBoundingBox"
      >
        <stop offset="0%" stopColor="black" stopOpacity={0.6} />
        <stop offset="30%" stopColor="black" stopOpacity={0.3} />
        <stop offset="70%" stopColor="black" stopOpacity={0.1} />
        <stop offset="100%" stopColor="black" stopOpacity={0} />
      </radialGradient>
    </defs>
  );
};
