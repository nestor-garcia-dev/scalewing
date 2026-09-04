import {
  type ColorTokens,
  isSemanticColorKey,
  semanticColorKeys,
} from './colors.js';
import { isHexColor } from './contrast.js';
import { type ColorScheme, type Theme, themeForScheme } from './theme.js';

export type ThemeOverlay = {
  colorScheme: ColorScheme;
  colors?: Partial<ColorTokens>;
};

export function createTheme(overlay: ThemeOverlay): Theme {
  const base = themeForScheme(overlay.colorScheme);
  const colors = overlay.colors;

  if (!colors) {
    return base;
  }

  for (const key of Object.keys(colors)) {
    if (!isSemanticColorKey(key)) {
      throw new Error(`Unknown color token: ${key}`);
    }

    const value = colors[key];

    if (!value || !isHexColor(value)) {
      throw new Error(`Invalid color for ${key}`);
    }
  }

  const merged: ColorTokens = { ...base.colors };

  for (const key of semanticColorKeys) {
    const next = colors[key];
    if (next) {
      merged[key] = next;
    }
  }

  return {
    ...base,
    colors: merged,
  };
}
