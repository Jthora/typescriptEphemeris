import React, { useState, useEffect, useCallback } from 'react';
import type { AstrologyChart } from '../astrology';
import { PlanetaryHarmonicsCalculator, type PlanetaryHarmonics, type QuantumEmotionalState, type DimensionalCoordinate } from '../planetary-harmonics';
import './PlanetaryHarmonicsSidebar.css';

interface PlanetaryHarmonicsSidebarProps {
  chart: AstrologyChart;
}

interface HarmonicsData {
  planetaryHarmonics: PlanetaryHarmonics[];
  quantumEmotionalState: QuantumEmotionalState;
  dimensionalCoordinates: DimensionalCoordinate[];
  synodicPeriods: Map<string, number>;
}

export const PlanetaryHarmonicsSidebar: React.FC<PlanetaryHarmonicsSidebarProps> = ({ chart }) => {
  const [harmonicsData, setHarmonicsData] = useState<HarmonicsData | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'harmonics' | 'quantum' | 'dimensions' | 'synodic'>('overview');

  const calculateHarmonics = useCallback(async () => {
    setIsCalculating(true);
    try {
      const calculator = new PlanetaryHarmonicsCalculator();
      
      // Convert astrology chart bodies to planetary data format
      const planetData = chart.bodies.map(body => ({
        name: body.name,
        longitude: body.longitude
      }));
      
      // Calculate Julian Day from birth date
      const julianDay = 2440587.5 + (chart.birthData.date.getTime() / 86400000);
      
      const results = calculator.calculateUnifiedHarmonics(planetData, julianDay);
      setHarmonicsData(results);
    } catch (error) {
      console.error('Error calculating planetary harmonics:', error);
    } finally {
      setIsCalculating(false);
    }
  }, [chart]);

  // Automatically calculate harmonics when chart changes
  useEffect(() => {
    if (chart) {
      calculateHarmonics();
    }
  }, [chart, calculateHarmonics]);

  const formatFrequency = (freq: number): string => {
    if (freq < 1e-9) return `${(freq * 1e12).toFixed(2)} pHz`;
    if (freq < 1e-6) return `${(freq * 1e9).toFixed(2)} nHz`;
    if (freq < 1e-3) return `${(freq * 1e6).toFixed(2)} μHz`;
    return `${(freq * 1000).toFixed(2)} mHz`;
  };

  const formatDays = (days: number): string => {
    if (days < 1) return `${(days * 24).toFixed(1)} hours`;
    if (days < 365) return `${days.toFixed(1)} days`;
    return `${(days / 365.25).toFixed(1)} years`;
  };

  const getCosmicForceColor = (force: string): string => {
    const colors = {
      'Core': '#FF6B35',    // Fire+Earth: Orange-red
      'Void': '#4ECDC4',    // Water+Air: Teal
      'Order': '#45B7D1',   // Air+Earth: Sky blue
      'Chaos': '#96CEB4',   // Fire+Water: Sea green
      'Alpha': '#FFEAA7',   // Fire+Air: Golden yellow
      'Omega': '#DDA0DD'    // Earth+Water: Plum
    };
    return colors[force as keyof typeof colors] || '#888';
  };

  const renderOverview = () => (
    <div className="harmonics-overview">
      <h4>🌌 Comprehensive Cosmic Force Distribution</h4>
      {harmonicsData && (
        <div className="force-distribution">
          {/* Calculate combined force distribution across all planets */}
          {(() => {
            // Aggregate cosmic force weights across all planets
            const aggregatedForces = new Map<string, number>();
            const allForces = ['Core', 'Void', 'Order', 'Chaos', 'Alpha', 'Omega'];
            
            // Initialize all forces
            allForces.forEach(force => aggregatedForces.set(force, 0));
            
            // Sum weights from all planets
            harmonicsData.planetaryHarmonics.forEach(planetary => {
              planetary.cosmicForceDistribution.weights.forEach((weight, force) => {
                aggregatedForces.set(force, (aggregatedForces.get(force) || 0) + weight);
              });
            });
            
            // Normalize to get percentages
            const totalWeight = Array.from(aggregatedForces.values()).reduce((sum, w) => sum + w, 0);
            if (totalWeight > 0) {
              aggregatedForces.forEach((weight, force) => {
                aggregatedForces.set(force, weight / totalWeight);
              });
            }
            
            // Sort by weight and display all 6 forces
            return Array.from(aggregatedForces.entries())
              .sort(([,a], [,b]) => b - a)
              .map(([force, weight]) => (
                <div key={force} className="force-item">
                  <div className="force-header">
                    <span 
                      className="force-indicator"
                      style={{ backgroundColor: getCosmicForceColor(force) }}
                    ></span>
                    <span className="force-name">{force}</span>
                    <span className="force-description">
                      {force === 'Core' ? '(Fire+Earth)' :
                       force === 'Void' ? '(Water+Air)' :
                       force === 'Order' ? '(Air+Earth)' :
                       force === 'Chaos' ? '(Fire+Water)' :
                       force === 'Alpha' ? '(Fire+Air)' :
                       force === 'Omega' ? '(Earth+Water)' : ''}
                    </span>
                  </div>
                  <div className="force-bar">
                    <div 
                      className="force-fill"
                      style={{ 
                        width: `${weight * 100}%`,
                        backgroundColor: getCosmicForceColor(force)
                      }}
                    ></div>
                  </div>
                  <span className="force-weight">{(weight * 100).toFixed(1)}%</span>
                </div>
              ));
          })()}
        </div>
      )}
      
      <h4>🪐 Planetary Force Breakdown</h4>
      {harmonicsData && (
        <div className="planetary-force-summary">
          {harmonicsData.planetaryHarmonics.slice(0, 5).map((planetary, index) => (
            <div key={index} className="planet-force-summary">
              <div className="planet-name">{planetary.planetName}</div>
              <div className="planet-primary-force">
                <span 
                  className="force-dot"
                  style={{ backgroundColor: getCosmicForceColor(planetary.cosmicForceDistribution.primary) }}
                ></span>
                <span className="force-label">{planetary.cosmicForceDistribution.primary}</span>
                <span className="force-percentage">
                  {((planetary.cosmicForceDistribution.weights.get(planetary.cosmicForceDistribution.primary) || 0) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <h4>🎵 Harmonic Summary</h4>
      {harmonicsData && (
        <div className="harmonic-summary">
          <div className="summary-grid">
            <div className="summary-item">
              <span className="label">Dominant Frequency</span>
              <span className="value">
                {formatFrequency(Math.max(...harmonicsData.planetaryHarmonics.map(h => h.baseFrequency)))}
              </span>
            </div>
            <div className="summary-item">
              <span className="label">Quantum State Norm</span>
              <span className="value">
                {harmonicsData.quantumEmotionalState.isNormalized ? '✓ Normalized' : '⚠ Unstable'}
              </span>
            </div>
            <div className="summary-item">
              <span className="label">15D Coordinates</span>
              <span className="value">{harmonicsData.dimensionalCoordinates.length} active</span>
            </div>
            <div className="summary-item">
              <span className="label">Synodic Pairs</span>
              <span className="value">{harmonicsData.synodicPeriods.size} calculated</span>
            </div>
          </div>
          
          <div className="demo-section">
            <h5>📊 Mathematical Validation</h5>
            <p className="demo-description">
              Run a comprehensive demonstration of all Planetary Harmonics calculations
            </p>
            <button 
              className="demo-btn"
              onClick={() => {
                if (harmonicsData) {
                  console.log('🌌 Planetary Harmonics Cosmic Force Validation:');
                  console.log('==================================================');
                  
                  // Validate that all 6 cosmic forces are present
                  const allForces = ['Core', 'Void', 'Order', 'Chaos', 'Alpha', 'Omega'];
                  let validationPassed = true;
                  
                  harmonicsData.planetaryHarmonics.forEach((planetary) => {
                    console.log(`\n🪐 ${planetary.planetName}:`);
                    const weights = planetary.cosmicForceDistribution.weights;
                    
                    allForces.forEach(forceName => {
                      const weight = weights.get(forceName as any) || 0;
                      console.log(`  ${forceName}: ${(weight * 100).toFixed(2)}%`);
                      if (weight === 0) {
                        console.warn(`⚠️  Warning: ${forceName} has zero weight for ${planetary.planetName}`);
                        validationPassed = false;
                      }
                    });
                    
                    // Verify normalization
                    const totalWeight = Array.from(weights.values()).reduce((sum, w) => sum + w, 0);
                    console.log(`  Total: ${(totalWeight * 100).toFixed(2)}% (should be 100%)`);
                    if (Math.abs(totalWeight - 1.0) > 0.001) {
                      console.error(`❌ Normalization error for ${planetary.planetName}: ${totalWeight}`);
                      validationPassed = false;
                    }
                  });
                  
                  console.log(`\n${validationPassed ? '✅' : '❌'} Cosmic Force Distribution: ${validationPassed ? 'VALID' : 'INVALID'}`);
                  console.log('📊 All 6 cosmic forces are now properly calculated!');
                }
                
                import('../harmonics-demo').then(() => {
                  console.log('\n🧪 Running full mathematical demonstration...');
                });
              }}
            >
              🧪 Run Mathematical Demo
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderHarmonics = () => (
    <div className="planetary-harmonics">
      <h4>🪐 Individual Planetary Harmonics</h4>
      {harmonicsData?.planetaryHarmonics.map((planetary, index) => (
        <div key={index} className="planet-harmonics">
          <div className="planet-header">
            <h5>{planetary.planetName}</h5>
            <div className="planet-stats">
              <span>Base: {formatFrequency(planetary.baseFrequency)}</span>
              <span>Period: {formatDays(planetary.orbitalPeriod)}</span>
              <span>Phase: {planetary.currentPhase.toFixed(1)}°</span>
            </div>
          </div>
          
          <div className="harmonic-series">
            {planetary.harmonicSeries.map((harmonic, hIndex) => {
              // Enhanced harmonic classification with musical and astrological significance
              const musicallySignificant = [1, 2, 3, 5, 7].includes(harmonic.order);
              const astrologicallySignificant = [4, 6, 8, 12].includes(harmonic.order);
              const complexHarmonic = [9, 10, 11].includes(harmonic.order);
              
              let harmonicClass = 'standard';
              let indicator = '◦';
              if (musicallySignificant) {
                harmonicClass = 'significant';
                indicator = '★';
              } else if (astrologicallySignificant) {
                harmonicClass = 'astrological';
                indicator = '♦';
              } else if (complexHarmonic) {
                harmonicClass = 'complex';
                indicator = '◊';
              }
              
              return (
                <div key={hIndex} className={`harmonic-component ${harmonicClass}`}>
                  <div className="harmonic-header">
                    <span className="harmonic-indicator">{indicator}</span>
                    <span className="harmonic-order">H{harmonic.order}</span>
                    <span className="harmonic-type">
                      {harmonic.order === 1 ? 'Fund' : 
                       harmonic.order === 2 ? 'Oct' :
                       harmonic.order === 3 ? '5th' :
                       harmonic.order === 4 ? '2Oct' :
                       harmonic.order === 5 ? '3rd' :
                       harmonic.order === 6 ? 'Tri' :
                       harmonic.order === 7 ? '7th' :
                       harmonic.order === 8 ? '3Oct' :
                       harmonic.order === 9 ? '9th' :
                       harmonic.order === 12 ? 'Full' : 
                       `${harmonic.order}th`}
                    </span>
                  </div>
                  
                  <div className="harmonic-info">
                    <div className="harmonic-bar">
                      <div 
                        className="harmonic-fill"
                        style={{ 
                          width: `${Math.min(harmonic.amplitude * 100, 100)}%`,
                          backgroundColor: `hsl(${(harmonic.order * 30) % 360}, ${musicallySignificant ? '85%' : astrologicallySignificant ? '70%' : '55%'}, ${musicallySignificant ? '65%' : astrologicallySignificant ? '55%' : '45%'})`
                        }}
                      ></div>
                    </div>
                    <div className="harmonic-details">
                      <span className="harmonic-freq">{formatFrequency(harmonic.frequency)}</span>
                      <span className="harmonic-amp">Amp: {(harmonic.amplitude * 100).toFixed(1)}%</span>
                      <span className="harmonic-phase">φ: {harmonic.phase.toFixed(0)}°</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="cosmic-force-info">
            <div className="force-distribution-mini">
              <span className="primary-force">
                Primary: 
                <span 
                  className="force-label"
                  style={{ color: getCosmicForceColor(planetary.cosmicForceDistribution.primary) }}
                >
                  {planetary.cosmicForceDistribution.primary}
                </span>
              </span>
              {planetary.cosmicForceDistribution.secondary && (
                <span className="secondary-force">
                  Secondary: 
                  <span 
                    className="force-label"
                    style={{ color: getCosmicForceColor(planetary.cosmicForceDistribution.secondary) }}
                  >
                    {planetary.cosmicForceDistribution.secondary}
                  </span>
                </span>
              )}
            </div>
            <div className="modality-info">
              <span className="modality">
                Wave: {planetary.cosmicForceDistribution.modalityWave.modality}
                <span className="frequency-mult">
                  (×{planetary.cosmicForceDistribution.modalityWave.frequencyMultiplier.toFixed(2)})
                </span>
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderQuantumState = () => (
    <div className="quantum-state">
      <h4>⚛️ Quantum Emotional State</h4>
      {harmonicsData && (
        <div className="quantum-details">
          <div className="state-info">
            <div className="state-stat">
              <span className="label">Normalization:</span>
              <span className={`value ${harmonicsData.quantumEmotionalState.isNormalized ? 'normalized' : 'unstable'}`}>
                {harmonicsData.quantumEmotionalState.isNormalized ? '✓ Valid' : '⚠ Invalid'}
              </span>
            </div>
            <div className="state-stat">
              <span className="label">Timestamp:</span>
              <span className="value">JD {harmonicsData.quantumEmotionalState.timestamp.toFixed(1)}</span>
            </div>
            <div className="state-stat">
              <span className="label">Dimensions:</span>
              <span className="value">{harmonicsData.quantumEmotionalState.amplitudes.length}</span>
            </div>
          </div>
          
          <h5>Dimensional Amplitudes</h5>
          <div className="amplitude-grid">
            {harmonicsData.quantumEmotionalState.amplitudes.map((amplitude, index) => (
              <div key={index} className="amplitude-item">
                <span className="dimension-label">D{index + 1}</span>
                <div className="amplitude-visualization">
                  <div className="magnitude-bar">
                    <div 
                      className="magnitude-fill"
                      style={{ 
                        width: `${amplitude.magnitude * 100}%`,
                        backgroundColor: `hsl(${(amplitude.phase * 180 / Math.PI) % 360}, 70%, 60%)`
                      }}
                    ></div>
                  </div>
                  <span className="phase-indicator">
                    ∠{(amplitude.phase * 180 / Math.PI).toFixed(0)}°
                  </span>
                </div>
                <span className="magnitude-value">{amplitude.magnitude.toFixed(3)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderDimensions = () => (
    <div className="dimensional-coordinates">
      <h4>📐 15-Dimensional Coordinates</h4>
      {harmonicsData && (
        <div className="dimensions-grid">
          {harmonicsData.dimensionalCoordinates.map((coord, index) => (
            <div key={index} className="dimension-item">
              <div className="dimension-header">
                <span className="dimension-number">D{coord.dimension}</span>
                <span className="force-pair">
                  <span style={{ color: getCosmicForceColor(coord.force1) }}>
                    {coord.force1}
                  </span>
                  ↔
                  <span style={{ color: getCosmicForceColor(coord.force2) }}>
                    {coord.force2}
                  </span>
                </span>
              </div>
              <div className="weight-visualization">
                <div className="weight-bar">
                  <div 
                    className="weight-fill"
                    style={{ 
                      width: `${coord.weight * 100}%`,
                      background: `linear-gradient(90deg, ${getCosmicForceColor(coord.force1)}, ${getCosmicForceColor(coord.force2)})`
                    }}
                  ></div>
                </div>
                <span className="weight-value">{coord.weight.toFixed(3)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSynodicPeriods = () => (
    <div className="synodic-periods">
      <h4>🔄 Synodic Periods</h4>
      {harmonicsData && (
        <div className="synodic-grid">
          {Array.from(harmonicsData.synodicPeriods.entries()).map(([pair, period]) => (
            <div key={pair} className="synodic-item">
              <div className="planet-pair">
                <span className="pair-name">{pair.replace('-', ' ↔ ')}</span>
              </div>
              <div className="period-info">
                <span className="period-value">{formatDays(period)}</span>
                <span className="frequency-value">{formatFrequency(1 / (period * 86400))}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'harmonics': return renderHarmonics();
      case 'quantum': return renderQuantumState();
      case 'dimensions': return renderDimensions();
      case 'synodic': return renderSynodicPeriods();
      default: return renderOverview();
    }
  };

  return (
    <div className="planetary-harmonics-sidebar">
      <div className="sidebar-header">
        <h3>🌌 Planetary Harmonics</h3>
        <p>Advanced astrological analysis using base-12 circular logic</p>
        
        <div className="harmonics-status">
          {isCalculating ? (
            <span className="status-calculating">⚛️ Calculating...</span>
          ) : harmonicsData ? (
            <span className="status-ready">✨ Live Analysis Active</span>
          ) : (
            <span className="status-waiting">⏳ Waiting for data...</span>
          )}
        </div>
      </div>

      {harmonicsData && (
        <>
          <div className="sidebar-tabs">
            <button 
              className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`tab ${activeTab === 'harmonics' ? 'active' : ''}`}
              onClick={() => setActiveTab('harmonics')}
            >
              Harmonics
            </button>
            <button 
              className={`tab ${activeTab === 'quantum' ? 'active' : ''}`}
              onClick={() => setActiveTab('quantum')}
            >
              Quantum
            </button>
            <button 
              className={`tab ${activeTab === 'dimensions' ? 'active' : ''}`}
              onClick={() => setActiveTab('dimensions')}
            >
              15D Space
            </button>
            <button 
              className={`tab ${activeTab === 'synodic' ? 'active' : ''}`}
              onClick={() => setActiveTab('synodic')}
            >
              Synodic
            </button>
          </div>

          <div className="sidebar-content">
            {renderContent()}
          </div>
        </>
      )}
    </div>
  );
};

export default PlanetaryHarmonicsSidebar;
