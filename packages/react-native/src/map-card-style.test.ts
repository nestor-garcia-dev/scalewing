import { darkTheme, lightTheme } from '@scalewing/tokens';
import { describe, expect, it } from 'vitest';

import { mapCardViewStyle } from './map-card-style.js';

describe('mapCardViewStyle', () => {
  it('uses glass fill for the default glass variant', () => {
    const style = mapCardViewStyle(lightTheme, 'glass');

    expect(style.backgroundColor).toBe(lightTheme.glass.fill);
    expect(style.borderRadius).toBe(lightTheme.radius.lg);
  });

  it('fills plain information with subtle and no border', () => {
    const style = mapCardViewStyle(darkTheme, 'filled');

    expect(style.backgroundColor).toBe(darkTheme.colors.subtle);
    expect(style.borderWidth).toBe(0);
    expect(style.borderRadius).toBe(darkTheme.radius.lg);
  });

  it('uses solid surface for outlined cards', () => {
    const style = mapCardViewStyle(lightTheme, 'outlined');

    expect(style.backgroundColor).toBe(lightTheme.colors.surface);
    expect(style.borderColor).toBe(lightTheme.colors.border);
  });
});
