/**
 * Worker message protocol definitions (Milestone M2)
 */
import type { PlanetId, TimestreamTile, EphemerisProviderMeta } from './types';

export interface TimestreamWorkerInitMessage {
  type: 'init';
  planets: PlanetId[];
  provider?: EphemerisProviderMeta;
}

export interface TimestreamWorkerRequestTileMessage {
  type: 'requestTile';
  startTimeMs: number;
  cols: number;
  stepMs: number;
  lod: number; // 0 finest
}

export interface TimestreamWorkerAbortMessage {
  type: 'abort';
  requestId: string;
}

export interface TimestreamWorkerShutdownMessage {
  type: 'shutdown';
}

export type TimestreamWorkerInboundMessage =
  | TimestreamWorkerInitMessage
  | TimestreamWorkerRequestTileMessage
  | TimestreamWorkerAbortMessage
  | TimestreamWorkerShutdownMessage;

// Outbound
export interface TimestreamWorkerTileMessage {
  type: 'tile';
  tile: TimestreamTile;
}

export interface TimestreamWorkerLogMessage {
  type: 'log';
  level: 'info' | 'warn' | 'error';
  message: string;
}

export type TimestreamWorkerOutboundMessage =
  | TimestreamWorkerTileMessage
  | TimestreamWorkerLogMessage;
