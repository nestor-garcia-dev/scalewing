import { contrastRatio } from './contrast.js';
import { type ColorScheme } from './theme.js';

/**
 * A generic categorical scale: hues that tell a small set of kinds apart
 * (a product's services, a chart's series), not meanings. Which kind takes
 * which hue is the consumer's choice. Order is the scale's own.
 */
export const categoricalHues = [
  'green',
  'blue',
  'orange',
  'purple',
  'teal',
  'rose',
] as const;

export type CategoricalHue = (typeof categoricalHues)[number];

/** A categorical hue, or `neutral` for a kind that is not one of them. */
export type CategoricalColor = CategoricalHue | 'neutral';

export const categoricalColorKeys: readonly CategoricalColor[] = [
  ...categoricalHues,
  'neutral',
];

/**
 * The glyph color drawn on a categorical fill, in both schemes. The fills
 * keep it at 3:1, enough for a glyph (WCAG 1.4.11) but not for text: a
 * categorical fill is not a text background.
 */
export const onCategorical = '#FFFFFF';

/**
 * A glyph on a categorical fill is a graphical object, so it needs 3:1
 * (WCAG 1.4.11), not the 4.5:1 of text.
 */
export const categoricalGlyphMinContrast = 3;

/** How a fill that fails is darkened: one 1% mix toward black at a time. */
export const categoricalDarkenStep = 0.01;

/*
 * Each fill keeps a white glyph at 3:1 or more. Orange is darkened from
 * #E08600 (2.77:1) in steps of 1% mixed toward black until it passes, which
 * takes five (#D57F00, 3.06:1; four give #D78100, 2.99:1); the others,
 * neutral included (3.26:1), already pass and keep their values. The fills
 * are deep enough for a dark canvas, so dark repeats light and a kind keeps
 * its color across schemes. Palettes do not overlay them, so on a palette
 * with a strong surface (sunburst, harvest, postcard, mocha) a fill may sit
 * close to the surface; the white glyph on the fill is what the scale keeps.
 */
const fills: Readonly<Record<CategoricalColor, string>> = Object.freeze({
  green: '#2E8F47',
  blue: '#0A7AFF',
  orange: '#D57F00',
  purple: '#8E5CD9',
  teal: '#1A96AD',
  rose: '#C2415D',
  neutral: '#8E8E93',
});

export const categoricalColors: Record<
  ColorScheme,
  Readonly<Record<CategoricalColor, string>>
> = Object.freeze({
  light: fills,
  dark: fills,
});

export function isCategoricalColor(value: unknown): value is CategoricalColor {
  return (categoricalColorKeys as readonly unknown[]).includes(value);
}

/** The fill for one categorical color in one scheme. */
export function categoricalColorFor(
  color: CategoricalColor,
  scheme: ColorScheme,
): string {
  if (!isCategoricalColor(color))
    throw new RangeError(`Unknown categorical color: ${String(color)}`);
  if (!Object.hasOwn(categoricalColors, scheme))
    throw new RangeError(`Unknown color scheme: ${String(scheme)}`);
  return categoricalColors[scheme][color];
}

/** The contrast of the white glyph on a categorical fill. */
export function categoricalGlyphContrast(fill: string): number {
  return contrastRatio(onCategorical, fill);
}
