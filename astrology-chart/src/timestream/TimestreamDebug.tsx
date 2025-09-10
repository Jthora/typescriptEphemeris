/**
 * M3 debug component (refined): visualizes tile coverage using the useTimestreamData hook
 * with manual pan & span controls. This supersedes the earlier typo file TilstestreamDebug.tsx.
 */
import React, { useState, useCallback } from 'react';
import { useTimestreamData } from './useTimestreamData';

interface TimestreamDebugProps {
  initialSpanHours?: number; // total window span in hours
  initialCenterTimeMs?: number; // center time (defaults now)
}

const hourMs = 3600 * 1000;

const TimestreamDebug: React.FC<TimestreamDebugProps> = ({ initialSpanHours = 12, initialCenterTimeMs }) => {
  const [center, setCenter] = useState(initialCenterTimeMs ?? Date.now());
  const [spanHours, setSpanHours] = useState(initialSpanHours);
  const spanMs = spanHours * hourMs;

  const { tiles, loading, windowStartMs, windowEndMs, requestWindow } = useTimestreamData({
    centerTimeMs: center,
    spanMs,
    prefetchTiles: 1
  });

  const pan = useCallback((hours: number) => {
    setCenter(c => {
      const newCenter = c + hours * hourMs;
      requestWindow(newCenter, spanMs);
      return newCenter;
    });
  }, [requestWindow, spanMs]);

  const changeSpan = useCallback((deltaHours: number) => {
    setSpanHours(h => {
      const nh = Math.min(240, Math.max(1, h + deltaHours));
      requestWindow(center, nh * hourMs);
      return nh;
    });
  }, [center, requestWindow]);

  const totalSpanMs = windowEndMs - windowStartMs;

  return (
    <div style={{ fontFamily: 'monospace', padding: 8, background: '#111', color: '#ddd', border: '1px solid #333', borderRadius: 4 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <strong>Timestream Debug (M3)</strong>
        <button onClick={() => pan(-spanHours * 0.25)} style={btn}>« Pan -25%</button>
        <button onClick={() => pan(-1)} style={btn}>« Pan -1h</button>
        <button onClick={() => pan(1)} style={btn}>Pan +1h »</button>
        <button onClick={() => pan(spanHours * 0.25)} style={btn}>Pan +25% »</button>
        <button onClick={() => changeSpan(-1)} style={btn}>− Span</button>
        <button onClick={() => changeSpan(1)} style={btn}>+ Span</button>
        <span style={{ fontSize: 11, opacity: 0.8 }}>Span: {spanHours}h | Center: {new Date(center).toLocaleTimeString()}</span>
      </div>
      <div style={{ fontSize: 11, opacity: 0.7, marginTop: 4 }}>
        window: {new Date(windowStartMs).toLocaleTimeString()} — {new Date(windowEndMs).toLocaleTimeString()} | tiles: {tiles.length} {loading ? '(loading...)' : ''}
      </div>
      <div style={{ position: 'relative', height: 40, background: '#222', marginTop: 6, overflow: 'hidden', border: '1px solid #444' }}>
        {tiles.map(tile => {
          const tileStart = tile.startTimeMs;
          const tileEnd = tile.startTimeMs + tile.cols * tile.stepMs;
          const leftPct = ((tileStart - windowStartMs) / totalSpanMs) * 100;
          const widthPct = ((tileEnd - tileStart) / totalSpanMs) * 100;
          return (
            <div
              key={tile.id}
              title={`tile ${tile.id}`}
              style={{
                position: 'absolute',
                left: `${leftPct}%`,
                width: `${widthPct}%`,
                top: 6,
                bottom: 6,
                background: 'linear-gradient(90deg,#444,#666)',
                border: '1px solid #555',
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
                color: '#bbb'
              }}
            >
              {tile.cols}
            </div>
          );
        })}
      </div>
      <div style={{ fontSize: 10, marginTop: 6, opacity: 0.6 }}>
        Use pan & span controls to trigger dynamic tile requests. Prefetch=1. LOD0 only.
      </div>
    </div>
  );
};

const btn: React.CSSProperties = {
  background: '#262626',
  color: '#ddd',
  border: '1px solid #444',
  padding: '2px 6px',
  fontSize: 11,
  cursor: 'pointer'
};

export default TimestreamDebug;
