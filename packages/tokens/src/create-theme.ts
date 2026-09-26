import {
  type ColorTokens,
  isSemanticColorKey,
  semanticColorKeys,
} from './colors.js';
import { isHexColor } from './contrast.js';
import { glassForAccent } from './glass.js';
import { colorsForPalette, isPaletteId, type PaletteId } from './palettes.js';
import { type ColorScheme, type Theme, themeForScheme } from './theme.js';

export type ColorOverlay = Partial<ColorTokens>;

export type SchemeColorOverlay = {
  light?: ColorOverlay;
  dark?: ColorOverlay;
};

export type ThemeColors = ColorOverlay | SchemeColorOverlay;

export type ThemeOverlay = {
  colorScheme: ColorScheme;
  palette?: PaletteId;
  colors?: ThemeColors;
};

function assertColorOverlay(colors: ColorOverlay): void {
  for (const key of Object.keys(colors)) {
    if (!isSemanticColorKey(key)) {
      throw new Error(`Unknown color token: ${key}`);
    }

    const value = colors[key];

    if (!value || !isHexColor(value)) {
      throw new Error(`Invalid color for ${key}`);
    }
  }
}

function overlayForActiveScheme(
  colors: ThemeColors,
  scheme: ColorScheme,
): ColorOverlay | undefined {
  const keys = Object.keys(colors);
  const hasLight = keys.includes('light');
  const hasDark = keys.includes('dark');
  const hasSchemeKeys = hasLight || hasDark;
  const hasSemanticKeys = keys.some((key) => key !== 'light' && key !== 'dark');

  if (hasSchemeKeys && hasSemanticKeys) {
    throw new Error(
      'Color overlay must be flat semantic keys or { light, dark }, not both',
    );
  }

  if (!hasSchemeKeys) {
    const flat = colors as ColorOverlay;
    assertColorOverlay(flat);
    return flat;
  }

  const selected = (colors as SchemeColorOverlay)[scheme];

  if (!selected) {
    return undefined;
  }

  if (typeof selected !== 'object' || Array.isArray(selected)) {
    throw new Error(`Invalid color overlay for ${scheme}`);
  }

  assertColorOverlay(selected);
  return selected;
}

function resolvedColorOverlay(overlay: ThemeOverlay): ColorOverlay | undefined {
  if (overlay.palette !== undefined && !isPaletteId(overlay.palette)) {
    throw new Error(`Unknown palette: ${overlay.palette}`);
  }

  const fromPalette = overlay.palette
    ? colorsForPalette(overlay.palette, overlay.colorScheme)
    : undefined;

  const fromColors = overlay.colors
    ? overlayForActiveScheme(overlay.colors, overlay.colorScheme)
    : undefined;

  if (!fromPalette && !fromColors) {
    return undefined;
  }

  const merged: ColorOverlay = { ...fromPalette, ...fromColors };

  if (Object.keys(merged).length === 0) {
    return undefined;
  }

  assertColorOverlay(merged);
  return merged;
}

export function createTheme(overlay: ThemeOverlay): Theme {
  const base = themeForScheme(overlay.colorScheme);
  const colors = resolvedColorOverlay(overlay);

  if (!colors) {
    return base;
  }

  const merged: ColorTokens = { ...base.colors };

  for (const key of semanticColorKeys) {
    const next = colors[key];
    if (next) {
      merged[key] = next;
    }
  }

  // An unset secondary fill follows the surface, so a palette that changes
  // the surface keeps its secondary action an outlined pill.
  if (!colors.secondary) {
    merged.secondary = merged.surface;
  }

  return {
    ...base,
    colors: merged,
    glass: glassForAccent(merged.accent, overlay.colorScheme),
  };
}
