import React from 'react';
import type { AstrologyChart } from '../astrology';
import { ChartWheelPure as ChartWheel } from './ChartWheelPure';
import { ResponsiveSquare } from './layout/ResponsiveSquare';
import { ChartViewport } from './layout/ChartViewport';
import './BirthChartVisualization.css';

interface BirthChartVisualizationProps {
  chart: AstrologyChart;
  /** Minimum chart side */
  minSize?: number;
  /** Maximum chart side */
  maxSize?: number;
  /** Inner padding in container */
  padding?: number;
}

/**
 * BirthChartVisualization
 * Now a lightweight orchestrator composing the reusable layout primitives.
 */
const BirthChartVisualization: React.FC<BirthChartVisualizationProps> = ({
  chart,
  minSize = 260,
  maxSize = 1800,
  padding = 0
}) => {
  return (
    <div className="birth-chart-visualization">
      <div className="chart-wheel-container" style={{ width: '100%', height: '100%' }}>
        <ResponsiveSquare min={minSize} max={maxSize} padding={padding}>
          {(size) => (
            <ChartViewport size={size} frame>
              <ChartWheel chart={chart} width={size} height={size} />
            </ChartViewport>
          )}
        </ResponsiveSquare>
      </div>
    </div>
  );
};

export default BirthChartVisualization;
