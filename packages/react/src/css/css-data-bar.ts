import { chartFill, statementFillTones } from './chart-tones.js';

/**
 * What a range bar's fill means: the start or a carried figure (`neutral`),
 * money in (`success`), money out (`muted`, never danger: an outflow is not
 * an error), a subtotal (`strong`) and what was counted or recorded
 * (`accent`).
 */
export const dataBarTones = statementFillTones;

export type DataBarTone = (typeof dataBarTones)[number];

/*
 * Each tone is a chart fill (`chart-tones.ts`, shared with ChartLegend's
 * `bar` swatch so a statement's legend matches its bars): a semantic
 * colour mixed into the surface where the board draws a lighter fill. The
 * bar is decorative (the figure is the cell's text), so the mixes keep the
 * tones apart from one another rather than meeting a text contrast: every
 * tone at 1.5:1 or more on the surface, and the three greys (out, start,
 * subtotal) 1.5:1 or more from the next one, in every palette and scheme
 * (`data-bar.test.tsx`). `accent` is the accent itself.
 */
function toneRules(): string {
  return dataBarTones
    .map(
      (tone) =>
        `.sw-data-bar-${tone} > .sw-data-bar-fill { background: ${chartFill(tone)}; }`,
    )
    .join('\n');
}

/*
 * A range bar fills its container's width: a track with no fill of its own,
 * a spacing step 4 tall, and the bar placed on it by two shares the
 * component sets (`--sw-data-bar-start`, `--sw-data-bar-size`), with
 * logical insets so a right-to-left table mirrors it. A diverging domain
 * draws a hairline at zero (`--sw-data-bar-zero`) across the track, under
 * the bar, and the bar's end at zero is square (`sw-data-bar-zero-start`
 * or `-end`), so it meets the line as BarChart's diverging bars do.
 * Forced colours draw the bar and the line in the system text colour;
 * the figure beside it carries the meaning there, as always.
 */
export function cssDataBarClasses(): string {
  return `.sw-data-bar {
  display: block;
  height: var(--sw-space-4);
  min-width: var(--sw-space-6);
  position: relative;
  width: 100%;
}

.sw-data-bar-fill {
  border-radius: calc(var(--sw-radius-sm) / 2);
  inset-block: 0;
  inset-inline-start: calc(var(--sw-data-bar-start, 0) * 100%);
  position: absolute;
  width: calc(var(--sw-data-bar-size, 0) * 100%);
}

${toneRules()}

.sw-data-bar-diverging::before {
  background: var(--sw-color-border);
  content: '';
  inset-block: calc(-1 * var(--sw-space-1));
  inset-inline-start: calc(var(--sw-data-bar-zero, 0) * 100%);
  /* Centred on zero, mirrored right to left. */
  margin-inline-start: -0.5px;
  position: absolute;
  width: 1px;
}

.sw-data-bar-zero-start > .sw-data-bar-fill {
  border-end-start-radius: 0;
  border-start-start-radius: 0;
}

.sw-data-bar-zero-end > .sw-data-bar-fill {
  border-end-end-radius: 0;
  border-start-end-radius: 0;
}

@media (forced-colors: active) {
  .sw-data-bar > .sw-data-bar-fill,
  .sw-data-bar-diverging::before { background: CanvasText; }
}`;
}

export function dataBarClassCatalog(): string[] {
  return [
    'sw-data-bar',
    'sw-data-bar-fill',
    'sw-data-bar-diverging',
    'sw-data-bar-zero-start',
    'sw-data-bar-zero-end',
    ...dataBarTones.map((tone) => `sw-data-bar-${tone}`),
  ];
}
