import React, { useState, useEffect } from 'react';
import type { ForceIndicatorProps } from '../types';
import { getCosmicForceColor, getCosmicForceDescription, decimalToPercentage } from '../utils';
import themeManager, { THEMES } from '../../../theme-manager';
import {
  symbolsO2AlphaStandard,
  symbolsO2AlphaWhite,
  symbolsO2ChaosStandard,
  symbolsO2ChaosWhite,
  symbolsO2CoreStandard,
  symbolsO2CoreWhite,
  symbolsO2OmegaStandard,
  symbolsO2OmegaWhite,
  symbolsO2OrderStandard,
  symbolsO2OrderWhite,
  symbolsO2VoidStandard,
  symbolsO2VoidWhite,
  symbolsO1AirStandard,
  symbolsO1AirWhite,
  symbolsO1EarthStandard,
  symbolsO1EarthWhite,
  symbolsO1FireStandard,
  symbolsO1FireWhite,
  symbolsO1WaterStandard,
  symbolsO1WaterWhite,
} from '../../../assets/images/symbols/universal';

/**
 * Maps cosmic force names to their symbol imports from the existing o2 series
 * Note: o2 symbols have reversed naming - "white" variants are for light theme, "standard" for dark theme
 */
const getCosmicForceSymbol = (forceName: string, isDarkMode: boolean = false): string => {
  const symbolMap: Record<string, string> = {
    'alpha': isDarkMode ? symbolsO2AlphaWhite : symbolsO2AlphaStandard,
    'omega': isDarkMode ? symbolsO2OmegaWhite : symbolsO2OmegaStandard, 
    'order': isDarkMode ? symbolsO2OrderWhite : symbolsO2OrderStandard,
    'chaos': isDarkMode ? symbolsO2ChaosWhite : symbolsO2ChaosStandard,
    'void': isDarkMode ? symbolsO2VoidWhite : symbolsO2VoidStandard,
    'core': isDarkMode ? symbolsO2CoreWhite : symbolsO2CoreStandard
  };
  
  const normalizedName = forceName.toLowerCase();
  return symbolMap[normalizedName] || symbolsO2CoreStandard; // fallback to core symbol
};

/**
 * Maps element names to their o1 symbol imports  
 */
const getElementSymbol = (elementName: string, isDarkMode: boolean = false): string => {
  const symbolMap: Record<string, string> = {
    'fire': isDarkMode ? symbolsO1FireWhite : symbolsO1FireStandard,
    'earth': isDarkMode ? symbolsO1EarthWhite : symbolsO1EarthStandard,
    'air': isDarkMode ? symbolsO1AirWhite : symbolsO1AirStandard,
    'water': isDarkMode ? symbolsO1WaterWhite : symbolsO1WaterStandard
  };
  
  const normalizedName = elementName.toLowerCase();
  return symbolMap[normalizedName] || symbolsO1FireStandard; // fallback to fire
};

/**
 * Maps cosmic forces to their constituent elements based on your theory
 */
const getCosmicForceElements = (forceName: string): [string, string] => {
  const forceElements: Record<string, [string, string]> = {
    'core': ['fire', 'earth'],    // Fire + Earth
    'void': ['water', 'air'],     // Water + Air  
    'order': ['air', 'earth'],    // Air + Earth
    'chaos': ['fire', 'water'],   // Fire + Water
    'alpha': ['fire', 'air'],     // Fire + Air
    'omega': ['earth', 'water']   // Earth + Water
  };
  
  const normalizedName = forceName.toLowerCase();
  return forceElements[normalizedName] || ['fire', 'earth'];
};

/**
 * Enhanced cosmic force display component with cosmic symbols and mechanical styling
 */
export const ForceIndicator: React.FC<ForceIndicatorProps> = ({
  force,
  normalizedValue,
  fractionalValue,
  differentialValue,
  variant = 'dot',
  interactive = false,
  showPercentage = true
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Initialize theme detection and listen for changes
  useEffect(() => {
    // Set initial theme state
    const updateTheme = () => {
      const actualTheme = themeManager.getActualTheme();
      setIsDarkMode(actualTheme === THEMES.DARK);
    };
    
    // Set initial state
    updateTheme();
    
    // Listen for theme changes
    themeManager.addListener(updateTheme);
    
    // Cleanup listener on unmount
    return () => {
      themeManager.removeListener(updateTheme);
    };
  }, []);

  const mapForceToSymbol = (name: string, dark: boolean) => {
    const n = name.toLowerCase();
    if (n === 'alpha') return dark ? symbolsO2AlphaWhite : symbolsO2AlphaStandard;
    if (n === 'omega') return dark ? symbolsO2OmegaWhite : symbolsO2OmegaStandard;
    if (n === 'order') return dark ? symbolsO2OrderWhite : symbolsO2OrderStandard;
    if (n === 'chaos') return dark ? symbolsO2ChaosWhite : symbolsO2ChaosStandard;
    if (n === 'void') return dark ? symbolsO2VoidWhite : symbolsO2VoidStandard;
    if (n === 'core') return dark ? symbolsO2CoreWhite : symbolsO2CoreStandard;
    return dark ? symbolsO2CoreWhite : symbolsO2CoreStandard;
  };

  const mapElementToSymbol = (name: string, dark: boolean) => {
    const n = name.toLowerCase();
    if (n === 'air') return dark ? symbolsO1AirWhite : symbolsO1AirStandard;
    if (n === 'earth') return dark ? symbolsO1EarthWhite : symbolsO1EarthStandard;
    if (n === 'fire') return dark ? symbolsO1FireWhite : symbolsO1FireStandard;
    if (n === 'water') return dark ? symbolsO1WaterWhite : symbolsO1WaterStandard;
    return dark ? symbolsO1AirWhite : symbolsO1AirStandard;
  };

  const symbolPath = mapForceToSymbol(force.name, isDarkMode);
  const [element1, element2] = getCosmicForceElements(force.name);
  const element1Path = mapElementToSymbol(element1, isDarkMode);
  const element2Path = mapElementToSymbol(element2, isDarkMode);
  
  const color = getCosmicForceColor(force.name);
  const description = getCosmicForceDescription(force.name);
  
  const indicatorClass = [
    'force-indicator',
    `force-indicator--${variant}`,
    interactive ? 'force-indicator--interactive' : '',
    isHovered ? 'force-indicator--hovered' : ''
  ].filter(Boolean).join(' ');

  const handleMouseEnter = () => {
    if (interactive) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (interactive) setIsHovered(false);
  };
  
  if (variant === 'detailed') {
    return (
      <div 
        className="force-item-compact"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="force-symbols-row">
          {/* Main cosmic force symbol */}
          <div className="cosmic-symbol-main">
            <img 
              src={symbolPath}
              alt={`${force.name} cosmic symbol`}
              className="cosmic-symbol"
              title={`${force.name}: ${description}`}
            />
          </div>
          
          {/* Element composition */}
          <div className="element-composition">
            <img 
              src={element1Path}
              alt={`${element1} element`}
              className="element-symbol"
              title={`${element1} element`}
            />
            <span className="element-plus">+</span>
            <img 
              src={element2Path}
              alt={`${element2} element`}
              className="element-symbol"
              title={`${element2} element`}
            />
          </div>
          
          {/* Force name and percentage */}
          <div className="force-info">
            <span className="force-name">{force.name}</span>
            {showPercentage && (
              <span className="force-percentage">{decimalToPercentage(Math.max(fractionalValue, 0))}</span>
            )}
          </div>
          
          {/* Mini pie chart */}
          <div className="force-mini-pie">
            <svg width="24" height="24" viewBox="0 0 24 24">
              {/* Outer circle border */}
              <circle 
                cx="12" 
                cy="12" 
                r="10" 
                fill="none" 
                stroke="var(--color-border)" 
                strokeWidth="1"
              />
              {/* Pie chart ring - Normalized relative strength (same as top bar) */}
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeDasharray={`${Math.max(normalizedValue * 62.83, 1)} 62.83`}
                strokeDashoffset="15.71"
                transform="rotate(-90 12 12)"
                opacity="0.8"
              />
              {/* Inner filling circle - Differential deviation (same as bottom bar) */}
              <circle
                cx="12"
                cy="12"
                r={Math.max(differentialValue * 8, 0.5)}
                fill={color}
                opacity="0.6"
              />
            </svg>
          </div>
          
          {/* Triple progress bars with tick marks */}
          <div className="force-bars-triple">
            {/* Bar 1: Normalized (relative to strongest force) */}
            <div className="force-bar-compact normalized">
              <div className="bar-tick-marks">
                <div className="tick" style={{left: '0%'}}></div>
                <div className="tick" style={{left: '25%'}}></div>
                <div className="tick" style={{left: '50%'}}></div>
                <div className="tick" style={{left: '75%'}}></div>
                <div className="tick" style={{left: '100%'}}></div>
              </div>
              <div 
                className="force-fill"
                style={{ 
                  width: `${Math.max(normalizedValue * 100, 2)}%`,
                  backgroundColor: color,
                  opacity: 0.9
                }}
              />
            </div>
            
            {/* Bar 2: Fractional (actual percentage 0-100%) */}
            <div className="force-bar-compact fractional">
              <div className="bar-tick-marks">
                <div className="tick" style={{left: '0%'}}></div>
                <div className="tick" style={{left: '25%'}}></div>
                <div className="tick" style={{left: '50%'}}></div>
                <div className="tick" style={{left: '75%'}}></div>
                <div className="tick" style={{left: '100%'}}></div>
              </div>
              <div 
                className="force-fill"
                style={{ 
                  width: `${Math.max(fractionalValue * 100, 2)}%`,
                  backgroundColor: color,
                  opacity: 0.7
                }}
              />
            </div>
            
            {/* Bar 3: Deviation from average (centered at 50%) */}
            <div className="force-bar-compact deviation">
              <div className="bar-tick-marks">
                <div className="tick" style={{left: '0%'}}></div>
                <div className="tick" style={{left: '25%'}}></div>
                <div className="tick" style={{left: '50%'}}></div>
                <div className="tick" style={{left: '75%'}}></div>
                <div className="tick" style={{left: '100%'}}></div>
              </div>
              <div 
                className="force-fill"
                style={{ 
                  width: `${Math.max(differentialValue * 100, 2)}%`,
                  backgroundColor: differentialValue > 0.5 ? color : `${color}80`,
                  opacity: 0.8
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (variant === 'bar') {
    return (
      <div 
        className="force-bar-container"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="force-bar">
          <div 
            className="force-fill"
            style={{ 
              width: `${Math.max(normalizedValue * 100, 0)}%`,
              backgroundColor: color,
              '--fill-percentage': `${Math.max(normalizedValue * 100, 0)}%`
            } as any}
          />
          <div className="force-bar-highlight" />
        </div>
        {showPercentage && (
          <span className="force-percentage">{decimalToPercentage(Math.max(fractionalValue, 0))}</span>
        )}
      </div>
    );
  }
  
  // Enhanced dot variant with cosmic symbol
  return (
    <div className="cosmic-symbol-dot">
      <img 
        src={symbolPath}
        alt={`${force.name} cosmic symbol`}
        className={indicatorClass}
        title={`${force.name} ${description}: ${decimalToPercentage(Math.max(fractionalValue, 0))}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
    </div>
  );
};
