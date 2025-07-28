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
  const nodeRadius = radius * 0.7; // Between planets and decans

  if (!chart.nodes.northNode) {
    return null;
  }

  return (
    <g className="lunar-nodes">
      {/* North Node */}
      <text
        x={Math.cos((chart.nodes.northNode.longitude - 90) * (Math.PI / 180)) * nodeRadius}
        y={Math.sin((chart.nodes.northNode.longitude - 90) * (Math.PI / 180)) * nodeRadius}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="16px"
        fontFamily={fonts.display}
        fill={secondaryTextColor}
      >
        {chart.nodes.northNode.symbol}
      </text>

      {/* South Node */}
      <text
        x={Math.cos((chart.nodes.southNode.longitude - 90) * (Math.PI / 180)) * nodeRadius}
        y={Math.sin((chart.nodes.southNode.longitude - 90) * (Math.PI / 180)) * nodeRadius}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="16px"
        fontFamily={fonts.display}
        fill={secondaryTextColor}
      >
        {chart.nodes.southNode.symbol}
      </text>
    </g>
  );
};
