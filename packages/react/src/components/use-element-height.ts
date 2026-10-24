'use client';

import { type RefObject, useLayoutEffect, useState } from 'react';

/**
 * Follows the height of an element's border box, in CSS pixels: on
 * mount, before the first paint, and whenever its box changes size. It is
 * `null` before that, on the server, while `enabled` is false and while the
 * element draws no box (`display: none`), so a caller can fall back to a
 * value of its own. A browser with no ResizeObserver measures on window
 * resizes instead.
 */
export function useElementHeight(
  ref: RefObject<HTMLElement | null>,
  enabled = true,
): number | null {
  const [height, setHeight] = useState<number | null>(null);

  useLayoutEffect(() => {
    const box = ref.current;
    if (!box || !enabled) {
      setHeight(null);
      return;
    }
    function measure() {
      if (!box) return;
      const next = box.getBoundingClientRect().height;
      setHeight(next > 0 ? next : null);
    }
    measure();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
    }
    const observer = new ResizeObserver(measure);
    observer.observe(box);
    return () => observer.disconnect();
  }, [ref, enabled]);

  return height;
}
