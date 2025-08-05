import React, { useMemo } from 'react';
import type { HarmonicsDisplayProps } from '../types';
import { ForceIndicator } from './ForceIndicator';
import { ProgressBar } from './ProgressBar';
import { StatusIndicator } from './StatusIndicator';
import { MechanicalPanel } from './MechanicalPanel';
import { 
  calculateAggregatedForces, 
  sortForcesByWeight, 
  getCosmicForceColor,
  getCosmicForceDescription,
  getDominantFrequency,
  isQuantumStateNormalized,
  getActiveDimensionalCoordinates,
  getSynodicPairsCount,
  formatFrequency,
  getPrimaryCosmicForce
} from '../utils';

/**
 * Professional Harmonics Display - Real Data Processing Interface
 * Focused on computational accuracy and practical astronomical analysis
 */
export const HarmonicsDisplay: React.FC<HarmonicsDisplayProps> = ({
  data,
  isCalculating
}) => {
  // Memoized calculations for performance
  const aggregatedForces = useMemo(() => {
    return data ? calculateAggregatedForces(data) : {};
  }, [data]);

  const sortedForces = useMemo(() => {
    return sortForcesByWeight(aggregatedForces);
  }, [aggregatedForces]);

  // Custom order for cosmic forces display
  const orderedForces = useMemo(() => {
    const forceOrder = ['Core', 'Void', 'Order', 'Chaos', 'Alpha', 'Omega'];
    const forceMap = new Map(sortedForces);
    
    return forceOrder.map(forceName => [
      forceName, 
      forceMap.get(forceName) || 0
    ] as [string, number]);
  }, [sortedForces]);

  // Centralized force data processing with clear semantic meaning
  const processedForceData = useMemo(() => {
    const weights = orderedForces.map(([, weight]) => weight);
    const maxWeight = Math.max(...weights);
    const avgWeight = weights.reduce((sum, w) => sum + w, 0) / weights.length;
    const minWeight = Math.min(...weights);
    
    return orderedForces.map(([force, rawWeight]) => ({
      name: force,
      color: getCosmicForceColor(force),
      description: getCosmicForceDescription(force),
      
      // Core data values with clear semantics
      fractional: rawWeight,  // 0-1: Actual percentage of total cosmic force energy
      normalized: rawWeight / maxWeight,  // 0-1: Relative strength compared to strongest force
      differential: maxWeight > minWeight 
        ? (rawWeight - avgWeight) / (maxWeight - minWeight) * 0.5 + 0.5  // 0-1: Position relative to range, centered at 0.5
        : 0.5  // If all equal, show at center
    }));
  }, [orderedForces]);

  const calculationStatus = useMemo(() => {
    if (isCalculating) return 'calculating';
    if (!data) return 'ready';
    if (data.planetaryHarmonics.length === 0) return 'error';
    return 'ready';
  }, [isCalculating, data]);

  // Handle no data state
  if (!data) {
    return (
      <MechanicalPanel title="Planetary Harmonics Analysis" variant="primary" showRivets>
        <div className="harmonics-no-data">
          <StatusIndicator 
            status={calculationStatus}
            message={isCalculating ? 'Computing harmonics...' : 'Awaiting chart data'}
            loadingVariant={isCalculating ? 'spinner' : undefined}
            size="medium"
          />
          <div className="data-requirements">
            <h4>Required for Analysis:</h4>
            <ul>
              <li>Valid birth chart with planetary positions</li>
              <li>Astronomical ephemeris data</li>
              <li>Accurate birth time and location</li>
            </ul>
          </div>
        </div>
      </MechanicalPanel>
    );
  }

  // Overview content - comprehensive analysis
  const renderOverview = () => (
    <div className="harmonics-content overview">
      <div className="force-analysis">
        <div className="force-distribution-list">
          {processedForceData.map((forceData) => (
            <ForceIndicator
                key={forceData.name}
                force={{
                  name: forceData.name,
                  weight: forceData.fractional,
                  color: forceData.color,
                  description: forceData.description
                }}
                normalizedValue={forceData.normalized}
                fractionalValue={forceData.fractional}
                differentialValue={forceData.differential}
                variant="detailed"
                interactive={true}
                showPercentage={true}
              />
            ))}
          </div>
        </div>
    </div>
  );

  // Main render
  return (
    <div className="harmonics-display-professional">
      <div className="harmonics-content-wrapper">
        {renderOverview()}
      </div>
    </div>
  );
};
