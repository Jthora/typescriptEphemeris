import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { AstrologyChart } from '../astrology';
import { ZODIAC_SIGNS, PLANET_SYMBOLS } from '../astrology';
import { fonts } from '../assets';
import { cosmicSymbols } from '../assets';
import { scaleImageSizeForViewport } from '../utils/image-optimization';
import {
  ChartDefinitions,
  ChartBackground,
  ZodiacRing,
  HouseRing,
  AspectArea,
  ZodiacDivider,
  ZodiacSymbols,
  HouseDivider,
  HouseNumbers,
  PlanetaryBodies,
  AspectLines,
  ChartAngles
} from './chart-wheel';
import './CosmicSymbols.css';

// Utility functions for chart angles
const mapAngleNameToSymbol = (name: string): string => {
  if (name === 'ascendant') return 'ASC';
  if (name === 'descendant') return 'DSC'; 
  if (name === 'midheaven') return 'MC';
  if (name === 'imumCoeli') return 'IC';
  return name.toUpperCase();
};

// Calculate the smallest angular distance between two longitudes (0-360)
const getAngularDistance = (longitude1: number, longitude2: number): number => {
  // Ensure longitudes are between 0-360
  const long1 = ((longitude1 % 360) + 360) % 360;
  const long2 = ((longitude2 % 360) + 360) % 360;
  
  // Calculate the smallest angle between the two longitudes
  const directDiff = Math.abs(long1 - long2);
  return Math.min(directDiff, 360 - directDiff);
};

// Calculate opacity based on proximity to celestial bodies
const calculateSymbolOpacity = (
  symbolLongitude: number, 
  bodies: Array<{longitude: number}>, 
  baseOpacity: number = 0.1,
  maxOpacity: number = 1.0,
  orbSize: number = 15
): number => {
  if (!bodies || bodies.length === 0) return baseOpacity;
  
  // Find the closest body to this symbol
  let minDistance = 180; // Start with max possible distance
  
  bodies.forEach(body => {
    const distance = getAngularDistance(symbolLongitude, body.longitude);
    if (distance < minDistance) {
      minDistance = distance;
    }
  });
  
  // If outside the orb, return base opacity
  if (minDistance >= orbSize) return baseOpacity;
  
  // Calculate opacity based on proximity (linear scale)
  // The closer to 0 distance, the closer to maxOpacity
  const opacityIncrease = (maxOpacity - baseOpacity) * (1 - minDistance / orbSize);
  return baseOpacity + opacityIncrease;
};

// Get CSS variable value for use in SVG
const getCssVariable = (variableName: string): string => {
  return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
};

// Utility function to get theme-aware colors
const getThemeColor = (name: string): string => {
  const cssVarName = `--color-${name}`;
  return getCssVariable(cssVarName);
};

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

  // Enhanced logging to debug chart rendering
  useEffect(() => {
    if (!svgRef.current || !chart) return;

    console.log('🎨 ChartWheel rendering with chart:', chart);
    console.log('📊 Bodies to render:', chart.bodies.length);
    console.log('🔄 Chart angles:', chart.angles);
    console.log('🎭 Cosmic symbols available:', cosmicSymbols);
    console.log('🎭 Angle symbols:', cosmicSymbols?.angles);
    
    chart.bodies.forEach((body, index) => {
      console.log(`  ${index + 1}. ${body.name}: ${body.longitude.toFixed(2)}° (${body.sign})`);
    });

    // Clear previous chart
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const radius = Math.min(width, height) / 2 - 40;
    // Define the radius for the house wheel (2/3 of the main radius)
    const houseRadius = radius * 0.8;
    // Define the radius for the aspect area (inner circle)
    const aspectAreaRadius = radius * 0.5;
    
    const centerX = width / 2;
    const centerY = height / 2;

    // Get theme colors for chart elements
    const strokeColor = getThemeColor('border');
    const primaryTextColor = getThemeColor('text-primary');
    const secondaryTextColor = getThemeColor('text-secondary');
    
    // Create main group
    const g = svg.append('g')
      .attr('transform', `translate(${centerX}, ${centerY})`);

    // Render using React components (converted to D3)
    const renderReactComponentToD3 = (component: React.ReactElement, container: d3.Selection<SVGGElement, unknown, null, undefined>) => {
      // This is a placeholder - in a real implementation, you'd need to render React components to SVG
      // For now, we'll continue with the original D3 approach but organized by layers
    };

    // Layer 1: Background and definitions
    const backgroundLayer = g.append('g').attr('class', 'background-layer');
    
    // Add definitions first
    const defs = svg.append('defs');
    
    // Center area gradient
    const centerGradient = defs.append('radialGradient')
      .attr('id', 'centerGradient')
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', '50%')
      .attr('fx', '50%')
      .attr('fy', '50%');
      
    centerGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', primaryTextColor)
      .attr('stop-opacity', 0.05);
      
    centerGradient.append('stop')
      .attr('offset', '70%')
      .attr('stop-color', secondaryTextColor)
      .attr('stop-opacity', 0.1);
      
    centerGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', strokeColor)
      .attr('stop-opacity', 0.15);

    // Outer ring gradient
    const outerRingGradient = defs.append('radialGradient')
      .attr('id', 'outerRingGradient')
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', '50%')
      .attr('fx', '50%')
      .attr('fy', '50%');
      
    outerRingGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', primaryTextColor)
      .attr('stop-opacity', 0.02);
      
    outerRingGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', strokeColor)
      .attr('stop-opacity', 0.08);

    // House ring gradient
    const houseRingGradient = defs.append('radialGradient')
      .attr('id', 'houseRingGradient')
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', '50%')
      .attr('fx', '50%')
      .attr('fy', '50%');
      
    houseRingGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', primaryTextColor)
      .attr('stop-opacity', 0.03);
      
    houseRingGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', strokeColor)
      .attr('stop-opacity', 0.1);

    // Grid pattern for background
    const gridPattern = defs.append('pattern')
      .attr('id', 'gridPattern')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 40)
      .attr('height', 40);
      
    gridPattern.append('path')
      .attr('d', 'M 40 0 L 0 0 0 40')
      .attr('fill', 'none')
      .attr('stroke', strokeColor)
      .attr('stroke-width', 0.5)
      .attr('opacity', 0.3);
      
    gridPattern.append('path')
      .attr('d', 'M 0 20 L 40 20 M 20 0 L 20 40')
      .attr('fill', 'none')
      .attr('stroke', strokeColor)
      .attr('stroke-width', 0.3)
      .attr('opacity', 0.2);

    // Glow filter for zodiac dividers
    const glowFilter = defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');
      
    glowFilter.append('feGaussianBlur')
      .attr('stdDeviation', 2)
      .attr('result', 'coloredBlur');
      
    const glowMerge = glowFilter.append('feMerge');
    glowMerge.append('feMergeNode')
      .attr('in', 'coloredBlur');
    glowMerge.append('feMergeNode')
      .attr('in', 'SourceGraphic');

    // Add background rect with grid pattern
    backgroundLayer.append('circle')
      .attr('r', radius + 20)
      .attr('fill', 'url(#gridPattern)')
      .attr('opacity', 0.8);

    // Layer 2: Zodiac ring
    const zodiacLayer = g.append('g').attr('class', 'zodiac-layer');
    
    // Outer zodiac circle (outer edge)
    zodiacLayer.append('circle')
      .attr('r', radius)
      .attr('fill', 'none')
      .attr('stroke', strokeColor)
      .attr('stroke-width', 2);
    
    // Ring between zodiac and house wheels with gradient
    const outerRingArc = d3.arc<any>()
      .innerRadius(houseRadius)
      .outerRadius(radius)
      .startAngle(0)
      .endAngle(2 * Math.PI);
      
    zodiacLayer.append('path')
      .attr('d', outerRingArc as any)
      .attr('fill', 'url(#outerRingGradient)')
      .attr('opacity', 0.9);

    // Layer 3: House ring
    const houseLayer = g.append('g').attr('class', 'house-layer');
    
    // Inner circle (house wheel) edge
    houseLayer.append('circle')
      .attr('r', houseRadius)
      .attr('fill', 'none')
      .attr('stroke', strokeColor)
      .attr('stroke-width', 1.5);
      
    // Ring between house wheel and aspect area with gradient
    const houseRingArc = d3.arc<any>()
      .innerRadius(aspectAreaRadius)
      .outerRadius(houseRadius)
      .startAngle(0)
      .endAngle(2 * Math.PI);
      
    houseLayer.append('path')
      .attr('d', houseRingArc as any)
      .attr('fill', 'url(#houseRingGradient)')
      .attr('opacity', 0.9);

    // Layer 4: Zodiac dividers and symbols
    const zodiacSymbolsLayer = g.append('g').attr('class', 'zodiac-symbols-layer');
    
    // Draw zodiac sign divisions
    for (let i = 0; i < 12; i++) {
      const angle = (i * 30 - 90) * (Math.PI / 180);
      const x1 = Math.cos(angle) * houseRadius;
      const y1 = Math.sin(angle) * houseRadius;
      const x2 = Math.cos(angle) * radius;
      const y2 = Math.sin(angle) * radius;

      // Get sign element for line color
      const currentSignName = ZODIAC_SIGNS[i].name;
      const currentCosmicData = cosmicSymbols.zodiac[currentSignName as keyof typeof cosmicSymbols.zodiac];
      const lineColor = cosmicSymbols.elementColors[currentCosmicData.element as keyof typeof cosmicSymbols.elementColors];
      
      // Create a linear gradient for each sign divider line
      const dividerGradientId = `divider-gradient-${i}`;
      const dividerGradient = defs.append('linearGradient')
        .attr('id', dividerGradientId)
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '100%')
        .attr('y2', '100%');
        
      dividerGradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', lineColor)
        .attr('stop-opacity', 0.4);
        
      dividerGradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', lineColor)
        .attr('stop-opacity', 0.9);
      
      zodiacSymbolsLayer.append('line')
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2)
        .attr('stroke', `url(#${dividerGradientId})`)
        .attr('stroke-width', 1.8)
        .attr('filter', 'url(#glow)');

      // Add cosmic modality symbols for zodiac signs
      const symbolAngle = ((i * 30) + 15 - 90) * (Math.PI / 180);
      const symbolRadius = radius * 0.95;
      const symbolX = Math.cos(symbolAngle) * symbolRadius;
      const symbolY = Math.sin(symbolAngle) * symbolRadius;
      
      const signName = ZODIAC_SIGNS[i].name;
      const cosmicSymbolData = cosmicSymbols.zodiac[signName as keyof typeof cosmicSymbols.zodiac];
      
      const baseSize = cosmicSymbolData?.size || 48;
      const symbolSize = scaleImageSizeForViewport(baseSize, width);
      
      const imageUrl = cosmicSymbolData.image;
      
      const symbolGroup = zodiacSymbolsLayer.append('g')
        .attr('class', 'cosmic-symbol')
        .attr('data-sign', signName)
        .attr('data-element', cosmicSymbolData.element)
        .attr('transform', `translate(${symbolX}, ${symbolY})`);

      if (imageUrl) {
        symbolGroup.append('image')
          .attr('href', imageUrl)
          .attr('x', -symbolSize / 2)
          .attr('y', -symbolSize / 2)
          .attr('width', symbolSize)
          .attr('height', symbolSize)
          .attr('opacity', 0.9);
      } else {
        symbolGroup.append('text')
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('font-size', '24px')
          .attr('font-family', fonts.display)
          .attr('fill', primaryTextColor)
          .text(ZODIAC_SIGNS[i].symbol);
      }
    }

    // Layer 5: House dividers and numbers
    const houseNumbersLayer = g.append('g').attr('class', 'house-numbers-layer');
    
    // Draw house divisions
    for (let i = 0; i < chart.houses.cusps.length; i++) {
      const houseAngle = (chart.houses.cusps[i] - 90) * (Math.PI / 180);
      const x1 = Math.cos(houseAngle) * aspectAreaRadius;
      const y1 = Math.sin(houseAngle) * aspectAreaRadius;
      const x2 = Math.cos(houseAngle) * houseRadius;
      const y2 = Math.sin(houseAngle) * houseRadius;

      houseNumbersLayer.append('line')
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2)
        .attr('stroke', strokeColor)
        .attr('stroke-width', 1)
        .attr('opacity', 0.6);
    }

    // Add house numbers
    const houseTextRadius = (houseRadius + aspectAreaRadius) / 2;
    for (let i = 0; i < chart.houses.cusps.length; i++) {
      const houseAngle = (chart.houses.cusps[i] - 90) * (Math.PI / 180);
      const nextHouseAngle = i < chart.houses.cusps.length - 1 
        ? (chart.houses.cusps[i + 1] - 90) * (Math.PI / 180)
        : ((chart.houses.cusps[0] + 360) - 90) * (Math.PI / 180);
      
      let midAngle = (houseAngle + nextHouseAngle) / 2;
      
      if (nextHouseAngle < houseAngle) {
        midAngle = (houseAngle + (nextHouseAngle + 2 * Math.PI)) / 2;
        if (midAngle > Math.PI) {
          midAngle -= 2 * Math.PI;
        }
      }
      
      const textX = Math.cos(midAngle) * houseTextRadius;
      const textY = Math.sin(midAngle) * houseTextRadius;
      
      houseNumbersLayer.append('text')
        .attr('x', textX)
        .attr('y', textY)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '14px')
        .attr('font-family', fonts.primary)
        .attr('fill', secondaryTextColor)
        .text(i + 1);
    }

    // Layer 6: Aspect area
    const aspectLayer = g.append('g').attr('class', 'aspect-layer');
    
    // Draw background circle for aspect lines area
    aspectLayer.append('circle')
      .attr('r', aspectAreaRadius)
      .attr('fill', 'url(#centerGradient)')
      .attr('stroke', strokeColor)
      .attr('stroke-width', 1.5)
      .attr('opacity', 1);

    // Layer 7: Aspect lines
    const aspectLinesLayer = g.append('g').attr('class', 'aspect-lines-layer');
    
    // Draw major aspects
    chart.aspects.forEach(aspect => {
      if (['Conjunction', 'Opposition', 'Trine', 'Square', 'Sextile'].includes(aspect.type)) {
        const body1 = chart.bodies.find(b => b.name === aspect.body1);
        const body2 = chart.bodies.find(b => b.name === aspect.body2);
        
        if (body1 && body2) {
          const angle1 = (body1.longitude - 90) * (Math.PI / 180);
          const angle2 = (body2.longitude - 90) * (Math.PI / 180);
          const aspectRadius = houseRadius * 0.4;
          
          const x1 = Math.cos(angle1) * aspectRadius;
          const y1 = Math.sin(angle1) * aspectRadius;
          const x2 = Math.cos(angle2) * aspectRadius;
          const y2 = Math.sin(angle2) * aspectRadius;

          const aspectColors: { [key: string]: string } = {
            'Conjunction': '#FFD700',
            'Opposition': '#FF4444',
            'Trine': '#44FF44',
            'Square': '#FF8844',
            'Sextile': '#4488FF'
          };
          
          const aspectColor = aspectColors[aspect.type] || strokeColor;

          aspectLinesLayer.append('line')
            .attr('x1', x1)
            .attr('y1', y1)
            .attr('x2', x2)
            .attr('y2', y2)
            .attr('stroke', aspectColor)
            .attr('stroke-width', aspect.orb < 2 ? 2 : 1)
            .attr('opacity', aspect.orb < 2 ? 0.9 : 0.6);
        }
      }
    });

    // Layer 8: Planetary bodies
    const planetaryLayer = g.append('g').attr('class', 'planetary-layer');
    
    // Filter out chart angles from bodies for opacity calculation
    const planetsOnly = chart.bodies.filter(body => 
      !['ASC', 'DSC', 'MC', 'IC'].includes(body.name)
    );
    
    const planetRadius = houseRadius * 0.8;
    chart.bodies.forEach((body) => {
      const bodyAngle = (body.longitude - 90) * (Math.PI / 180);
      const bodyX = Math.cos(bodyAngle) * planetRadius;
      const bodyY = Math.sin(bodyAngle) * planetRadius;
      
      // Calculate opacity based on proximity to cosmic symbols (excluding chart angles)
      const zodiacIndex = Math.floor(body.longitude / 30);
      const signName = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                       'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'][zodiacIndex];
      
      const planetName = body.name as keyof typeof PLANET_SYMBOLS;
      const cosmicSymbolData = cosmicSymbols.zodiac[signName as keyof typeof cosmicSymbols.zodiac];
      const planetOpacity = cosmicSymbolData ? 
        (1.0 - Math.min(0.7, Math.abs(body.longitude % 30 - 15) / 15 * 0.5)) : 1.0;

      const planetImages = PLANET_SYMBOLS; // Use existing planet symbols instead
      const planetImage = planetImages[planetName];
      const planetSize = 32; // Fixed size for planets

      const planetGroup = planetaryLayer.append('g')
        .attr('class', 'planetary-body')
        .attr('transform', `translate(${bodyX}, ${bodyY})`)
        .attr('opacity', planetOpacity);

      planetGroup.append('circle')
        .attr('r', planetSize / 2 + 4)
        .attr('fill', 'rgba(255, 255, 255, 0.1)')
        .attr('stroke', 'rgba(255, 255, 255, 0.3)')
        .attr('stroke-width', 1);

      if (false) { // Never use images for planets in this version
        planetGroup.append('image')
          .attr('href', '')
          .attr('x', -planetSize / 2)
          .attr('y', -planetSize / 2)
          .attr('width', planetSize)
          .attr('height', planetSize);
      } else {
        planetGroup.append('text')
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('font-size', '18px')
          .attr('font-family', fonts.display)
          .attr('fill', primaryTextColor)
          .text(body.symbol);
      }
    });

    // Layer 9: Chart angles
    const anglesLayer = g.append('g').attr('class', 'angles-layer');
    
    const angleRadius = houseRadius * 1.1;
    const angles = [
      { name: 'ASC', longitude: chart.houses.cusps[0], symbol: 'ASC' },
      { name: 'DSC', longitude: chart.houses.cusps[6], symbol: 'DSC' },
      { name: 'MC', longitude: chart.houses.cusps[9], symbol: 'MC' },
      { name: 'IC', longitude: chart.houses.cusps[3], symbol: 'IC' }
    ];

    angles.forEach((angle) => {
      const angleRadians = (angle.longitude - 90) * (Math.PI / 180);
      const angleX = Math.cos(angleRadians) * angleRadius;
      const angleY = Math.sin(angleRadians) * angleRadius;

      const angleGroup = anglesLayer.append('g')
        .attr('transform', `translate(${angleX}, ${angleY})`);

      angleGroup.append('circle')
        .attr('r', 14)
        .attr('fill', 'rgba(255, 255, 255, 0.1)')
        .attr('stroke', 'rgba(255, 255, 255, 0.5)')
        .attr('stroke-width', 1);

      angleGroup.append('text')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '12px')
        .attr('font-family', fonts.primary)
        .attr('fill', primaryTextColor)
        .attr('font-weight', 'bold')
        .text(angle.symbol);
    });

  }, [chart, width, height]);

  return (
    <svg 
      ref={svgRef} 
      width={width} 
      height={height} 
      className="chart-wheel"
    />
  );
};
