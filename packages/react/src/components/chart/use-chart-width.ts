'use client';

import { type RefObject, useLayoutEffect, useState } from 'react';

import { chartFallbackWidth } from '../../chart-metrics.js';

/**
 * Follows the width a chart is given, so its drawing is laid out in its
 * own pixels: on mount, before the first paint, and whenever its box
 * changes size. On the server it reports `chartFallbackWidth`, and a browser with
 * no ResizeObserver measures on window resizes instead.
 */
export function useChartWidth(ref: RefObject<HTMLElement | null>): number {
  const [width, setWidth] = useState(chartFallbackWidth);

  // Before paint, so a phone never shows the wide layout first.
  useLayoutEffect(() => {
    const box = ref.current;
    if (!box) return;
    function measure() {
      if (!box) return;
      const next = Math.round(box.getBoundingClientRect().width);
      if (next > 0) setWidth(next);
    }
    measure();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
    }
    const observer = new ResizeObserver(measure);
    observer.observe(box);
    return () => observer.disconnect();
  }, [ref]);

  return width;
}
