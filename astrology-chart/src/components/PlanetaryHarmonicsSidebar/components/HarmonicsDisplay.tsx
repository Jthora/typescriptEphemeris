import React, { useState, useEffect, useMemo } from 'react';
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

type TabType = 'overview';

interface TabConfig {
  id: TabType;
  label: string;
  icon: string;
  description: string;
}

const TAB_CONFIGS: TabConfig[] = [
  { 
    id: 'overview', 
    label: 'Cosmic Forces', 
    icon: '🌌', 
    description: 'Base-12 Circular Logic: Cosmic Force Distribution & Quantum Emotional Dynamics'
  }
];

/**
 * Professional Harmonics Display - Real Data Processing Interface
 * Focused on computational accuracy and practical astronomical analysis
 */
export const HarmonicsDisplay: React.FC<HarmonicsDisplayProps> = ({
  data,
  isCalculating
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Memoized calculations for performance
  const aggregatedForces = useMemo(() => {
    return data ? calculateAggregatedForces(data) : {};
  }, [data]);

  const sortedForces = useMemo(() => {
    return sortForcesByWeight(aggregatedForces);
  }, [aggregatedForces]);

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

  // Tab navigation component
  const renderTabNavigation = () => (
    <div className="harmonics-tabs-professional">
      {TAB_CONFIGS.map(tab => (
        <button
          key={tab.id}
          className={`harmonics-tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
          disabled={isCalculating}
          title={tab.description}
          aria-label={`Switch to ${tab.label} analysis`}
        >
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-text">{tab.label}</span>
        </button>
      ))}
    </div>
  );

  // Overview tab - comprehensive analysis
  const renderOverview = () => (
    <div className="harmonics-content overview">
      <MechanicalPanel title="Cosmic Force Distribution" variant="secondary" showRivets>
        <div className="force-analysis">
          <div className="primary-force-indicator">
            <span className="label">Primary Force:</span>
            <span className="value">{getPrimaryCosmicForce(data)?.name || 'Undefined'}</span>
          </div>
          
          <div className="force-distribution-list">
            {sortedForces.slice(0, 6).map(([force, weight]) => (
              <ForceIndicator
                key={force}
                force={{
                  name: force,
                  weight,
                  color: getCosmicForceColor(force),
                  description: getCosmicForceDescription(force)
                }}
                weight={weight}
                variant="detailed"
                interactive={true}
                showPercentage={true}
              />
            ))}
          </div>
        </div>
      </MechanicalPanel>
    </div>
  );

  // Main render
  return (
    <div className="harmonics-display-professional">
      {renderTabNavigation()}
      
      <div className="harmonics-content-wrapper">
        {renderOverview()}
      </div>
    </div>
  );
};
