import React from 'react';
import { getCosmicForceColor } from '../utils';
import type { ForceComparison } from '../utils/forceDimensions';

/**
 * Maps cosmic force names to their symbol filenames from the existing o2 series
 */
const getCosmicForceSymbol = (forceName: string, isDarkMode: boolean = false): string => {
  const symbolMap: Record<string, string> = {
    'alpha': isDarkMode ? 'symbols-o2-alpha-white.png' : 'symbols-o2-alpha-standard.png',
    'omega': isDarkMode ? 'symbols-o2-omega-white.png' : 'symbols-o2-omega-standard.png', 
    'order': isDarkMode ? 'symbols-o2-order-white.png' : 'symbols-o2-order-standard.png',
    'chaos': isDarkMode ? 'symbols-o2-chaos-white.png' : 'symbols-o2-chaos-standard.png',
    'void': isDarkMode ? 'symbols-o2-void-white.png' : 'symbols-o2-void-standard.png',
    'core': isDarkMode ? 'symbols-o2-core-white.png' : 'symbols-o2-core-standard.png'
  };
  
  const normalizedName = forceName.toLowerCase();
  return symbolMap[normalizedName] || 'symbols-o2-core-standard.png';
};

interface ForceComparisonProps {
  comparison: ForceComparison;
  size?: 'small' | 'medium' | 'large';
  showLabels?: boolean;
}

/**
 * Individual force comparison component showing dual-directional bars
 * with balance indicator
 */
export const ForceComparisonBar: React.FC<ForceComparisonProps> = ({
  comparison,
  size = 'medium',
  showLabels = true
}) => {
  const { leftForce, rightForce, leftValue, rightValue, balance } = comparison;
  
  const leftColor = getCosmicForceColor(leftForce);
  const rightColor = getCosmicForceColor(rightForce);
  
  // Detect dark mode from document or body class
  const isDarkMode = document.documentElement.classList.contains('dark') || 
                     document.body.classList.contains('dark-theme') ||
                     window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  
  const leftSymbolPath = `/src/assets/images/symbols/universal/${getCosmicForceSymbol(leftForce, isDarkMode)}`;
  const rightSymbolPath = `/src/assets/images/symbols/universal/${getCosmicForceSymbol(rightForce, isDarkMode)}`;
  
  // Calculate bar widths as percentages
  const total = leftValue + rightValue;
  const leftWidth = total > 0 ? (leftValue / total) * 100 : 0;
  const rightWidth = total > 0 ? (rightValue / total) * 100 : 0;
  
  // Balance bar position (0-100%)
  const balancePosition = balance * 100;
  
  const sizeClasses = {
    small: 'force-comparison-small',
    medium: 'force-comparison-medium', 
    large: 'force-comparison-large'
  };
  
  return (
    <div className={`force-comparison-bar ${sizeClasses[size]}`}>
      {showLabels && (
        <div className="comparison-labels">
          <div className="force-label-container left">
            <img 
              src={leftSymbolPath}
              alt={`${leftForce} symbol`}
              className="force-symbol"
            />
          </div>
          <div className="vs-separator-line" />
          <div className="force-label-container right">
            <img 
              src={rightSymbolPath}
              alt={`${rightForce} symbol`}
              className="force-symbol"
            />
          </div>
        </div>
      )}
      
      <div className="comparison-bars-container">
        {/* Balance indicator bar (white) */}
        <div className="balance-bar-track">
          <div 
            className="balance-indicator"
            style={{ 
              left: `${balancePosition}%`,
              transform: 'translateX(-50%)'
            }}
          />
        </div>
        
        {/* Force comparison bars */}
        <div className="force-bars-container">
          {/* Left force bar (grows leftward) */}
          <div className="left-bar-track">
            <div 
              className="force-bar left-bar"
              style={{ 
                width: `${leftWidth}%`,
                backgroundColor: leftColor,
                marginLeft: 'auto'
              }}
            />
          </div>
          
          {/* Center divider */}
          <div className="center-divider" />
          
          {/* Right force bar (grows rightward) */}
          <div className="right-bar-track">
            <div 
              className="force-bar right-bar"
              style={{ 
                width: `${rightWidth}%`,
                backgroundColor: rightColor
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
