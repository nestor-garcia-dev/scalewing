import {
  type ColorTokens,
  createTheme,
  paletteIds,
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
