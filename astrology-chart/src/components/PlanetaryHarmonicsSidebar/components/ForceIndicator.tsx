import React, { useState, useEffect } from 'react';
import type { ForceIndicatorProps } from '../types';
import { getCosmicForceColor, getCosmicForceDescription, decimalToPercentage } from '../utils';
import themeManager, { THEMES } from '../../../theme-manager';

/**
 * Maps cosmic force names to their symbol filenames from the existing o2 series
 * Note: o2 symbols have reversed naming - "white" variants are for light theme, "standard" for dark theme
 */
const getCosmicForceSymbol = (forceName: string, isDarkMode: boolean = false): string => {
  const symbolMap: Record<string, string> = {
    'alpha': !isDarkMode ? 'symbols-o2-alpha-white.png' : 'symbols-o2-alpha-standard.png',
    'omega': !isDarkMode ? 'symbols-o2-omega-white.png' : 'symbols-o2-omega-standard.png', 
    'order': !isDarkMode ? 'symbols-o2-order-white.png' : 'symbols-o2-order-standard.png',
    'chaos': !isDarkMode ? 'symbols-o2-chaos-white.png' : 'symbols-o2-chaos-standard.png',
    'void': !isDarkMode ? 'symbols-o2-void-white.png' : 'symbols-o2-void-standard.png',
    'core': !isDarkMode ? 'symbols-o2-core-white.png' : 'symbols-o2-core-standard.png'
  };
  
  const normalizedName = forceName.toLowerCase();
  return symbolMap[normalizedName] || 'symbols-o2-core-standard.png'; // fallback to core symbol
};

/**
 * Maps element names to their o1 symbol filenames  
 */
const getElementSymbol = (elementName: string, isDarkMode: boolean = false): string => {
  const symbolMap: Record<string, string> = {
    'fire': isDarkMode ? 'symbols-o1-fire-white.png' : 'symbols-o1-fire-standard.png',
    'earth': isDarkMode ? 'symbols-o1-earth-white.png' : 'symbols-o1-earth-standard.png',
    'air': isDarkMode ? 'symbols-o1-air-white.png' : 'symbols-o1-air-standard.png',
    'water': isDarkMode ? 'symbols-o1-water-white.png' : 'symbols-o1-water-standard.png'
  };
  
  const normalizedName = elementName.toLowerCase();
  return symbolMap[normalizedName] || 'symbols-o1-fire-standard.png';
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
  weight,
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
  
  const color = getCosmicForceColor(force.name);
  const description = getCosmicForceDescription(force.name);
  const symbolPath = `/src/assets/images/symbols/universal/${getCosmicForceSymbol(force.name, isDarkMode)}`;
  const [element1, element2] = getCosmicForceElements(force.name);
  const element1Path = `/src/assets/images/symbols/universal/${getElementSymbol(element1, isDarkMode)}`;
  const element2Path = `/src/assets/images/symbols/universal/${getElementSymbol(element2, isDarkMode)}`;
  
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
              <span className="force-percentage">{decimalToPercentage(Math.max(weight, 0))}</span>
            )}
          </div>
          
          {/* Compact progress bar */}
          <div className="force-bar-compact">
            <div 
              className="force-fill"
              style={{ 
                width: `${Math.max(weight * 100, 2)}%`, // minimum 2% for visibility
                backgroundColor: color
              }}
            />
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
              width: `${Math.max(weight * 100, 0)}%`,
              backgroundColor: color,
              '--fill-percentage': `${Math.max(weight * 100, 0)}%`
            } as any}
          />
          <div className="force-bar-highlight" />
        </div>
        {showPercentage && (
          <span className="force-percentage">{decimalToPercentage(Math.max(weight, 0))}</span>
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
        title={`${force.name} ${description}: ${decimalToPercentage(Math.max(weight, 0))}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
    </div>
  );
};
