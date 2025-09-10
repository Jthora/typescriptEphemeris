import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import TimestreamDebug from '../timestream/TimestreamDebug';
import { useTimestreamData } from '../timestream/useTimestreamData';
import TimestreamCanvas from '../timestream/TimestreamCanvas';
import TimestreamFallbackCanvas from '../timestream/TimestreamFallbackCanvas';
import { DEFAULT_PLANET_ORDER } from '../timestream/constants';
import InfoBar from './InfoBar';

interface BottomDrawerContextValue {
  // Placeholder for future state (tabs, filters, etc.)
}

const BottomDrawerContext = createContext<BottomDrawerContextValue | undefined>(undefined);

const useBottomDrawer = () => {
  const ctx = useContext(BottomDrawerContext);
  if (!ctx) throw new Error('useBottomDrawer must be used within BottomDrawerProvider');
  return ctx;
};

const BottomDrawerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value: BottomDrawerContextValue = {};
  return <BottomDrawerContext.Provider value={value}>{children}</BottomDrawerContext.Provider>;
};

const BottomDrawerHeader: React.FC = () => (
  <div className="bottom-drawer-header">
    <h3>Tools</h3>
  </div>
);

const BottomDrawerBody: React.FC = () => {
  const initialCenter = Date.now();
  const [center, setCenter] = useState(initialCenter);
  const [spanMs, setSpanMs] = useState(12 * 3600 * 1000); // 12h window
  const { tiles, requestWindow, lod, prevLodTiles, nextLodTiles, refinedTiles, residentTileCount, pendingRequests, avgTileGenMs } = useTimestreamData({ centerTimeMs: center, spanMs, prefetchTiles: 1 });
  const [blendMode, setBlendMode] = useState<'multiply' | 'additive' | 'screen' | 'overlay' | 'difference'>('multiply');
  const [highlightGain, setHighlightGain] = useState(0);
  const [highlightMode, setHighlightMode] = useState<'off' | 'purity' | 'balance'>('off');
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverDetail, setHoverDetail] = useState<any>(null);
  const [stats, setStats] = useState<{ drawMs: number; tiles: number; rows: number; cols: number; lod?: number; uploadMode?: 'full' | 'sub'; uploadMs?: number } | null>(null);
  const STORAGE_KEY = 'timestreamPlanetOrderV1';
  const [planetOrder, setPlanetOrder] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.every(p => typeof p === 'string')) {
          // Include any newly added planets not in saved order
          const merged = [...parsed, ...DEFAULT_PLANET_ORDER.filter(p => !parsed.includes(p))];
          return merged;
        }
      }
    } catch {}
    return DEFAULT_PLANET_ORDER;
  });
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(planetOrder)); } catch {}
  }, [planetOrder]);
  // Phase 1 (Ordering Integrity): build rowMap safely with instrumentation counts.
  const [rowMap, invalidRowMapCount] = React.useMemo(() => {
    if (!tiles.length || !tiles[0]?.bodies) return [[], 0] as [number[], number];
    const bodies = tiles[0].bodies;
    const raw = planetOrder.map(p => bodies.indexOf(p));
    const invalidCount = raw.filter(i => i < 0).length;
    // Phase 2: Preserve -1 sentinel; shader will render these rows transparent.
    return [raw, invalidCount];
  }, [planetOrder, tiles]);

  const handlePan = useCallback((delta: number) => {
    const newCenter = center + delta;
    setCenter(newCenter);
    requestWindow(newCenter, spanMs);
  }, [center, spanMs, requestWindow]);

  const handleZoom = useCallback((factor: number, anchor: number) => {
    const newSpan = Math.min(48 * 3600 * 1000, Math.max(15 * 60 * 1000, spanMs * factor)); // clamp 15m .. 48h
    // Keep anchor time stable: compute new center so that anchor maintains same relative position
    const rel = (anchor - (center - spanMs/2)) / spanMs; // 0..1
    const newCenter = anchor - rel * newSpan + newSpan/2;
    setSpanMs(newSpan);
    setCenter(newCenter);
    requestWindow(newCenter, newSpan);
  }, [center, spanMs, requestWindow]);

  const movePlanet = (index: number, dir: -1 | 1) => {
    setPlanetOrder(prev => {
      const next = [...prev];
      const ni = index + dir;
      if (ni < 0 || ni >= next.length) return prev;
      const tmp = next[index]; next[index] = next[ni]; next[ni] = tmp;
      return next;
    });
  };

  const windowStart = center - spanMs/2;
  const windowEnd = center + spanMs/2;

  const canvasRefState = useRef<HTMLCanvasElement | null>(null);
  const handleExport = () => {
    if (!canvasRefState.current) return;
    const url = canvasRefState.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url; a.download = `timestream-${Date.now()}.png`; a.click();
  };

  const msPerPixel = stats && stats.cols ? stats.drawMs / stats.cols : null;

  const [webglSupported, setWebglSupported] = useState(true);
  useEffect(() => {
    try {
      const c = document.createElement('canvas');
      const ok = !!c.getContext('webgl2');
      setWebglSupported(ok);
    } catch { setWebglSupported(false); }
  }, []);

  const [diagWarning, setDiagWarning] = useState<string | null>(null);
  const [lastDiag, setLastDiag] = useState<any>(null);
  // Watchdog + diag poll
  useEffect(() => {
    const id = setInterval(() => {
      const diagApi: any = (window as any).__timestreamDiag;
      if (diagApi) {
        const frames = diagApi.get();
        if (frames.length) setLastDiag(frames[frames.length - 1]);
        const recent = frames.slice(-5);
        if (recent.length === 5) {
          const low = recent.every((f: any) => f.tiles === 0 || f.coveragePct < 0.05);
          if (low) setDiagWarning('Coverage lost (tiles=0 or <5% over last 5 frames)');
          else if (diagWarning) setDiagWarning(null);
        }
      }
    }, 1000);
    return () => clearInterval(id);
  }, [diagWarning]);
  const exportDiag = () => {
    const diagApi: any = (window as any).__timestreamDiag;
    if (!diagApi) return;
    const blob = new Blob([diagApi.export()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `timestream-diag-${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="bottom-drawer-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <TimestreamDebug />
  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, flexWrap: 'nowrap', minHeight: 24, overflow: 'hidden' }}>
        <label style={{ color: '#ccc' }}>Blend:</label>
  <select value={blendMode} onChange={e => setBlendMode(e.target.value as any)} style={{ background: '#111', color: '#eee', border: '1px solid #333', borderRadius: 4, padding: '1px 4px' }}>
          <option value="multiply">Multiply</option>
          <option value="additive">Additive</option>
          <option value="screen">Screen</option>
          <option value="overlay">Overlay</option>
          <option value="difference">Difference</option>
        </select>
  <label style={{ color: '#666', display: 'flex', alignItems: 'center', gap: 3 }}>
          <span>Highlight</span>
          <input type="range" min={0} max={1} step={0.05} value={highlightGain} onChange={e => setHighlightGain(parseFloat(e.target.value))} />
        </label>
  <select value={highlightMode} onChange={e => setHighlightMode(e.target.value as any)} style={{ background: '#111', color: '#eee', border: '1px solid #333', borderRadius: 4, padding: '1px 4px' }}>
          <option value="off">No Highlight</option>
          <option value="purity">Purity</option>
          <option value="balance">Balance</option>
        </select>
        <button onClick={handleExport} style={{ ...btn, background: '#143', borderColor: '#285' }}>Export PNG</button>
        <button onClick={exportDiag} style={{ ...btn, background: '#241', borderColor: '#482' }}>Export Diag</button>
        <InfoBar
          hoverTime={hoverTime}
          stats={stats ? { drawMs: stats.drawMs, uploadMs: stats.uploadMs, uploadMode: stats.uploadMode, tiles: stats.tiles, rows: stats.rows, cols: stats.cols } : undefined}
          summary={{ spanHours: spanMs/3600000, lod, refinedCount: refinedTiles.length, prevCount: prevLodTiles.length, nextCount: nextLodTiles.length }}
        />
  {invalidRowMapCount > 0 && <span style={{ color:'#d85', fontSize:10, marginLeft:8 }}>rowMap missing:{invalidRowMapCount}</span>}
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', fontSize: 11, background: '#0a0a0a', padding: 6, border: '1px solid #222', borderRadius: 4 }}>
        {planetOrder.map((p,i) => (
          <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#181818', padding: '2px 4px', borderRadius: 4 }}>
            <span style={{ color: '#bbb' }}>{p}</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <button style={reBtn} onClick={() => movePlanet(i,-1)}>↑</button>
              <button style={reBtn} onClick={() => movePlanet(i,1)}>↓</button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ height: 160, border: '1px solid #333', borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
        {webglSupported ? (
          <TimestreamCanvas
            tiles={tiles}
            prevLodTiles={prevLodTiles}
            nextLodTiles={nextLodTiles}
            lod={lod}
            blendMode={blendMode}
            onHoverTime={setHoverTime}
            timeStartMs={windowStart}
            timeEndMs={windowEnd}
            onPan={handlePan}
            onZoom={handleZoom}
            onHoverDetail={setHoverDetail}
            highlightGain={highlightGain}
            highlightMode={highlightMode}
            rowMap={rowMap}
            onStats={setStats}
            onCanvasRef={el => (canvasRefState.current = el)}
          />
        ) : (
          <TimestreamFallbackCanvas
            tiles={tiles}
            timeStartMs={windowStart}
            timeEndMs={windowEnd}
            onHoverTime={setHoverTime}
            onPan={handlePan}
            onZoom={handleZoom}
            planetOrder={planetOrder}
          />
        )}
        {/* Perf overlay only if WebGL */}
        {webglSupported && stats && (
          <div style={{ position: 'absolute', top: 4, left: 4, background: 'rgba(0,0,0,0.6)', padding: '4px 6px', fontSize: 10, lineHeight: 1.4, color: '#ccc', border: '1px solid #222', borderRadius: 4 }}>
            <div>frame: {stats.drawMs.toFixed(2)} ms</div>
            {msPerPixel && <div>ms/px: {msPerPixel.toExponential(2)}</div>}
            <div>LOD: {lod}</div>
            <div>render tiles: {stats.tiles}</div>
            <div>resident: {residentTileCount}</div>
            <div>pending: {pendingRequests}</div>
            {avgTileGenMs !== undefined && <div>gen avg: {avgTileGenMs.toFixed(2)} ms</div>}
            <div>upload: {stats.uploadMs?.toFixed(2)} ms ({stats.uploadMode})</div>
            {lastDiag && (
              <div style={{ marginTop: 4, borderTop: '1px solid #333', paddingTop: 4 }}>
                <div style={{ color: lastDiag.coveragePct < 0.2 ? '#f95' : '#6c6' }}>cov: {(lastDiag.coveragePct*100).toFixed(1)}%</div>
                {lastDiag.glError && <div style={{ color: '#f55' }}>glErr: {lastDiag.glError}</div>}
                {lastDiag.sampleHash && <div style={{ color: '#888' }}>hash: {lastDiag.sampleHash}</div>}
                {lastDiag.warnings && lastDiag.warnings.length > 0 && <div style={{ color: '#fa5' }}>warn: {lastDiag.warnings.join(',')}</div>}
              </div>
            )}
          </div>
        )}
        {!webglSupported && (
          <div style={{ position: 'absolute', top:4, left:4, background:'rgba(40,0,0,0.6)', color:'#f88', fontSize:10, padding:'4px 6px', border:'1px solid #600', borderRadius:4 }}>Fallback 2D mode</div>
        )}
        {/* existing hover marker & tooltip remain below */}
        {hoverTime && hoverTime >= windowStart && hoverTime <= windowEnd && (
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${((hoverTime - windowStart) / (windowEnd - windowStart)) * 100}%`, width: 1, background: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} />
        )}
        {hoverDetail && webglSupported && (
          <div style={{ position: 'absolute', bottom: 4, left: 4, background: 'rgba(0,0,0,0.7)', color: '#ddd', padding: '4px 6px', fontSize: 10, border: '1px solid #444', borderRadius: 4 }}>
            <div>{new Date(hoverDetail.timeMs).toISOString()}</div>
            {hoverDetail.elementVector && (
              <div>F:{hoverDetail.elementVector.fire.toFixed(2)} E:{hoverDetail.elementVector.earth.toFixed(2)} A:{hoverDetail.elementVector.air.toFixed(2)} W:{hoverDetail.elementVector.water.toFixed(2)}</div>
            )}
            <div>Row: {hoverDetail.rowIndex}</div>
          </div>
        )}
        {diagWarning && (
          <div style={{ position:'absolute', top:4, right:4, background:'rgba(80,0,0,0.7)', color:'#faa', padding:'4px 6px', fontSize:10, border:'1px solid #600', borderRadius:4 }}>
            {diagWarning}
          </div>
        )}
      </div>
    </div>
  );
};

const reBtn: React.CSSProperties = { background: '#222', color: '#ccc', border: '1px solid #333', padding: 0, lineHeight: '12px', fontSize: 10, cursor: 'pointer' };
const btn: React.CSSProperties = { background: '#111', color: '#fff', border: '1px solid #333', borderRadius: 4, padding: '4px 8px', fontSize: 12, cursor: 'pointer' };
// Info pills are provided by InfoBar component

const BottomDrawer: React.FC = () => {
  return (
    <BottomDrawerProvider>
      <div className="bottom-drawer-content">
        <BottomDrawerHeader />
        <BottomDrawerBody />
      </div>
    </BottomDrawerProvider>
  );
};

export default BottomDrawer;
export { useBottomDrawer, BottomDrawerHeader, BottomDrawerBody };
