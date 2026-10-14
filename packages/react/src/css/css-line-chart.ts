import { chartAreaShare } from './chart-tones.js';

/*
 * The marks only a line chart draws, beside the shared plot classes
 * (`css-chart-plot.ts`): the area under the line, a quiet tint of its
 * stroke; a marker's triangle in its tone's stroke; and the marker's
 * words in its tone's ink. Forced colours drop the area and draw markers
 * and their words in the text colour, apart from the line's highlight
 * colour.
 */
export function cssLineChartClasses(): string {
  return `.sw-chart-area {
  fill: color-mix(in srgb, var(--sw-chart-stroke) ${chartAreaShare * 100}%, transparent);
}

.sw-chart-marker { fill: var(--sw-chart-stroke); }

.sw-chart-marker-label {
  fill: var(--sw-chart-ink);
  font-variant-numeric: tabular-nums;
  font-weight: 600;
}

@media (forced-colors: active) {
  .sw-chart-area { fill: none; }
  .sw-chart-marker,
  .sw-chart-marker-label { fill: CanvasText; }
}`;
}

export function lineChartClassCatalog(): string[] {
  return ['sw-chart-area', 'sw-chart-marker', 'sw-chart-marker-label'];
}
