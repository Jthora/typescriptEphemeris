/**
 * Validation helpers for element mapping (Milestone M1 refinement).
 * Simple runtime assertions; NOT a full test framework.
 */
import { computeElementVector } from './elementMapping';
import { DEFAULT_ELEMENT_MAPPING } from './constants';

interface AssertionResult { name: string; passed: boolean; details?: string; }

function approxEqual(a: number, b: number, eps = 1e-6) { return Math.abs(a - b) <= eps; }

function runCuspContinuityTest(): AssertionResult {
  const cfg = DEFAULT_ELEMENT_MAPPING;
  const cuspWidth = cfg.cuspWidthDeg;
  // Test Aries->Taurus cusp at 30°.
  const center = 30; // cusp longitude
  const step = cuspWidth / 10; // fine sampling inside window
  let maxDeltaSum = 0;
  for (let d = -cuspWidth; d <= cuspWidth; d += step) {
    const lon = center - d; // sample before/after cusp
    const v = computeElementVector(lon, cfg);
    const sum = v.fire + v.earth + v.air + v.water;
    const delta = Math.abs(sum - 1);
    if (delta > maxDeltaSum) maxDeltaSum = delta;
  }
  const passed = maxDeltaSum < 0.02; // allow minor deviation
  return { name: 'Cusp continuity (sum≈1 across blend)', passed, details: `maxDeltaSum=${maxDeltaSum.toFixed(4)}` };
}

function runPureCenterTest(): AssertionResult {
  // Mid Leo (Leo starts 120°)
  const lon = 120 + 15; // center of Leo
  const v = computeElementVector(lon, DEFAULT_ELEMENT_MAPPING);
  const channels = [v.fire, v.earth, v.air, v.water];
  const dominant = channels.filter(c => c > 0.9).length === 1;
  return { name: 'Single dominant element mid-sign', passed: dominant, details: `channels=${channels.map(c=>c.toFixed(2)).join(',')}` };
}

function runNoNegativeTest(): AssertionResult {
  for (let lon = 0; lon < 360; lon += 2) {
    const v = computeElementVector(lon, DEFAULT_ELEMENT_MAPPING);
    if (v.fire < -1e-6 || v.earth < -1e-6 || v.air < -1e-6 || v.water < -1e-6) {
      return { name: 'No negative channels', passed: false, details: `negative at lon=${lon}` };
    }
  }
  return { name: 'No negative channels', passed: true };
}

export function runElementMappingValidation(): AssertionResult[] {
  return [
    runCuspContinuityTest(),
    runPureCenterTest(),
    runNoNegativeTest()
  ];
}

/** Convenience dev runner; call manually from a temporary script */
export function logElementMappingValidation(): void {
  const results = runElementMappingValidation();
  console.group('[M1] Element Mapping Validation');
  results.forEach(r => {
    const status = r.passed ? '✅' : '❌';
    console.log(status, r.name, r.details ? `- ${r.details}` : '');
  });
  const failed = results.filter(r => !r.passed).length;
  console.log(failed === 0 ? 'All validation checks passed.' : `${failed} validation checks failed.`);
  console.groupEnd();
}
