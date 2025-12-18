import React, { useState } from 'react';
import { BookOpen, CalendarDays, Download, Info, Home } from 'lucide-react';
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
  onOpenCalendar?: () => void;
  onOpenCalendarDownloads?: () => void;
  tutorialActive?: boolean;
  aboutActive?: boolean;
  calendarActive?: boolean;
  calendarDownloadsActive?: boolean;
  showShareButton?: boolean;
  onNavigateHome?: () => void;
  homeActive?: boolean;
}

const TopBar: React.FC<TopBarProps> = ({
  shareState = 'idle',
  shareMessage,
  onOpenTutorial,
  onOpenAbout,
  onOpenCalendar,
  onOpenCalendarDownloads,
  tutorialActive = false,
  aboutActive = false,
  calendarActive = false,
  calendarDownloadsActive = false,
  onNavigateHome,
  homeActive = false,
  
}) => {
  const [showPerformanceTest, setShowPerformanceTest] = useState(false);
  return (
    <>
      <div className="top-bar hardware-panel">
        <div className="top-bar-left">
          <a
            href="https://archangel.agency/hub"
            target="_blank"
            rel="noreferrer"
            aria-label="Open Archangel Agency hub"
          >
            <img src={WingCommanderLogo} alt="Wing Commander insignia" className="wing-commander-logo" />
          </a>
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
          {onOpenCalendar && (
            <button
              type="button"
              className={`hardware-button nav-button ${calendarActive ? 'is-active' : ''}`}
              onClick={onOpenCalendar}
              title="Calendar view"
              aria-pressed={calendarActive}
            >
              <CalendarDays size={16} aria-hidden="true" />
              <span className="sr-only">Open calendar view</span>
            </button>
          )}
          {onOpenCalendarDownloads && (
            <button
              type="button"
              className={`hardware-button nav-button ${calendarDownloadsActive ? 'is-active' : ''}`}
              onClick={onOpenCalendarDownloads}
              title="ICS downloads"
              aria-pressed={calendarDownloadsActive}
            >
              <Download size={16} aria-hidden="true" />
              <span className="sr-only">Open ICS downloads</span>
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
