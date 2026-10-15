import {
  type CategoricalColor,
  type CategoricalHue,
  categoricalColorKeys,
  categoricalHues,
} from '@scalewing/tokens';

import { isOneOf } from '../is-one-of.js';

/*
 * The colours every chart mark and legend swatch is drawn from, so a
 * legend's swatch is always the colour of the mark it names. A tone plays
 * up to three roles, each with its own list:
 *
 * - a fill (a column, a range bar, a `bar` swatch): the categorical scale
 *   for a chart's series, and the range bar's statement tones;
 * - a stroke (a line, a marker, the boxed current period): the semantic
 *   colours, which keep 3:1 on the surface in every palette and scheme;
 * - an ink (the words drawn beside a mark: a callout, a line's last value,
 *   a marker's label), which keeps 4.5:1 on the surface.
 *
 * `chart-tones.test.ts` holds each role to its contrast in every palette.
 */

/** Where a mark's colour comes from: a semantic or a categorical colour. */
export type ChartColorSource =
  | { semantic: 'accent' | 'success' | 'warning' | 'danger' | 'muted' | 'text' }
  | { categorical: CategoricalColor };

/**
 * A colour mixed into the surface or toward the text colour by a share of
 * its own (1 is the colour unmixed).
 */
export type ChartColorMix = ChartColorSource & {
  share: number;
  into: 'surface' | 'text';
};

/** A source as its custom property. */
function sourceProperty(source: ChartColorSource): string {
  return 'semantic' in source
    ? `var(--sw-color-${source.semantic})`
    : `var(--sw-categorical-${source.categorical})`;
}

/**
 * The statement tones a range bar's fill takes (see DataBar). `danger` is
 * for a shortage, never for cash leaving: an outflow is `muted`.
 */
export const statementFillTones = [
  'neutral',
  'success',
  'muted',
  'strong',
  'accent',
  'danger',
] as const;

/**
 * Every fill tone: the categorical colours (a chart's series), then the
 * statement tones a range bar adds. `neutral` is in both and is one grey.
 */
export const chartFillTones = [
  ...categoricalColorKeys,
  ...statementFillTones.filter((tone) => tone !== 'neutral'),
] as const;

export type ChartFillTone =
  CategoricalColor | (typeof statementFillTones)[number];

/** The tones a line, a marker or the boxed period is drawn in. */
export const chartStrokeTones = [
  'accent',
  'success',
  'warning',
  'danger',
  'neutral',
] as const;

export type ChartStrokeTone = (typeof chartStrokeTones)[number];

/** Every tone a chart or a legend swatch can take. */
export type ChartTone = ChartFillTone | ChartStrokeTone;

export const chartTones: readonly ChartTone[] = [
  ...new Set<ChartTone>([...chartFillTones, ...chartStrokeTones]),
];

/**
 * How much of a categorical colour a column's fill mixes into the surface:
 * a lighter fill, so a line drawn over the columns stands apart, that
 * keeps 1.5:1 on the surface in every palette and scheme.
 */
export const categoricalFillShare = 0.72;

/**
 * How much of the danger colour its fill mixes into the surface (a
 * shortage's range bar, never cash leaving): a light red, at 1.5:1 or more
 * on the surface in every palette and scheme, as every other fill.
 */
export const dangerFillShare = 0.4;

/** Each fill tone's colour, mixed into the surface. */
export const chartFillMixes: Record<ChartFillTone, ChartColorMix> = {
  ...(Object.fromEntries(
    categoricalHues.map((hue) => [
      hue,
      { categorical: hue, share: categoricalFillShare, into: 'surface' },
    ]),
  ) as Record<CategoricalHue, ChartColorMix>),
  neutral: { semantic: 'muted', share: 0.65, into: 'surface' },
  success: { semantic: 'success', share: 0.55, into: 'surface' },
  muted: { semantic: 'muted', share: 0.35, into: 'surface' },
  strong: { semantic: 'text', share: 0.85, into: 'surface' },
  accent: { semantic: 'accent', share: 1, into: 'surface' },
  danger: { semantic: 'danger', share: dangerFillShare, into: 'surface' },
};

/** Each stroke tone's colour: a semantic colour, or muted for neutral. */
export const chartStrokeColors: Record<ChartStrokeTone, ChartColorSource> = {
  accent: { semantic: 'accent' },
  success: { semantic: 'success' },
  warning: { semantic: 'warning' },
  danger: { semantic: 'danger' },
  neutral: { semantic: 'muted' },
};

/** A stroke tone's colour as CSS, such as a line's or a bar's. */
export function chartStroke(tone: ChartStrokeTone): string {
  return sourceProperty(chartStrokeColors[tone]);
}

/**
 * How much of a line's stroke the area under it takes, over transparency:
 * a quiet tint behind the line, decorative (the line carries the values).
 */
export const chartAreaShare = 0.12;

/** How much of a hue's colour its words keep, moved toward the text colour. */
export const categoricalInkShare = 0.3;

/** How much of a semantic colour its words keep, moved toward the text colour. */
export const semanticInkShare = 0.5;

/** The tones whose words are drawn beside a mark: a series' and a stroke's. */
export const chartInkTones = [...categoricalHues, ...chartStrokeTones] as const;

export type ChartInkTone = (typeof chartInkTones)[number];

/** The words beside a mark: its tone moved toward the text colour. */
export const chartInkMixes: Record<ChartInkTone, ChartColorMix> = {
  ...(Object.fromEntries(
    categoricalHues.map((hue) => [
      hue,
      { categorical: hue, share: categoricalInkShare, into: 'text' },
    ]),
  ) as Record<CategoricalHue, ChartColorMix>),
  accent: { semantic: 'accent', share: semanticInkShare, into: 'text' },
  success: { semantic: 'success', share: semanticInkShare, into: 'text' },
  warning: { semantic: 'warning', share: semanticInkShare, into: 'text' },
  danger: { semantic: 'danger', share: semanticInkShare, into: 'text' },
  neutral: { semantic: 'muted', share: 1, into: 'text' },
};

/** A mix as CSS: the colour alone when unmixed. */
export function chartColorMix(mix: ChartColorMix): string {
  const color = sourceProperty(mix);
  if (mix.share === 1) return color;
  return `color-mix(in srgb, ${color} ${Math.round(mix.share * 100)}%, var(--sw-color-${mix.into}))`;
}

/** A fill tone's colour. */
export function chartFill(tone: ChartFillTone): string {
  return chartColorMix(chartFillMixes[tone]);
}

/*
 * A tone class hands its roles to the marks inside it as custom
 * properties, `--sw-chart-fill`, `--sw-chart-stroke` and `--sw-chart-ink`,
 * so a legend swatch, a column, a line and a label each read the role it
 * draws. A tone sets only the roles it has.
 */
function toneDeclarations(tone: ChartTone): string {
  const declarations: string[] = [];
  if (isOneOf(chartFillTones, tone))
    declarations.push(`--sw-chart-fill: ${chartFill(tone)};`);
  if (isOneOf(chartStrokeTones, tone))
    declarations.push(`--sw-chart-stroke: ${chartStroke(tone)};`);
  if (isOneOf(chartInkTones, tone))
    declarations.push(`--sw-chart-ink: ${chartColorMix(chartInkMixes[tone])};`);
  return declarations.join(' ');
}

export function cssChartToneClasses(): string {
  return chartTones
    .map((tone) => `.sw-chart-tone-${tone} { ${toneDeclarations(tone)} }`)
    .join('\n');
}

export function chartToneClassCatalog(): string[] {
  return chartTones.map((tone) => `sw-chart-tone-${tone}`);
}
