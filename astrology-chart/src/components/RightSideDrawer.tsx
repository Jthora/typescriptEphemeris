import React from 'react';
import { PlanetaryHarmonicsSidebar } from './PlanetaryHarmonicsSidebar/index';
import { ElementDistribution } from './charts/ElementDistribution';
import { ModalityDistribution } from './charts/ModalityDistribution';
import type { AstrologyChart } from '../astrology';
import './charts/PieChart.css';

interface RightSideDrawerProps {
  chart: AstrologyChart | null;
}

const RightSideDrawer: React.FC<RightSideDrawerProps> = ({ chart }) => {
  return (
    <div className="right-side-drawer">
      {chart && (
        <>
          {/* Distribution Charts at the top */}
          <div className="distribution-charts-container">
            <ModalityDistribution chart={chart} />
            <ElementDistribution chart={chart} />
          </div>
          
          {/* Planetary Harmonics Sidebar below */}
          <PlanetaryHarmonicsSidebar chart={chart} />
        </>
      )}
    </div>
  );
};

export default RightSideDrawer;
