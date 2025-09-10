/** Harmonic highlight row-level flags: identify rows with sustained dominant element runs. */
export interface HarmonicConfig {
  purityThreshold: number;      // minimum purity score for dominant element within run
  minRunColumns: number;        // minimum consecutive columns with same dominant element
}

/** Purity score: dominant channel minus mean of other three. Channels expected 0..1. */
export function purity(f: number, e: number, a: number, w: number): number {
  const mx = Math.max(f,e,a,w);
  const sum = f+e+a+w;
  return mx - ( (sum - mx) / 3 );
}

/** Compute dominant element index (0 fire,1 earth,2 air,3 water). */
export function dominantIndex(f: number,e:number,a:number,w:number): number {
  let mx = f; let idx = 0;
  if (e > mx) { mx = e; idx = 1; }
  if (a > mx) { mx = a; idx = 2; }
  if (w > mx) { mx = w; idx = 3; }
  return idx;
}

/**
 * Compute harmonic highlight flags per row from packed FEAW buffer.
 * Buffer layout: rows contiguous, each column has 4 bytes RGBA in [0,255].
 */
export function computeRowHarmonicFlags(buffer: Uint8Array, rows: number, cols: number, cfg: HarmonicConfig): boolean[] {
  const { purityThreshold, minRunColumns } = cfg;
  const flags: boolean[] = Array(rows).fill(false);
  if (!rows || !cols) return flags;
  for (let r=0; r<rows; r++) {
    let bestRunLen = 0;
    let bestRunPurityAccum = 0;
    let bestRunPurityCols = 0;
    let curDom = -1;
    let curLen = 0;
    let curPurityAccum = 0;
    for (let c=0; c<cols; c++) {
      const idx = (r * cols + c) * 4;
      const f = buffer[idx] / 255;
      const e = buffer[idx+1] / 255;
      const a = buffer[idx+2] / 255;
      const w = buffer[idx+3] / 255;
      const p = purity(f,e,a,w);
      const d = dominantIndex(f,e,a,w);
      if (d === curDom) {
        curLen++;
        curPurityAccum += p;
      } else {
        // finalize previous run
        if (curDom !== -1 && curLen > bestRunLen) {
          bestRunLen = curLen; bestRunPurityAccum = curPurityAccum; bestRunPurityCols = curLen;
        }
        curDom = d; curLen = 1; curPurityAccum = p;
      }
    }
    if (curDom !== -1 && curLen > bestRunLen) { bestRunLen = curLen; bestRunPurityAccum = curPurityAccum; bestRunPurityCols = curLen; }
    if (bestRunLen >= minRunColumns) {
      const avgPurity = bestRunPurityAccum / (bestRunPurityCols || 1);
      if (avgPurity >= purityThreshold) flags[r] = true;
    }
  }
  return flags;
}
