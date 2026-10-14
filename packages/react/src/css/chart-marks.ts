/*
 * The sizes every chart's marks share, so a legend swatch is drawn at the
 * size of the mark it names. They are geometry, not theme values: the
 * colours come from `chart-tones.ts` and the type from the caption variant.
 */

/** A line's thickness (a chart's line and a legend's line swatch), in px. */
export const chartLineWidth = 2;

/** A hairline: a grid line, a leader, the boxed period's dashed edge. */
export const chartHairline = 1;

/** The boxed period's dashes: 3 px drawn, 3 px left out. */
export const chartBoxDash = '3 3';

/** A callout's leader: finer dashes, 2 px drawn, 2 px left out. */
export const chartLeaderDash = '2 2';

/** The gap between grouped columns side by side, at most. */
export const chartColumnGap = chartLineWidth;
