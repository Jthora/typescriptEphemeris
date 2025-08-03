import React from 'react';
import type { LoadingIndicatorProps } from '../types';

/**
 * Mechanical loading indicator with multiple variants
 */
export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  variant = 'pulse',
  size = 'medium',
  message
}) => {
  const indicatorClass = [
    'loading-indicator',
    `loading-indicator--${variant}`,
    `loading-indicator--${size}`
  ].filter(Boolean).join(' ');

  const renderIndicator = () => {
    switch (variant) {
      case 'spinner':
        return <div className="loading-spinner" />;
      
      case 'bars':
        return (
          <div className="loading-bars">
            <div className="loading-bar" />
            <div className="loading-bar" />
            <div className="loading-bar" />
            <div className="loading-bar" />
          </div>
        );
      
      case 'pulse':
      default:
        return <div className="loading-pulse">⚙️</div>;
    }
  };

  return (
    <div className={indicatorClass} role="status" aria-live="polite">
      {renderIndicator()}
      {message && <span className="loading-message">{message}</span>}
    </div>
  );
};
