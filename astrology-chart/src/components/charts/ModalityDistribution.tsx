import React, { useMemo } from 'react';
import { PieChart, type PieChartSegment } from './PieChart';
import { ZODIAC_SIGNS, type AstrologyChart } from '../../astrology';

interface ModalityDistributionProps {
  chart: AstrologyChart;
}

/**
 * Modality colors reflecting their astrological nature
 */
const MODALITY_COLORS = {
  'Cardinal': '#FF4757',  // Red - initiating, action-oriented energy
  'Fixed': '#8B4513',     // Brown - stable, persistent, stubborn energy  
  'Mutable': '#03E9F4'    // Cyan - adaptable, flexible, changeable energy
};

/**
 * Displays the distribution of planets across the three modalities (qualities)
 */
export const ModalityDistribution: React.FC<ModalityDistributionProps> = ({ chart }) => {
  const modalityData = useMemo(() => {
    // Count planets in each modality
    const modalityCounts = {
      'Cardinal': 0,
      'Fixed': 0,
      'Mutable': 0
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
      if (sign && modalityCounts.hasOwnProperty(sign.quality)) {
        modalityCounts[sign.quality as keyof typeof modalityCounts]++;
      }
    });

    const total = Object.values(modalityCounts).reduce((sum, count) => sum + count, 0);
    
    // Convert to pie chart segments
    const segments: PieChartSegment[] = Object.entries(modalityCounts)
      .filter(([_, count]) => count > 0) // Only show modalities that have bodies
      .map(([modality, count]) => ({
        label: modality,
        value: count,
        color: MODALITY_COLORS[modality as keyof typeof MODALITY_COLORS],
        percentage: (count / total) * 100
      }))
      .sort((a, b) => b.value - a.value); // Sort by count descending

    return segments;
  }, [chart]);

  return (
    <PieChart
      segments={modalityData}
      title="Modalities"
      size={140}
      className="modality-distribution-chart"
      showLabels={true}
    />
  );
};
