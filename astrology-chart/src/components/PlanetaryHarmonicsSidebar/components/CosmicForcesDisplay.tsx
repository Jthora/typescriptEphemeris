import React from 'react';
import type { CosmicForcesDisplayProps } from '../types';
import { ForceIndicator } from './ForceIndicator';
import { AnimatedProgressBar } from './AnimatedProgressBar';
import { DataVisualizationCard } from './DataVisualizationCard';
import { 
  calculateAggregatedForces, 
  sortForcesByWeight, 
  getCosmicForceColor,
  getCosmicForceDescription,
  getPrimaryCosmicForce
} from '../utils';

/**
 * Enhanced cosmic forces display with animations and detailed visualization
 */
export const CosmicForcesDisplay: React.FC<CosmicForcesDisplayProps> = ({
  forces,
  showBreakdown = true
}) => {
  if (!forces || forces.length === 0) {
    return (
      <DataVisualizationCard
        title="🌌 Cosmic Force Distribution"
        data={null}
        renderContent={() => (
          <div className="no-data">No cosmic force data available</div>
        )}
      />
    );
  }

  // Calculate aggregated forces across all planets
  const aggregatedForces = React.useMemo(() => {
    const aggregated = new Map<string, number>();
    const allForces = ['Core', 'Void', 'Order', 'Chaos', 'Alpha', 'Omega'];
    
    // Initialize all forces
    allForces.forEach(force => aggregated.set(force, 0));
    
    // Sum weights from all planets
    forces.forEach(planetary => {
      planetary.cosmicForceDistribution.weights.forEach((weight, force) => {
        aggregated.set(force, (aggregated.get(force) || 0) + weight);
      });
    });
    
    // Normalize to get percentages
    const totalWeight = Array.from(aggregated.values()).reduce((sum, w) => sum + w, 0);
    if (totalWeight > 0) {
      aggregated.forEach((weight, force) => {
        aggregated.set(force, weight / totalWeight);
      });
    }
    
    return Object.fromEntries(aggregated);
  }, [forces]);

  const sortedForces = sortForcesByWeight(aggregatedForces);

  const renderAggregatedForces = () => (
    <div className="force-distribution-enhanced">
      {sortedForces.map(([force, weight], index) => (
        <div key={force} className="force-item-enhanced">
          <div className="force-header">
            <ForceIndicator
              force={{
                name: force,
                weight,
                color: getCosmicForceColor(force),
                description: getCosmicForceDescription(force)
              }}
              weight={weight}
              variant="dot"
              interactive={true}
            />
            <span className="force-name">{force}</span>
            <span className="force-description">
              {getCosmicForceDescription(force)}
            </span>
          </div>
          
          <AnimatedProgressBar
            value={weight}
            variant="force"
            color={getCosmicForceColor(force)}
            showLabel={true}
            animated={true}
            staggerDelay={index * 100}
            animationDuration={800}
            className="force-progress-bar"
          />
          
          <span className="force-weight-enhanced">
            {(weight * 100).toFixed(1)}%
          </span>
        </div>
      ))}
    </div>
  );

  const renderPlanetaryBreakdown = () => (
    <div className="planetary-breakdown">
      <h5>🪐 Individual Planetary Forces</h5>
      <div className="planetary-force-grid">
        {forces.slice(0, 6).map((planetary, index) => {
          const primaryForce = getPrimaryCosmicForce(planetary);
          return (
            <div key={index} className="planet-force-card">
              <div className="planet-header">
                <span className="planet-name">{planetary.planetName}</span>
                <ForceIndicator
                  force={{
                    name: primaryForce.name,
                    weight: primaryForce.weight,
                    color: getCosmicForceColor(primaryForce.name),
                    description: getCosmicForceDescription(primaryForce.name)
                  }}
                  weight={primaryForce.weight}
                  variant="dot"
                  interactive={false}
                />
              </div>
              
              <div className="planet-force-details">
                <span className="primary-force-label">{primaryForce.name}</span>
                <AnimatedProgressBar
                  value={primaryForce.weight}
                  variant="magnitude"
                  color={getCosmicForceColor(primaryForce.name)}
                  showLabel={false}
                  animated={true}
                  staggerDelay={index * 150}
                  className="planet-force-bar"
                />
                <span className="primary-force-percentage">
                  {Math.round(primaryForce.weight * 100)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      <DataVisualizationCard
        title="🌌 Comprehensive Cosmic Force Distribution"
        data={aggregatedForces}
        renderContent={renderAggregatedForces}
        className="cosmic-forces-card"
      />
      
      {showBreakdown && (
        <DataVisualizationCard
          title="🪐 Planetary Force Analysis"
          data={forces}
          renderContent={renderPlanetaryBreakdown}
          className="planetary-breakdown-card"
        />
      )}
    </>
  );
};
