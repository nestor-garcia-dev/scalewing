import { typographyVariants } from '@scalewing/tokens';

import {
  chartBoxDash,
  chartHairline,
  chartLeaderDash,
  chartLineWidth,
} from './chart-marks.js';

const caption = typographyVariants.caption;

/*
 * The parts every plotted chart (ColumnChart, LineChart) draws in its SVG:
 * the words in the caption type, the grid and zero lines, the boxed
 * period, a line and its last value, and the callouts with their leaders.
 * Every colour is a theme colour or a tone's role (`chart-tones.ts`), read
 * from the tone class on the mark or its group; words with no tone are
 * the text colour.
 */
function plotRules(): string {
  return `.sw-chart {
  display: grid;
  gap: var(--sw-space-2);
  min-width: 0;
}

.sw-chart-svg {
  display: block;
  font-family: var(--sw-font-sans);
  font-size: ${caption.fontSize}px;
  height: auto;
  letter-spacing: ${caption.letterSpacing}px;
  max-width: 100%;
  overflow: visible;
  width: 100%;
}

.sw-chart-tick,
.sw-chart-category {
  fill: var(--sw-color-muted);
  font-variant-numeric: tabular-nums;
}

.sw-chart-tick-line { fill: var(--sw-chart-ink); }

.sw-chart-grid {
  stroke: var(--sw-color-border);
  stroke-width: ${chartHairline};
}

.sw-chart-zero {
  stroke: var(--sw-color-muted);
  stroke-width: ${chartHairline};
}

.sw-chart-highlight {
  fill: none;
  stroke: var(--sw-chart-stroke);
  stroke-dasharray: ${chartBoxDash};
  stroke-width: ${chartHairline};
}

.sw-chart-line {
  fill: none;
  stroke: var(--sw-chart-stroke);
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: ${chartLineWidth};
}

.sw-chart-dot { fill: var(--sw-chart-stroke); }

.sw-chart-end-label {
  fill: var(--sw-chart-ink);
  font-variant-numeric: tabular-nums;
  font-weight: 600;
}

.sw-chart-leader {
  stroke: var(--sw-chart-ink, var(--sw-color-text));
  stroke-dasharray: ${chartLeaderDash};
  stroke-width: ${chartHairline};
}

.sw-chart-callout-text {
  fill: var(--sw-chart-ink, var(--sw-color-text));
  font-weight: 600;
}`;
}

/*
 * On a compact chart the callouts are a list under the plot: each its
 * words in its hue's ink, after a dot in its hue's fill (the colour of its
 * column) centred on their first line.
 */
function calloutListRules(): string {
  return `.sw-chart-callouts {
  display: grid;
  font-family: var(--sw-font-sans);
  font-size: ${caption.fontSize}px;
  gap: var(--sw-space-1);
  letter-spacing: ${caption.letterSpacing}px;
  line-height: ${caption.lineHeight}px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.sw-chart-callout {
  align-items: flex-start;
  color: var(--sw-chart-ink, var(--sw-color-text));
  display: flex;
  font-weight: 600;
  gap: var(--sw-space-2);
}

.sw-chart-callout-dot {
  background: var(--sw-chart-fill, currentColor);
  border-radius: var(--sw-radius-pill);
  flex: none;
  height: var(--sw-space-2);
  margin-block-start: calc((${caption.lineHeight}px - var(--sw-space-2)) / 2);
  width: var(--sw-space-2);
}`;
}

/*
 * Forced colours keep the drawing legible in the system colours: marks in
 * the text colour (columns outlined in the canvas colour so a stack's
 * parts stay apart), the line and its last value in the highlight colour,
 * grid lines in the grey text colour, and every word in the text colour.
 * The hidden table carries the figures there as everywhere.
 */
function forcedColorRules(): string {
  return `@media (forced-colors: active) {
  .sw-chart-column { fill: CanvasText; stroke: Canvas; }
  .sw-chart-grid { stroke: GrayText; }
  .sw-chart-zero,
  .sw-chart-highlight,
  .sw-chart-leader { stroke: CanvasText; }
  .sw-chart-line { stroke: Highlight; }
  .sw-chart-dot,
  .sw-chart-end-label { fill: Highlight; }
  .sw-chart-tick,
  .sw-chart-category,
  .sw-chart-callout-text { fill: CanvasText; }
  .sw-chart-callout { color: CanvasText; }
  .sw-chart-callout-dot { background: CanvasText; }
}`;
}

export function cssChartPlotClasses(): string {
  return `${plotRules()}

.sw-chart-column { fill: var(--sw-chart-fill); }

${calloutListRules()}

${forcedColorRules()}`;
}

export function chartPlotClassCatalog(): string[] {
  return [
    'sw-chart',
    'sw-chart-svg',
    'sw-chart-tick',
    'sw-chart-tick-line',
    'sw-chart-category',
    'sw-chart-grid',
    'sw-chart-zero',
    'sw-chart-highlight',
    'sw-chart-line',
    'sw-chart-dot',
    'sw-chart-end-label',
    'sw-chart-leader',
    'sw-chart-callout-text',
    'sw-chart-column',
    'sw-chart-callouts',
    'sw-chart-callout',
    'sw-chart-callout-dot',
  ];
}
