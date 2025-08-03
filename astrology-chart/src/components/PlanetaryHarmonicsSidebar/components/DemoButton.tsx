import React, { useState } from 'react';
import type { DemoButtonProps } from '../types';

/**
 * Enhanced mechanical demo button component with sophisticated press/release feedback
 */
export const DemoButton: React.FC<DemoButtonProps> = ({
  onDemo,
  loading = false,
  disabled = false,
  variant = 'primary',
  children
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const buttonClass = [
    'mechanical-button',
    `mechanical-button--${variant}`,
    loading ? 'mechanical-button--loading' : '',
    disabled ? 'mechanical-button--disabled' : '',
    isPressed ? 'mechanical-button--pressed' : '',
    isHovered ? 'mechanical-button--hovered' : ''
  ].filter(Boolean).join(' ');
  
  const handleClick = () => {
    if (!loading && !disabled) {
      onDemo();
    }
  };

  const handleMouseDown = () => {
    if (!loading && !disabled) {
      setIsPressed(true);
    }
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleMouseEnter = () => {
    if (!loading && !disabled) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
  };
  
  return (
    <button 
      className={buttonClass}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={loading || disabled}
      aria-busy={loading}
    >
      <div className="button-surface">
        {loading ? (
          <div className="loading-content">
            <span className="loading-spinner" />
            <span className="loading-text">Calculating...</span>
          </div>
        ) : (
          <div className="button-content">
            {children}
          </div>
        )}
      </div>
      <div className="button-shadow" />
    </button>
  );
};
