import {
  type ColorTokens,
  createTheme,
  paletteIds,
  parseHexColor,
  type Theme,
} from '@scalewing/tokens';

export const colorSchemes = ['light', 'dark'] as const;

/**
 * Runs `check` once for every named palette in light and dark, with that
 * theme's colors, a label for assertion messages and the whole theme (for its
 * glass fill), so a contrast claim is tested wherever a consumer can put it.
 * Test-only: excluded from the build.
 */
export function forEveryTheme(
  check: (colors: ColorTokens, label: string, theme: Theme) => void,
): void {
  for (const palette of paletteIds) {
    for (const colorScheme of colorSchemes) {
      const theme = createTheme({ colorScheme, palette });
      check(theme.colors, `${palette} ${colorScheme}`, theme);
    }
  }
}

type Rgb = readonly number[];

/** A `#rrggbb` or `rgba(r, g, b, a)` color as its channels and alpha. */
function channels(color: string): { rgb: Rgb; alpha: number } {
  const rgba = /^rgba\((\d+), (\d+), (\d+), ([\d.]+)\)$/.exec(color);
  if (rgba) return { rgb: rgba.slice(1, 4).map(Number), alpha: +rgba[4]! };
  return { rgb: parseHexColor(color), alpha: 1 };
}

function over(top: Rgb, alpha: number, bottom: Rgb): Rgb {
  return top.map(
    (value, index) => value * alpha + bottom[index]! * (1 - alpha),
  );
}

function toHex(rgb: Rgb): string {
  return `#${rgb.map((value) => Math.round(value).toString(16).padStart(2, '0')).join('')}`;
}

/**
 * The opaque color a glass surface (a control, a chart's track, the
 * calendar) shows: the theme's glass fill composited over the page
 * background.
 */
export function glassOverBackground(theme: Theme): string {
  const fill = channels(theme.glass.fill);
  return toHex(
    over(fill.rgb, fill.alpha, parseHexColor(theme.colors.background)),
  );
}

/**
 * `color` at `strength` (0 to 1) layered over an opaque `backdrop`, as
 * `color-mix(in srgb, color strength, transparent)` paints over it.
 */
export function tintOver(
  color: string,
  strength: number,
  backdrop: string,
): string {
  return toHex(over(parseHexColor(color), strength, parseHexColor(backdrop)));
}
