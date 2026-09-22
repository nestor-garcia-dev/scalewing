import { lightTheme } from '@scalewing/tokens';
import { describe, expect, it } from 'vitest';

import { calendarDayColor, mapCalendarDayStyle } from './map-calendar-style.js';
import { chipLabelColor, mapChipStyle } from './map-chip-style.js';

describe('chip and calendar day styles', () => {
  it('fills selected chips with accent and keeps a 44-point target', () => {
    const selected = mapChipStyle(lightTheme, {
      disabled: false,
      selected: true,
    });
    const idle = mapChipStyle(lightTheme, { disabled: true, selected: false });

    expect(selected.backgroundColor).toBe(lightTheme.colors.accent);
    expect(selected.minHeight).toBe(lightTheme.control.md.minHeight);
    expect(chipLabelColor(true)).toBe('onAccent');
    expect(idle.backgroundColor).toBe(lightTheme.colors.surface);
    expect(idle.borderColor).toBe(lightTheme.colors.border);
    expect(idle.opacity).toBe(lightTheme.disabledOpacity);
    expect(chipLabelColor(false)).toBe('text');
  });

  it('mutes neighboring-month days and highlights the selection', () => {
    const selected = { disabled: false, inMonth: true, selected: true };
    const outside = { disabled: true, inMonth: false, selected: false };

    expect(mapCalendarDayStyle(lightTheme, selected).backgroundColor).toBe(
      lightTheme.colors.accent,
    );
    expect(calendarDayColor(selected)).toBe('onAccent');
    expect(mapCalendarDayStyle(lightTheme, outside).opacity).toBe(
      lightTheme.disabledOpacity,
    );
    expect(calendarDayColor(outside)).toBe('muted');
    expect(
      calendarDayColor({ disabled: false, inMonth: true, selected: false }),
    ).toBe('text');
  });
});
