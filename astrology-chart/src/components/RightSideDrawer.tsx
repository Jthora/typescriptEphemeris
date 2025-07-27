import React from 'react';
import PlanetaryHarmonicsSidebar from './PlanetaryHarmonicsSidebar';
import type { AstrologyChart } from '../astrology';

interface RightSideDrawerProps {
  chart: AstrologyChart | null;
}

const RightSideDrawer: React.FC<RightSideDrawerProps> = ({ chart }) => {
  return (
    <div className="right-side-drawer">
      {chart && <PlanetaryHarmonicsSidebar chart={chart} />}
    </div>
  );
};

export default RightSideDrawer;
