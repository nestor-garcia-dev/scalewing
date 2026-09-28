import { describe, expect, it } from 'vitest';

import {
  accentSubtleFor,
  accentSubtleMinContrast,
  accentSubtleMix,
  accentSubtleMixFor,
} from './accent-subtle.js';
import { mixHexColors } from './color-mix.js';
import { contrastRatio } from './contrast.js';
import { createTheme } from './create-theme.js';
import { paletteIds } from './palettes.js';
import { darkTheme, lightTheme } from './theme.js';

const schemes = ['light', 'dark'] as const;

describe('mixHexColors', () => {
  it('mixes two colours as solid six-digit hex', () => {
    expect(mixHexColors('#FFFFFF', '#000000', 0)).toBe('#FFFFFF');
    expect(mixHexColors('#FFFFFF', '#000000', 1)).toBe('#000000');
    expect(mixHexColors('#FFFFFF', '#0066CC', 0.1)).toBe('#E6F0FA');
    expect(mixHexColors('#fff', '#000', 0.5)).toBe('#808080');
  });
});

describe('accentSubtle', () => {
  it('tints the default surfaces with a tenth of the accent', () => {
    for (const theme of [lightTheme, darkTheme]) {
      const { accent, accentSubtle, surface } = theme.colors;
      expect(accentSubtleMixFor(accent, surface)).toBe(accentSubtleMix);
      expect(accentSubtle).toBe(mixHexColors(surface, accent, 0.1));
      expect(accentSubtle).not.toBe(surface);
    }
    expect(lightTheme.colors.accentSubtle).toBe('#EFECFE');
    expect(darkTheme.colors.accentSubtle).toBe('#2A2734');
  });

  it('keeps accent text at AA on the tint in every palette and scheme', () => {
    const belowOnSurface: string[] = [];

    for (const palette of paletteIds) {
      for (const colorScheme of schemes) {
        const { colors } = createTheme({ colorScheme, palette });
        const ratio = contrastRatio(colors.accent, colors.accentSubtle);

        if (contrastRatio(colors.accent, colors.surface) < 4.5) {
          // The tint cannot help here, so it stays the bare surface.
          belowOnSurface.push(`${palette}/${colorScheme}`);
          expect(colors.accentSubtle).toBe(
            mixHexColors(colors.surface, colors.accent, 0),
          );
          continue;
        }

        expect(ratio).toBeGreaterThanOrEqual(accentSubtleMinContrast);
        expect(
          accentSubtleMixFor(colors.accent, colors.surface),
        ).toBeLessThanOrEqual(accentSubtleMix);
      }
    }

    // Harvest's dark accent is 4.24:1 on its own surface (it passes on the
    // background); any new entry here is a palette regression.
    expect(belowOnSurface).toEqual(['harvest/dark']);
  });

  it('steps the mix down for a light accent close to the floor', () => {
    const { colors } = createTheme({ colorScheme: 'light', palette: 'amber' });
    expect(accentSubtleMixFor(colors.accent, colors.surface)).toBe(0.07);
    expect(
      contrastRatio(
        colors.accent,
        mixHexColors(colors.surface, colors.accent, 0.08),
      ),
    ).toBeLessThan(accentSubtleMinContrast);
  });

  it('follows an overlaid accent and surface unless the overlay sets it', () => {
    const branded = createTheme({
      colorScheme: 'light',
      colors: { accent: '#164F37', surface: '#F8F8F2' },
    });
    expect(branded.colors.accentSubtle).toBe(
      accentSubtleFor('#164F37', '#F8F8F2'),
    );

    const pinned = createTheme({
      colorScheme: 'dark',
      palette: 'signal',
      colors: { accentSubtle: '#102030' },
    });
    expect(pinned.colors.accentSubtle).toBe('#102030');
  });
});
