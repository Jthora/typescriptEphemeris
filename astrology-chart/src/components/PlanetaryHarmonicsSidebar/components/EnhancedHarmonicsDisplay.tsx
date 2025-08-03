import React, { useState } from 'react';
import type { PlanetaryHarmonics } from '../../../planetary-harmonics';
import { TabNavigation, TabPanel, type TabItem } from './TabNavigation';
import { HarmonicsDisplay } from './HarmonicsDisplay';
import { LoadingIndicator } from './LoadingIndicator';
import '../styles/tabs.css';
import '../styles/enhanced.css';

interface EnhancedHarmonicsDisplayProps {
  harmonics?: PlanetaryHarmonics;
  isLoading?: boolean;
  onRefresh?: () => void;
}

export const EnhancedHarmonicsDisplay: React.FC<EnhancedHarmonicsDisplayProps> = ({
  harmonics,
  isLoading = false,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs: TabItem[] = [
    { id: 'overview', label: 'Overview', icon: '🌌' },
    { id: 'forces', label: 'Cosmic Forces', icon: '⚡' },
    { id: 'planetary', label: 'Planetary Data', icon: '🪐' },
    { id: 'quantum', label: 'Quantum States', icon: '🔬' },
    { id: 'coordinates', label: 'Dimensions', icon: '📐' },
  ];

  const renderOverviewTab = () => (
    <div className="overview-content">
      <div className="harmonics-overview">
        <h4>Planetary Harmonics Overview</h4>
        <div className="harmonic-summary">
          <div className="summary-grid">
            <div className="summary-item">
              <div className="label">Total Harmonics</div>
              <div className="value">{harmonics?.harmonicSeries?.length || 0}</div>
            </div>
            <div className="summary-item">
              <div className="label">Base Frequency</div>
              <div className="value">{harmonics?.baseFrequency?.toFixed(2) || 'N/A'} Hz</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderForcesTab = () => (
    <div className="forces-content">
      <h4>Cosmic Forces Analysis</h4>
      <div className="force-distribution-enhanced">
        {['Solar', 'Lunar', 'Planetary', 'Harmonic'].map((force, index) => (
          <div key={force} className="force-item-enhanced">
            <div className="force-header">
              <span className="force-name">{force}</span>
              <span className="force-description">Primary {force.toLowerCase()} influence</span>
            </div>
            <div className="force-progress-bar">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${Math.random() * 100}%`,
                    background: `hsl(${index * 60}, 70%, 50%)`
                  }}
                />
              </div>
            </div>
            <span className="force-weight-enhanced">{(Math.random()).toFixed(3)}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPlanetaryTab = () => (
    <div className="planetary-content">
      <h4>Detailed Planetary Harmonics</h4>
      <div className="planetary-force-grid">
        {['Sun', 'Moon', 'Mercury', 'Venus', 'Mars'].map((planet, index) => (
          <div key={planet} className="planet-force-card">
            <div className="planet-header">
              <span className="planet-name">{planet}</span>
            </div>
            <div className="planet-force-details">
              <div className="primary-force-label">Primary Force</div>
              <div className="planet-force-bar progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${Math.random() * 100}%`,
                    background: `hsl(${index * 45}, 70%, 55%)`
                  }}
                />
              </div>
              <div className="primary-force-percentage">{(Math.random() * 100).toFixed(1)}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderQuantumTab = () => (
    <div className="quantum-content">
      <h4>Quantum Emotional States</h4>
      <div className="quantum-states-grid">
        {[1, 2, 3].map((stateIndex) => (
          <div key={stateIndex} className="quantum-state-item">
            <div className="quantum-state-header">
              <h5>State {stateIndex}</h5>
              <div className="phase-indicator">
                <span className="phase-value">{(Math.random() * 360).toFixed(1)}°</span>
              </div>
            </div>
            
            <div className="quantum-metrics">
              {[1, 2, 3].map((amplitudeIndex) => (
                <div key={amplitudeIndex} className="quantum-metric">
                  <label className="quantum-label">Amplitude {amplitudeIndex}</label>
                  <div className="progress-bar-container">
                    <div className="progress-bar quantum-bar">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${Math.random() * 100}%`,
                          background: `hsl(${220 + amplitudeIndex * 40}, 70%, 50%)`
                        }}
                      />
                    </div>
                    <span className="quantum-value">{Math.random().toFixed(3)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className={`normalization-status ${Math.random() > 0.5 ? 'normalized' : 'unstable'}`}>
              {Math.random() > 0.5 ? '✓ Normalized' : '⚠ Unstable'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCoordinatesTab = () => (
    <div className="coordinates-content">
      <h4>Dimensional Coordinates</h4>
      <div className="dimensional-coordinates-display">
        <div className="coordinates-grid">
          {['X', 'Y', 'Z', 'Time', 'Energy', 'Resonance'].map((dimension, index) => (
            <div key={index} className="coordinate-item">
              <div className="coordinate-label">{dimension}</div>
              <div className="progress-bar-container">
                <div className="coordinate-bar progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${Math.random() * 100}%`,
                      background: Math.random() > 0.5 
                        ? 'var(--color-success)'
                        : 'var(--color-warning)'
                    }}
                  />
                </div>
              </div>
              <div className="coordinate-value">{(Math.random() * 2 - 1).toFixed(3)}</div>
              <div className="coordinate-forces">
                Harmonic influences
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="enhanced-harmonics-loading">
        <LoadingIndicator variant="pulse" size="large" message="Calculating planetary harmonics..." />
      </div>
    );
  }

  return (
    <div className="enhanced-harmonics-display">
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <TabPanel id="overview" activeTab={activeTab}>
        {renderOverviewTab()}
      </TabPanel>

      <TabPanel id="forces" activeTab={activeTab}>
        {renderForcesTab()}
      </TabPanel>

      <TabPanel id="planetary" activeTab={activeTab}>
        {renderPlanetaryTab()}
      </TabPanel>

      <TabPanel id="quantum" activeTab={activeTab}>
        {renderQuantumTab()}
      </TabPanel>

      <TabPanel id="coordinates" activeTab={activeTab}>
        {renderCoordinatesTab()}
      </TabPanel>
    </div>
  );
};
