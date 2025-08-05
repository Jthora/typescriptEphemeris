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
  const { leftForce, rightForce, leftValue, rightValue, balance, prominence } = comparison;
  
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
  
  // Prominence bar calculation: convert [-1, 1] to position and width
  const prominenceWidth = Math.abs(prominence) * 50; // 0 to 50% width
  
  // Calculate left edge position to ensure bar stays within bounds
  let prominenceLeft: number;
  if (prominence >= 0) {
    // Positive prominence: bar grows from center to right
    prominenceLeft = 50;
  } else {
    // Negative prominence: bar grows from center to left
    prominenceLeft = 50 - prominenceWidth;
  }
  
  // Ensure the bar never exceeds container bounds
  prominenceLeft = Math.max(0, Math.min(prominenceLeft, 100 - prominenceWidth));
  
  const prominenceColor = prominence >= 0 ? rightColor : leftColor;
  
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
        {/* Prominence bar (4th bar) - shows magnitude of difference */}
        <div className="prominence-bar-track">
          <div 
            className="prominence-indicator"
            style={{ 
              left: `${prominenceLeft}%`,
              width: `${prominenceWidth}%`,
              backgroundColor: prominenceColor
            }}
          />
        </div>
        
        {/* Balance indicator bar (3rd bar - white) */}
        <div className="balance-bar-track">
          <div 
            className="balance-indicator"
            style={{ 
              left: `${balancePosition}%`,
              transform: 'translateX(-50%)'
            }}
          />
        </div>
      </div>
    </div>
  );
};
