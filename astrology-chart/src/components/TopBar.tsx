import React, { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import { PerformanceTest } from './PerformanceTest';

// Feature flag for performance test button
const SHOW_PERFORMANCE_TEST = false;

const TopBar: React.FC = () => {
  const [showPerformanceTest, setShowPerformanceTest] = useState(false);

  return (
    <>
      <div className="top-bar hardware-panel">
        <div className="app-title">COSMIC CYPHER</div>
        <div className="top-bar-controls">
          {SHOW_PERFORMANCE_TEST && (
            <button
              className="performance-test-btn"
              onClick={() => setShowPerformanceTest(true)}
              title="Run Performance Test"
            >
              📊
            </button>
          )}
          <ThemeToggle />
        </div>
      </div>
      
      {SHOW_PERFORMANCE_TEST && (
        <PerformanceTest 
          isOpen={showPerformanceTest}
          onClose={() => setShowPerformanceTest(false)}
        />
      )}
    </>
  );
};

export default TopBar;
