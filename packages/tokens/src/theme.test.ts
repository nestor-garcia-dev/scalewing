import { describe, expect, it } from 'vitest';

import { contrastRatio } from './contrast.js';
import { createTheme } from './create-theme.js';
import { product } from './product.js';
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
    expect(theme.glass.fill).toBe(lightTheme.glass.fill);
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

  it('applies light and dark brand overlays when the user switches scheme', () => {
    const colors = {
      light: { accent: '#0066CC', onAccent: '#FFFFFF' },
      dark: { accent: '#5AC8FA', onAccent: '#101214' },
    };

    expect(createTheme({ colorScheme: 'light', colors }).colors.accent).toBe(
      '#0066CC',
    );
    expect(createTheme({ colorScheme: 'dark', colors }).colors.accent).toBe(
      '#5AC8FA',
    );
  });

  it('rejects mixing a flat overlay with light/dark maps', () => {
    expect(() =>
      createTheme({
        colorScheme: 'light',
        colors: {
          accent: '#0066CC',
          light: { accent: '#164F37' },
        } as never,
      }),
    ).toThrow(/not both/);
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

  it('keeps button label colors at 4.5:1 on accent and danger', () => {
    expect(
      contrastRatio(lightTheme.colors.onAccent, lightTheme.colors.accent),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrastRatio(lightTheme.colors.onDanger, lightTheme.colors.danger),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrastRatio(darkTheme.colors.onAccent, darkTheme.colors.accent),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrastRatio(darkTheme.colors.onDanger, darkTheme.colors.danger),
    ).toBeGreaterThanOrEqual(4.5);
  });

  it('keeps indigo accent readable on the canvas and away from success', () => {
    expect(lightTheme.colors.accent).toBe('#5B3DF5');
    expect(darkTheme.colors.accent).toBe('#A78BFA');
    expect(
      contrastRatio(lightTheme.colors.accent, lightTheme.colors.background),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrastRatio(darkTheme.colors.accent, darkTheme.colors.background),
    ).toBeGreaterThanOrEqual(4.5);
    expect(lightTheme.colors.accent).not.toBe(lightTheme.colors.success);
    expect(darkTheme.colors.accent).not.toBe(darkTheme.colors.success);
  });
});
