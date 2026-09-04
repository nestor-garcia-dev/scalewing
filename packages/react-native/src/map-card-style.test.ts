import { lightTheme } from '@scalewing/tokens';
import { describe, expect, it } from 'vitest';

import { mapCardViewStyle } from './map-card-style.js';

describe('mapCardViewStyle', () => {
  it('uses glass fill for the default glass variant', () => {
    const style = mapCardViewStyle(lightTheme, 'glass');

    expect(style.backgroundColor).toBe(lightTheme.glass.fill);
    expect(style.borderRadius).toBe(lightTheme.radius.lg);
  });

  it('uses solid surface for outlined cards', () => {
    const style = mapCardViewStyle(lightTheme, 'outlined');

    expect(style.backgroundColor).toBe(lightTheme.colors.surface);
    expect(style.borderColor).toBe(lightTheme.colors.border);
  });
});
