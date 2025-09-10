/**
 * Tile cache / data acquisition hook (Milestone M8 - adaptive sampling refinement with subdivision)
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DEFAULT_BASE_STEP_MS, DEFAULT_TILE_COLS, DEFAULT_MAX_RESIDENT_TILES, DEFAULT_PLANET_ORDER, DEFAULT_VARIANCE_THRESHOLD, DEFAULT_RETRO_DENSITY_THRESHOLD } from './constants';
import { shouldRefineTile, computeRetroDensity } from './refinementLogic';
import type { PlanetId, TimestreamTile } from './types';
import { TimestreamWorkerClient } from './workerClient';

export interface UseTimestreamOptions {
  centerTimeMs: number;
  spanMs: number;
  stepMs?: number;
  tileCols?: number;
  maxResidentTiles?: number;
  planets?: PlanetId[];
  prefetchTiles?: number;
  varianceThreshold?: number; // (M8) adaptive refinement trigger
}

export interface UseTimestreamResult {
  tiles: TimestreamTile[];
  prevLodTiles: TimestreamTile[];
  nextLodTiles: TimestreamTile[];
  refinedTiles: TimestreamTile[]; // (M8) finer LOD tiles loaded due to variance
  loading: boolean;
  windowStartMs: number;
  windowEndMs: number;
  lod: number;
  requestWindow: (centerTimeMs: number, spanMs: number) => void;
  invalidate: () => void;
  residentTileCount: number; // (M10 OVERLAY) total cached tiles
  pendingRequests: number; // (M10 OVERLAY) outstanding requests
  avgTileGenMs?: number; // (M10) average generation time of currently resident tiles
}

interface InternalTileMap { [id: string]: TimestreamTile; }

export function normalizeTime(value: number): number {
  // Ensure integer millisecond and avoid negative zero
  return Math.round(value + 0.0000001);
}

export function computeLod(spanMs: number): number {
  if (spanMs <= 2 * 3600 * 1000) return -1;               // <=2h superfine
  if (spanMs <= 12 * 3600 * 1000) return 0;               // <=12h fine
  if (spanMs <= 72 * 3600 * 1000) return 1;               // <=3d mid
  if (spanMs <= 14 * 24 * 3600 * 1000) return 2;          // <=14d broad
  return 3;                                               // >14d very broad
}

export function useTimestreamData(options: UseTimestreamOptions): UseTimestreamResult {
  const {
    centerTimeMs,
    spanMs,
    stepMs = DEFAULT_BASE_STEP_MS,
    tileCols = DEFAULT_TILE_COLS,
    maxResidentTiles = DEFAULT_MAX_RESIDENT_TILES,
    planets = DEFAULT_PLANET_ORDER,
    prefetchTiles = 1,
  varianceThreshold = DEFAULT_VARIANCE_THRESHOLD
  } = options;

  const [windowCenter, setWindowCenter] = useState(normalizeTime(centerTimeMs));
  const [windowSpan, setWindowSpan] = useState(normalizeTime(spanMs));
  const [loading, setLoading] = useState(false);
  const tileMapRef = useRef<InternalTileMap>({});
  const [version, setVersion] = useState(0);
  const requestedKeysRef = useRef<Set<string>>(new Set());
  const workerRef = useRef<TimestreamWorkerClient | null>(null);

  const windowStartMs = windowCenter - windowSpan / 2;
  const windowEndMs = windowCenter + windowSpan / 2;

  const lod = computeLod(spanMs);

  useEffect(() => {
    if (!workerRef.current) {
      workerRef.current = new TimestreamWorkerClient(
        new URL('./timestreamWorker.ts', import.meta.url).href,
        {
          onTile: tile => {
            tileMapRef.current[tile.id] = tile;
            // Cache eviction oldest by start time
            const ids = Object.keys(tileMapRef.current)
              .map(id => tileMapRef.current[id])
              .sort((a,b)=> a.startTimeMs - b.startTimeMs);
            if (ids.length > maxResidentTiles) {
              const toRemove = ids.length - maxResidentTiles;
              for (let i=0;i<toRemove;i++) {
                const evictedId = ids[i].id;
                delete tileMapRef.current[evictedId];
                // Phase A: prune requestedKeys for evicted tiles
                requestedKeysRef.current.delete(evictedId);
              }
            }
            setLoading(false);
            setVersion(v => v + 1);
          },
          onLog: (level, message) => {
            if (level === 'error') console.error('[TimestreamWorker]', message);
            else if (level === 'warn') console.warn('[TimestreamWorker]', message);
            else if (import.meta.env.DEV) console.log('[TimestreamWorker]', message); // gate noisy logs in prod
          }
        }
      );
    }
    return () => {
      // Phase A: lifecycle cleanup
      try { workerRef.current?.shutdown(); } catch {}
      workerRef.current = null;
    };
  }, [maxResidentTiles]);

  const neededTileStarts = useMemo(() => {
    const tileTimeSpan = tileCols * stepMs;
    const baseStart = Math.floor(windowStartMs / tileTimeSpan) * tileTimeSpan;
    const starts: number[] = [];
    const totalTilesToCover = Math.ceil((windowEndMs - baseStart) / tileTimeSpan);
    for (let i = -prefetchTiles; i < totalTilesToCover + prefetchTiles; i++) {
      const st = baseStart + i * tileTimeSpan;
      if (st + tileTimeSpan >= windowStartMs - tileTimeSpan * prefetchTiles && st <= windowEndMs + tileTimeSpan * prefetchTiles) {
        starts.push(st);
      }
    }
    return starts;
  }, [windowStartMs, windowEndMs, windowSpan, stepMs, tileCols, prefetchTiles]);

  // Request primary LOD tiles & always next coarser (lod+1) for crossfade.
  useEffect(() => {
    const worker = workerRef.current; if (!worker) return;
    let anyRequested = false;
    for (const start of neededTileStarts) {
      const primaryId = `w-${lod}-${start}`;
      if (!tileMapRef.current[primaryId] && !requestedKeysRef.current.has(primaryId)) {
        requestedKeysRef.current.add(primaryId);
        worker.requestTile(start, tileCols, stepMs * Math.pow(4, lod), lod);
        anyRequested = true;
      }
      const coarserId = `w-${lod+1}-${start}`;
      if (lod < 2 && !tileMapRef.current[coarserId] && !requestedKeysRef.current.has(coarserId)) {
        requestedKeysRef.current.add(coarserId);
        worker.requestTile(start, tileCols, stepMs * Math.pow(4, lod+1), lod+1);
        anyRequested = true;
      }
    }
    if (anyRequested) setLoading(true);
    // Phase A: prune requested keys far outside current window (time-based)
    const tileTimeSpan = tileCols * stepMs * Math.pow(4, lod);
    const pruneBefore = windowStartMs - 2 * windowSpan - tileTimeSpan;
    const pruneAfter = windowEndMs + 2 * windowSpan + tileTimeSpan;
    for (const key of Array.from(requestedKeysRef.current)) {
      // key format: w-LOD-start
      const parts = key.split('-');
      const start = parts.length >= 3 ? parseInt(parts[2],10) : NaN;
      const kLod = parts.length >= 3 ? parseInt(parts[1],10) : lod;
      if (!Number.isFinite(start)) continue;
      const coverage = tileCols * stepMs * Math.pow(4, kLod);
      const end = start + coverage;
      if (end < pruneBefore || start > pruneAfter) requestedKeysRef.current.delete(key);
    }
  }, [neededTileStarts, stepMs, tileCols, lod, windowStartMs, windowEndMs, windowSpan]);

  // Adaptive refinement: request full finer subdivision (4 subtiles) when coarse variance high.
  useEffect(() => {
    if (lod === 0) return; // already finest
    const worker = workerRef.current; if (!worker) return;
    let anyRequested = false;
    const coarseStep = stepMs * Math.pow(4, lod);
    const fineStep = stepMs * Math.pow(4, lod-1);
    const coverageFactor = coarseStep / fineStep; // expect 4
    for (const start of neededTileStarts) {
      const coarse = tileMapRef.current[`w-${lod}-${start}`];
      if (!coarse) continue;
      if (shouldRefineTile(coarse, varianceThreshold, DEFAULT_RETRO_DENSITY_THRESHOLD)) {
        // Request all subtiles needed to fully cover coarse interval.
        for (let i = 0; i < coverageFactor; i++) {
          const fineStart = start + i * (coarse.cols * fineStep); // shift by fine tile coverage each segment
          const finerId = `w-${lod-1}-${fineStart}`;
          if (!tileMapRef.current[finerId] && !requestedKeysRef.current.has(finerId)) {
            requestedKeysRef.current.add(finerId);
            worker.requestTile(fineStart, tileCols, fineStep, lod-1);
            anyRequested = true;
          }
        }
      }
    }
    if (anyRequested) setLoading(true);
  }, [lod, varianceThreshold, neededTileStarts, stepMs, tileCols, version]);

  const allTiles = useMemo(() => Object.values(tileMapRef.current), [version]);
  // Build render set: start from coarse tiles at current LOD; replace high variance coarse tile with complete finer subdivision if available.
  const tiles = useMemo(() => {
    const coarseTiles = allTiles.filter(t => t.lod === lod && t.startTimeMs <= windowEndMs && (t.startTimeMs + t.cols * t.stepMs) >= windowStartMs).sort((a,b)=> a.startTimeMs - b.startTimeMs);
    if (lod === 0) return coarseTiles; // nothing to refine
    const fineStep = stepMs * Math.pow(4, lod-1);
    const result: TimestreamTile[] = [];
    for (const ct of coarseTiles) {
      const mv = ct.maxVariance ?? 0;
      if (mv < varianceThreshold) {
        result.push(ct);
        continue;
      }
      const expectedCoverage = ct.cols * ct.stepMs; // coarse coverage span
      const fineTileCoverage = ct.cols * fineStep; // each finer tile coverage
      // Phase A: deterministic needed computation using integer ratio (avoid rounding drift)
      const ratio = expectedCoverage / fineTileCoverage;
      const needed = Math.max(1, Math.round(ratio)); // fallback; expected integer like 4
      // adjust tolerance: if abs(ratio - needed) > 0.01 then floor
      const tol = Math.abs(ratio - needed) > 0.01 ? Math.floor(ratio) : needed;
      const neededTiles = tol;
      const fineTiles: TimestreamTile[] = [];
      for (let i=0;i<neededTiles;i++) {
        const fineStart = ct.startTimeMs + i * fineTileCoverage;
        const fine = allTiles.find(t => t.lod === lod-1 && t.startTimeMs === fineStart);
        if (fine) fineTiles.push(fine);
        else break; // incomplete; abort replacement
      }
      if (fineTiles.length === neededTiles) {
        // All subtiles present; splice them instead of coarse.
        fineTiles.sort((a,b)=> a.startTimeMs - b.startTimeMs);
        fineTiles.forEach(ft => result.push(ft));
      } else {
        result.push(ct); // fallback to coarse until full set ready
      }
    }
    return result.sort((a,b)=> a.startTimeMs - b.startTimeMs);
  }, [allTiles, lod, windowStartMs, windowEndMs, varianceThreshold, stepMs]);
  const prevLodTiles = useMemo(() => allTiles.filter(t => t.lod === lod-1).sort((a,b)=> a.startTimeMs - b.startTimeMs), [allTiles, lod]);
  const nextLodTiles = useMemo(() => allTiles.filter(t => t.lod === lod+1).sort((a,b)=> a.startTimeMs - b.startTimeMs), [allTiles, lod]);
  const refinedTiles = useMemo(() => tiles.filter(t => t.lod === lod-1), [tiles, lod]);

  const requestWindow = useCallback((center: number, span: number) => {
    setWindowCenter(normalizeTime(center));
    setWindowSpan(normalizeTime(span));
  }, []);

  const invalidate = useCallback(() => {
    tileMapRef.current = {};
    requestedKeysRef.current.clear();
    setVersion(v => v + 1);
  }, []);

  return {
    tiles,
    prevLodTiles,
    nextLodTiles,
    refinedTiles,
    loading,
    windowStartMs,
    windowEndMs,
    lod,
    requestWindow,
    invalidate,
    residentTileCount: Object.keys(tileMapRef.current).length,
    pendingRequests: Math.max(0, requestedKeysRef.current.size - Object.keys(tileMapRef.current).length),
    avgTileGenMs: allTiles.length ? allTiles.reduce((a,t)=> a + (t.genMs || 0),0)/allTiles.length : undefined
  };
}
