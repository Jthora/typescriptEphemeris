/**
 * TimestreamFallbackCanvas (M11 FALLBACK)
 * Basic 2D canvas renderer used when WebGL2 is unavailable.
 * Renders element vectors as horizontal bands similar to WebGL path.
 */
import React, { useEffect, useRef } from 'react';
import type { TimestreamTile } from './types';

export interface TimestreamFallbackCanvasProps {
  tiles: TimestreamTile[];
  timeStartMs: number;
  timeEndMs: number;
  blendMode?: 'multiply' | 'additive' | 'screen' | 'overlay' | 'difference';
  highlightGain?: number;
  highlightMode?: 'off' | 'purity' | 'balance';
  onHoverTime?: (t: number | null) => void;
  onPan?: (delta: number) => void;
  onZoom?: (factor: number, anchor: number) => void;
  width?: number;
  height?: number;
  planetOrder?: string[]; // Ordering integrity: apply reorder via rowMap now
}

const TimestreamFallbackCanvas: React.FC<TimestreamFallbackCanvasProps> = ({
  tiles,
  timeStartMs,
  timeEndMs,
  onHoverTime,
  onPan,
  onZoom,
  width = 800,
  height = 200,
  planetOrder
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dragging = useRef(false);
  const dragOriginX = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
  ctx.fillStyle = '#000'; ctx.fillRect(0,0,width,height);
    if (!tiles.length) return;
    const canonicalBodies = tiles[0].bodies || [];
    const srcRows = tiles[0].rows;
    const displayOrder = planetOrder && planetOrder.length ? planetOrder : canonicalBodies;
    const rowMap = displayOrder.map(p => canonicalBodies.indexOf(p)); // may include -1 sentinel
    const displayRows = rowMap.length;
    // Draw each tile sequentially applying rowMap indirection
    for (const tile of tiles) {
      if (!tile.buffer || tile.rows !== srcRows) continue; // skip mismatched
      const cols = tile.cols;
      for (let c=0;c<cols;c++) {
        const t = tile.startTimeMs + c * tile.stepMs;
        if (t < timeStartMs || t > timeEndMs) continue;
        const u = (t - timeStartMs) / (timeEndMs - timeStartMs);
        const x = Math.floor(u * width);
        for (let dr=0; dr<displayRows; dr++) {
          const sr = rowMap[dr];
            if (sr == null || sr < 0 || sr >= srcRows) continue; // transparent lane
          const idx = (sr * cols + c) * 4;
          const fire = tile.buffer[idx];
          const earth = tile.buffer[idx+1];
          const air = tile.buffer[idx+2];
          const water = tile.buffer[idx+3];
          const avg = (fire + earth + air + water) / 4;
          ctx.fillStyle = `rgb(${avg},${avg},${avg})`;
          const y0 = Math.floor(dr * (height / displayRows));
          const y1 = Math.floor((dr+1) * (height / displayRows));
          ctx.fillRect(x, y0, 1, Math.max(1, y1 - y0));
        }
      }
    }
    // Timeline border
    ctx.strokeStyle = '#222';
    ctx.strokeRect(0,0,width,height);
    // Ordering diagnostics: highlight any invalid (-1) mappings visually (red corner marker)
    if (rowMap.some(i => i < 0)) {
      ctx.fillStyle = '#500'; ctx.fillRect(0,0,50,10);
      ctx.fillStyle = '#f88'; ctx.font = '10px monospace'; ctx.fillText('MISSING', 2,9);
      if (import.meta.env.DEV) console.warn('[TimestreamFallback] Missing planet rows (sentinel -1)');
    }
  }, [tiles, timeStartMs, timeEndMs, width, height]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={`Timestream fallback view from ${new Date(timeStartMs).toISOString()} to ${new Date(timeEndMs).toISOString()}`}
      width={width}
      height={height}
      tabIndex={0}
      style={{ width: '100%', height: '100%', background: '#000', cursor: dragging.current ? 'grabbing' : 'grab' }}
      onPointerDown={e => { dragging.current = true; dragOriginX.current = e.clientX; (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId); }}
      onPointerUp={e => { dragging.current = false; (e.target as HTMLCanvasElement).releasePointerCapture(e.pointerId); }}
      onPointerMove={e => {
        const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
        const t = timeStartMs + ((e.clientX - rect.left) / rect.width) * (timeEndMs - timeStartMs);
        onHoverTime?.(t);
        if (dragging.current && onPan) {
          const dx = e.clientX - dragOriginX.current;
          const frac = dx / rect.width;
          const delta = -frac * (timeEndMs - timeStartMs);
          onPan(delta);
        }
      }}
      onPointerLeave={() => onHoverTime?.(null)}
      onWheel={e => { if (!onZoom) return; e.preventDefault(); const rect = (e.target as HTMLCanvasElement).getBoundingClientRect(); const anchor = timeStartMs + ((e.clientX - rect.left)/rect.width)*(timeEndMs - timeStartMs); const factor = Math.exp(e.deltaY * 0.001); onZoom(factor, anchor); }}
      onKeyDown={e => {
        if (!onPan || !onZoom) return;
        if (e.key === 'ArrowLeft') { onPan((timeEndMs - timeStartMs) * -0.05); }
        else if (e.key === 'ArrowRight') { onPan((timeEndMs - timeStartMs) * 0.05); }
        else if (e.key === '+') { onZoom(0.9, (timeStartMs + timeEndMs)/2); }
        else if (e.key === '-') { onZoom(1.1, (timeStartMs + timeEndMs)/2); }
      }}
    />
  );
};

export default TimestreamFallbackCanvas;
