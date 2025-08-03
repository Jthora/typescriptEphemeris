import React from 'react';
import type { StatusIndicatorProps } from '../types';

/**
 * Enhanced status indicator component with mechanical animations and loading states
 */
export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  message,
  showIcon = true,
  loadingVariant = 'pulse',
  size = 'medium'
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'calculating': return '⚙️';
      case 'ready': return '✅';
      case 'error': return '❌';
      default: return '⚫';
    }
  };
  
  const indicatorClass = [
    'status-indicator',
    `status-indicator--${status}`,
    `status-indicator--${size}`,
    status === 'calculating' ? `status-indicator--${loadingVariant}` : ''
  ].filter(Boolean).join(' ');
  
  const renderLoadingAnimation = () => {
    if (status !== 'calculating') return null;
    
    switch (loadingVariant) {
      case 'spinner':
        return <div className="loading-spinner mechanical" />;
      case 'bars':
        return (
          <div className="loading-bars">
            <div className="bar" />
            <div className="bar" />
            <div className="bar" />
          </div>
        );
      case 'pulse':
      default:
        return <div className="loading-pulse" />;
    }
  };
  
  return (
    <div className={indicatorClass} role="status" aria-live="polite">
      <div className="status-content">
        {status === 'calculating' && renderLoadingAnimation()}
        {showIcon && (
          <span className={`status-icon ${status === 'calculating' ? 'animated' : ''}`}>
            {getStatusIcon(status)}
          </span>
        )}
        <span className="status-text">
          {message || (
            status === 'calculating' ? 'Calculating harmonics...' :
            status === 'ready' ? 'Ready' :
            status === 'error' ? 'Calculation Error' : 'Unknown Status'
          )}
        </span>
      </div>
      {status === 'calculating' && (
        <div className="calculation-progress">
          <div className="progress-dots">
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </div>
        </div>
      )}
    </div>
  );
};
