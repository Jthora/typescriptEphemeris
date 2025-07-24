import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { AstrologyChart } from '../astrology';
import { ZODIAC_SIGNS, PLANET_SYMBOLS } from '../astrology';
import { fonts } from '../assets';
import { cosmicSymbols } from '../assets/images';
import { scaleImageSizeForViewport } from '../utils/image-optimization';
import './CosmicSymbols.css';

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
      
    // Removed cosmic alignment disk background image

    // Draw inner circle (house wheel)
    const houseRadius = radius * 0.7;
    // Define aspectAreaRadius early since it's used in multiple places
    // Reduced to 90.25% of original size (0.5 * 0.95 * 0.95 = 0.45125)
    const aspectAreaRadius = houseRadius * 0.45125; // Shrunk to 90.25% of original size
    
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

      // Get sign element for line color
      const currentSignName = ZODIAC_SIGNS[i].name;
      const currentCosmicData = cosmicSymbols.zodiac[currentSignName as keyof typeof cosmicSymbols.zodiac];
      const lineColor = cosmicSymbols.elementColors[currentCosmicData.element as keyof typeof cosmicSymbols.elementColors];
      
      g.append('line')
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2)
        .attr('stroke', lineColor)
        .attr('stroke-width', 1.5)
        .attr('opacity', 0.7);

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
      
      
      // Add image with error handling and rotation
      const image = symbolGroup.append('image')
        .attr('href', imageUrl)
        .attr('x', symbolX - symbolSize/2)
        .attr('y', symbolY - symbolSize/2)
        .attr('width', symbolSize)
        .attr('height', symbolSize)
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .attr('transform', `rotate(${rotationAngle}, ${symbolX}, ${symbolY})`);
        
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
        
      const cuspImage = cuspGroup.append('image')
        .attr('href', cuspData.image)
        .attr('x', cuspX - cuspSize/2)
        .attr('y', cuspY - cuspSize/2)
        .attr('width', cuspSize)
        .attr('height', cuspSize)
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .attr('transform', `rotate(${cuspRotationAngle}, ${cuspX}, ${cuspY})`);
        
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
          
        const decanImage = decanGroup.append('image')
          .attr('href', decanData.image)
          .attr('x', decanX - decanSize/2)
          .attr('y', decanY - decanSize/2)
          .attr('width', decanSize)
          .attr('height', decanSize)
          .attr('preserveAspectRatio', 'xMidYMid meet')
          .attr('transform', `rotate(${decanRotationAngle}, ${decanX}, ${decanY})`)
          .attr('opacity', 0.85); // Slightly transparent to avoid visual overload
          
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
        .attr('stroke', '#999')
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
        .attr('fill', '#666')
        .attr('font-weight', 'bold')
        .text((i + 1).toString());
    }

    // Draw planets - place on their own innermost rim
    chart.bodies.forEach((body, index) => {
      const planetRadius = radius * 0.65; // Innermost rim for planets
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
        .attr('font-family', fonts.display)
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

      // Draw line from planet to center (optional, but stops at aspect area boundary)
      g.append('line')
        .attr('x1', Math.cos(angle) * (aspectAreaRadius))
        .attr('y1', Math.sin(angle) * (aspectAreaRadius))
        .attr('x2', Math.cos(angle) * (houseRadius + 5))
        .attr('y2', Math.sin(angle) * (houseRadius + 5))
        .attr('stroke', planetColor)
        .attr('stroke-width', 1)
        .attr('opacity', 0.3);
    });

    // Draw lunar nodes - place them on a specific rim between planets and decans
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
        .attr('font-family', fonts.display)
        .attr('fill', '#666')
        .text(chart.nodes.southNode.symbol);
    }

    // Draw white background circle for aspect lines area
    // This will be placed above house/zodiac lines but underneath the aspect lines
    // to make aspects more visible by hiding the lines in the center
    g.append('circle')
      .attr('r', aspectAreaRadius)
      .attr('fill', 'white')  // White fill to cover the underlying lines
      .attr('stroke', '#333') // Black border
      .attr('stroke-width', 1)
      .attr('opacity', 0.9);  // Slightly transparent

    // Draw major aspects
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

    // Draw chart angles (ASC, DSC, MC, IC) if available
    if (chart.angles) {
      console.log('🔍 Rendering chart angles:', chart.angles);
      
      // Reference to the cosmic symbols for angles
      const angleSymbols = cosmicSymbols.angles;
      if (!angleSymbols) {
        console.error('❌ Angle symbols not found in cosmicSymbols:', cosmicSymbols);
      } else {
        console.log('✅ Angle symbols loaded:', angleSymbols);
      }
      
      // Draw each angle symbol
      Object.entries(chart.angles).forEach(([key, angle]) => {
        console.log(`🔶 Rendering angle: ${key} at ${angle.longitude.toFixed(2)}°`);
        
        // Place angles even further out for maximum visibility
        const angleRadius = radius * 1.08; // Outermost rim (beyond zodiac symbols)
        const anglePos = (angle.longitude - 90) * (Math.PI / 180);
        const x = Math.cos(anglePos) * angleRadius;
        const y = Math.sin(anglePos) * angleRadius;
        
        // Get the angle symbol details
        const angleSymbol = angleSymbols?.[key.toUpperCase() as keyof typeof angleSymbols];
        if (!angleSymbol) {
          console.error(`❌ Symbol not found for angle: ${key}`);
          return;
        }
        
        // Create image group for the angle
        const angleGroup = g.append('g')
          .attr('transform', `translate(${x},${y})`)
          .attr('class', 'chart-angle');
          
        // Calculate rotation to point symbol outward
        const rotationDegrees = (angle.longitude + 90) % 360;
        
        // Render the angle symbol as an image
        angleGroup.append('image')
          .attr('href', angleSymbol.image)
          .attr('x', -angleSymbol.size / 2)
          .attr('y', -angleSymbol.size / 2)
          .attr('width', angleSymbol.size)
          .attr('height', angleSymbol.size)
          .attr('transform', `rotate(${rotationDegrees})`)
          .attr('class', 'angle-symbol')
          .on('error', function() {
            console.error(`❌ Failed to load angle symbol: ${key}`, angleSymbol.image);
            // Add a visual placeholder for the missing image
            angleGroup.append('circle')
              .attr('r', angleSymbol.size / 2)
              .attr('fill', 'none')
              .attr('stroke', angleSymbol.color)
              .attr('stroke-width', 2);
          });
        
        // Add angle name with a subtle background to improve visibility
        // First, add a semi-transparent background behind the text
        angleGroup.append('rect')
          .attr('x', -15)
          .attr('y', angleSymbol.size * 0.6 - 8)
          .attr('width', 30)
          .attr('height', 16)
          .attr('rx', 4)
          .attr('ry', 4)
          .attr('fill', 'white')
          .attr('fill-opacity', 0.7);
          
        // Then add the angle symbol text
        angleGroup.append('text')
          .attr('x', 0)
          .attr('y', angleSymbol.size * 0.7)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('font-size', '12px')
          .attr('font-family', fonts.display)
          .attr('fill', angleSymbol.color)
          .attr('font-weight', 'bold')
          .text(angle.symbol);
          
        // Add a line connecting from the wheel to the angle symbol for better visibility
        const lineStartRadius = radius * 0.95;
        const lineStartX = Math.cos(anglePos) * lineStartRadius;
        const lineStartY = Math.sin(anglePos) * lineStartRadius;
        
        // Draw line from wheel to angle
        g.append('line')
          .attr('x1', lineStartX)
          .attr('y1', lineStartY)
          .attr('x2', x)
          .attr('y2', y)
          .attr('stroke', angleSymbol.color)
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
      style={{ background: '#fafafa', borderRadius: '8px' }}
    />
  );
};

export default ChartWheel;
