import { describe, it, expect } from 'vitest';
// This test samples synthetic tile via worker build analog (simplified) to ensure new per-channel variance metric is non-zero and bounded.

function simulateVariance(rows: number, cols: number) {
  // build pseudo-random but structured channel data across rows
  const chSums = [new Float32Array(cols), new Float32Array(cols), new Float32Array(cols), new Float32Array(cols)];
  const chSumsSq = [new Float32Array(cols), new Float32Array(cols), new Float32Array(cols), new Float32Array(cols)];
  for (let r=0;r<rows;r++) {
    for (let c=0;c<cols;c++) {
      const base = (Math.sin((r+1)*(c+3)) + 1)/2; // 0..1
      const channels = [base, (c/cols), (r/rows), (base + r/(rows*2)) % 1];
      for (let ch=0; ch<4; ch++) {
        const v = channels[ch];
        chSums[ch][c] += v;
        chSumsSq[ch][c] += v*v;
      }
    }
  }
  const n = rows;
  const varMax = new Float32Array(cols);
  let globalMax = 0;
  for (let c=0;c<cols;c++) {
    let maxChVar = 0;
    for (let ch=0; ch<4; ch++) {
      const mean = chSums[ch][c] / n;
      const meanSq = chSumsSq[ch][c] / n;
      const v = Math.max(0, meanSq - mean*mean);
      if (v > maxChVar) maxChVar = v;
    }
    varMax[c] = maxChVar;
    if (maxChVar > globalMax) globalMax = maxChVar;
  }
  return { varMax, globalMax };
}

describe('variance metric change', () => {
  it('produces non-zero bounded variance with per-channel max aggregation', () => {
    const { varMax, globalMax } = simulateVariance(8, 128);
    // not all zeros
    const nonZero = Array.from(varMax).some(v => v > 1e-6);
    expect(nonZero).toBe(true);
    // global max within plausible upper bound (<0.3 for these patterns)
    expect(globalMax).toBeLessThan(0.5);
  });
});
