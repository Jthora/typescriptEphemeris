import { useState, useLayoutEffect } from 'react';
import type { RefObject } from 'react';

/**
 * Lightweight resize observer hook.
 * Returns content box width/height of the observed element.
 */
export function useResizeObserver<T extends HTMLElement>(ref: RefObject<T>) {
  const [size, setSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const { clientWidth, clientHeight } = el;
      if (clientWidth !== size.width || clientHeight !== size.height) {
        setSize({ width: clientWidth, height: clientHeight });
      }
    };

    update();

    const ro = new ResizeObserver(() => update());
    ro.observe(el);
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [ref, size.width, size.height]);

  return size;
}
