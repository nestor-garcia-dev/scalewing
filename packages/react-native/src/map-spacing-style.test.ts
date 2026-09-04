import { describe, expect, it } from 'vitest';

import { mapSpacingStyle } from './map-spacing-style.js';
import { lightTheme } from '@scalewing/tokens';

describe('mapSpacingStyle', () => {
  it('maps spacing steps to pixel styles from the theme', () => {
    expect(
      mapSpacingStyle(lightTheme, {
        padding: 4,
        paddingTop: 2,
        gap: 3,
      }),
    ).toEqual({
      gap: 12,
      padding: 16,
      paddingTop: 8,
    });
  });

  it('does not invent CSS class names', () => {
    const style = mapSpacingStyle(lightTheme, { paddingTop: 4 });
    expect(JSON.stringify(style)).not.toContain('sw-padding-top-4');
    expect(style.paddingTop).toBe(16);
  });
});
