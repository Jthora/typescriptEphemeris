/**
 * Main-thread worker client (Milestone M2 initial).
 */
import type { TimestreamWorkerOutboundMessage, TimestreamWorkerInboundMessage } from './workerMessages';
import type { EphemerisProviderMeta, TimestreamTile } from './types';

export interface WorkerClientCallbacks {
  onTile: (tile: TimestreamTile) => void;
  onLog?: (level: string, message: string) => void;
}

export class TimestreamWorkerClient {
  private worker: Worker;
  private ready = false;

  constructor(url: string, private callbacks: WorkerClientCallbacks, private providerMeta?: EphemerisProviderMeta) {
    this.worker = new Worker(url, { type: 'module' });
    this.worker.onmessage = (e: MessageEvent<TimestreamWorkerOutboundMessage>) => {
      const msg = e.data;
      if (msg.type === 'tile') {
        this.callbacks.onTile(msg.tile);
      } else if (msg.type === 'log') {
        this.callbacks.onLog?.(msg.level, msg.message);
      }
    };
    this.send({ type: 'init', planets: [], provider: this.providerMeta });
  }

  requestTile(startTimeMs: number, cols: number, stepMs: number, lod: number) {
    this.send({ type: 'requestTile', startTimeMs, cols, stepMs, lod });
  }

  shutdown() {
    this.send({ type: 'shutdown' });
  }

  private send(msg: TimestreamWorkerInboundMessage) {
    this.worker.postMessage(msg);
  }
}
