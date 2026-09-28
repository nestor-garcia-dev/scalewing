import { describe, expect, it } from 'vitest';

import { calendarKeyTarget } from './calendar-keys.js';

function press(key: string, focused: string, shiftKey = false, extra = {}) {
  return calendarKeyTarget({ key, shiftKey }, focused, {
    weekStartsOn: 0,
    ...extra,
  });
}

describe('calendar key targets', () => {
  it('moves by day and week with the arrows', () => {
    expect(press('ArrowRight', '2024-03-10')).toBe('2024-03-11');
    expect(press('ArrowLeft', '2024-03-01')).toBe('2024-02-29');
    expect(press('ArrowDown', '2024-03-28')).toBe('2024-04-04');
    expect(press('ArrowUp', '2024-03-03')).toBe('2024-02-25');
  });

  it('swaps the horizontal arrows in right-to-left grids', () => {
    expect(press('ArrowLeft', '2024-03-10', false, { rtl: true })).toBe(
      '2024-03-11',
    );
    expect(press('ArrowRight', '2024-03-10', false, { rtl: true })).toBe(
      '2024-03-09',
    );
  });

  it('goes to the edges of the week for the configured week start', () => {
    // 2024-03-13 is a Wednesday.
    expect(press('Home', '2024-03-13')).toBe('2024-03-10');
    expect(press('End', '2024-03-13')).toBe('2024-03-16');
    expect(press('Home', '2024-03-13', false, { weekStartsOn: 1 })).toBe(
      '2024-03-11',
    );
    expect(press('End', '2024-03-13', false, { weekStartsOn: 1 })).toBe(
      '2024-03-17',
    );
    expect(press('Home', '2024-03-10', false, { weekStartsOn: 1 })).toBe(
      '2024-03-04',
    );
  });

  it('moves by month with PageUp and PageDown, and by year with Shift', () => {
    expect(press('PageUp', '2024-03-31')).toBe('2024-02-29');
    expect(press('PageDown', '2024-01-31')).toBe('2024-02-29');
    expect(press('PageUp', '2024-02-29', true)).toBe('2023-02-28');
    expect(press('PageDown', '2024-03-10', true)).toBe('2025-03-10');
  });

  it('stays inside min and max and the four-digit years', () => {
    const bounds = { min: '2024-03-05', max: '2024-03-20' };
    expect(press('ArrowUp', '2024-03-08', false, bounds)).toBe('2024-03-05');
    expect(press('PageDown', '2024-03-10', false, bounds)).toBe('2024-03-20');
    expect(press('PageUp', '2024-03-10', true, bounds)).toBe('2024-03-05');
    expect(press('ArrowLeft', '0001-01-01')).toBe('0001-01-01');
    expect(press('PageDown', '9999-12-31', true)).toBe('9999-12-31');
  });

  it('leaves other keys to the browser', () => {
    expect(press('Tab', '2024-03-10')).toBeNull();
    expect(press('a', '2024-03-10')).toBeNull();
  });
});
