import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { AstrologyChart } from '../astrology';
import { ZODIAC_SIGNS, PLANET_SYMBOLS } from '../astrology';

interface ChartWheelProps {
  chart: AstrologyChart;
  width?: number;
  height?: number;
}

export const ChartWheel: React.FC<ChartWheelProps> = ({ 
  chart, 
  width = 600, 
  height = 600 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !chart) return;

    console.log('🎨 ChartWheel rendering with chart:', chart);
    console.log('📊 Bodies to render:', chart.bodies.length);
    chart.bodies.forEach((body, index) => {
      console.log(`  ${index + 1}. ${body.name}: ${body.longitude.toFixed(2)}° (${body.sign})`);
    });

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous chart

    const radius = Math.min(width, height) / 2 - 40;
    const centerX = width / 2;
    const centerY = height / 2;

    // Create main group
    const g = svg.append('g')
      .attr('transform', `translate(${centerX}, ${centerY})`);

    // Draw outer circle (zodiac wheel)
    g.append('circle')
      .attr('r', radius)
      .attr('fill', 'none')
      .attr('stroke', '#333')
      .attr('stroke-width', 2);

    // Draw inner circle (house wheel)
    const houseRadius = radius * 0.7;
    g.append('circle')
      .attr('r', houseRadius)
      .attr('fill', 'none')
      .attr('stroke', '#666')
      .attr('stroke-width', 1);

    // Draw zodiac sign divisions
    for (let i = 0; i < 12; i++) {
      const angle = (i * 30 - 90) * (Math.PI / 180); // Start from Aries at top
      const x1 = Math.cos(angle) * houseRadius;
      const y1 = Math.sin(angle) * houseRadius;
      const x2 = Math.cos(angle) * radius;
      const y2 = Math.sin(angle) * radius;

      g.append('line')
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2)
        .attr('stroke', '#ccc')
        .attr('stroke-width', 1);

      // Add zodiac sign symbols
      const symbolAngle = ((i * 30) + 15 - 90) * (Math.PI / 180);
      const symbolRadius = radius - 20;
      const symbolX = Math.cos(symbolAngle) * symbolRadius;
      const symbolY = Math.sin(symbolAngle) * symbolRadius;

      g.append('text')
        .attr('x', symbolX)
        .attr('y', symbolY)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '20px')
        .attr('font-family', 'serif')
        .attr('fill', '#666')
        .text(ZODIAC_SIGNS[i].symbol);

      // Add sign names
      const nameRadius = radius - 45;
      const nameX = Math.cos(symbolAngle) * nameRadius;
      const nameY = Math.sin(symbolAngle) * nameRadius;

      g.append('text')
        .attr('x', nameX)
        .attr('y', nameY)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '10px')
        .attr('font-family', 'sans-serif')
        .attr('fill', '#999')
        .text(ZODIAC_SIGNS[i].name);
    }

    // Draw house divisions
    for (let i = 0; i < 12; i++) {
      const houseCusp = chart.houses.cusps[i];
      const angle = (houseCusp - 90) * (Math.PI / 180);
      const x1 = 0;
      const y1 = 0;
      const x2 = Math.cos(angle) * houseRadius;
      const y2 = Math.sin(angle) * houseRadius;

      g.append('line')
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2)
        .attr('stroke', '#999')
        .attr('stroke-width', i % 3 === 0 ? 2 : 1) // Thicker lines for angular houses
        .attr('opacity', 0.7);

      // Add house numbers
      const houseAngle = ((houseCusp + (chart.houses.cusps[(i + 1) % 12] - houseCusp) / 2) - 90) * (Math.PI / 180);
      const houseNumberRadius = houseRadius * 0.5;
      const houseX = Math.cos(houseAngle) * houseNumberRadius;
      const houseY = Math.sin(houseAngle) * houseNumberRadius;

      g.append('text')
        .attr('x', houseX)
        .attr('y', houseY)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '12px')
        .attr('font-family', 'sans-serif')
        .attr('fill', '#666')
        .attr('font-weight', 'bold')
        .text((i + 1).toString());
    }

    // Draw planets
    chart.bodies.forEach((body, index) => {
      const planetRadius = radius * 0.85;
      const angle = (body.longitude - 90) * (Math.PI / 180);
      let x = Math.cos(angle) * planetRadius;
      let y = Math.sin(angle) * planetRadius;

      // Adjust position to avoid overlaps (simplified)
      const adjustmentAngle = (index * 5) * (Math.PI / 180);
      x += Math.cos(adjustmentAngle) * 5;
      y += Math.sin(adjustmentAngle) * 5;

      // Planet circle
      const planetColor = PLANET_SYMBOLS[body.name as keyof typeof PLANET_SYMBOLS]?.color || '#333';
      
      g.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 8)
        .attr('fill', planetColor)
        .attr('stroke', '#fff')
        .attr('stroke-width', 1)
        .attr('opacity', 0.8);

      // Planet symbol
      g.append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '12px')
        .attr('font-family', 'serif')
        .attr('fill', '#fff')
        .attr('font-weight', 'bold')
        .text(body.symbol);

      // Retrograde indicator
      if (body.retrograde) {
        g.append('text')
          .attr('x', x + 12)
          .attr('y', y - 8)
          .attr('text-anchor', 'middle')
          .attr('font-size', '8px')
          .attr('fill', '#ff0000')
          .text('℞');
      }

      // Draw line from planet to center (optional)
      g.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', Math.cos(angle) * (houseRadius + 5))
        .attr('y2', Math.sin(angle) * (houseRadius + 5))
        .attr('stroke', planetColor)
        .attr('stroke-width', 1)
        .attr('opacity', 0.3);
    });

    // Draw lunar nodes
    if (chart.nodes.northNode) {
      const nodeRadius = radius * 0.9;
      
      // North Node
      const northAngle = (chart.nodes.northNode.longitude - 90) * (Math.PI / 180);
      const northX = Math.cos(northAngle) * nodeRadius;
      const northY = Math.sin(northAngle) * nodeRadius;
      
      g.append('text')
        .attr('x', northX)
        .attr('y', northY)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '16px')
        .attr('font-family', 'serif')
        .attr('fill', '#666')
        .text(chart.nodes.northNode.symbol);

      // South Node
      const southAngle = (chart.nodes.southNode.longitude - 90) * (Math.PI / 180);
      const southX = Math.cos(southAngle) * nodeRadius;
      const southY = Math.sin(southAngle) * nodeRadius;
      
      g.append('text')
        .attr('x', southX)
        .attr('y', southY)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '16px')
        .attr('font-family', 'serif')
        .attr('fill', '#666')
        .text(chart.nodes.southNode.symbol);
    }

    // Draw major aspects
    chart.aspects.forEach(aspect => {
      if (['Conjunction', 'Opposition', 'Trine', 'Square', 'Sextile'].includes(aspect.type)) {
        
        const body1 = chart.bodies.find(b => b.name === aspect.body1);
        const body2 = chart.bodies.find(b => b.name === aspect.body2);
        
        if (body1 && body2) {
          const angle1 = (body1.longitude - 90) * (Math.PI / 180);
          const angle2 = (body2.longitude - 90) * (Math.PI / 180);
          const aspectRadius = houseRadius * 0.3;
          
          const x1 = Math.cos(angle1) * aspectRadius;
          const y1 = Math.sin(angle1) * aspectRadius;
          const x2 = Math.cos(angle2) * aspectRadius;
          const y2 = Math.sin(angle2) * aspectRadius;
          
          // Determine aspect color based on type
          let aspectColor = '#aa0000'; // Default to challenging (red)
          if (aspect.type === 'Trine' || aspect.type === 'Sextile') {
            aspectColor = '#00aa00'; // Harmonious (green)
          }
          
          const strokeWidth = aspect.type === 'Conjunction' || aspect.type === 'Opposition' ? 2 : 1;
          
          g.append('line')
            .attr('x1', x1)
            .attr('y1', y1)
            .attr('x2', x2)
            .attr('y2', y2)
            .attr('stroke', aspectColor)
            .attr('stroke-width', strokeWidth)
            .attr('opacity', 0.6)
            .attr('stroke-dasharray', aspect.type === 'Square' ? '5,5' : 'none');
        }
      }
    });

    // Add chart title
    g.append('text')
      .attr('x', 0)
      .attr('y', -radius - 20)
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .attr('font-family', 'sans-serif')
      .attr('font-weight', 'bold')
      .attr('fill', '#333')
      .text(chart.birthData.name ? `Birth Chart for ${chart.birthData.name}` : 'Birth Chart');

    // Add birth date and location
    g.append('text')
      .attr('x', 0)
      .attr('y', radius + 30)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-family', 'sans-serif')
      .attr('fill', '#666')
      .text(`${chart.birthData.date.toLocaleString()}`);

    g.append('text')
      .attr('x', 0)
      .attr('y', radius + 45)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('font-family', 'sans-serif')
      .attr('fill', '#999')
      .text(`${chart.birthData.latitude.toFixed(2)}°, ${chart.birthData.longitude.toFixed(2)}°`);

  }, [chart, width, height]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      className="chart-wheel"
      style={{ background: '#fafafa', borderRadius: '8px' }}
    />
  );
};

export default ChartWheel;
