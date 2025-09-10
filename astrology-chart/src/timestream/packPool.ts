/** Simple growable buffer pool for packing (Uint8Array) */
class Uint8Pool {
  private buf: Uint8Array | null = null;
  allocCount = 0;
  getView(size: number): Uint8Array {
    const cap = this.buf ? this.buf.byteLength : 0;
    if (!this.buf || cap < size) {
      // grow to next power of two >= size
      let next = 1;
      while (next < size) next <<= 1;
      this.buf = new Uint8Array(next);
      this.allocCount++;
    }
    return this.buf.subarray(0, size);
  }
}

export const packPool = new Uint8Pool();
