import { typographyVariants } from '@scalewing/tokens';

import {
  chartStroke,
  chartStrokeTones,
  type ChartStrokeTone,
} from './chart-tones.js';

const caption = typographyVariants.caption;
const data = typographyVariants.data;

/**
 * The meanings a bar's fill can take in place of its sign's default (the
 * accent, or danger for a negative value), such as a diverging chart whose
 * overage is a warning and whose shortage is danger.
 */
export const barChartTones = chartStrokeTones;

export type BarChartTone = ChartStrokeTone;

/**
 * A tone's colour: the charts' stroke colour of that tone (`chart-tones.ts`),
 * a semantic colour at 3:1 or more, the muted grey for `neutral`, a bar
 * that is counted but not the point (the other days beside the busiest
 * ones). Not the lighter fill mix a column takes, which is 1.5:1.
 */
export function barChartToneColor(tone: BarChartTone): string {
  return chartStroke(tone);
}

/**
 * `track` (the default) draws each bar in a track with the value axis
 * under the bars; `bare` draws the bars alone, with no track and no axis,
 * for bars whose values are all written beside them.
 */
export const barChartAppearances = ['track', 'bare'] as const;
export type BarChartAppearance = (typeof barChartAppearances)[number];

/*
 * A tone's rule follows the negative fill's, at the same specificity, so a
 * toned negative bar keeps its diverging geometry and takes the tone's
 * color. Each tone keeps 3:1 against the track in every palette and scheme
 * (`chart.test.tsx`). Forced colors would paint a token fill as the
 * canvas, so every fill, toned or not, is drawn in the system text color
 * after the tones: the value and its sign carry the meaning there.
 */
function toneRules(): string {
  return barChartTones
    .map(
      (tone) =>
        `.sw-bar-chart-fill-${tone} { background: ${barChartToneColor(tone)}; }`,
    )
    .join('\n');
}

/*
 * A diverging chart puts zero in the middle of each track, marked by a
 * hairline: a positive bar starts there and grows toward the inline end, a
 * negative one ends there and grows toward the start, each at most half the
 * track. The fill keeps its share of the scale (`--sw-bar-fill`), so a
 * bar is half as long as in the magnitude layout, on the same scale. The
 * end at zero is square, so the bars meet the hairline.
 */
function divergingRules(): string {
  return `.sw-bar-chart-diverging .sw-bar-chart-track {
  position: relative;
}

.sw-bar-chart-diverging .sw-bar-chart-track::before {
  background: var(--sw-color-border);
  content: '';
  inset-block: 0;
  inset-inline-start: 50%;
  position: absolute;
  width: 1px;
}

.sw-bar-chart-diverging .sw-bar-chart-fill {
  border-end-start-radius: 0;
  border-start-start-radius: 0;
  margin-inline-start: 50%;
  width: calc(var(--sw-bar-fill, 0) * 50%);
}

.sw-bar-chart-diverging .sw-bar-chart-fill-negative {
  border-end-end-radius: 0;
  border-end-start-radius: inherit;
  border-start-end-radius: 0;
  border-start-start-radius: inherit;
  margin-inline-start: calc(50% - var(--sw-bar-fill, 0) * 50%);
}

@media (forced-colors: active) {
  .sw-bar-chart-diverging .sw-bar-chart-track::before { background: CanvasText; }
}`;
}

/*
 * A bare chart draws no track: the bar sits on the surface around it, the
 * track's room kept so the labels and values line up as before (in forced
 * colours its edge is the canvas colour, as forcing replaces a transparent
 * one). A diverging bare chart keeps its zero hairline.
 */
function bareRules(): string {
  return `.sw-bar-chart-bare .sw-bar-chart-track {
  background: transparent;
  border-color: transparent;
}

/* Forced colours replace a transparent edge; the canvas colour hides it. */
@media (forced-colors: active) {
  .sw-bar-chart-bare .sw-bar-chart-track { border-color: Canvas; }
}`;
}

export function cssBarChartClasses(): string {
  return `.sw-bar-chart {
  display: grid;
  gap: var(--sw-space-2);
}

.sw-bar-chart-plot {
  display: grid;
  gap: var(--sw-space-2);
  list-style: none;
  margin: 0;
  padding: 0;
}

.sw-bar-chart-row,
.sw-bar-chart-axis {
  align-items: center;
  display: grid;
  gap: var(--sw-space-3);
  grid-template-columns: minmax(0, 2fr) minmax(0, 5fr) minmax(var(--sw-space-8), max-content);
}

.sw-bar-chart-label {
  color: var(--sw-color-muted);
  font-family: var(--sw-font-sans);
  font-size: ${caption.fontSize}px;
  font-weight: 400;
  letter-spacing: ${caption.letterSpacing}px;
  line-height: ${caption.lineHeight}px;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sw-bar-chart-track {
  background: var(--sw-glass-fill);
  border: 1px solid var(--sw-color-border);
  border-radius: var(--sw-radius-pill);
  height: var(--sw-space-3);
  min-width: 0;
  overflow: hidden;
}

.sw-bar-chart-fill {
  background: var(--sw-color-accent);
  border-radius: inherit;
  display: block;
  height: 100%;
  width: calc(var(--sw-bar-fill, 0) * 100%);
}

.sw-bar-chart-fill-negative {
  background: var(--sw-color-danger);
}

${toneRules()}

.sw-bar-chart-value {
  color: var(--sw-color-text);
  font-family: var(--sw-font-sans);
  font-size: ${data.fontSize}px;
  font-variant-numeric: tabular-nums;
  font-weight: ${data.fontWeight};
  letter-spacing: ${data.letterSpacing}px;
  line-height: ${data.lineHeight}px;
  text-align: end;
}

.sw-bar-chart-axis {
  color: var(--sw-color-muted);
  font-family: var(--sw-font-sans);
  font-size: ${caption.fontSize}px;
  font-weight: 400;
  letter-spacing: ${caption.letterSpacing}px;
  line-height: ${caption.lineHeight}px;
}

.sw-bar-chart-axis-track {
  display: flex;
  justify-content: space-between;
}

${divergingRules()}

${bareRules()}

@media (forced-colors: active) {
  .sw-bar-chart-fill { background: CanvasText; }
}`;
}

export function barChartClassCatalog(): string[] {
  return [
    'sw-bar-chart',
    'sw-bar-chart-plot',
    'sw-bar-chart-row',
    'sw-bar-chart-axis',
    'sw-bar-chart-label',
    'sw-bar-chart-track',
    'sw-bar-chart-fill',
    'sw-bar-chart-fill-negative',
    ...barChartTones.map((tone) => `sw-bar-chart-fill-${tone}`),
    'sw-bar-chart-value',
    'sw-bar-chart-axis-track',
    'sw-bar-chart-diverging',
    'sw-bar-chart-bare',
  ];
}
