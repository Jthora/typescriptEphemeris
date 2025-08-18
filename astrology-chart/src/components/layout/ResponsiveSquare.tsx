import React, { useRef, useMemo } from 'react';
import { useResizeObserver } from './useResizeObserver';

export interface ResponsiveSquareProps {
  /** Minimum side length in px */
  min?: number;
  /** Maximum side length in px (use Infinity for no cap) */
  max?: number;
  /** Inner padding applied (px) */
  padding?: number;
  /** Called when computed size changes */
  onSizeChange?(size: number): void;
  /** Render prop receiving the square dimension */
  children: (size: number) => React.ReactNode;
  /** Optional className for outer container */
  className?: string;
  /** Strategy determines how padding is applied (currently single strategy) */
  scaleStrategy?: 'fit';
}

/**
 * ResponsiveSquare - observes its own width/height and renders a square area fitting inside it.
 * Maintains 1:1 aspect while honoring min/max constraints and padding.
 */
export const ResponsiveSquare: React.FC<ResponsiveSquareProps> = ({
  min = 240,
  max = 1600,
  padding = 0,
  onSizeChange,
  children,
  className,
}) => {
  const outerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useResizeObserver(outerRef);

  const size = useMemo(() => {
    if (!width || !height) return Math.max(min, padding * 2);
    const raw = Math.min(width, height) - padding * 2;
    return Math.max(min, Math.min(max, raw));
  }, [width, height, min, max, padding]);

  React.useEffect(() => {
    if (onSizeChange) onSizeChange(size);
  }, [size, onSizeChange]);

  return (
    <div ref={outerRef} className={className} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div
        className="responsive-square"
        style={{
          position: 'absolute',
          left: '50%',
            top: '50%',
          transform: 'translate(-50%, -50%)',
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {children(size)}
      </div>
    </div>
  );
};

export default ResponsiveSquare;
