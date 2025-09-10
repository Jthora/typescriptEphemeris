// Ordering integrity utilities (scoped to tile body order vs planet reorder)
export function computeOrderSignature(bodies: readonly string[] | undefined): string {
  return bodies && bodies.length ? bodies.join('|') : '';
}

export function ordersMatch(a: readonly string[] | undefined, b: readonly string[] | undefined): boolean {
  if (!a || !b) return !a && !b;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

export interface OrderValidationResult {
  signature: string;
  mismatchedTileIds: string[];
}

export function validateTileOrders(tiles: { id: string; bodies?: string[] }[]): OrderValidationResult {
  if (!tiles.length) return { signature: '', mismatchedTileIds: [] };
  const sig = computeOrderSignature(tiles[0].bodies);
  const mismatched: string[] = [];
  for (let i = 1; i < tiles.length; i++) {
    if (computeOrderSignature(tiles[i].bodies) !== sig) mismatched.push(tiles[i].id);
  }
  return { signature: sig, mismatchedTileIds: mismatched };
}

// Dev-only warning suppression (one per signature)
export function devWarnOnce(key: string, msg: string) {
  if (typeof window === 'undefined') return;
  const anyWin: any = window as any;
  const cache: Set<string> = anyWin.__timestreamWarnedKeys || (anyWin.__timestreamWarnedKeys = new Set());
  if (cache.has(key)) return;
  cache.add(key);
  if (import.meta.env.DEV) console.warn(msg);
}