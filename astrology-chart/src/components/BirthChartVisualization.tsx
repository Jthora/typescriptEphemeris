import React, { forwardRef } from 'react';
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
  /** Notified when responsive square size changes */
  onSizeChange?: (size: number) => void;
}

/**
 * BirthChartVisualization
 * Now a lightweight orchestrator composing the reusable layout primitives.
 */
const BirthChartVisualization = forwardRef<SVGSVGElement, BirthChartVisualizationProps>(({
  chart,
  minSize = 260,
  maxSize = 1800,
  padding = 0,
  onSizeChange
}, ref) => {
  return (
    <div className="birth-chart-visualization">
      <div className="chart-wheel-container" style={{ width: '100%', height: '100%' }}>
        <ResponsiveSquare min={minSize} max={maxSize} padding={padding} onSizeChange={onSizeChange}>
          {(size) => (
            <ChartViewport size={size} frame>
              <ChartWheel ref={ref} chart={chart} width={size} height={size} />
            </ChartViewport>
          )}
        </ResponsiveSquare>
      </div>
    </div>
  );
});

BirthChartVisualization.displayName = 'BirthChartVisualization';

export default BirthChartVisualization;
