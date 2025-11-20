import React, { useState } from 'react';
import { BookOpen, Info, Home } from 'lucide-react';
import WingCommanderLogo from '../assets/WingCommanderLogo-288x162.gif';
import type { ShareState } from '../utils/share/shareState';
import ThemeToggle from './ThemeToggle';
import { PerformanceTest } from './PerformanceTest';

// Feature flag for performance test button
const SHOW_PERFORMANCE_TEST = false;

interface TopBarProps {
  shareState?: ShareState;
  shareMessage?: string | null;
  onOpenTutorial?: () => void;
  onOpenAbout?: () => void;
  tutorialActive?: boolean;
  aboutActive?: boolean;
  showShareButton?: boolean;
  onNavigateHome?: () => void;
  homeActive?: boolean;
}

const TopBar: React.FC<TopBarProps> = ({
  shareState = 'idle',
  shareMessage,
  onOpenTutorial,
  onOpenAbout,
  tutorialActive = false,
  aboutActive = false,
  onNavigateHome,
  homeActive = false
}) => {
  const [showPerformanceTest, setShowPerformanceTest] = useState(false);
  return (
    <>
      <div className="top-bar hardware-panel">
        <div className="top-bar-left">
          <img src={WingCommanderLogo} alt="Wing Commander insignia" className="wing-commander-logo" />
          <div className="app-title">COSMIC CYPHER</div>
        </div>
        <div className="top-bar-controls">
          {onNavigateHome && (
            <button
              type="button"
              className={`hardware-button nav-button home-button ${homeActive ? 'is-active' : ''}`}
              onClick={onNavigateHome}
              title="Go to chart"
              aria-pressed={homeActive}
            >
              <Home size={16} aria-hidden="true" />
              <span className="sr-only">Go to chart</span>
            </button>
          )}
          {onOpenTutorial && (
            <button
              type="button"
              className={`hardware-button nav-button ${tutorialActive ? 'is-active' : ''}`}
              onClick={onOpenTutorial}
              title="Tutorials"
              aria-pressed={tutorialActive}
            >
              <BookOpen size={16} aria-hidden="true" />
              <span className="sr-only">Open tutorials</span>
            </button>
          )}
          {onOpenAbout && (
            <button
              type="button"
              className={`hardware-button nav-button ${aboutActive ? 'is-active' : ''}`}
              onClick={onOpenAbout}
              title="About the project"
              aria-pressed={aboutActive}
            >
              <Info size={16} aria-hidden="true" />
              <span className="sr-only">Open about page</span>
            </button>
          )}
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
      {shareMessage && (
        <div className={`share-banner share-banner--${shareState}`} role="status" aria-live="polite">
          {shareMessage}
        </div>
      )}
      
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
