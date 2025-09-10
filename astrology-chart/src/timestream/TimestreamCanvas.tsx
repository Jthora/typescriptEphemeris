/**
 * TimestreamCanvas updated for M10: export + perf stats callback.
 */
import React, { useEffect, useRef, useCallback } from 'react';
import { validateTileOrders, devWarnOnce } from './orderIntegrity';
import { VERT_SOURCE, FRAG_SOURCE } from './gl/shaders';
import { initGL } from './gl/initGL';
import { computeRowHarmonicFlags } from './harmonicHighlight';
import type { TimestreamTile } from './types';
import { packPool } from './packPool';
// TD1 diagnostics helpers (placed near top for scope)
interface FrameDiag { frameId:number; ts:number; tiles:number; packedCols:number; packedRows:number; lod?:number; startMs:number; endMs:number; coveragePct:number; uploadMode?:'full'|'sub'; uploadMs?:number; drawMs?:number; glError?:number; primaryTexDims?:[number,number]; secondaryTexDims?:[number,number]; sampleHash?:string; rowHeight:number; warnings:string[]; }
const DIAG_ENABLED = !!import.meta.env.DEV;
const frameDiags: FrameDiag[] = [];
let globalFrameId = 0;
function pushDiag(d: FrameDiag) { if (!DIAG_ENABLED) return; frameDiags.push(d); if (frameDiags.length>300) frameDiags.shift(); (window as any).__timestreamDiag = { get: () => frameDiags, export: () => JSON.stringify(frameDiags,null,2) }; }
export function getTimestreamDiagnostics(): FrameDiag[] { return [...frameDiags]; }
function hashBytes(arr: Uint8Array) { let h=2166136261>>>0; for (let i=0;i<arr.length;i++){ h^=arr[i]; h = Math.imul(h,16777619);} return ('00000000'+(h>>>0).toString(16)).slice(-8); }

interface HoverDetail {
  timeMs: number;
  rowIndex: number | null;
  elementVector?: { fire: number; earth: number; air: number; water: number };
}

interface TimestreamCanvasProps {
  tiles: TimestreamTile[];
  prevLodTiles: TimestreamTile[];
  nextLodTiles: TimestreamTile[];
  width?: number;
  height?: number;
  blendMode?: 'multiply' | 'additive' | 'screen' | 'overlay' | 'difference';
  onHoverTime?: (timeMs: number | null) => void;
  timeStartMs?: number;
  timeEndMs?: number;
  onPan?: (deltaTimeMs: number) => void;
  onZoom?: (factor: number, anchorTimeMs: number) => void;
  onHoverDetail?: (detail: HoverDetail | null) => void;
  highlightGain?: number;
  highlightMode?: 'off' | 'purity' | 'balance' | 'resonance';
  lod?: number;
  rowMap?: number[]; // (M9)
  onStats?: (s: { drawMs: number; tiles: number; rows: number; cols: number; lod?: number; uploadMode?: 'full' | 'sub'; uploadMs?: number }) => void; // (M10 extended)
  onCanvasRef?: (el: HTMLCanvasElement | null) => void; // (M10) expose for export
}

const TimestreamCanvas: React.FC<TimestreamCanvasProps> = ({
  tiles,
  prevLodTiles = [],
  nextLodTiles = [],
  width = 800,
  height = 200,
  blendMode = 'multiply',
  onHoverTime,
  timeStartMs,
  timeEndMs,
  onPan,
  onZoom,
  onHoverDetail,
  highlightGain = 0.0,
  highlightMode = 'off',
  lod,
  rowMap,
  onStats,
  onCanvasRef
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glRef = useRef<ReturnType<typeof initGL> | null>(null);
  const packedBufferRef = useRef<{ buffer: Uint8Array; totalCols: number; rows: number } | null>(null);
  const lastDimsRef = useRef<{ w: number; h: number } | null>(null);

  const derivedStart = tiles[0]?.startTimeMs ?? 0;
  const derivedEnd = tiles.length ? (tiles[tiles.length - 1].startTimeMs + tiles[tiles.length - 1].cols * tiles[tiles.length - 1].stepMs) : derivedStart + 1;
  const startMs = timeStartMs ?? derivedStart;
  const endMs = timeEndMs ?? derivedEnd;
  const spanMs = endMs - startMs;

  const draggingRef = useRef(false);
  const dragOriginX = useRef(0);

  const mapClientXToTime = useCallback((clientX: number, rect: DOMRect) => {
    const u = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    return startMs + u * spanMs;
  }, [startMs, spanMs]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    const t = mapClientXToTime(e.clientX, rect);
    if (onHoverTime) onHoverTime(t);
    if (draggingRef.current && onPan) {
      const dx = e.clientX - dragOriginX.current;
      const frac = dx / rect.width;
      const deltaTimeMs = -frac * spanMs;
      onPan(deltaTimeMs);
    } else if (onHoverDetail && packedBufferRef.current) {
      const { buffer, totalCols, rows } = packedBufferRef.current;
      const xFrac = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      const col = Math.min(totalCols - 1, Math.max(0, Math.floor(xFrac * totalCols)));
      const yFrac = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
      const row = Math.min(rows - 1, Math.max(0, Math.floor(yFrac * rows)));
      const idx = (row * totalCols + col) * 4;
      const fire = buffer[idx] / 255;
      const earth = buffer[idx + 1] / 255;
      const air = buffer[idx + 2] / 255;
      const water = buffer[idx + 3] / 255;
      onHoverDetail({ timeMs: t, rowIndex: row, elementVector: { fire, earth, air, water } });
    }
  }, [onHoverTime, onPan, onHoverDetail, mapClientXToTime, spanMs]);

  const handlePointerLeave = useCallback(() => {
    if (onHoverTime) onHoverTime(null);
    if (onHoverDetail) onHoverDetail(null);
  }, [onHoverTime, onHoverDetail]);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    draggingRef.current = true;
    dragOriginX.current = e.clientX;
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    draggingRef.current = false;
    (e.target as HTMLCanvasElement).releasePointerCapture(e.pointerId);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
    if (!onZoom) return;
    e.preventDefault();
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    const anchor = mapClientXToTime(e.clientX, rect);
    const factor = Math.exp(e.deltaY * 0.001);
    onZoom(factor, anchor);
  }, [onZoom, mapClientXToTime]);

  useEffect(() => { onCanvasRef?.(canvasRef.current); return () => onCanvasRef?.(null); }, [onCanvasRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!glRef.current) {
      glRef.current = initGL(canvas, VERT_SOURCE, FRAG_SOURCE);
    }
    // Ordering integrity Phase 1: validate tile body ordering + build diagnostics snapshot
    const diagExtras: any = {};
    if (tiles.length) {
      const { signature, mismatchedTileIds } = validateTileOrders(tiles);
      diagExtras.orderSig = signature;
      if (mismatchedTileIds.length) {
        diagExtras.orderMismatches = mismatchedTileIds;
        devWarnOnce('order-mismatch:'+signature, '[Timestream] Tile body order mismatch detected; crossfade and refinement safeguards engaged.');
      }
      try {
        const mon: any = (window as any).__timestreamMon || ((window as any).__timestreamMon = {});
        mon.orderSig = signature;
        mon.orderMismatchCount = mismatchedTileIds.length;
        mon.lastOrderCheckTs = performance.now();
      } catch {}
    }
    const t0 = performance.now();
    const { gl, program, tex, texB, uLocations } = glRef.current;
    gl.viewport(0,0,canvas.width, canvas.height);

    const secondary = (nextLodTiles.length ? nextLodTiles : prevLodTiles);
    // Phase 4 ordering integrity: verify secondary order matches primary; else disable crossfade
    let secondaryAllowed = true;
    if (tiles.length && secondary.length) {
      const primaryOrder = tiles[0].bodies;
      const secondaryOrder = secondary[0].bodies;
      if (!validateOrders(primaryOrder, secondaryOrder)) {
        secondaryAllowed = false;
        devWarnOnce('crossfade-order-mismatch', '[Timestream] Crossfade disabled due to planet add/remove or reordering mismatch.');
      }
    }

    function pack(tilesArr: TimestreamTile[]): { buffer: Uint8Array; totalCols: number; rows: number } | null {
      if (!tilesArr.length) return null;
      let totalCols = 0; tilesArr.forEach(t=> totalCols += t.cols);
      const rows = tilesArr[0].rows;
      if (rows === 0 || totalCols === 0) return null;
      const buffer = packPool.getView(totalCols * rows * 4);
      let colOffset = 0;
      for (const tile of tilesArr) {
        for (let r=0;r<rows;r++) {
          const srcRowOffset = r * tile.cols * 4;
          const dstRowOffset = r * totalCols * 4 + colOffset * 4;
          buffer.set(tile.buffer.subarray(srcRowOffset, srcRowOffset + tile.cols * 4), dstRowOffset);
        }
        colOffset += tile.cols;
      }
      return { buffer, totalCols, rows };
    }

  const primaryPack = pack(tiles);
  const secondaryPack = secondaryAllowed ? pack(secondary) : null;

    if (!primaryPack) {
      gl.clearColor(0,0,0,1); gl.clear(gl.COLOR_BUFFER_BIT);
      pushDiag({ frameId: ++globalFrameId, ts: performance.now(), tiles: tiles.length, packedCols:0, packedRows:0, lod, startMs, endMs, coveragePct:0, rowHeight: canvas.height/ (tiles[0]?.rows||1), warnings:['noPrimaryPack'], ...diagExtras });
      return;
    }

    // coverage metrics
    const renderStart = tiles[0].startTimeMs;
    const renderEnd = tiles[tiles.length-1].startTimeMs + tiles[tiles.length-1].cols * tiles[tiles.length-1].stepMs;
    const coveragePct = Math.max(0, Math.min(1, (renderEnd - renderStart)/(endMs - startMs)));

    packedBufferRef.current = primaryPack;

    gl.useProgram(program);

    const uploadStart = performance.now();
    let uploadMode: 'full' | 'sub' = 'full';
    // Primary texture upload optimization
    if (primaryPack) {
      const dims = { w: primaryPack.totalCols, h: primaryPack.rows };
      const sameDims = lastDimsRef.current && lastDimsRef.current.w === dims.w && lastDimsRef.current.h === dims.h;
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      if (sameDims) {
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, dims.w, dims.h, gl.RGBA, gl.UNSIGNED_BYTE, primaryPack.buffer);
        uploadMode = 'sub';
      } else {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, dims.w, dims.h, 0, gl.RGBA, gl.UNSIGNED_BYTE, primaryPack.buffer);
        lastDimsRef.current = dims;
        uploadMode = 'full';
      }
      gl.uniform1i(uLocations.tex, 0);
    }
    // Secondary always full for now (different dims likely)
  if (secondaryPack) {
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, texB);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, secondaryPack.totalCols, secondaryPack.rows, 0, gl.RGBA, gl.UNSIGNED_BYTE, secondaryPack.buffer);
      gl.uniform1i(uLocations.texB, 1);
    }
    const uploadEnd = performance.now();

    let crossfade = 0.0;
    if (secondaryPack) {
      const isHigher = nextLodTiles.length > 0;
      // Phase A: strict overlap guard — only crossfade if identical temporal coverage
      const primStart = tiles[0].startTimeMs;
      const primEnd = tiles[tiles.length-1].startTimeMs + tiles[tiles.length-1].cols * tiles[tiles.length-1].stepMs;
      const secStart = (secondary[0]?.startTimeMs) ?? primStart;
      const secEnd = secondary.length ? (secondary[secondary.length-1].startTimeMs + secondary[secondary.length-1].cols * secondary[secondary.length-1].stepMs) : secStart;
      const coverageMatch = primStart === secStart && primEnd === secEnd;
      if (coverageMatch) {
        crossfade = isHigher ? 0.5 : 0.3;
      } else {
        crossfade = 0.0; // disable crossfade if spans differ
      }
    } else {
      gl.uniform1i(uLocations.texB, 0);
      crossfade = 0.0;
    }

    gl.uniform1f(uLocations.rowCount, primaryPack.rows);
    if ((uLocations as any).rowMapLoc) {
      const mapArr = new Int32Array(32);
      const activeMap = rowMap && rowMap.length ? rowMap : [...Array(primaryPack.rows)].map((_,i)=>i);
      for (let i=0;i<32;i++) mapArr[i] = i < activeMap.length ? activeMap[i] : 0;
      gl.uniform1iv((uLocations as any).rowMapLoc, mapArr);
    }
    gl.uniform1i(uLocations.blendMode, blendMode === 'multiply' ? 0 : blendMode === 'additive' ? 1 : blendMode === 'screen' ? 2 : blendMode === 'overlay' ? 3 : 4);
    if ((uLocations as any).highlightGainLoc) gl.uniform1f((uLocations as any).highlightGainLoc, highlightGain);
    if ((uLocations as any).highlightModeLoc) {
      const modeInt = highlightMode === 'off' ? 0 : highlightMode === 'purity' ? 1 : highlightMode === 'balance' ? 2 : 3;
      gl.uniform1i((uLocations as any).highlightModeLoc, modeInt);
    }
    // Harmonic row highlight flags when mode is resonance (string 'resonance' accepted)
    if (highlightMode === 'resonance' && (uLocations as any).rowHighlightLoc && primaryPack) {
      const flags = computeRowHarmonicFlags(primaryPack.buffer, primaryPack.rows, primaryPack.totalCols, { purityThreshold: 0.35, minRunColumns: Math.max(4, Math.floor(primaryPack.totalCols * 0.02)) });
      const arr = new Int32Array(32);
      for (let i=0;i<Math.min(flags.length,32);i++) arr[i] = flags[i] ? 1 : 0;
      gl.uniform1iv((uLocations as any).rowHighlightLoc, arr);
    } else if ((uLocations as any).rowHighlightLoc) {
      const arr = new Int32Array(32); gl.uniform1iv((uLocations as any).rowHighlightLoc, arr);
    }
    if ((uLocations as any).crossfadeLoc) gl.uniform1f((uLocations as any).crossfadeLoc, crossfade);
    gl.uniform1f(uLocations.timeStartMs, startMs);
    gl.uniform1f(uLocations.timeEndMs, endMs);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
    const t1 = performance.now();
    const glErr = gl.getError();
    // sample hash (small region)
    let sampleHash: string | undefined;
    try {
      const sw = Math.min(4, primaryPack.totalCols);
      const sh = Math.min(4, primaryPack.rows);
      if (sw>0 && sh>0) {
        const sample = new Uint8Array(sw*sh*4);
        gl.readPixels(0,0,sw,sh,gl.RGBA,gl.UNSIGNED_BYTE,sample);
        sampleHash = hashBytes(sample);
      }
    } catch {}
    const warnings:string[] = [];
    if (glErr) warnings.push('glError');
    if (coveragePct < 0.05) warnings.push('lowCoverage');
    const rowHeight = canvas.height / (primaryPack.rows||1);
    if (rowHeight < 1) warnings.push('rowSubPixel');
  pushDiag({ frameId: ++globalFrameId, ts: performance.now(), tiles: tiles.length, packedCols: primaryPack.totalCols, packedRows: primaryPack.rows, lod, startMs, endMs, coveragePct, uploadMode, uploadMs: uploadEnd - uploadStart, drawMs: t1 - t0, glError: glErr || undefined, primaryTexDims:[primaryPack.totalCols, primaryPack.rows], secondaryTexDims: secondaryPack ? [secondaryPack.totalCols, secondaryPack.rows]: undefined, sampleHash, rowHeight, warnings, ...diagExtras });
    onStats?.({ drawMs: t1 - t0, tiles: tiles.length, rows: packedBufferRef.current?.rows || 0, cols: packedBufferRef.current?.totalCols || 0, lod, uploadMode, uploadMs: uploadEnd - uploadStart });
  }, [tiles, nextLodTiles, prevLodTiles, blendMode, startMs, endMs, highlightGain, highlightMode, rowMap, lod, onStats]);

  // local helper (kept inside file to avoid extra import churn)
  function validateOrders(a?: string[], b?: string[]) {
    if (!a || !b) return !a && !b;
    if (a.length !== b.length) return false;
    for (let i=0;i<a.length;i++) if (a[i] !== b[i]) return false;
    return true;
  }

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ width: '100%', height: '100%', display: 'block', background: '#000', cursor: draggingRef.current ? 'grabbing' : (onPan ? 'grab' : (onHoverTime ? 'crosshair' : 'default')) }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
    />
  );
};

export default TimestreamCanvas;
