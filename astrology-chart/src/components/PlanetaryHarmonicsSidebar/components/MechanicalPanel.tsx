import React, { useState } from 'react';
import type { MechanicalPanelProps } from '../types';

/**
 * Enhanced container component with sophisticated hardware aesthetics and mechanical design
 */
export const MechanicalPanel: React.FC<MechanicalPanelProps> = ({
  title,
  children,
  variant = 'primary',
  showRivets = true,
  collapsible = false,
  className = ''
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const panelClass = [
    'mechanical-panel',
    `mechanical-panel--${variant}`,
    isCollapsed ? 'mechanical-panel--collapsed' : '',
    isHovered ? 'mechanical-panel--hovered' : '',
    className
  ].filter(Boolean).join(' ');
  
  const headerClass = [
    'panel-header',
    showRivets ? 'panel-header--with-rivets' : '',
    collapsible ? 'panel-header--collapsible' : ''
  ].filter(Boolean).join(' ');
  
  const toggleCollapse = () => {
    if (collapsible) {
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  
  return (
    <div 
      className={panelClass}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Hardware elements */}
      <div className="panel-hardware">
        {showRivets && (
          <>
            <div className="rivet rivet--top-left" />
            <div className="rivet rivet--top-right" />
            <div className="rivet rivet--bottom-left" />
            <div className="rivet rivet--bottom-right" />
          </>
        )}
        <div className="panel-lip" />
        <div className="panel-edge-highlight" />
      </div>
      
      <div className={headerClass}>
        <h3 
          className="panel-title"
          onClick={toggleCollapse}
          style={{ cursor: collapsible ? 'pointer' : 'default' }}
          role={collapsible ? 'button' : undefined}
          tabIndex={collapsible ? 0 : undefined}
          onKeyDown={(e) => {
            if (collapsible && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              toggleCollapse();
            }
          }}
        >
          {title}
          {collapsible && (
            <span className={`collapse-indicator ${isCollapsed ? 'collapsed' : 'expanded'}`}>
              {isCollapsed ? ' ▶' : ' ▼'}
            </span>
          )}
        </h3>
        {showRivets && (
          <div className="header-rivets">
            <div className="header-rivet" />
            <div className="header-rivet" />
          </div>
        )}
      </div>
      
      <div className={`panel-content ${isCollapsed ? 'collapsed' : 'expanded'}`}>
        {(!collapsible || !isCollapsed) && children}
      </div>
    </div>
  );
};
