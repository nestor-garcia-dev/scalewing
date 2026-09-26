import { describe, expect, it } from 'vitest';

import { secondaryActionBorder } from './action-colors.js';
import { createTheme } from './create-theme.js';

describe('secondaryActionBorder', () => {
  it('outlines a secondary that sits on the surface', () => {
    const { colors } = createTheme({ colorScheme: 'light' });
    expect(secondaryActionBorder(colors)).toBe(colors.border);
  });

  it('shows no ring around a solid secondary', () => {
    for (const colorScheme of ['light', 'dark'] as const) {
      const { colors } = createTheme({ colorScheme, palette: 'signal' });
      expect(secondaryActionBorder(colors)).toBe(colors.secondary);
    }
  });
});
