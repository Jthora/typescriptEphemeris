import React, { useState, useEffect } from 'react';
import { Clock, ChevronUp, ChevronDown } from 'lucide-react';
import type { BirthData } from '../astrology';

interface BottomBarProps {
  isRealTimeMode: boolean;
  toggleRealTimeMode: () => void;
  resetToCurrentTime: () => void;
  birthData: BirthData;
  bottomPanelOpen?: boolean;
  toggleBottomPanel?: () => void;
}

const BottomBar: React.FC<BottomBarProps> = ({
  isRealTimeMode,
  toggleRealTimeMode,
  resetToCurrentTime,
  birthData,
  bottomPanelOpen = false,
  toggleBottomPanel
}) => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Update current time every second for UI display (independent of chart calculations)
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000); // Keep 1-second UI updates for responsive time display
    
    return () => clearInterval(intervalId);
  }, []);

  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format time for display
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };
  return (
    <div className="bottom-bar">
      <div className="bottom-bar-content">
        <div className="bottom-bar-section">
          {/* Left side digital displays */}
          <div className="time-displays">
            {/* Birth chart date/time display */}
            <div className="digital-display birth-time">
              <div className="display-label">Chart</div>
              <div className="display-date">{formatDate(birthData.date)}</div>
              <div className="display-time">{formatTime(birthData.date)}</div>
            </div>
            
            {/* Current date/time display */}
            <div className="digital-display current-time">
              <div className="display-label">Now</div>
              <div className="display-date">{formatDate(currentDateTime)}</div>
              <div className="display-time">{formatTime(currentDateTime)}</div>
            </div>
          </div>
        </div>
        
        <div className="bottom-bar-section center-toggle">
          {/* Center toggle button for bottom drawer */}
          <button
            className="hardware-button bottom-drawer-toggle"
            onClick={toggleBottomPanel}
            title={bottomPanelOpen ? 'Hide tools' : 'Show tools'}
          >
            {bottomPanelOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        </div>
        
        <div className="bottom-bar-section controls">
          {/* Right side with controls */}
          <button 
            className={`hardware-button ${isRealTimeMode ? 'active' : ''}`}
            onClick={toggleRealTimeMode}
            title={isRealTimeMode ? "Pause real-time updates" : "Enable real-time updates"}
          >
            <span className={`led-indicator ${isRealTimeMode ? 'active' : ''}`}></span>
            <Clock size={14} />
            {isRealTimeMode ? "Real-time" : "Manual"}
          </button>

          <button 
            className="hardware-button"
            onClick={resetToCurrentTime}
            title="Reset to current time"
          >
            <Clock size={14} /> Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default BottomBar;
