import React, { useMemo } from 'react';
import { PieChart, type PieChartSegment } from './PieChart';
import { ZODIAC_SIGNS, type AstrologyChart } from '../../astrology';

interface ElementDistributionProps {
  chart: AstrologyChart;
}

/**
 * Element colors using traditional astrological correspondences
 */
const ELEMENT_COLORS = {
  'Fire': '#FF4757',       // Red - passionate, energetic
  'Earth': '#0AE173',      // Green - natural, grounded  
  'Air': '#00A8FF',        // Blue - mental, communicative
  'Water': '#FFC107'       // Yellow - emotional, flowing
};

/**
 * Displays the distribution of planets across the four classical elements
 */
export const ElementDistribution: React.FC<ElementDistributionProps> = ({ chart }) => {
  const elementData = useMemo(() => {
    // Count planets in each element
    const elementCounts = {
      'Fire': 0,
      'Earth': 0,
      'Air': 0,
      'Water': 0
    };

    // Count all bodies including planets, nodes, and angles
    const allBodies = [
      ...chart.bodies,
      chart.nodes.northNode,
      chart.angles.ascendant,
      chart.angles.midheaven
    ];

    allBodies.forEach(body => {
      const sign = ZODIAC_SIGNS.find(s => s.name === body.sign);
      if (sign && elementCounts.hasOwnProperty(sign.element)) {
        elementCounts[sign.element as keyof typeof elementCounts]++;
      }
    });

    const total = Object.values(elementCounts).reduce((sum, count) => sum + count, 0);
    
    // Convert to pie chart segments
    const segments: PieChartSegment[] = Object.entries(elementCounts)
      .filter(([_, count]) => count > 0) // Only show elements that have bodies
      .map(([element, count]) => ({
        label: element,
        value: count,
        color: ELEMENT_COLORS[element as keyof typeof ELEMENT_COLORS],
        percentage: (count / total) * 100
      }))
      .sort((a, b) => b.value - a.value); // Sort by count descending

    return segments;
  }, [chart]);

  return (
    <PieChart
      segments={elementData}
      title="Elements"
      size={140}
      className="element-distribution-chart"
      showLabels={true}
    />
  );
};
