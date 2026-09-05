import { describe, expect, it } from 'vitest';

import { contrastRatio } from './contrast.js';
import { createTheme } from './create-theme.js';
import { generatePaletteStylesheet } from './css-palettes.js';
import {
  defaultPaletteId,
  isPaletteId,
  paletteById,
  paletteHasStylesheet,
  paletteIds,
  palettes,
} from './palettes.js';
import { generateStylesheet } from './stylesheet.js';
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
    expect(() => generatePaletteStylesheet('indigo')).toThrow(/no overlay/);
    expect(paletteById('cerulean').light.accent).toBe('#0066CC');
  });
});

describe('generated palette CSS', () => {
  const css = generateStylesheet();

  it('paints named palettes with data-palette on the existing canvas', () => {
    expect(css).toContain("[data-theme='light'][data-palette='cerulean']");
    expect(css).toContain("[data-theme='dark'][data-palette='sunburst']");
    expect(css).toContain('--sw-color-accent: #0066CC');
    expect(css).toContain('--sw-color-background: #F6DCAC');
    expect(css).not.toContain("data-palette='indigo'");
    expect(css).not.toContain("data-palette='azure'");
  });

  it('emits a root overlay file for a single palette import', () => {
    const cerulean = generatePaletteStylesheet('cerulean');
    expect(cerulean).toContain(':root');
    expect(cerulean).toContain('--sw-color-accent: #0066CC');
    expect(cerulean).toContain('--sw-color-accent: #5AC8FA');
    expect(cerulean).toContain('--sw-glass-fill:');
  });
});
