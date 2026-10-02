'use client';

import { type RefObject, useEffect, useState } from 'react';

import {
  noScrollOverflow,
  sameScrollOverflow,
  type ScrollOverflow,
  scrollOverflow,
} from '../scroll-overflow.js';

/**
 * Follows which inline edges of a scroll box have more content past them:
 * on mount, on every scroll, and whenever the box or its content changes
 * size. Before mount (and on the server) it reports no overflow, so the
 * box renders as it always has until it is measured.
 */
export function useScrollOverflow(
  ref: RefObject<HTMLElement | null>,
): ScrollOverflow {
  const [overflow, setOverflow] = useState<ScrollOverflow>(noScrollOverflow);

  useEffect(() => {
    const box = ref.current;
    if (!box) return;

    function measure() {
      if (!box) return;
      const next = scrollOverflow(
        box.scrollLeft,
        box.scrollWidth,
        box.clientWidth,
      );
      setOverflow((current) =>
        sameScrollOverflow(current, next) ? current : next,
      );
    }

    measure();
    box.addEventListener('scroll', measure, { passive: true });
    const resize =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(measure);
    if (resize) {
      resize.observe(box);
      for (const child of Array.from(box.children)) resize.observe(child);
    } else {
      window.addEventListener('resize', measure);
    }
    return () => {
      box.removeEventListener('scroll', measure);
      if (resize) resize.disconnect();
      else window.removeEventListener('resize', measure);
    };
  }, [ref]);

  return overflow;
}
