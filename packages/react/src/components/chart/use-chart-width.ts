'use client';

import { type RefObject } from 'react';

import { chartFallbackWidth } from '../../chart-metrics.js';
import { useElementWidth } from '../use-element-width.js';

/**
 * Follows the width a chart is given, so its drawing is laid out in its
 * own pixels: on mount, before the first paint, and whenever its box
 * changes size. On the server it reports `chartFallbackWidth`, and a browser with
 * no ResizeObserver measures on window resizes instead.
 */
export function useChartWidth(ref: RefObject<HTMLElement | null>): number {
  return useElementWidth(ref, chartFallbackWidth);
}
