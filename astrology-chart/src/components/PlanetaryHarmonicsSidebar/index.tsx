import React, { useState, useEffect, useCallback } from 'react';
import type { AstrologyChart } from '../../astrology';
import { PlanetaryHarmonicsCalculator } from '../../planetary-harmonics';
import type { HarmonicsData } from './types';
import { MechanicalPanel, HarmonicsDisplay } from './components';

// Import styles
import './styles/foundation.css';
import './styles/components.css';

interface PlanetaryHarmonicsSidebarProps {
  chart: AstrologyChart;
}

/**
 * Professional Planetary Harmonics Sidebar
 * Real-time astronomical computation interface
 */
export const PlanetaryHarmonicsSidebar: React.FC<PlanetaryHarmonicsSidebarProps> = ({ chart }) => {
  const [harmonicsData, setHarmonicsData] = useState<HarmonicsData | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateHarmonics = useCallback(async () => {
    if (!chart || !chart.bodies || chart.bodies.length === 0) {
      setError('Invalid chart data');
      return;
    }

    setIsCalculating(true);
    setError(null);
    
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
      setError(error instanceof Error ? error.message : 'Calculation failed');
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

  return (
    <div className="planetary-harmonics-sidebar">
      {error && (
        <MechanicalPanel title="Error" variant="secondary">
          <div className="error-message">
            <p>⚠️ {error}</p>
            <button onClick={calculateHarmonics} disabled={isCalculating}>
              Retry Calculation
            </button>
          </div>
        </MechanicalPanel>
      )}
      
      <HarmonicsDisplay
        data={harmonicsData}
        isCalculating={isCalculating}
      />
    </div>
  );
};
