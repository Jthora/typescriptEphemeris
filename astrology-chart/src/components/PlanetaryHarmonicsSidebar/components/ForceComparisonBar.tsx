import React, { useMemo } from 'react';
import { getCosmicForceColor } from '../utils';
import type { ForceComparison } from '../utils/forceDimensions';
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
  symbolsO2VoidWhite
} from '../../../assets/images/symbols/universal';
import themeManager, { THEMES } from '../../../theme-manager';

/**
 * Maps cosmic force names to their symbol imports from the existing o2 series
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
  return symbolMap[normalizedName] || symbolsO2CoreStandard;
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
const ForceComparisonBarBase: React.FC<ForceComparisonProps> = ({
  comparison,
  size = 'medium',
  showLabels = true
}) => {
  const { leftForce, rightForce, leftValue, rightValue, balance, prominence } = comparison;
  
  const leftColor = getCosmicForceColor(leftForce);
  const rightColor = getCosmicForceColor(rightForce);
  
  // Use ThemeManager instead of DOM reads; returns 'dark' | 'light'
  const isDarkMode = themeManager.getActualTheme() === THEMES.DARK;
  
  // Use imported asset URLs directly (Vite resolves them for prod)
  const leftSymbolPath = getCosmicForceSymbol(leftForce, isDarkMode);
  const rightSymbolPath = getCosmicForceSymbol(rightForce, isDarkMode);
  
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

export const ForceComparisonBar = React.memo(ForceComparisonBarBase);
