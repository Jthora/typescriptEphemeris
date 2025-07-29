import React from 'react';
import type { AstrologyChart } from '../../astrology';

interface LunarNodesProps {
  chart: AstrologyChart;
  radius: number;
  fonts: any;
  secondaryTextColor: string;
}

export const LunarNodes: React.FC<LunarNodesProps> = ({
  chart,
  radius,
  fonts,
  secondaryTextColor
}) => {
  // Position nodes and additional points just outside the zodiac rim
  const nodeRadius = radius * 1.05;
  // Aspect area radius (outer edge of aspect area)
  const aspectAreaRadius = radius * 0.5;

  if (!chart.nodes.northNode) {
    return null;
  }

  return (
    <g className="lunar-nodes-and-points">
      {/* North Node */}
      <text
        x={Math.cos((chart.nodes.northNode.longitude - 90) * (Math.PI / 180)) * nodeRadius}
        y={Math.sin((chart.nodes.northNode.longitude - 90) * (Math.PI / 180)) * nodeRadius}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="18px"
        fontFamily={fonts.display}
        fill={secondaryTextColor}
        opacity={0.9}
      >
        {chart.nodes.northNode.symbol}
      </text>

      {/* South Node */}
      <text
        x={Math.cos((chart.nodes.southNode.longitude - 90) * (Math.PI / 180)) * nodeRadius}
        y={Math.sin((chart.nodes.southNode.longitude - 90) * (Math.PI / 180)) * nodeRadius}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="18px"
        fontFamily={fonts.display}
        fill={secondaryTextColor}
        opacity={0.9}
      >
        {chart.nodes.southNode.symbol}
      </text>

      {/* Black Moon Lilith (if available) */}
      {chart.additionalPoints?.blackMoonLilith && (
        <text
          x={Math.cos((chart.additionalPoints.blackMoonLilith.longitude - 90) * (Math.PI / 180)) * nodeRadius}
          y={Math.sin((chart.additionalPoints.blackMoonLilith.longitude - 90) * (Math.PI / 180)) * nodeRadius}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="18px"
          fontFamily={fonts.display}
          fill="#FFFFFF"
          opacity={0.9}
        >
          ⚸
        </text>
      )}

      {/* White Moon Selena (if available) */}
      {chart.additionalPoints?.whiteMoonSelena && (
        <text
          x={Math.cos((chart.additionalPoints.whiteMoonSelena.longitude - 90) * (Math.PI / 180)) * nodeRadius}
          y={Math.sin((chart.additionalPoints.whiteMoonSelena.longitude - 90) * (Math.PI / 180)) * nodeRadius}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="18px"
          fontFamily={fonts.display}
          fill="#FFFFFF"
          opacity={0.8}
        >
          ⊙
        </text>
      )}

      {/* Dotted lines from zodiac rim to aspect area edge */}
      {/* North Node dotted line */}
      <g>
        <defs>
          <linearGradient
            id="northNodeLineGradient"
            x1={Math.cos((chart.nodes.northNode.longitude - 90) * (Math.PI / 180)) * radius}
            y1={Math.sin((chart.nodes.northNode.longitude - 90) * (Math.PI / 180)) * radius}
            x2={Math.cos((chart.nodes.northNode.longitude - 90) * (Math.PI / 180)) * aspectAreaRadius}
            y2={Math.sin((chart.nodes.northNode.longitude - 90) * (Math.PI / 180)) * aspectAreaRadius}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={secondaryTextColor} stopOpacity={0.5} />
            <stop offset="100%" stopColor={secondaryTextColor} stopOpacity={0} />
          </linearGradient>
        </defs>
        <line
          x1={Math.cos((chart.nodes.northNode.longitude - 90) * (Math.PI / 180)) * radius}
          y1={Math.sin((chart.nodes.northNode.longitude - 90) * (Math.PI / 180)) * radius}
          x2={Math.cos((chart.nodes.northNode.longitude - 90) * (Math.PI / 180)) * aspectAreaRadius}
          y2={Math.sin((chart.nodes.northNode.longitude - 90) * (Math.PI / 180)) * aspectAreaRadius}
          stroke="url(#northNodeLineGradient)"
          strokeWidth="1"
          strokeDasharray="1,2"
        />
      </g>

      {/* South Node dotted line */}
      <g>
        <defs>
          <linearGradient
            id="southNodeLineGradient"
            x1={Math.cos((chart.nodes.southNode.longitude - 90) * (Math.PI / 180)) * radius}
            y1={Math.sin((chart.nodes.southNode.longitude - 90) * (Math.PI / 180)) * radius}
            x2={Math.cos((chart.nodes.southNode.longitude - 90) * (Math.PI / 180)) * aspectAreaRadius}
            y2={Math.sin((chart.nodes.southNode.longitude - 90) * (Math.PI / 180)) * aspectAreaRadius}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={secondaryTextColor} stopOpacity={0.5} />
            <stop offset="100%" stopColor={secondaryTextColor} stopOpacity={0} />
          </linearGradient>
        </defs>
        <line
          x1={Math.cos((chart.nodes.southNode.longitude - 90) * (Math.PI / 180)) * radius}
          y1={Math.sin((chart.nodes.southNode.longitude - 90) * (Math.PI / 180)) * radius}
          x2={Math.cos((chart.nodes.southNode.longitude - 90) * (Math.PI / 180)) * aspectAreaRadius}
          y2={Math.sin((chart.nodes.southNode.longitude - 90) * (Math.PI / 180)) * aspectAreaRadius}
          stroke="url(#southNodeLineGradient)"
          strokeWidth="1"
          strokeDasharray="1,2"
        />
      </g>

      {/* Black Moon Lilith dotted line (if available) */}
      {chart.additionalPoints?.blackMoonLilith && (
        <g>
          <defs>
            <linearGradient
              id="blackMoonLineGradient"
              x1={Math.cos((chart.additionalPoints.blackMoonLilith.longitude - 90) * (Math.PI / 180)) * radius}
              y1={Math.sin((chart.additionalPoints.blackMoonLilith.longitude - 90) * (Math.PI / 180)) * radius}
              x2={Math.cos((chart.additionalPoints.blackMoonLilith.longitude - 90) * (Math.PI / 180)) * aspectAreaRadius}
              y2={Math.sin((chart.additionalPoints.blackMoonLilith.longitude - 90) * (Math.PI / 180)) * aspectAreaRadius}
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <line
            x1={Math.cos((chart.additionalPoints.blackMoonLilith.longitude - 90) * (Math.PI / 180)) * radius}
            y1={Math.sin((chart.additionalPoints.blackMoonLilith.longitude - 90) * (Math.PI / 180)) * radius}
            x2={Math.cos((chart.additionalPoints.blackMoonLilith.longitude - 90) * (Math.PI / 180)) * aspectAreaRadius}
            y2={Math.sin((chart.additionalPoints.blackMoonLilith.longitude - 90) * (Math.PI / 180)) * aspectAreaRadius}
            stroke="url(#blackMoonLineGradient)"
            strokeWidth="1"
            strokeDasharray="1,2"
          />
        </g>
      )}

      {/* White Moon Selena dotted line (if available) */}
      {chart.additionalPoints?.whiteMoonSelena && (
        <g>
          <defs>
            <linearGradient
              id="whiteMoonLineGradient"
              x1={Math.cos((chart.additionalPoints.whiteMoonSelena.longitude - 90) * (Math.PI / 180)) * radius}
              y1={Math.sin((chart.additionalPoints.whiteMoonSelena.longitude - 90) * (Math.PI / 180)) * radius}
              x2={Math.cos((chart.additionalPoints.whiteMoonSelena.longitude - 90) * (Math.PI / 180)) * aspectAreaRadius}
              y2={Math.sin((chart.additionalPoints.whiteMoonSelena.longitude - 90) * (Math.PI / 180)) * aspectAreaRadius}
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <line
            x1={Math.cos((chart.additionalPoints.whiteMoonSelena.longitude - 90) * (Math.PI / 180)) * radius}
            y1={Math.sin((chart.additionalPoints.whiteMoonSelena.longitude - 90) * (Math.PI / 180)) * radius}
            x2={Math.cos((chart.additionalPoints.whiteMoonSelena.longitude - 90) * (Math.PI / 180)) * aspectAreaRadius}
            y2={Math.sin((chart.additionalPoints.whiteMoonSelena.longitude - 90) * (Math.PI / 180)) * aspectAreaRadius}
            stroke="url(#whiteMoonLineGradient)"
            strokeWidth="1"
            strokeDasharray="1,2"
          />
        </g>
      )}
    </g>
  );
};
