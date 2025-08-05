import React from 'react';

export interface PieChartSegment {
  label: string;
  value: number;
  color: string;
  percentage: number;
}

interface PieChartProps {
  segments: PieChartSegment[];
  size?: number;
  title?: string;
  showLabels?: boolean;
  className?: string;
}

/**
 * Simple SVG-based pie chart component
 */
export const PieChart: React.FC<PieChartProps> = ({
  segments,
  size = 120,
  title,
  showLabels = true,
  className = ''
}) => {
  const radius = size / 2 - 10; // Leave some padding
  const center = size / 2;
  
  // Calculate cumulative angles for each segment
  let cumulativeAngle = 0;
  const segmentsWithAngles = segments.map(segment => {
    const startAngle = cumulativeAngle;
    const angle = (segment.percentage / 100) * 360;
    cumulativeAngle += angle;
    
    return {
      ...segment,
      startAngle,
      endAngle: cumulativeAngle,
      angle
    };
  });

  // Convert angle to SVG path coordinates
  const getCoordinatesForAngle = (angle: number) => {
    const radian = (angle - 90) * (Math.PI / 180); // -90 to start from top
    return {
      x: center + radius * Math.cos(radian),
      y: center + radius * Math.sin(radian)
    };
  };

  // Create SVG path for each segment
  const createPath = (startAngle: number, endAngle: number) => {
    const start = getCoordinatesForAngle(startAngle);
    const end = getCoordinatesForAngle(endAngle);
    
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
    
    return [
      `M ${center} ${center}`, // Move to center
      `L ${start.x} ${start.y}`, // Line to start
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`, // Arc to end
      'Z' // Close path
    ].join(' ');
  };

  return (
    <div className={`pie-chart ${className}`}>
      {title && <h4 className="pie-chart-title">{title}</h4>}
      
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {segmentsWithAngles.map((segment, index) => (
          <g key={segment.label}>
            <path
              d={createPath(segment.startAngle, segment.endAngle)}
              fill={segment.color}
              stroke="var(--color-border)"
              strokeWidth="1"
              className="pie-segment"
              title={`${segment.label}: ${segment.percentage.toFixed(1)}%`}
            />
            
            {/* Add percentage labels if enabled and segment is large enough */}
            {showLabels && segment.percentage > 8 && (
              <text
                x={getCoordinatesForAngle(segment.startAngle + segment.angle / 2).x}
                y={getCoordinatesForAngle(segment.startAngle + segment.angle / 2).y}
                textAnchor="middle"
                dominantBaseline="central"
                className="pie-label"
                fontSize="10"
                fill="var(--color-text-primary)"
                fontWeight="600"
              >
                {segment.percentage.toFixed(0)}%
              </text>
            )}
          </g>
        ))}
      </svg>
      
      {/* Legend */}
      <div className="pie-legend">
        {segments.map((segment, index) => (
          <div key={segment.label} className="pie-legend-item">
            <div 
              className="pie-legend-color"
              style={{ backgroundColor: segment.color }}
            />
            <span className="pie-legend-label">{segment.label}</span>
            <span className="pie-legend-value">{segment.percentage.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
