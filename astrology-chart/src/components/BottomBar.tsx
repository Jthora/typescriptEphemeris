import React, { useState, useEffect, forwardRef } from 'react';
import { Clock, ChevronUp, ChevronDown, Share2, Loader2, Check, AlertTriangle } from 'lucide-react';
import type { BirthData } from '../astrology';
import type { ShareState } from '../utils/share/shareState';

interface BottomBarProps {
  isRealTimeMode: boolean;
  toggleRealTimeMode: () => void;
  resetToCurrentTime: () => void;
  birthData: BirthData;
  bottomPanelOpen?: boolean;
  toggleBottomPanel?: () => void;
  onShare?: () => void;
  shareDisabled?: boolean;
  shareState?: ShareState;
}

const BottomBar = forwardRef<HTMLDivElement, BottomBarProps>(({
  isRealTimeMode,
  toggleRealTimeMode,
  resetToCurrentTime,
  birthData,
  bottomPanelOpen = false,
  toggleBottomPanel,
  onShare,
  shareDisabled = false,
  shareState = 'idle'
}, ref) => {
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
  const isShareBusy = shareState === 'capturing' || shareState === 'sharing';
  const isShareSuccess = shareState === 'success';
  const isShareError = shareState === 'error';
  const isShareFallback = shareState === 'fallback';

  const shareButtonTitle = (() => {
    if (!onShare) return undefined;
    if (isShareBusy) return 'Preparing chart...';
    if (shareDisabled) return 'Share unavailable until chart is ready';
    if (isShareSuccess) return 'Shared successfully';
    if (isShareFallback) return 'Downloaded image (fallback)';
    if (isShareError) return 'Share failed';
    return 'Share chart';
  })();

  return (
    <div className="bottom-bar" ref={ref}>
      <div className="bottom-bar-content">
        <div className="bottom-bar-grid">
          <BottomBarTimeCluster
            chartDate={birthData.date}
            currentDateTime={currentDateTime}
            formatDate={formatDate}
            formatTime={formatTime}
          />

          <BottomBarToggleCluster
            toggleBottomPanel={toggleBottomPanel}
            bottomPanelOpen={bottomPanelOpen}
          />

          <BottomBarControls
            isRealTimeMode={isRealTimeMode}
            toggleRealTimeMode={toggleRealTimeMode}
            resetToCurrentTime={resetToCurrentTime}
            onShare={onShare}
            shareDisabled={shareDisabled}
            shareState={shareState}
            shareButtonTitle={shareButtonTitle}
            toggleBottomPanel={toggleBottomPanel}
            bottomPanelOpen={bottomPanelOpen}
          />
        </div>
      </div>
    </div>
  );
});

BottomBar.displayName = 'BottomBar';

export default BottomBar;

interface BottomBarTimeClusterProps {
  chartDate: Date;
  currentDateTime: Date;
  formatDate: (date: Date) => string;
  formatTime: (date: Date) => string;
}

const BottomBarTimeCluster: React.FC<BottomBarTimeClusterProps> = ({
  chartDate,
  currentDateTime,
  formatDate,
  formatTime
}) => (
  <div className="bottom-bar-cluster bottom-bar-time">
    <div className="time-displays">
      <TimeDisplay
        label="Now"
        variant="current-time"
        date={currentDateTime}
        formatDate={formatDate}
        formatTime={formatTime}
      />
      <TimeDisplay
        label="Chart"
        variant="birth-time"
        date={chartDate}
        formatDate={formatDate}
        formatTime={formatTime}
      />
    </div>
  </div>
);

interface TimeDisplayProps {
  label: string;
  variant: 'birth-time' | 'current-time';
  date: Date;
  formatDate: (date: Date) => string;
  formatTime: (date: Date) => string;
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({
  label,
  variant,
  date,
  formatDate,
  formatTime
}) => (
  <div className={`digital-display ${variant}`}>
    <div className="display-label">{label}</div>
    <div className="display-date">{formatDate(date)}</div>
    <div className="display-time">{formatTime(date)}</div>
  </div>
);

interface DrawerToggleButtonProps {
  toggleBottomPanel?: () => void;
  bottomPanelOpen: boolean;
  variant: 'desktop' | 'mobile';
}

const DrawerToggleButton: React.FC<DrawerToggleButtonProps> = ({
  toggleBottomPanel,
  bottomPanelOpen,
  variant
}) => {
  if (!toggleBottomPanel) return null;

  const classes = [
    'hardware-button',
    'bottom-drawer-toggle',
    variant === 'mobile' ? 'bottom-drawer-toggle--mobile' : 'bottom-drawer-toggle--desktop'
  ].join(' ');

  return (
    <button
      className={classes}
      onClick={toggleBottomPanel}
      title={bottomPanelOpen ? 'Hide tools' : 'Show tools'}
    >
      {bottomPanelOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
      <span className="sr-only">Toggle tools drawer</span>
    </button>
  );
};

interface BottomBarToggleClusterProps {
  toggleBottomPanel?: () => void;
  bottomPanelOpen: boolean;
}

const BottomBarToggleCluster: React.FC<BottomBarToggleClusterProps> = ({
  toggleBottomPanel,
  bottomPanelOpen
}) => (
  <div className="bottom-bar-cluster bottom-bar-toggle">
    <DrawerToggleButton
      toggleBottomPanel={toggleBottomPanel}
      bottomPanelOpen={bottomPanelOpen}
      variant="desktop"
    />
  </div>
);

interface ShareButtonProps {
  onShare?: () => void;
  shareDisabled: boolean;
  shareState: ShareState;
  shareButtonTitle?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({
  onShare,
  shareDisabled,
  shareState,
  shareButtonTitle
}) => {
  if (!onShare) return null;

  const isShareBusy = shareState === 'capturing' || shareState === 'sharing';
  const isShareSuccess = shareState === 'success';
  const isShareError = shareState === 'error';

  const icon = isShareBusy ? (
    <Loader2 size={16} className="spinning" aria-hidden="true" />
  ) : isShareSuccess ? (
    <Check size={16} aria-hidden="true" />
  ) : isShareError ? (
    <AlertTriangle size={16} aria-hidden="true" />
  ) : (
    <Share2 size={16} aria-hidden="true" />
  );

  return (
    <button
      type="button"
      className={`hardware-button share-button ${isShareBusy ? 'is-loading' : ''} ${isShareSuccess ? 'is-success' : ''} ${isShareError ? 'is-error' : ''}`}
      onClick={onShare}
      disabled={shareDisabled || isShareBusy}
      title={shareButtonTitle}
      aria-live="polite"
    >
      {icon}
      <span className="sr-only">Share chart</span>
    </button>
  );
};

interface BottomBarControlsProps {
  isRealTimeMode: boolean;
  toggleRealTimeMode: () => void;
  resetToCurrentTime: () => void;
  onShare?: () => void;
  shareDisabled: boolean;
  shareState: ShareState;
  shareButtonTitle?: string;
  toggleBottomPanel?: () => void;
  bottomPanelOpen: boolean;
}

const BottomBarControls: React.FC<BottomBarControlsProps> = ({
  isRealTimeMode,
  toggleRealTimeMode,
  resetToCurrentTime,
  onShare,
  shareDisabled,
  shareState,
  shareButtonTitle,
  toggleBottomPanel,
  bottomPanelOpen
}) => (
  <div className="bottom-bar-cluster bottom-bar-controls">
    <DrawerToggleButton
      toggleBottomPanel={toggleBottomPanel}
      bottomPanelOpen={bottomPanelOpen}
      variant="mobile"
    />

    <ShareButton
      onShare={onShare}
      shareDisabled={shareDisabled}
      shareState={shareState}
      shareButtonTitle={shareButtonTitle}
    />

    <button
      className={`hardware-button ${isRealTimeMode ? 'active' : ''}`}
      onClick={toggleRealTimeMode}
      title={isRealTimeMode ? 'Pause real-time updates' : 'Enable real-time updates'}
    >
      <span className={`led-indicator ${isRealTimeMode ? 'active' : ''}`}></span>
      <Clock size={14} />
      {isRealTimeMode ? 'Real-time' : 'Manual'}
    </button>

    <button
      className="hardware-button"
      onClick={resetToCurrentTime}
      title="Reset to current time"
    >
      <Clock size={14} /> Now
    </button>
  </div>
);
