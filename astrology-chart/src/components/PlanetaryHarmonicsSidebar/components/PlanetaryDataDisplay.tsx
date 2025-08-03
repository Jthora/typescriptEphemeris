import React from 'react';
import type { PlanetaryDataDisplayProps } from '../types';
import { DataVisualizationCard } from './DataVisualizationCard';
import { AnimatedProgressBar } from './AnimatedProgressBar';
import { 
  formatFrequency, 
  formatDays, 
  getDominantFrequency,
  isQuantumStateNormalized,
  getActiveDimensionalCoordinates,
  getSynodicPairsCount
} from '../utils';

/**
 * Advanced planetary data display with quantum mechanics and dimensional coordinates
 */
export const PlanetaryDataDisplay: React.FC<PlanetaryDataDisplayProps> = ({
  planets,
  quantumState,
  dimensions,
  synodicPeriods
}) => {
  const harmonicsData = React.useMemo(() => ({
    planetaryHarmonics: planets,
    quantumEmotionalState: quantumState,
    dimensionalCoordinates: dimensions,
    synodicPeriods
  }), [planets, quantumState, dimensions, synodicPeriods]);

  const renderHarmonicSummary = () => (
    <div className="harmonic-summary-enhanced">
      <div className="summary-grid-enhanced">
        <div className="summary-metric">
          <div className="metric-icon">🎵</div>
          <div className="metric-content">
            <span className="metric-label">Dominant Frequency</span>
            <span className="metric-value">
              {formatFrequency(getDominantFrequency(harmonicsData))}
            </span>
          </div>
        </div>

        <div className="summary-metric">
          <div className="metric-icon">⚛️</div>
          <div className="metric-content">
            <span className="metric-label">Quantum State</span>
            <span className={`metric-value ${isQuantumStateNormalized(harmonicsData) ? 'metric-value--success' : 'metric-value--warning'}`}>
              {isQuantumStateNormalized(harmonicsData) ? '✓ Normalized' : '⚠ Unstable'}
            </span>
          </div>
        </div>

        <div className="summary-metric">
          <div className="metric-icon">📐</div>
          <div className="metric-content">
            <span className="metric-label">15D Coordinates</span>
            <span className="metric-value">
              {getActiveDimensionalCoordinates(harmonicsData)} active
            </span>
          </div>
        </div>

        <div className="summary-metric">
          <div className="metric-icon">🔄</div>
          <div className="metric-content">
            <span className="metric-label">Synodic Pairs</span>
            <span className="metric-value">
              {getSynodicPairsCount(harmonicsData)} calculated
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPlanetaryHarmonics = () => (
    <div className="planetary-harmonics-detailed">
      <h5>🪐 Individual Planetary Harmonics</h5>
      <div className="harmonics-list">
        {planets.slice(0, 8).map((planetary, index) => (
          <div key={index} className="harmonic-item">
            <div className="harmonic-header">
              <span className="planet-name-detailed">{planetary.planetName}</span>
              <span className="base-frequency">
                {formatFrequency(planetary.baseFrequency)}
              </span>
            </div>
            
            <div className="harmonic-visualization">
              <div className="frequency-bars">
                {planetary.harmonicSeries.slice(0, 5).map((harmonic, freqIndex) => (
                  <div key={freqIndex} className="frequency-bar-container">
                    <span className="harmonic-label">H{harmonic.order}</span>
                    <AnimatedProgressBar
                      value={harmonic.amplitude}
                      variant="harmonic"
                      showLabel={false}
                      animated={true}
                      staggerDelay={index * 100 + freqIndex * 50}
                      className="frequency-bar"
                    />
                    <span className="frequency-value">
                      {formatFrequency(harmonic.frequency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderQuantumState = () => (
    <div className="quantum-state-display">
      <h5>⚛️ Quantum Emotional State</h5>
      <div className="quantum-metrics">
        <div className="quantum-metric">
          <span className="quantum-label">Average Magnitude</span>
          <AnimatedProgressBar
            value={quantumState.amplitudes.reduce((sum, amp) => sum + amp.magnitude, 0) / quantumState.amplitudes.length}
            variant="magnitude"
            showLabel={true}
            animated={true}
            className="quantum-bar"
          />
        </div>
        
        <div className="quantum-metric">
          <span className="quantum-label">Phase Variance</span>
          <div className="phase-indicator">
            <span className="phase-value">
              {Math.max(...quantumState.amplitudes.map(a => a.phase)).toFixed(2)}
            </span>
          </div>
        </div>
        
        <div className="quantum-metric">
          <span className="quantum-label">Normalization</span>
          <div className={`normalization-status ${quantumState.isNormalized ? 'normalized' : 'unstable'}`}>
            {quantumState.isNormalized ? '✓ Normalized' : '⚠ Unstable'}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDimensionalCoordinates = () => (
    <div className="dimensional-coordinates-display">
      <h5>📐 15-Dimensional Coordinates</h5>
      <div className="coordinates-grid">
        {dimensions.slice(0, 15).map((coord, index) => (
          <div key={index} className="coordinate-item">
            <span className="coordinate-label">D{coord.dimension}</span>
            <AnimatedProgressBar
              value={coord.weight}
              variant="magnitude"
              showLabel={false}
              animated={true}
              staggerDelay={index * 30}
              className="coordinate-bar"
            />
            <span className="coordinate-value">
              {coord.weight.toFixed(3)}
            </span>
            <span className="coordinate-forces">
              {coord.force1}-{coord.force2}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <DataVisualizationCard
        title="🎵 Harmonic Analysis Summary"
        data={harmonicsData}
        renderContent={renderHarmonicSummary}
        className="harmonic-summary-card"
      />

      <DataVisualizationCard
        title="🪐 Detailed Planetary Harmonics"
        data={planets}
        renderContent={renderPlanetaryHarmonics}
        className="planetary-harmonics-card"
      />

      <DataVisualizationCard
        title="⚛️ Quantum Emotional Mechanics"
        data={quantumState}
        renderContent={renderQuantumState}
        className="quantum-state-card"
      />

      <DataVisualizationCard
        title="📐 Multidimensional Analysis"
        data={dimensions}
        renderContent={renderDimensionalCoordinates}
        className="dimensional-coordinates-card"
      />
    </>
  );
};
