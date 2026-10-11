'use client';

import { type RefObject, useEffect, useState } from 'react';

import {
  noScrollOverflow,
  sameScrollOverflow,
  type ScrollOverflow,
  scrollOverflow,
} from '../scroll-overflow.js';

/** A box's overflow, and whether it has been measured yet. */
export type MeasuredScrollOverflow = ScrollOverflow & { measured: boolean };

const unmeasured: MeasuredScrollOverflow = {
  ...noScrollOverflow,
  measured: false,
};

/**
 * Follows which inline edges of a scroll box have more content past them:
 * on mount, on every scroll, and whenever the box or its content changes
 * size. Before mount (and on the server) it reports no overflow and
 * `measured: false`, so the box renders as it always has until it is
 * measured; a measured box with neither edge set fits its content.
 */
export function useScrollOverflow(
  ref: RefObject<HTMLElement | null>,
): MeasuredScrollOverflow {
  const [overflow, setOverflow] = useState<MeasuredScrollOverflow>(unmeasured);

  useEffect(() => {
    const box = ref.current;
    if (!box) return;

    // The metrics hold on a box that does not scroll (a fitting table
    // region set to overflow: visible): scrollWidth still reports content
    // past its edge, so the box turns back into a scroll box as it widens.
    // Keep it that way; a scroll-container-only check would pin it open.
    function measure() {
      if (!box) return;
      const next = scrollOverflow(
        box.scrollLeft,
        box.scrollWidth,
        box.clientWidth,
      );
      setOverflow((current) =>
        current.measured && sameScrollOverflow(current, next)
          ? current
          : { ...next, measured: true },
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
