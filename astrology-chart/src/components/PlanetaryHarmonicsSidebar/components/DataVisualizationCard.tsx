import React from 'react';
import type { DataVisualizationCardProps } from '../types';
import { LoadingIndicator } from './LoadingIndicator';

/**
 * Reusable data visualization card container with loading states
 */
export const DataVisualizationCard: React.FC<DataVisualizationCardProps> = ({
  title,
  data,
  renderContent,
  loading = false,
  error,
  className = ''
}) => {
  const cardClass = [
    'data-card',
    loading ? 'data-card--loading' : '',
    error ? 'data-card--error' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClass}>
      <div className="data-card-header">
        <h4 className="data-card-title">{title}</h4>
        {loading && (
          <LoadingIndicator 
            variant="pulse" 
            size="small" 
          />
        )}
      </div>
      
      <div className="data-card-content">
        {error ? (
          <div className="data-card-error">
            <span className="error-icon">❌</span>
            <span className="error-message">{error}</span>
          </div>
        ) : loading ? (
          <LoadingIndicator 
            variant="bars" 
            size="medium" 
            message="Loading data..." 
          />
        ) : (
          renderContent(data)
        )}
      </div>
    </div>
  );
};
