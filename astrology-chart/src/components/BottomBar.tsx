import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import type { BirthData } from '../astrology';

interface BottomBarProps {
  isRealTimeMode: boolean;
  toggleRealTimeMode: () => void;
  resetToCurrentTime: () => void;
  birthData: BirthData;
}

const BottomBar: React.FC<BottomBarProps> = ({
  isRealTimeMode,
  toggleRealTimeMode,
  resetToCurrentTime,
  birthData
}) => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Update current time every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    
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
        
        <div className="bottom-bar-section">
          {/* Center of the bottom bar */}
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
