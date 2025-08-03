import React from 'react';
import type { AnimatedProgressBarProps } from '../types';
import { ProgressBar } from './ProgressBar';

/**
 * Enhanced progress bar with staggered animations and mechanical timing
 */
export const AnimatedProgressBar: React.FC<AnimatedProgressBarProps> = ({
  value,
  variant = 'harmonic',
  color,
  showLabel = false,
  animated = true,
  staggerDelay = 0,
  animationDuration = 400,
  easingFunction = 'cubic-bezier(0.190, 1.000, 0.220, 1.000)',
  className = ''
}) => {
  const animatedClass = [
    'animated-progress-bar',
    animated ? 'animated-progress-bar--animated' : '',
    className
  ].filter(Boolean).join(' ');

  const animationStyle: React.CSSProperties = animated ? {
    '--animation-delay': `${staggerDelay}ms`,
    '--animation-duration': `${animationDuration}ms`,
    '--animation-easing': easingFunction,
  } as React.CSSProperties : {};

  return (
    <div className={animatedClass} style={animationStyle}>
      <ProgressBar
        value={value}
        variant={variant}
        color={color}
        showLabel={showLabel}
        animated={animated}
      />
    </div>
  );
};
