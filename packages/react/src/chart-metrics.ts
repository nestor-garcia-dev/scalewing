import {
  radiusScale,
  spacingScale,
  typographyVariants,
} from '@scalewing/tokens';

import { chartLineWidth } from './css/chart-marks.js';

/*
 * The measures a chart's drawing is laid out with, all from tokens: the
 * caption type its words are set in, spacing steps for its gaps, and the
 * radius scale for its corners. The drawing is SVG in the chart's own
 * pixels, so it is laid out for the width it is given (D-39: component
 * geometry, not theme math).
 */

/** The type a chart's words are drawn in: the caption variant. */
export const chartType = typographyVariants.caption;

/** The gap between a mark and its words, and around the plot. */
export const chartGap = spacingScale[2];

/** A small inset: a leader's distance from its column, a box's overhang. */
export const chartInset = spacingScale[1];

/**
 * Below this width a chart is compact: its callouts move under the plot as
 * a list, its plot is shorter, and its axes label fewer places. A phone
 * column (a 390 px screen less its margins) is under it; a tablet's is not.
 */
export const chartCompactWidth = spacingScale[8] * 10;

/**
 * The narrowest plot a chart keeps: under it, a line's own axis gives up
 * its words (the line's last value and the hidden table still say it).
 */
export const chartMinPlotWidth = spacingScale[8] * 2;

/** The width a chart is drawn at before it has been measured. */
export const chartFallbackWidth = spacingScale[8] * 13;

/** The plot's height: the area the values are drawn in. */
export function chartPlotHeight(compact: boolean): number {
  return compact ? spacingScale[6] * 5 : spacingScale[8] * 4;
}

/** A column's corners, and the boxed period's. */
export const chartColumnRadius = radiusScale.sm / 4;
export const chartBoxRadius = radiusScale.sm / 2;

/** The dot at a line's last value. */
export const chartDotRadius = chartLineWidth * 1.75;

/**
 * About how wide a run of the chart's words is: its characters at 0.6 of
 * the font size, the width of a tabular digit in the system sans. Used to
 * leave room for axis labels and to keep labels from running into one
 * another; the words are short figures and dates.
 */
export function chartTextWidth(text: string): number {
  return text.length * chartType.fontSize * 0.6;
}
