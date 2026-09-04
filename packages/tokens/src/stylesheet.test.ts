import { describe, expect, it } from 'vitest';

import { contrastRatio } from './contrast.js';
import { createTheme } from './create-theme.js';
import { product } from './product.js';
import { spacingClass } from './spacing-classes.js';
import { generateStylesheet, utilityClassCatalog } from './stylesheet.js';
import { darkTheme, lightTheme } from './theme.js';

describe('product', () => {
  it('uses Scalewing as the display name', () => {
    expect(product.displayName).toBe('Scalewing');
  });
});

describe('createTheme', () => {
  it('overlays a brand accent on the light palette', () => {
    const theme = createTheme({
      colorScheme: 'light',
      colors: { accent: '#164F37' },
    });

    expect(theme.colors.accent).toBe('#164F37');
    expect(theme.colors.background).toBe(lightTheme.colors.background);
  });

  it('rejects unknown color keys', () => {
    expect(() =>
      createTheme({
        colorScheme: 'light',
        colors: { primary: '#000000' } as never,
      }),
    ).toThrow(/Unknown color token/);
  });

  it('rejects empty or non-hex colors', () => {
    expect(() =>
      createTheme({
        colorScheme: 'dark',
        colors: { text: 'blue' },
      }),
    ).toThrow(/Invalid color/);
  });
});

describe('contrast', () => {
  it('keeps body text above 4.5:1 on light and dark canvases', () => {
    expect(
      contrastRatio(lightTheme.colors.text, lightTheme.colors.background),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrastRatio(lightTheme.colors.muted, lightTheme.colors.background),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrastRatio(lightTheme.colors.text, lightTheme.colors.surface),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrastRatio(darkTheme.colors.text, darkTheme.colors.background),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrastRatio(darkTheme.colors.muted, darkTheme.colors.background),
    ).toBeGreaterThanOrEqual(4.5);
  });
});

describe('generated CSS', () => {
  const css = generateStylesheet();
  const catalog = utilityClassCatalog();

  it('emits spacing step 4 as a class, not 4px in the name', () => {
    expect(spacingClass('padding', 'top', 4)).toBe('sw-padding-top-4');
    expect(css).toContain('.sw-padding-top-4');
    expect(css).toContain('--sw-space-4: 16px');
    expect(catalog).toContain('sw-padding-top-4');
    expect(catalog).not.toContain('sw-padding-top-13px');
  });

  it('includes the bounded layout catalog', () => {
    expect(catalog).toEqual(expect.arrayContaining(['sw-stack', 'sw-sr-only']));
    expect(css).toContain('.sw-stack');
    expect(css).not.toContain('!important');
  });

  it('keeps light and dark semantic color variables in parity', () => {
    for (const key of Object.keys(lightTheme.colors)) {
      expect(css).toContain(
        `--sw-color-${key}: ${lightTheme.colors[key as keyof typeof lightTheme.colors]}`,
      );
      expect(css).toContain(
        `--sw-color-${key}: ${darkTheme.colors[key as keyof typeof darkTheme.colors]}`,
      );
    }
  });
});
