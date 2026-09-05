import { describe, expect, it } from 'vitest';

import { darkColors, lightColors } from './colors.js';
import { glassForAccent, lightGlass } from './glass.js';

describe('glassForAccent', () => {
  it('uses opaque white fill on light so muted text stays readable', () => {
    const glass = glassForAccent(lightColors.accent, 'light');

    expect(glass.fill).toBe(lightGlass.fill);
    expect(glass.fill).toBe('rgba(255, 255, 255, 1)');
    expect(glass.border).toBe('rgba(210, 210, 215, 1)');
    expect(glass.blur).toBe(24);
  });

  it('does not tint light glass when the accent changes', () => {
    const teal = glassForAccent('#0B615E', 'light');
    const indigo = glassForAccent('#5B3DF5', 'light');

    expect(teal.fill).toBe(indigo.fill);
    expect(teal.border).toBe(indigo.border);
  });

  it('keeps dark glass translucent', () => {
    const glass = glassForAccent(darkColors.accent, 'dark');

    expect(glass.fill).toContain('0.72)');
    expect(glass.saturate).toBe(1.8);
  });
});
