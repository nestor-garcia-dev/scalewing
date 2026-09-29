import { type ColorTokens, createTheme, paletteIds } from '@scalewing/tokens';

export const colorSchemes = ['light', 'dark'] as const;

/**
 * Runs `check` once for every named palette in light and dark, with that
 * theme's colors and a label for assertion messages, so a contrast claim is
 * tested wherever a consumer can put it. Test-only: excluded from the build.
 */
export function forEveryTheme(
  check: (colors: ColorTokens, label: string) => void,
): void {
  for (const palette of paletteIds) {
    for (const colorScheme of colorSchemes) {
      const { colors } = createTheme({ colorScheme, palette });
      check(colors, `${palette} ${colorScheme}`);
    }
  }
}
