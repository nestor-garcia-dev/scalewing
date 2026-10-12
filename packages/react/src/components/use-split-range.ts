'use client';

import { useCallback, useLayoutEffect, useState, type RefObject } from 'react';

import { containerContentWidth, splitTokenMetrics } from '../split-measure.js';
import { effectiveSplitRange, type SplitMetrics } from '../split-size.js';

export type SplitRange = Pick<SplitMetrics, 'min' | 'max'> & {
  defaultWidth: number;
};

function sameRange(a: SplitRange | null, b: SplitRange): boolean {
  return (
    a !== null &&
    a.min === b.min &&
    a.max === b.max &&
    a.defaultWidth === b.defaultWidth
  );
}

/**
 * The range a Split's pane can take in its container, measured on layout and
 * whenever the container resizes, and `measure` for a gesture, which also
 * brings the shown range up to date. An unchanged range keeps its state, so
 * a resize that changes nothing does not render again.
 */
export function useSplitRange(
  splitRef: RefObject<HTMLDivElement | null>,
  handleRef: RefObject<HTMLDivElement | null>,
) {
  const [range, setRange] = useState<SplitRange | null>(null);

  const measure = useCallback((): SplitMetrics & { defaultWidth: number } => {
    const split = splitRef.current;
    if (!split) {
      return { min: 0, max: 0, step: 16, defaultWidth: 0 };
    }
    const tokens = splitTokenMetrics(split);
    const handleWidth = handleRef.current?.getBoundingClientRect().width ?? 0;
    const measured = {
      ...tokens,
      ...effectiveSplitRange(tokens, containerContentWidth(split), handleWidth),
    };
    const next = {
      min: measured.min,
      max: measured.max,
      defaultWidth: measured.defaultWidth,
    };
    setRange((current) => (sameRange(current, next) ? current : next));
    return measured;
  }, [splitRef, handleRef]);

  useLayoutEffect(() => {
    const parent = splitRef.current?.parentElement;
    measure();
    if (!parent || typeof ResizeObserver === 'undefined') {
      return;
    }
    const observer = new ResizeObserver(() => measure());
    observer.observe(parent);
    return () => observer.disconnect();
  }, [measure, splitRef]);

  return { range, measure };
}
