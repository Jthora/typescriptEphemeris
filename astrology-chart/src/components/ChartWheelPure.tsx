import React from 'react';
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
  CuspSymbols,
  DecanSymbols,
  HouseDivider,
  HouseNumbers,
  PlanetaryBodies,
  LunarNodes,
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

export const ChartWheelPure: React.FC<ChartWheelProps> = ({ 
  chart, 
  width = 600, 
  height = 600 
}) => {
  // Calculate dimensions
  const radius = Math.min(width, height) / 2 - 40;
  const houseRadius = radius * 0.8;
  const aspectAreaRadius = radius * 0.5;
  const centerX = width / 2;
  const centerY = height / 2;

  // Get theme colors for chart elements
  const strokeColor = getThemeColor('border');
  const primaryTextColor = getThemeColor('text-primary');
  const secondaryTextColor = getThemeColor('text-secondary');
  const surfaceColor = getThemeColor('surface');
  const baseDarkColor = getThemeColor('base-dark');
  const baseMediumColor = getThemeColor('base-medium');

  // Create all celestial bodies list for opacity calculations
  const allCelestialBodies = [
    ...chart.bodies,
    ...(chart.nodes.northNode ? [chart.nodes.northNode, chart.nodes.southNode] : [])
  ];

  // Calculate house data for components
  const houseData = chart.houses.cusps.map((cusp, index) => ({
    index,
    cusp,
    angle: (cusp - 90) * (Math.PI / 180)
  }));

  // Calculate zodiac data
  const zodiacData = ZODIAC_SIGNS.map((sign, index) => {
    const currentSignName = sign.name;
    const currentCosmicData = cosmicSymbols.zodiac[currentSignName as keyof typeof cosmicSymbols.zodiac];
    const lineColor = cosmicSymbols.elementColors[currentCosmicData.element as keyof typeof cosmicSymbols.elementColors];
    
    return {
      index,
      sign,
      cosmicData: currentCosmicData,
      lineColor,
      angle: (index * 30 - 90) * (Math.PI / 180),
      dividerGradientId: `divider-gradient-${index}`
    };
  });

  // Calculate planet data
  const planetData = chart.bodies.map((body) => {
    const zodiacIndex = Math.floor(body.longitude / 30);
    const signName = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                     'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'][zodiacIndex];
    
    const planetName = body.name as keyof typeof PLANET_SYMBOLS;
    const cosmicSymbolData = cosmicSymbols.zodiac[signName as keyof typeof cosmicSymbols.zodiac];
    const planetOpacity = cosmicSymbolData ? 
      (1.0 - Math.min(0.7, Math.abs(body.longitude % 30 - 15) / 15 * 0.5)) : 1.0;

    const planetInfo = PLANET_SYMBOLS[planetName];
    
    return {
      body,
      opacity: planetOpacity,
      planetInfo,
      angle: (body.longitude - 90) * (Math.PI / 180)
    };
  });

  // Calculate aspect data
  const aspectData = chart.aspects
    .filter(aspect => ['Conjunction', 'Opposition', 'Trine', 'Square', 'Sextile'].includes(aspect.type))
    .map(aspect => {
      const body1 = chart.bodies.find(b => b.name === aspect.body1);
      const body2 = chart.bodies.find(b => b.name === aspect.body2);
      
      if (!body1 || !body2) return null;

      const aspectColors: { [key: string]: string } = {
        'Conjunction': '#FFD700',
        'Opposition': '#FF4444',
        'Trine': '#44FF44',
        'Square': '#FF8844',
        'Sextile': '#4488FF'
      };
      
      return {
        aspect,
        body1,
        body2,
        color: aspectColors[aspect.type] || strokeColor,
        angle1: (body1.longitude - 90) * (Math.PI / 180),
        angle2: (body2.longitude - 90) * (Math.PI / 180)
      };
    })
    .filter(Boolean);

  // Calculate angle data
  const angleData = [
    { name: 'ASC', longitude: chart.houses.cusps[0], symbol: 'ASC' },
    { name: 'DSC', longitude: chart.houses.cusps[6], symbol: 'DSC' },
    { name: 'MC', longitude: chart.houses.cusps[9], symbol: 'MC' },
    { name: 'IC', longitude: chart.houses.cusps[3], symbol: 'IC' }
  ].map(angle => ({
    ...angle,
    angle: (angle.longitude - 90) * (Math.PI / 180)
  }));

  return (
    <svg 
      width={width} 
      height={height} 
      className="chart-wheel"
      style={{ background: 'transparent', borderRadius: '8px' }}
    >
      {/* Layer 1: Definitions */}
      <ChartDefinitions 
        strokeColor={strokeColor}
        primaryTextColor={primaryTextColor}
        secondaryTextColor={secondaryTextColor}
        surfaceColor={surfaceColor}
        baseDarkColor={baseDarkColor}
        baseMediumColor={baseMediumColor}
      />

      {/* Main chart group */}
      <g transform={`translate(${centerX}, ${centerY})`}>
        
        {/* Layer 2: Background */}
        <ChartBackground 
          radius={radius}
          gridPatternId="gridPattern"
        />

        {/* Layer 3: Zodiac Ring */}
        <ZodiacRing 
          radius={radius}
          houseRadius={houseRadius}
          strokeColor={strokeColor}
          outerRingGradientId="outerRingGradient"
        />

        {/* Layer 4: House Ring */}
        <HouseRing 
          houseRadius={houseRadius}
          aspectAreaRadius={aspectAreaRadius}
          strokeColor={strokeColor}
          houseRingGradientId="houseRingGradient"
        />

        {/* Layer 5: Zodiac Dividers */}
        {zodiacData.map((data) => (
          <ZodiacDivider
            key={data.index}
            index={data.index}
            houseRadius={houseRadius}
            radius={radius}
            lineColor={data.lineColor}
            dividerGradientId={data.dividerGradientId}
          />
        ))}

        {/* Layer 6: Zodiac Symbols */}
        <ZodiacSymbols 
          radius={radius}
          width={width}
          cosmicSymbols={cosmicSymbols}
          scaleImageSizeForViewport={scaleImageSizeForViewport}
          fonts={fonts}
          primaryTextColor={primaryTextColor}
          calculateSymbolOpacity={calculateSymbolOpacity}
          allCelestialBodies={allCelestialBodies}
        />

        {/* Layer 6.5: Cusp Symbols (Base24) */}
        <CuspSymbols
          radius={radius}
          width={width}
          cosmicSymbols={cosmicSymbols}
          scaleImageSizeForViewport={scaleImageSizeForViewport}
          calculateSymbolOpacity={calculateSymbolOpacity}
          allCelestialBodies={allCelestialBodies}
        />

        {/* Layer 6.7: Decan Symbols (Base36) */}
        <DecanSymbols
          radius={radius}
          width={width}
          cosmicSymbols={cosmicSymbols}
          scaleImageSizeForViewport={scaleImageSizeForViewport}
          calculateSymbolOpacity={calculateSymbolOpacity}
          allCelestialBodies={allCelestialBodies}
        />

        {/* Layer 7: House Dividers */}
        {houseData.map((house) => (
          <HouseDivider
            key={house.index}
            index={house.index}
            angle={house.angle}
            aspectAreaRadius={aspectAreaRadius}
            houseRadius={houseRadius}
            strokeColor={strokeColor}
          />
        ))}

        {/* Layer 8: House Numbers */}
        <HouseNumbers 
          houses={houseData}
          houseRadius={houseRadius}
          aspectAreaRadius={aspectAreaRadius}
          fonts={fonts}
          secondaryTextColor={secondaryTextColor}
        />

        {/* Layer 9: Aspect Area */}
        <AspectArea 
          aspectAreaRadius={aspectAreaRadius}
          strokeColor={strokeColor}
          centerGradientId="centerGradient"
          houseData={houseData}
        />

        {/* Layer 10: Aspect Lines */}
        <AspectLines 
          aspects={chart.aspects}
          bodies={chart.bodies}
          houseRadius={houseRadius}
          strokeColor={strokeColor}
          getThemeColor={getThemeColor}
        />

        {/* Layer 11: Planetary Bodies */}
        <PlanetaryBodies 
          bodies={chart.bodies}
          houseRadius={houseRadius}
          aspectAreaRadius={aspectAreaRadius}
          width={width}
          fonts={fonts}
          primaryTextColor={primaryTextColor}
          surfaceColor={surfaceColor}
          scaleImageSizeForViewport={scaleImageSizeForViewport}
          planetImages={PLANET_SYMBOLS}
          cosmicSymbols={cosmicSymbols}
          getThemeColor={getThemeColor}
        />

        {/* Layer 11.5: Lunar Nodes */}
        <LunarNodes
          chart={chart}
          radius={radius}
          fonts={fonts}
          secondaryTextColor={secondaryTextColor}
        />

        {/* Layer 12: Chart Angles */}
        <ChartAngles 
          chart={chart}
          radius={radius}
          fonts={fonts}
          primaryTextColor={primaryTextColor}
          strokeColor={strokeColor}
          cosmicSymbols={cosmicSymbols}
          getThemeColor={getThemeColor}
        />
      </g>
    </svg>
  );
};
