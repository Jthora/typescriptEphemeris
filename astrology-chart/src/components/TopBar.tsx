import React from 'react';
import ThemeToggle from './ThemeToggle';

const TopBar: React.FC = () => {
  return (
    <div className="top-bar hardware-panel">
      <div className="app-title">COSMIC CYPHER</div>
      <div className="top-bar-controls">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default TopBar;
