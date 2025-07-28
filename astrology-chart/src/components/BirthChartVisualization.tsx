import React from 'react';
import { ChartWheelPure as ChartWheel } from './ChartWheelPure';
import type { AstrologyChart } from '../astrology';
import './BirthChartVisualization.css';

interface BirthChartVisualizationProps {
  chart: AstrologyChart;
  width?: number;
  height?: number;
}

/**
 * BirthChartVisualization Component
 * Renders the astrological birth chart with no padding/margin
 * Includes hardware-style UI elements
 */
const BirthChartVisualization: React.FC<BirthChartVisualizationProps> = ({
  chart,
  width = 800,
  height = 800
}) => {
  return (
    <div className="birth-chart-visualization">
      <div className="chart-wheel-container">
        <ChartWheel chart={chart} width={width} height={height} />
        
        {/* Hardware corner elements */}
        <div className="chart-corner chart-corner-bl"></div>
        <div className="chart-corner chart-corner-br"></div>
        
        {/* Measurement lines */}
        <div className="chart-measure-line horizontal top"></div>
        <div className="chart-measure-line horizontal bottom"></div>
        <div className="chart-measure-line vertical left"></div>
        <div className="chart-measure-line vertical right"></div>
      </div>
    </div>
  );
};

export default BirthChartVisualization;
