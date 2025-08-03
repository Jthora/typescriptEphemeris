import React, { useEffect, useState } from 'react';
import type { ProgressBarProps } from '../types';
import { clamp } from '../utils';

/**
 * Enhanced reusable progress bar component with mechanical styling and animations
 * Supports different variants, staggered animations, and mechanical feedback
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 1.0,
  variant = 'harmonic',
  color,
  showValue = false,
  showLabel = false,
  animated = true,
  size = 'medium',
  className = '',
  staggerDelay = 0,
  mechanical = true
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const normalizedValue = clamp(value / max, 0, 1);
  const percentage = Math.round(normalizedValue * 100);
  
  // Staggered animation effect
  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimatedValue(normalizedValue);
      }, staggerDelay);
      
      return () => clearTimeout(timer);
    } else {
      setAnimatedValue(normalizedValue);
    }
  }, [normalizedValue, animated, staggerDelay]);

  const progressBarClass = [
    'progress-bar',
    `progress-bar--${variant}`,
    `progress-bar--${size}`,
    animated ? 'progress-bar--animated' : '',
    mechanical ? 'progress-bar--mechanical' : '',
    className
  ].filter(Boolean).join(' ');
  
  const displayValue = animated ? animatedValue : normalizedValue;
  const displayPercentage = Math.round(displayValue * 100);
  
  const fillStyle: React.CSSProperties = {
    width: `${displayPercentage}%`,
    ...(color && { '--progress-color': color } as any)
  };
  
  return (
    <div 
      className={progressBarClass} 
      role="progressbar" 
      aria-valuenow={percentage} 
      aria-valuemin={0} 
      aria-valuemax={100}
      style={{ '--stagger-delay': `${staggerDelay}ms` } as any}
    >
      <div className="progress-track">
        <div className="progress-fill" style={fillStyle} />
        {mechanical && <div className="progress-highlight" />}
      </div>
      {(showLabel || showValue) && (
        <span className="progress-label" aria-live="polite">
          {showValue ? value.toFixed(3) : `${percentage}%`}
        </span>
      )}
    </div>
  );
};
