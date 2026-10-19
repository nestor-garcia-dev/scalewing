'use client';

import { type RefObject, useLayoutEffect, useState } from 'react';

/**
 * Follows the width an element is given, in whole CSS pixels: on mount,
 * before the first paint, and whenever its box changes size. Before that,
 * and on the server, it reports `fallback`; a browser with no
 * ResizeObserver measures on window resizes instead. `content` measures
 * the content box (inside the padding) rather than the border box.
 */
export function useElementWidth(
  ref: RefObject<HTMLElement | null>,
  fallback: number,
  { content = false }: { content?: boolean } = {},
): number {
  const [width, setWidth] = useState(fallback);

  useLayoutEffect(() => {
    const box = ref.current;
    if (!box) return;
    function measure() {
      if (!box) return;
      const style = getComputedStyle(box);
      const padding = content
        ? (parseFloat(style.paddingLeft) || 0) +
          (parseFloat(style.paddingRight) || 0)
        : 0;
      const next = Math.round(box.getBoundingClientRect().width - padding);
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
  }, [ref, content]);

  return width;
}
