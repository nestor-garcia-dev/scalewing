import { typographyVariants } from '@scalewing/tokens';

import { chartHairline, chartLineWidth } from './chart-marks.js';

const caption = typographyVariants.caption;

/** The marks a legend item can show: what its words name in the chart. */
export const chartLegendSwatches = ['bar', 'line', 'marker', 'box'] as const;

export type ChartLegendSwatch = (typeof chartLegendSwatches)[number];

/*
 * Each swatch reads its colour from the item's tone class
 * (`sw-chart-tone-<tone>`, `chart-tones.ts`): a bar is the tone's fill, a
 * square a spacing step 3 wide; a line is its stroke, a spacing step 4
 * long at the charts' line width; a marker is a downward triangle in the
 * stroke, the shape a chart's marker takes; a box is the dashed outline of
 * the boxed current period. Forced colours draw every swatch in the system
 * text colour, as they draw the marks.
 */
function swatchRules(): string {
  return `.sw-chart-legend-bar {
  background: var(--sw-chart-fill);
  border-radius: calc(var(--sw-radius-sm) / 4);
  height: var(--sw-space-3);
  width: var(--sw-space-3);
}

.sw-chart-legend-line {
  background: var(--sw-chart-stroke);
  border-radius: var(--sw-radius-pill);
  height: ${chartLineWidth}px;
  width: var(--sw-space-4);
}

.sw-chart-legend-marker {
  background: var(--sw-chart-stroke);
  clip-path: polygon(0 0, 100% 0, 50% 100%);
  height: var(--sw-space-3);
  width: var(--sw-space-3);
}

.sw-chart-legend-box {
  border: ${chartHairline}px dashed var(--sw-chart-stroke);
  border-radius: calc(var(--sw-radius-sm) / 2);
  box-sizing: border-box;
  height: var(--sw-space-3);
  width: var(--sw-space-4);
}

@media (forced-colors: active) {
  .sw-chart-legend-bar,
  .sw-chart-legend-line,
  .sw-chart-legend-marker { background: CanvasText; }
  .sw-chart-legend-box { border-color: CanvasText; }
}`;
}

/*
 * A legend is a list of its items in a wrapping row, in the caption type:
 * each item its swatch, then its words. The words wrap within the item
 * rather than push the row past its container, and the swatch stays
 * centred on their first line.
 */
export function cssChartLegendClasses(): string {
  return `.sw-chart-legend {
  color: var(--sw-color-text);
  column-gap: var(--sw-space-5);
  display: flex;
  flex-wrap: wrap;
  font-family: var(--sw-font-sans);
  font-size: ${caption.fontSize}px;
  font-weight: ${caption.fontWeight};
  letter-spacing: ${caption.letterSpacing}px;
  line-height: ${caption.lineHeight}px;
  list-style: none;
  margin: 0;
  padding: 0;
  row-gap: var(--sw-space-2);
}

.sw-chart-legend-item {
  align-items: flex-start;
  display: inline-flex;
  gap: var(--sw-space-2);
  min-width: 0;
}

.sw-chart-legend-swatch {
  display: block;
  flex: none;
  /* Centred on the first line of the words, however many lines they wrap to. */
  margin-block-start: calc((${caption.lineHeight}px - var(--sw-space-3)) / 2);
}

.sw-chart-legend-line {
  margin-block-start: calc((${caption.lineHeight}px - ${chartLineWidth}px) / 2);
}

${swatchRules()}`;
}

export function chartLegendClassCatalog(): string[] {
  return [
    'sw-chart-legend',
    'sw-chart-legend-item',
    'sw-chart-legend-swatch',
    ...chartLegendSwatches.map((swatch) => `sw-chart-legend-${swatch}`),
  ];
}
