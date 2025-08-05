import React, { useMemo } from 'react';
import { ForceComparisonBar } from './ForceComparisonBar';
import { MechanicalPanel } from './MechanicalPanel';
import { 
  calculateForceComparisons, 
  organizeComparisonsGrid,
  type ForceComparison 
} from '../utils/forceDimensions';

interface DimensionalComparisonsProps {
  processedForceData: Array<{
    name: string;
    fractional: number;
    normalized: number;
    differential: number;
  }>;
  isCalculating?: boolean;
}

/**
 * 15-Dimensional Cosmic Force Comparison Grid
 * Shows all pairwise relationships between the 6 cosmic forces
 * Organized in 3 rows × 5 columns layout
 */
export const DimensionalComparisons: React.FC<DimensionalComparisonsProps> = ({
  processedForceData,
  isCalculating = false
}) => {
  const comparisons = useMemo(() => {
    return calculateForceComparisons(processedForceData);
  }, [processedForceData]);
  
  const comparisonGrid = useMemo(() => {
    return organizeComparisonsGrid(comparisons);
  }, [comparisons]);
  
  if (isCalculating) {
    return (
      <MechanicalPanel title="Dimensional Force Analysis" variant="secondary" showRivets>
        <div className="dimensional-loading">
          <div className="loading-spinner" />
          <span>Computing 15-dimensional relationships...</span>
        </div>
      </MechanicalPanel>
    );
  }
  
  return (
    <div className="dimensional-comparisons">        
      <div className="comparisons-grid">
        {comparisonGrid.map((row, rowIndex) => (
          <div key={rowIndex} className="comparison-row">
            {row.map((comparison, colIndex) => (
              <div key={`${comparison.leftForce}-${comparison.rightForce}`} className="comparison-cell">
                <ForceComparisonBar 
                  comparison={comparison}
                  size="small"
                  showLabels={true}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
