'use client';

import { type RefObject, useEffect, useState } from 'react';

import {
  blockScrollOverflow,
  type BlockScrollOverflow,
  noBlockScrollOverflow,
  noScrollOverflow,
  sameBlockScrollOverflow,
  sameScrollOverflow,
  type ScrollOverflow,
  scrollOverflow,
} from '../scroll-overflow.js';

/** A box's overflow on both axes, and whether it has been measured yet. */
export type MeasuredScrollOverflow = ScrollOverflow &
  BlockScrollOverflow & { measured: boolean };

const unmeasured: MeasuredScrollOverflow = {
  ...noScrollOverflow,
  ...noBlockScrollOverflow,
  measured: false,
};

function measureBox(box: HTMLElement): MeasuredScrollOverflow {
  return {
    ...scrollOverflow(box.scrollLeft, box.scrollWidth, box.clientWidth),
    ...blockScrollOverflow(box.scrollTop, box.scrollHeight, box.clientHeight),
    measured: true,
  };
}

function sameMeasure(
  current: MeasuredScrollOverflow,
  next: MeasuredScrollOverflow,
): boolean {
  return (
    current.measured &&
    sameScrollOverflow(current, next) &&
    sameBlockScrollOverflow(current, next)
  );
}

/**
 * Follows which edges of a scroll box have more content past them, the
 * inline start and end and the top and bottom: on mount, on every scroll,
 * and whenever the box or its content changes size. Before mount (and on
 * the server) it reports no overflow and `measured: false`, so the box
 * renders as it always has until it is measured; a measured box with
 * neither inline edge set fits its content's width. A box whose height
 * follows its content never reports a block edge.
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
      const next = measureBox(box);
      setOverflow((current) => (sameMeasure(current, next) ? current : next));
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
