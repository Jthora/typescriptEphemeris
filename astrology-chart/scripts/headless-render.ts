/// <reference lib="dom" />

// TD3 harness: render deterministic Timestream tiles via actual shaders and compare hash baseline.
// Falls back to no-op when WebGL2 headless context cannot be created (developer must run in a
// browser-enabled environment to refresh baselines).

import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { initGL } from '../src/timestream/gl/initGL';
import { VERT_SOURCE, FRAG_SOURCE } from '../src/timestream/gl/shaders';
import { packTiles } from '../src/timestream/packTiles';
import { makeDeterministicTile } from '../src/timestream/test/fixtures';
import { computeRowHarmonicFlags } from '../src/timestream/harmonicHighlight';

interface HashArtifact {
  width: number;
  height: number;
  hash: string;
  sampleHash: string;
  pixels: number;
  crossfade: number;
  highlightGain: number;
  tileSeeds: number[];
  glError?: number;
  pixelsEncoded?: string;
  sampleEncoded?: string;
}

const artifactPath = resolve('artifacts/headless/hash-baseline.json');
const diffArtifactPath = resolve('artifacts/headless/hash-diff.json');

function fnv1a(bytes: Uint8Array): string {
  let h = 0x811c9dc5 >>> 0;
  for (let i = 0; i < bytes.length; i++) {
    h ^= bytes[i];
    h = Math.imul(h, 0x01000193);
  }
  return ('00000000' + (h >>> 0).toString(16)).slice(-8);
}

function encode(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString('base64');
}

function decode(encoded: string | undefined): Uint8Array | null {
  if (!encoded) return null;
  try {
    return new Uint8Array(Buffer.from(encoded, 'base64'));
  } catch (err) {
    console.error('[headless-render] failed to decode baseline pixel data', err);
    return null;
  }
}

type ChannelName = 'fire' | 'earth' | 'air' | 'water';
const channelNames: ChannelName[] = ['fire', 'earth', 'air', 'water'];

function createDiffArtifact(
  prev: HashArtifact,
  next: HashArtifact,
  prevPixels: Uint8Array,
  nextPixels: Uint8Array
) {
  if (prevPixels.length !== nextPixels.length) {
    return {
      summary: {
        reason: 'length-mismatch',
        prevLength: prevPixels.length,
        nextLength: nextPixels.length
      },
      prev,
      next
    };
  }

  let differing = 0;
  let maxDelta = 0;
  let deltaSum = 0;
  let deltaSumSq = 0;
  const perChannel = channelNames.map(() => ({ differing: 0, maxDelta: 0 }));
  const samples: Array<{ pixel: number; row: number; col: number; channel: ChannelName; prev: number; next: number; delta: number }> = [];

  const totalPixels = prevPixels.length / 4;
  const width = prev.width;

  for (let i = 0; i < prevPixels.length; i++) {
    const a = prevPixels[i];
    const b = nextPixels[i];
    if (a === b) continue;
    const delta = Math.abs(a - b);
    differing++;
    deltaSum += delta;
    deltaSumSq += delta * delta;
    if (delta > maxDelta) maxDelta = delta;
    const pixIndex = Math.floor(i / 4);
    const channelIndex = i % 4;
    const channel = channelNames[channelIndex] ?? 'fire';
    const channelInfo = perChannel[channelIndex];
    channelInfo.differing++;
    if (delta > channelInfo.maxDelta) channelInfo.maxDelta = delta;
    if (samples.length < 16) {
      const row = Math.floor(pixIndex / width);
      const col = pixIndex % width;
      samples.push({ pixel: pixIndex, row, col, channel, prev: a, next: b, delta });
    }
  }

  const rms = differing ? Math.sqrt(deltaSumSq / differing) : 0;
  const meanDelta = differing ? deltaSum / differing : 0;

  return {
    summary: {
      totalPixels,
      differingComponents: differing,
      differingFraction: differing / (prevPixels.length),
      maxDelta,
      meanDelta,
      rmsDelta: rms,
      perChannel,
      samples
    },
    prev: {
      hash: prev.hash,
      sampleHash: prev.sampleHash,
      glError: prev.glError
    },
    next: {
      hash: next.hash,
      sampleHash: next.sampleHash,
      glError: next.glError
    }
  };
}

async function main() {
  const supportsOffscreen = typeof (globalThis as any).OffscreenCanvas !== 'undefined';
  if (!supportsOffscreen) {
    console.log('[headless-render] OffscreenCanvas not available; skipping (ok).');
    return;
  }

  const primaryTile = makeDeterministicTile({ seed: 42, rows: 12, cols: 192, startTimeMs: 0, stepMs: 60_000 });
  const secondaryTile = makeDeterministicTile({ seed: 99, rows: 12, cols: 192, startTimeMs: 0, stepMs: 60_000 });

  const pool = { getView: (size: number) => new Uint8Array(size) };
  const primaryPack = packTiles([primaryTile], { pool });
  const secondaryPack = packTiles([secondaryTile], { pool });
  if (!primaryPack || !secondaryPack) {
    throw new Error('Failed to pack deterministic tiles for headless render');
  }

  const canvas = new (globalThis as any).OffscreenCanvas(primaryPack.totalCols, primaryPack.rows);
  const { gl, tex, texB, uLocations } = initGL(canvas as any, VERT_SOURCE, FRAG_SOURCE);
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Upload textures
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, primaryPack.totalCols, primaryPack.rows, 0, gl.RGBA, gl.UNSIGNED_BYTE, primaryPack.buffer);
  if (uLocations.tex) gl.uniform1i(uLocations.tex, 0);

  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, texB);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, secondaryPack.totalCols, secondaryPack.rows, 0, gl.RGBA, gl.UNSIGNED_BYTE, secondaryPack.buffer);
  if (uLocations.texB) gl.uniform1i(uLocations.texB, 1);

  const crossfade = 0.35;
  const highlightGain = 0.25;
  if (uLocations.rowCount) gl.uniform1f(uLocations.rowCount, primaryPack.rows);
  if (uLocations.blendMode) gl.uniform1i(uLocations.blendMode, 0); // multiply
  if (uLocations.crossfadeLoc) gl.uniform1f(uLocations.crossfadeLoc, crossfade);
  if (uLocations.highlightGainLoc) gl.uniform1f(uLocations.highlightGainLoc, highlightGain);
  if (uLocations.highlightModeLoc) gl.uniform1i(uLocations.highlightModeLoc, 3); // resonance
  if (uLocations.timeStartMs) gl.uniform1f(uLocations.timeStartMs, primaryTile.startTimeMs);
  if (uLocations.timeEndMs) gl.uniform1f(uLocations.timeEndMs, primaryTile.startTimeMs + primaryTile.cols * primaryTile.stepMs);

  if (uLocations.rowMapLoc) {
    const rowMap = new Int32Array(32);
    for (let i = 0; i < rowMap.length; i++) rowMap[i] = i < primaryPack.rows ? i : -1;
    gl.uniform1iv(uLocations.rowMapLoc, rowMap);
  }
  if (uLocations.rowHighlightLoc) {
    const flags = computeRowHarmonicFlags(primaryPack.buffer, primaryPack.rows, primaryPack.totalCols, { purityThreshold: 0.35, minRunColumns: Math.max(4, Math.floor(primaryPack.totalCols * 0.02)) });
    const arr = new Int32Array(32);
    for (let i = 0; i < arr.length; i++) arr[i] = i < flags.length && flags[i] ? 1 : 0;
    gl.uniform1iv(uLocations.rowHighlightLoc, arr);
  }

  gl.drawArrays(gl.TRIANGLES, 0, 6);
  const glError = gl.getError();

  const pixels = new Uint8Array(primaryPack.totalCols * primaryPack.rows * 4);
  gl.readPixels(0, 0, primaryPack.totalCols, primaryPack.rows, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
  const hash = fnv1a(pixels);
  const sampleSide = Math.min(4, primaryPack.totalCols, primaryPack.rows);
  const sampleBuffer = new Uint8Array(sampleSide * sampleSide * 4);
  if (sampleSide > 0) {
    gl.readPixels(0, 0, sampleSide, sampleSide, gl.RGBA, gl.UNSIGNED_BYTE, sampleBuffer);
  }
  const sampleHash = fnv1a(sampleBuffer);

  const artifact: HashArtifact = {
    width: primaryPack.totalCols,
    height: primaryPack.rows,
    hash,
    sampleHash,
    pixels: pixels.length,
    crossfade,
    highlightGain,
    tileSeeds: [42, 99],
    glError: glError || undefined,
    pixelsEncoded: encode(pixels),
    sampleEncoded: sampleSide > 0 ? encode(sampleBuffer) : undefined
  };

  if (existsSync(artifactPath) && process.env.UPDATE_HEADLESS_BASELINE !== '1') {
    const prev = JSON.parse(readFileSync(artifactPath, 'utf-8')) as HashArtifact;
    const match = prev.hash === artifact.hash && prev.sampleHash === artifact.sampleHash;
    if (!match) {
      console.error('[headless-render] Hash mismatch. Previous:', prev.hash, 'Current:', artifact.hash);
      let diffPayload: any = null;
      const prevPixels = decode(prev.pixelsEncoded);
      if (prevPixels) {
        diffPayload = createDiffArtifact(prev, artifact, prevPixels, pixels);
        diffPayload.timestamp = new Date().toISOString();
        diffPayload.width = artifact.width;
        diffPayload.height = artifact.height;
        mkdirSync(dirname(diffArtifactPath), { recursive: true });
        writeFileSync(diffArtifactPath, JSON.stringify(diffPayload, null, 2));
        console.error('[headless-render] Diff artifact written to', diffArtifactPath);
      } else {
        console.warn('[headless-render] Baseline pixel data unavailable; skipping diff artifact. Run with UPDATE_HEADLESS_BASELINE=1 to regenerate baseline.');
      }
      console.error('[headless-render] Set UPDATE_HEADLESS_BASELINE=1 to refresh baselines.');
      process.exitCode = 1;
      return;
    }
    console.log('[headless-render] Baseline matched hash', artifact.hash);
    return;
  }

  mkdirSync(dirname(artifactPath), { recursive: true });
  writeFileSync(artifactPath, JSON.stringify(artifact, null, 2));
  console.log('[headless-render] Baseline written', artifactPath, 'hash', artifact.hash);
}

main().catch((e) => {
  console.error('[headless-render] error', e);
  process.exitCode = 1;
});
