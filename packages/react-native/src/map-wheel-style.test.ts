import { lightTheme } from '@scalewing/tokens';
import { describe, expect, it, vi } from 'vitest';

import {
  mapWheelBandStyle,
  mapWheelColumnStyle,
  mapWheelContentStyle,
  mapWheelRowStyle,
  wheelRowColor,
  wheelRowHeight,
} from './map-wheel-style.js';

vi.mock('react-native', () => ({ StyleSheet: { hairlineWidth: 0.5 } }));

describe('wheel styles', () => {
  it('shows five control-height rows with the band over the middle one', () => {
    const row = wheelRowHeight(lightTheme);
    expect(row).toBe(lightTheme.control.md.minHeight);
    expect(mapWheelColumnStyle(lightTheme, false).height).toBe(row * 5);
    expect(mapWheelContentStyle(lightTheme).paddingVertical).toBe(row * 2);
    expect(mapWheelRowStyle(lightTheme).height).toBe(row);
    const band = mapWheelBandStyle(lightTheme);
    expect(band.top).toBe(row * 2);
    expect(band.height).toBe(row);
    expect(band.borderTopWidth).toBe(0.5);
    expect(band.borderColor).toBe(lightTheme.colors.border);
  });

  it('dims a disabled column and mutes unselected rows', () => {
    expect(mapWheelColumnStyle(lightTheme, true).opacity).toBe(
      lightTheme.disabledOpacity,
    );
    expect(mapWheelColumnStyle(lightTheme, false).opacity).toBe(1);
    expect(wheelRowColor(true)).toBe('text');
    expect(wheelRowColor(false)).toBe('muted');
  });
});
