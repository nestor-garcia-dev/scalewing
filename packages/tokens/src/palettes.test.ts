import { describe, expect, it } from 'vitest';

import { contrastRatio } from './contrast.js';
import { createTheme } from './create-theme.js';
import {
  defaultPaletteId,
  isPaletteId,
  paletteById,
  paletteHasStylesheet,
  paletteIds,
  palettes,
} from './palettes.js';
import { themeForScheme } from './theme.js';

describe('palettes', () => {
  it('keeps unique ids aligned with the catalog', () => {
    expect(new Set(palettes.map((palette) => palette.id)).size).toBe(
      palettes.length,
    );
    expect(paletteIds).toEqual(palettes.map((palette) => palette.id));
    expect(defaultPaletteId).toBe('indigo');
    expect(isPaletteId('cerulean')).toBe(true);
    expect(isPaletteId('azure')).toBe(false);
  });

  it('keeps every named palette readable on its own canvas', () => {
    for (const palette of palettes) {
      for (const scheme of ['light', 'dark'] as const) {
        const theme = createTheme({ colorScheme: scheme, palette: palette.id });
        const { colors } = theme;

        expect(
          contrastRatio(colors.text, colors.background),
        ).toBeGreaterThanOrEqual(4.5);
        expect(
          contrastRatio(colors.muted, colors.background),
        ).toBeGreaterThanOrEqual(4.5);
        expect(
          contrastRatio(colors.accent, colors.background),
        ).toBeGreaterThanOrEqual(4.5);
        expect(
          contrastRatio(colors.onAccent, colors.accent),
        ).toBeGreaterThanOrEqual(4.5);
        expect(
          contrastRatio(colors.onSecondary, colors.secondary),
        ).toBeGreaterThanOrEqual(4.5);
        expect(
          contrastRatio(colors.onTertiary, colors.tertiary),
        ).toBeGreaterThanOrEqual(4.5);
        expect(
          contrastRatio(colors.text, colors.subtle),
        ).toBeGreaterThanOrEqual(4.5);
        // The three action fills stay apart from one another.
        expect(colors.tertiary).not.toBe(colors.accent);
        expect(colors.tertiary).not.toBe(colors.secondary);
        expect(colors.accent).not.toBe(colors.success);
        expect(colors.danger).toBe(themeForScheme(scheme).colors.danger);
      }
    }
  });

  it('lets a color overlay win over a named palette', () => {
    const theme = createTheme({
      colorScheme: 'light',
      palette: 'cerulean',
      colors: { accent: '#164F37' },
    });

    expect(theme.colors.accent).toBe('#164F37');
    expect(theme.colors.onAccent).toBe('#FFFFFF');
  });

  it('rejects an unknown palette name', () => {
    expect(() =>
      createTheme({
        colorScheme: 'light',
        palette: 'neon' as never,
      }),
    ).toThrow(/Unknown palette/);
  });

  it('does not emit a stylesheet for the default indigo palette', () => {
    expect(paletteHasStylesheet('indigo')).toBe(false);
    expect(paletteById('cerulean').light.accent).toBe('#0066CC');
  });

  it('keeps an unset secondary on the surface, so it stays an outline', () => {
    for (const scheme of ['light', 'dark'] as const) {
      const synthwave = createTheme({
        colorScheme: scheme,
        palette: 'synthwave',
      });
      expect(synthwave.colors.secondary).toBe(synthwave.colors.surface);
    }
    const indigo = createTheme({ colorScheme: 'light' });
    expect(indigo.colors.secondary).toBe(indigo.colors.surface);
  });

  it('fills every action in the signal palette', () => {
    const light = createTheme({ colorScheme: 'light', palette: 'signal' });
    expect(light.colors).toMatchObject({
      accent: '#0066CC',
      secondary: '#1D1D1F',
      tertiary: '#7C5CD6',
    });
    const dark = createTheme({ colorScheme: 'dark', palette: 'signal' });
    expect(dark.colors.secondary).not.toBe(dark.colors.surface);
  });
});
