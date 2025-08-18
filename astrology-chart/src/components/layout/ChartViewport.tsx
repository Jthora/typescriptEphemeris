import React, { useState } from 'react';

export interface ChartViewportProps {
  size: number;
  children: React.ReactNode;
  frame?: boolean;
  enableZoom?: boolean;
  zoomLimits?: { min: number; max: number };
  className?: string;
}

/**
 * ChartViewport - optional framing + (future) pan/zoom container for chart visualizations.
 */
export const ChartViewport: React.FC<ChartViewportProps> = ({
  size,
  children,
  frame = true,
  enableZoom = false,
  zoomLimits = { min: 0.5, max: 2 },
  className,
}) => {
  const [zoom, setZoom] = useState(1);

  const handleWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    if (!enableZoom || !e.ctrlKey) return; // require ctrl+wheel to zoom
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    setZoom((z) => Math.min(zoomLimits.max, Math.max(zoomLimits.min, z + delta)));
  };

  return (
    <div
      className={className}
      onWheel={handleWheel}
      style={{
        position: 'relative',
        width: size,
        height: size,
        overflow: 'hidden',
        border: frame ? 'var(--border-width) var(--border-style) var(--border-color)' : 'none',
        background: frame ? 'var(--color-surface)' : 'transparent',
        boxShadow: frame ? 'inset 0 0 20px var(--color-shadow)' : 'none',
        clipPath: frame
          ? 'polygon(0 20px, 20px 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0 calc(100% - 20px))'
          : undefined,
        transition: 'width 120ms ease, height 120ms ease',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          transform: `scale(${zoom})`,
          transformOrigin: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </div>
      {frame && (
        <>
          <div className="chart-corner chart-corner-bl" />
          <div className="chart-corner chart-corner-br" />
          <div className="chart-measure-line horizontal top" />
          <div className="chart-measure-line horizontal bottom" />
          <div className="chart-measure-line vertical left" />
          <div className="chart-measure-line vertical right" />
        </>
      )}
    </div>
  );
};

export default ChartViewport;
