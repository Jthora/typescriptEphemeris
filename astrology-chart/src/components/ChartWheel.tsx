import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { AstrologyChart } from '../astrology';
import { ZODIAC_SIGNS, PLANET_SYMBOLS } from '../astrology';
import { fonts } from '../assets';
import { cosmicSymbols } from '../assets';
import { scaleImageSizeForViewport } from '../utils/image-optimization';
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
    const textColor = getThemeColor('text-primary');
    const secondaryTextColor = getThemeColor('text-secondary');
    const surfaceColor = getThemeColor('surface');
    const baseDarkColor = getThemeColor('base-dark');
    const baseMediumColor = getThemeColor('base-medium');
    
    // Create main group
    const g = svg.append('g')
      .attr('transform', `translate(${centerX}, ${centerY})`);
      
    // Define gradients for chart rings
    const defs = svg.append('defs');
    
    // Outer ring gradient (zodiac wheel)
    const outerRingGradient = defs.append('radialGradient')
      .attr('id', 'outerRingGradient')
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', '50%')
      .attr('fx', '50%')
      .attr('fy', '50%');
      
    outerRingGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', baseMediumColor)
      .attr('stop-opacity', 0.8); // Increased opacity
      
    outerRingGradient.append('stop')
      .attr('offset', '70%')
      .attr('stop-color', baseMediumColor)
      .attr('stop-opacity', 0.7); // Increased opacity
      
    outerRingGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', baseDarkColor)
      .attr('stop-opacity', 0.6); // Increased opacity
    
    // House wheel gradient
    const houseRingGradient = defs.append('radialGradient')
      .attr('id', 'houseRingGradient')
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', '50%')
      .attr('fx', '50%')
      .attr('fy', '50%');
      
    houseRingGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', baseMediumColor)
      .attr('stop-opacity', 0.9); // Increased opacity
      
    houseRingGradient.append('stop')
      .attr('offset', '80%')
      .attr('stop-color', baseDarkColor)
      .attr('stop-opacity', 0.8); // Increased opacity
      
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
      .attr('stop-color', surfaceColor)
      .attr('stop-opacity', 1); // Full opacity
      
    centerGradient.append('stop')
      .attr('offset', '85%')
      .attr('stop-color', baseMediumColor)
      .attr('stop-opacity', 0.95); // Increased opacity
      
    centerGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', baseDarkColor)
      .attr('stop-opacity', 0.9); // Increased opacity
      
    // Add a subtle grid pattern for the chart background
    const gridPattern = defs.append('pattern')
      .attr('id', 'gridPattern')
      .attr('width', 20)
      .attr('height', 20)
      .attr('patternUnits', 'userSpaceOnUse');
      
    // Horizontal grid lines
    gridPattern.append('path')
      .attr('d', 'M 0 10 H 20')
      .attr('stroke', strokeColor)
      .attr('stroke-width', 0.5)
      .attr('opacity', 0.25); // Increased opacity
      
    // Vertical grid lines
    gridPattern.append('path')
      .attr('d', 'M 10 0 V 20')
      .attr('stroke', strokeColor)
      .attr('stroke-width', 0.5)
      .attr('opacity', 0.25); // Increased opacity
      
    // Add a subtle glow filter for highlights
    const glowFilter = defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');
      
    glowFilter.append('feGaussianBlur')
      .attr('stdDeviation', '2.5')
      .attr('result', 'coloredBlur');
      
    const glowMerge = glowFilter.append('feMerge');
    glowMerge.append('feMergeNode')
      .attr('in', 'coloredBlur');
    glowMerge.append('feMergeNode')
      .attr('in', 'SourceGraphic');
      
    // Add background rect with grid pattern and make it the background of the entire chart
    g.append('circle')
      .attr('r', radius + 20) // Slightly larger than outer zodiac wheel
      .attr('fill', 'url(#gridPattern)')
      .attr('opacity', 0.8); // Increased opacity

    // Create outer ring (zodiac area) as an actual ring using two circles
    // First the outer zodiac circle (outer edge)
    g.append('circle')
      .attr('r', radius)
      .attr('fill', 'none')
      .attr('stroke', strokeColor)
      .attr('stroke-width', 2);
    
    // Then create a ring between the zodiac and house wheels with gradient
    const outerRingArc = d3.arc<any>()
      .innerRadius(houseRadius)
      .outerRadius(radius)
      .startAngle(0)
      .endAngle(2 * Math.PI);
      
    g.append('path')
      .attr('d', outerRingArc as any)
      .attr('fill', 'url(#outerRingGradient)')
      .attr('opacity', 0.9); // Increased opacity
      
    // Draw inner circle (house wheel) edge
    g.append('circle')
      .attr('r', houseRadius)
      .attr('fill', 'none')
      .attr('stroke', strokeColor)
      .attr('stroke-width', 1.5); // Increased stroke width
      
    // Create a ring between the house wheel and aspect area with gradient
    const houseRingArc = d3.arc<any>()
      .innerRadius(aspectAreaRadius)
      .outerRadius(houseRadius)
      .startAngle(0)
      .endAngle(2 * Math.PI);
      
    g.append('path')
      .attr('d', houseRingArc as any)
      .attr('fill', 'url(#houseRingGradient)')
      .attr('opacity', 0.9); // Increased opacity

    // Draw zodiac sign divisions
    for (let i = 0; i < 12; i++) {
      const angle = (i * 30 - 90) * (Math.PI / 180); // Start from Aries at top
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
      
      g.append('line')
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2)
        .attr('stroke', `url(#${dividerGradientId})`)
        .attr('stroke-width', 1.8) // Increased stroke width
        .attr('filter', 'url(#glow)'); // Apply glow filter

      // Add cosmic modality symbols for zodiac signs (Base12)
      // Place on outer rim
      const symbolAngle = ((i * 30) + 15 - 90) * (Math.PI / 180);
      const symbolRadius = radius * 0.95; // Outer rim for Base12 zodiac symbols
      const symbolX = Math.cos(symbolAngle) * symbolRadius;
      const symbolY = Math.sin(symbolAngle) * symbolRadius;
      
      // Get current zodiac sign name and cosmic symbol data
      const signName = ZODIAC_SIGNS[i].name;
      // Use type assertion since we know these keys exist
      const cosmicSymbolData = cosmicSymbols.zodiac[signName as keyof typeof cosmicSymbols.zodiac];
      
      // Scale the symbol size based on viewport width
      const baseSize = cosmicSymbolData?.size || 48; // Increased default size for better visibility
      const symbolSize = scaleImageSizeForViewport(baseSize, width);
      
      // Get the image from our cosmic-modalities directory
      const imageUrl = cosmicSymbolData.image;
      
      // Add the cosmic symbol image with no fallbacks
      const symbolGroup = g.append('g')
        .attr('class', 'cosmic-symbol')
        .attr('data-sign', signName)
        .attr('data-element', cosmicSymbolData.element)
        .attr('data-modality', cosmicSymbolData.modality);
      
      // Returning to our previous approach that was close
      // Adding exactly 180 degrees to the previous calculation
      const rotationAngle = ((i * 30) + 15 + 180 + 180) % 360;
      
      // Calculate the absolute longitude of this zodiac symbol
      const symbolLongitude = (i * 30) + 15; // Center of zodiac sign
      
      // Calculate opacity based on proximity to planets and other celestial bodies
      // For zodiac signs, use a 15-degree orb
      // Note: Angles (ASC/DSC/MC/IC) are excluded as they have their own visual indicators
      const allCelestialBodies = [
        ...chart.bodies,
        ...(chart.nodes.northNode ? [chart.nodes.northNode, chart.nodes.southNode] : [])
      ];
      
      const symbolOpacity = calculateSymbolOpacity(
        symbolLongitude,
        allCelestialBodies,
        0.1, // base opacity
        1.0, // max opacity
        15   // orb size in degrees
      );
      
      // Add image with error handling, rotation, and dynamic opacity
      const image = symbolGroup.append('image')
        .attr('href', imageUrl)
        .attr('x', symbolX - symbolSize/2)
        .attr('y', symbolY - symbolSize/2)
        .attr('width', symbolSize)
        .attr('height', symbolSize)
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .attr('transform', `rotate(${rotationAngle}, ${symbolX}, ${symbolY})`)
        .attr('opacity', symbolOpacity) // Apply calculated opacity
        .attr('filter', 'url(#glow)'); // Apply glow filter for better visibility
        
      // Add error handling for image loading
      image.on('error', function() {
        console.error(`Failed to load image for ${signName}`);
      });

      // Add cusp symbol (base24) between this zodiac sign and the next
      // Get the current sign and the next sign
      const currentSign = ZODIAC_SIGNS[i];
      const nextSign = ZODIAC_SIGNS[(i + 1) % 12];
      
      // Get appropriate cusp symbol based on transitions between modalities and elements
      // The cusp should represent the transition between the current sign and the next
      const currentModality = currentSign.quality.toLowerCase();
      const nextModality = nextSign.quality.toLowerCase();
      const currentElement = currentSign.element.toLowerCase();
      const nextElement = nextSign.element.toLowerCase();
      
      // Find the most appropriate cusp symbol based on element and modality transitions
      const cuspData = findAppropriateCuspSymbol(cosmicSymbols.cusps, currentModality, nextModality, currentElement, nextElement, i);
      
      // Position cusp symbol exactly between two zodiac signs
      // Place on a middle rim (Base24)
      const cuspAngle = ((i * 30) + 30 - 90) * (Math.PI / 180); // +30 to place between signs
      const cuspRadius = radius * 0.85; // Middle rim for Base24 cusp symbols
      const cuspX = Math.cos(cuspAngle) * cuspRadius;
      const cuspY = Math.sin(cuspAngle) * cuspRadius;
      
      // Scale the cusp symbol size
      const cuspSize = scaleImageSizeForViewport(cuspData.size, width);
      
      // Cusp rotation angle - ensure it points outward like zodiac symbols
      const cuspRotationAngle = ((i * 30) + 30 + 180 + 180) % 360;
      
      // Add the cusp symbol
      const cuspGroup = g.append('g')
        .attr('class', 'cusp-symbol')
        .attr('data-force', cuspData.force)
        .attr('data-combo', cuspData.combo);
        
      // Calculate the absolute longitude of this cusp symbol
      const cuspLongitude = (i * 30) + 30; // Boundary between signs
      
      // Calculate opacity based on proximity to planets and other celestial bodies
      // For cusps, use a 15-degree orb
      const cuspOpacity = calculateSymbolOpacity(
        cuspLongitude,
        allCelestialBodies,
        0.1, // base opacity
        1.0, // max opacity
        15   // orb size in degrees
      );
        
      const cuspImage = cuspGroup.append('image')
        .attr('href', cuspData.image)
        .attr('x', cuspX - cuspSize/2)
        .attr('y', cuspY - cuspSize/2)
        .attr('width', cuspSize)
        .attr('height', cuspSize)
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .attr('transform', `rotate(${cuspRotationAngle}, ${cuspX}, ${cuspY})`)
        .attr('opacity', cuspOpacity); // Apply calculated opacity
        
      // Add error handling for cusp image loading
      cuspImage.on('error', function() {
        console.error(`Failed to load cusp image: ${cuspData.force}-${cuspData.combo}`);
      });
      
      // Add decan symbols (base36) for this zodiac sign
      // Each sign has 3 decans at 0°, 10°, and 20° of the sign
      for (let decanIndex = 0; decanIndex < 3; decanIndex++) {
        // Calculate the absolute degree for this decan (0-359), with 5-degree adjustment
        const decanDegree = (i * 30) + (decanIndex * 10);
        
        // Get the appropriate decan data from our cosmic symbols
        const decanData = cosmicSymbols.getDecanByDegree(decanDegree);
        
        // Position the decan symbol with 5-degree adjustment
        // 0° decan aligns with zodiac sign, others are placed at their respective positions
        // Place on inner rim (Base36)
        const decanAngle = ((i * 30) + (decanIndex * 10) + 5 - 90) * (Math.PI / 180); // +5 to adjust offset
        const decanRadius = radius * 0.75; // Inner rim for Base36 decan symbols
        const decanX = Math.cos(decanAngle) * decanRadius;
        const decanY = Math.sin(decanAngle) * decanRadius;
        
        // Scale the decan symbol size (slightly smaller than zodiac symbols)
        const decanSize = scaleImageSizeForViewport(decanData.size, width);
        
        // Decan rotation angle - ensure it points outward like other symbols
        // Adjusted by 5 degrees to match the position adjustment
        const decanRotationAngle = ((i * 30) + (decanIndex * 10) + 5 + 180 + 180) % 360;
        
        // Add the decan symbol
        const decanGroup = g.append('g')
          .attr('class', 'decan-symbol')
          .attr('data-element', decanData.element)
          .attr('data-modality', decanData.modality)
          .attr('data-force', decanData.force)
          .attr('data-zodiac-sign', decanData.zodiacSign)
          .attr('data-decan-position', decanData.decanPosition);
        
        // Calculate the absolute longitude of this decan symbol
        // Each decan is 10° wide, centered at 5°, 15°, 25° within each sign
        const decanLongitude = (i * 30) + (decanIndex * 10) + 5;
        
        // Calculate opacity based on proximity to planets and other celestial bodies
        // For decans, use a 5-degree orb (smaller than zodiac/cusps)
        const decanOpacity = calculateSymbolOpacity(
          decanLongitude,
          allCelestialBodies,
          0.1,  // base opacity
          0.85, // max opacity (keeping the original max of 0.85)
          5     // orb size in degrees (smaller than zodiac)
        );
          
        const decanImage = decanGroup.append('image')
          .attr('href', decanData.image)
          .attr('x', decanX - decanSize/2)
          .attr('y', decanY - decanSize/2)
          .attr('width', decanSize)
          .attr('height', decanSize)
          .attr('preserveAspectRatio', 'xMidYMid meet')
          .attr('transform', `rotate(${decanRotationAngle}, ${decanX}, ${decanY})`)
          .attr('opacity', decanOpacity); // Use calculated opacity
          
        // Add error handling for decan image loading
        decanImage.on('error', function() {
          console.error(`Failed to load decan image: ${decanData.element}-${decanData.modality}-${decanData.force}`);
        });
      }
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
        .attr('stroke', secondaryTextColor)
        .attr('stroke-width', i % 3 === 0 ? 2 : 1) // Thicker lines for angular houses
        .attr('opacity', 0.7);

      // Add house numbers
      // Calculate the midpoint between the current house cusp and the next one,
      // taking into account the possible angle wrap-around
      let nextCusp = chart.houses.cusps[(i + 1) % 12];
      let midpoint;
      
      // Handle the case where we cross the 0° mark
      if (nextCusp < houseCusp) {
        // We've crossed the 0° point, so we need to add 360 to nextCusp to get the correct midpoint
        midpoint = (houseCusp + (nextCusp + 360 - houseCusp) / 2) % 360;
      } else {
        midpoint = houseCusp + (nextCusp - houseCusp) / 2;
      }
      
      const houseAngle = (midpoint - 90) * (Math.PI / 180);
      const houseNumberRadius = houseRadius * 0.5;
      const houseX = Math.cos(houseAngle) * houseNumberRadius;
      const houseY = Math.sin(houseAngle) * houseNumberRadius;

      g.append('text')
        .attr('x', houseX)
        .attr('y', houseY)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '12px')
        .attr('font-family', fonts.primary)
        .attr('fill', textColor)
        .attr('font-weight', 'bold')
        .text((i + 1).toString());
    }

    // Draw planets with theme-aware styling
    chart.bodies.forEach((body, index) => {
      const planetRadius = radius * 0.65; // Innermost rim for planets
      const angle = (body.longitude - 90) * (Math.PI / 180);
      let x = Math.cos(angle) * planetRadius;
      let y = Math.sin(angle) * planetRadius;

      // Adjust position to avoid overlaps (simplified)
      const adjustmentAngle = (index * 5) * (Math.PI / 180);
      x += Math.cos(adjustmentAngle) * 5;
      y += Math.sin(adjustmentAngle) * 5;

      // Use planet color with theme awareness (fallback to primary color if not defined)
      const rawPlanetColor = PLANET_SYMBOLS[body.name as keyof typeof PLANET_SYMBOLS]?.color;
      const planetColor = rawPlanetColor || getThemeColor('primary');
      
      // Determine if this planet is near a significant point (zodiac, cusp, or decan)
      // Calculate which symbol types this planet is activating
      const isNearZodiac = (body.longitude % 30 - 15) <= 15 && (body.longitude % 30 - 15) >= -15;
      const isNearCusp = body.longitude % 30 <= 15 || body.longitude % 30 >= 25; // Within 5° of a boundary
      const isNearDecan = Math.min(
        Math.abs(body.longitude % 10 - 5),  // Distance to nearest decan center
        Math.min(
          Math.abs((body.longitude % 10) - 15 + 10), // Handle wraparound
          Math.abs((body.longitude % 10) + 5 - 10)
        )
      ) <= 5;
      
      // Adjust glow intensity based on proximity to symbols
      const glowIntensity = (isNearZodiac ? 1.5 : 1) * 
                            (isNearCusp ? 1.3 : 1) * 
                            (isNearDecan ? 1.2 : 1);
      
      // Create a custom glow filter for this planet based on its position
      const planetGlowId = `planetGlow-${index}`;
      const planetGlowFilter = defs.append('filter')
        .attr('id', planetGlowId)
        .attr('x', '-50%')
        .attr('y', '-50%')
        .attr('width', '200%')
        .attr('height', '200%');
        
      planetGlowFilter.append('feGaussianBlur')
        .attr('stdDeviation', 2.5 * glowIntensity) // Adjust blur based on symbol proximity
        .attr('result', 'coloredBlur');
        
      const feMerge = planetGlowFilter.append('feMerge');
      feMerge.append('feMergeNode')
        .attr('in', 'coloredBlur');
      feMerge.append('feMergeNode')
        .attr('in', 'SourceGraphic');
      
      // Create planet group to apply filter to entire planet (circle + symbol)
      const planetGroup = g.append('g')
        .attr('class', 'planet-group')
        .attr('data-planet', body.name)
        .attr('filter', `url(#${planetGlowId})`);
      
      // Draw planet circle with theme-aware border
      planetGroup.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 8)
        .attr('fill', planetColor)
        .attr('stroke', surfaceColor)
        .attr('stroke-width', 1)
        .attr('opacity', 0.8);

      // Planet symbol with theme-aware text color
      planetGroup.append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '12px')
        .attr('font-family', fonts.display)
        .attr('fill', surfaceColor)
        .attr('font-weight', 'bold')
        .text(body.symbol);

      // Retrograde indicator with theme-aware color
      if (body.retrograde) {
        planetGroup.append('text')
          .attr('x', x + 12)
          .attr('y', y - 8)
          .attr('text-anchor', 'middle')
          .attr('font-size', '8px')
          .attr('fill', getThemeColor('warning'))
          .text('℞');
      }

      // Draw line from planet to center with theme-aware color and gradient opacity
      g.append('line')
        .attr('x1', Math.cos(angle) * (aspectAreaRadius))
        .attr('y1', Math.sin(angle) * (aspectAreaRadius))
        .attr('x2', Math.cos(angle) * (houseRadius + 5))
        .attr('y2', Math.sin(angle) * (houseRadius + 5))
        .attr('stroke', planetColor)
        .attr('stroke-width', 1)
        .attr('opacity', 0.6)
        .attr('stroke-dasharray', '1,1');
    });

    // Draw lunar nodes - place them on a specific rim between planets and decans
    // Draw lunar nodes with theme-aware colors
    if (chart.nodes.northNode) {
      const nodeRadius = radius * 0.7; // Between planets and decans
      
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
        .attr('font-family', fonts.display)
        .attr('fill', secondaryTextColor)
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
        .attr('font-family', fonts.display)
        .attr('fill', secondaryTextColor)
        .text(chart.nodes.southNode.symbol);
    }

    // Draw background circle for aspect lines area with theme-aware gradient
    g.append('circle')
      .attr('r', aspectAreaRadius)
      .attr('fill', 'url(#centerGradient)')  // Use gradient instead of flat color
      .attr('stroke', strokeColor) // Theme border color
      .attr('stroke-width', 1.5)  // Increased stroke width
      .attr('opacity', 1);  // Full opacity for better visibility

    // Draw major aspects with theme colors
    chart.aspects.forEach(aspect => {
      if (['Conjunction', 'Opposition', 'Trine', 'Square', 'Sextile'].includes(aspect.type)) {
        
        const body1 = chart.bodies.find(b => b.name === aspect.body1);
        const body2 = chart.bodies.find(b => b.name === aspect.body2);
        
        if (body1 && body2) {
          const angle1 = (body1.longitude - 90) * (Math.PI / 180);
          const angle2 = (body2.longitude - 90) * (Math.PI / 180);
          const aspectRadius = houseRadius * 0.4; // Slightly larger aspect area
          
          const x1 = Math.cos(angle1) * aspectRadius;
          const y1 = Math.sin(angle1) * aspectRadius;
          const x2 = Math.cos(angle2) * aspectRadius;
          const y2 = Math.sin(angle2) * aspectRadius;
          
          // Determine aspect color based on type using theme colors
          let aspectColor;
          let aspectGradientId;
          
          if (aspect.type === 'Trine' || aspect.type === 'Sextile') {
            aspectColor = getThemeColor('success'); // Harmonious (green)
            aspectGradientId = 'aspect-success-gradient';
          } else if (aspect.type === 'Square' || aspect.type === 'Opposition') {
            aspectColor = getThemeColor('error'); // Challenging (red)
            aspectGradientId = 'aspect-error-gradient';
          } else {
            aspectColor = getThemeColor('primary'); // Neutral (blue)
            aspectGradientId = 'aspect-primary-gradient';
          }
          
          // Create gradient if it doesn't exist yet
          if (!defs.select(`#${aspectGradientId}`).node()) {
            const gradient = defs.append('linearGradient')
              .attr('id', aspectGradientId)
              .attr('gradientUnits', 'userSpaceOnUse')
              .attr('x1', x1)
              .attr('y1', y1)
              .attr('x2', x2)
              .attr('y2', y2);
              
            gradient.append('stop')
              .attr('offset', '0%')
              .attr('stop-color', aspectColor)
              .attr('stop-opacity', 0.9);
              
            gradient.append('stop')
              .attr('offset', '50%')
              .attr('stop-color', aspectColor)
              .attr('stop-opacity', 0.7);
              
            gradient.append('stop')
              .attr('offset', '100%')
              .attr('stop-color', aspectColor)
              .attr('stop-opacity', 0.9);
          }
          
          const strokeWidth = aspect.type === 'Conjunction' || aspect.type === 'Opposition' ? 2.5 : 1.5;
          
          g.append('line')
            .attr('x1', x1)
            .attr('y1', y1)
            .attr('x2', x2)
            .attr('y2', y2)
            .attr('stroke', `url(#${aspectGradientId})`)
            .attr('stroke-width', strokeWidth)
            .attr('opacity', 0.85)
            .attr('stroke-dasharray', aspect.type === 'Square' ? '5,5' : 'none')
            .attr('filter', 'url(#glow)');
        }
      }
    });

    // Chart title and info have been removed for a cleaner interface

    // Draw chart angles (ASC, DSC, MC, IC) with theme-aware colors
    if (chart.angles) {
      console.log('🔍 Rendering chart angles:', chart.angles);
      
      // Reference to the cosmic symbols for angles
      const angleSymbols = cosmicSymbols.angles;
      if (!angleSymbols) {
        console.error('❌ Angle symbols not found in cosmicSymbols:', cosmicSymbols);
      } else {
        console.log('✅ Angle symbols loaded:', angleSymbols);
        // Debug: Check all angle symbol properties
        Object.entries(angleSymbols).forEach(([key, symbol]) => {
          console.log(`🔎 Angle symbol ${key} details:`, symbol.symbol, symbol.fontSize, symbol.color);
        });
      }
      
      // Draw each angle symbol with theme awareness
      Object.entries(chart.angles).forEach(([key, angle]) => {
        console.log(`🔶 Rendering angle: ${key} at ${angle.longitude.toFixed(2)}°`);
        
        // Place angles even further out for maximum visibility
        const angleRadius = radius * 1.08; // Outermost rim (beyond zodiac symbols)
        const anglePos = (angle.longitude - 90) * (Math.PI / 180);
        const x = Math.cos(anglePos) * angleRadius;
        const y = Math.sin(anglePos) * angleRadius;
        
        // Map angle name to symbol code
        const symbolKey = mapAngleNameToSymbol(key);
        console.log(`🔄 Looking up symbol for ${key} with key: ${symbolKey}`);
        
        const angleSymbol = angleSymbols?.[symbolKey as keyof typeof angleSymbols];
        if (!angleSymbol) {
          console.error(`❌ Symbol not found for angle: ${key} (symbol key: ${symbolKey})`);
          
          // Create a fallback symbol using theme colors
          let fallbackColor;
          if (key === 'ascendant') fallbackColor = getThemeColor('error'); // ASC
          else if (key === 'descendant') fallbackColor = getThemeColor('warning'); // DSC
          else if (key === 'midheaven') fallbackColor = getThemeColor('success'); // MC
          else if (key === 'imumCoeli') fallbackColor = getThemeColor('info'); // IC
          else fallbackColor = getThemeColor('primary'); // Default
          
          // Create a simple circle as a fallback with theme-aware background
          const fallbackGroup = g.append('g')
            .attr('transform', `translate(${x},${y})`)
            .attr('class', 'chart-angle fallback');
            
          // Draw a circle with theme-aware gradient
          fallbackGroup.append('circle')
            .attr('r', 24)
            .attr('fill', 'url(#angleGradient)')
            .attr('stroke', strokeColor)
            .attr('stroke-width', 1);
            
          // Add the angle text (ASC, DSC, MC, IC)
          fallbackGroup.append('text')
            .attr('x', 0)
            .attr('y', 0)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('font-size', '16px')
            .attr('font-weight', 'bold')
            .attr('fill', fallbackColor)
            .text(symbolKey);
            
          return;
        }
        
        // Create symbol group for the angle with theme-aware styling
        const angleGroup = g.append('g')
          .attr('transform', `translate(${x},${y})`)
          .attr('class', 'chart-angle');
        
        // Add a circle background with theme-aware gradient
        angleGroup.append('circle')
          .attr('r', 24)
          .attr('fill', 'url(#angleGradient)')
          .attr('stroke', strokeColor)
          .attr('stroke-width', 1);
          
        // Render the angle text (ASC, DSC, MC, IC) with original color or theme color
        // Use the original color but make sure it's visible on both light and dark themes
        const textColor = angleSymbol.color || getThemeColor('primary');
        
        angleGroup.append('text')
          .attr('x', 0)
          .attr('y', 0)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('font-size', angleSymbol.fontSize || '16px')
          .attr('font-weight', angleSymbol.fontWeight || 'bold')
          .attr('fill', textColor)
          .text(angleSymbol.symbol);
        
        // Add a line connecting from the wheel to the angle symbol for better visibility
        const lineStartRadius = radius * 0.95;
        const lineStartX = Math.cos(anglePos) * lineStartRadius;
        const lineStartY = Math.sin(anglePos) * lineStartRadius;
        
        // Draw line from wheel to angle with theme-aware styling
        g.append('line')
          .attr('x1', lineStartX)
          .attr('y1', lineStartY)
          .attr('x2', x)
          .attr('y2', y)
          .attr('stroke', textColor)
          .attr('stroke-width', 1.5)
          .attr('stroke-dasharray', '3,2')
          .attr('opacity', 0.7);
      });
    }

    // Return cleanup function to remove tooltips when component unmounts
    return () => {
      // Remove any tooltips that were created
      d3.selectAll('.cosmic-tooltip').remove();
    };
  }, [chart, width, height]);

  // Function to find the most appropriate cusp symbol based on the transition between signs
  const findAppropriateCuspSymbol = (
    cuspSymbols: any[], 
    currentModality: string, 
    nextModality: string,
    currentElement: string,
    nextElement: string,
    index: number
  ) => {
    // Convert astrology.ts quality terms to cosmic-symbols.ts modality terms
    const getModalityTerm = (quality: string) => {
      if (quality === 'cardinal') return 'active';
      if (quality === 'fixed') return 'static';
      if (quality === 'mutable') return 'reactive';
      return quality; // fallback
    };
    
    const currentModalityTerm = getModalityTerm(currentModality);
    const nextModalityTerm = getModalityTerm(nextModality);
    
    // Match by transition force based on elements
    let force = 'core'; // default
    
    // Determine appropriate force based on element transitions
    // According to the rules:
    // core = between fire and earth
    // void = between water and air
    // order = between earth and air
    // chaos = between fire and water
    
    // Fire transitions
    if (currentElement === 'fire' && nextElement === 'earth') force = 'core';
    if (currentElement === 'fire' && nextElement === 'air') force = 'order';
    if (currentElement === 'fire' && nextElement === 'water') force = 'chaos';
    
    // Earth transitions
    if (currentElement === 'earth' && nextElement === 'fire') force = 'core';
    if (currentElement === 'earth' && nextElement === 'air') force = 'order';
    if (currentElement === 'earth' && nextElement === 'water') force = 'void';
    
    // Air transitions
    if (currentElement === 'air' && nextElement === 'fire') force = 'order';
    if (currentElement === 'air' && nextElement === 'earth') force = 'order';
    if (currentElement === 'air' && nextElement === 'water') force = 'void';
    
    // Water transitions
    if (currentElement === 'water' && nextElement === 'fire') force = 'chaos';
    if (currentElement === 'water' && nextElement === 'earth') force = 'void';
    if (currentElement === 'water' && nextElement === 'air') force = 'void';
    
    // Same element transitions - use cycle position
    if (currentElement === nextElement) {
      const forces = ['core', 'order', 'chaos', 'void'];
      force = forces[index % 4];
    }
    
    // Look for a cusp symbol that matches the transition
    // First try to find perfect match for both modality transition and force
    const combo = `${currentModalityTerm}-${nextModalityTerm}`;
    let symbol = cuspSymbols.find(s => s.force === force && s.combo === combo);
    
    // If no exact match, try reversed combo
    if (!symbol) {
      const reversedCombo = `${nextModalityTerm}-${currentModalityTerm}`;
      symbol = cuspSymbols.find(s => s.force === force && s.combo === reversedCombo);
    }
    
    // Try with all possible modality combinations for this force
    if (!symbol) {
      // List all combos for modalities
      const modalities = ['active', 'static', 'reactive'];
      const possibleCombos = [];
      
      // Try all combinations of modalities with the correct force
      for (const m1 of modalities) {
        for (const m2 of modalities) {
          if (m1 !== m2) { // Different modalities
            possibleCombos.push(`${m1}-${m2}`);
          }
        }
      }
      
      // Find first matching force with any modality combo
      for (const possibleCombo of possibleCombos) {
        const possibleSymbol = cuspSymbols.find(s => s.force === force && s.combo === possibleCombo);
        if (possibleSymbol) {
          symbol = possibleSymbol;
          break;
        }
      }
    }
    
    // If still no match, just find one with the right force
    if (!symbol) {
      symbol = cuspSymbols.find(s => s.force === force);
    }
    
    // Final fallback to any symbol
    if (!symbol) {
      symbol = cuspSymbols[index % cuspSymbols.length];
    }
    
    return symbol;
  };

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      className="chart-wheel"
      style={{ background: 'transparent', borderRadius: '8px' }}
    />
  );
};

export default ChartWheel;
