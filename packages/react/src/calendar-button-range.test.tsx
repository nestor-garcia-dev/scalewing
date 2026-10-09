import { contrastRatio, createTheme, paletteIds } from '@scalewing/tokens';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CalendarButton } from './components/CalendarButton.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';
import { assertDateRange, dayInRange } from './date-only.js';

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date(2026, 9, 3, 12));
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('dayInRange', () => {
  const week = { start: '2026-09-27', end: '2026-10-03' };

  it('places a day at the start, the end, both, inside or out', () => {
    expect(dayInRange('2026-09-27', week)).toBe('start');
    expect(dayInRange('2026-09-30', week)).toBe('inside');
    expect(dayInRange('2026-10-03', week)).toBe('end');
    expect(dayInRange('2026-09-26', week)).toBeNull();
    expect(dayInRange('2026-10-04', week)).toBeNull();
    expect(dayInRange('2026-09-30', undefined)).toBeNull();
    // A one-day range is both its start and its end.
    expect(
      dayInRange('2026-10-03', { start: '2026-10-03', end: '2026-10-03' }),
    ).toBe('only');
  });

  it('refuses a malformed end or a start after the end', () => {
    expect(() => assertDateRange(undefined)).not.toThrow();
    expect(() =>
      assertDateRange({ start: '2026-9-27', end: '2026-10-03' }),
    ).toThrow('range.start must be a valid YYYY-MM-DD date');
    expect(() =>
      assertDateRange({ start: '2026-10-04', end: '2026-10-03' }),
    ).toThrow('range.start must not be after range.end');
  });
});

describe('CalendarButton range', () => {
  it('tints the period, rounds its ends and keeps the value selected', async () => {
    const user = userEvent.setup();
    render(
      <CalendarButton
        label="Choose a week"
        onChange={() => undefined}
        range={{ start: '2026-09-27', end: '2026-10-03' }}
        value="2026-09-27"
      />,
    );
    await user.click(screen.getByRole('button', { name: /^Choose a week, / }));
    const calendar = screen.getByRole('dialog', { name: 'Choose a week' });
    const day = (name: string) =>
      within(calendar).getByRole('gridcell', { name });
    const start = day('Sunday, September 27, 2026');
    expect(start.className).toBe(
      'sw-date-field-day sw-date-field-day-in-range sw-date-field-day-range-start',
    );
    expect(start.getAttribute('aria-selected')).toBe('true');
    expect(day('Wednesday, September 30, 2026').className).toBe(
      'sw-date-field-day sw-date-field-day-in-range',
    );
    expect(
      day('Wednesday, September 30, 2026').getAttribute('aria-selected'),
    ).toBe('false');
    // The end, a day of the next month shown in September's grid.
    const end = day('Saturday, October 3, 2026');
    expect(end.className).toBe(
      'sw-date-field-day sw-date-field-day-outside sw-date-field-day-in-range sw-date-field-day-range-end',
    );
    expect(day('Saturday, September 26, 2026').className).toBe(
      'sw-date-field-day',
    );
    expect(
      within(calendar)
        .getAllByRole('gridcell')
        .filter((cell) =>
          cell.className.includes('sw-date-field-day-in-range'),
        ),
    ).toHaveLength(7);
  });

  it('rounds both ends of a one-day range', async () => {
    const user = userEvent.setup();
    render(
      <CalendarButton
        label="Choose a day"
        onChange={() => undefined}
        range={{ start: '2026-10-02', end: '2026-10-02' }}
        value="2026-10-03"
      />,
    );
    await user.click(screen.getByRole('button', { name: /^Choose a day, / }));
    expect(
      within(screen.getByRole('dialog', { name: 'Choose a day' })).getByRole(
        'gridcell',
        { name: 'Friday, October 2, 2026' },
      ).className,
    ).toBe(
      'sw-date-field-day sw-date-field-day-in-range sw-date-field-day-range-start sw-date-field-day-range-end',
    );
  });

  it('keeps day numbers at AA on the band in every palette and scheme', () => {
    // The band is accentSubtle: today's accent number keeps AA on it (the
    // token's own rule), and a neighbouring month's day on it takes the
    // text colour, because muted can fall below AA there.
    for (const palette of paletteIds) {
      for (const colorScheme of ['light', 'dark'] as const) {
        const { colors } = createTheme({ colorScheme, palette });
        expect(
          contrastRatio(colors.text, colors.accentSubtle),
          `${palette}/${colorScheme} text`,
        ).toBeGreaterThanOrEqual(4.5);
        if (contrastRatio(colors.accent, colors.surface) >= 4.5) {
          expect(
            contrastRatio(colors.accent, colors.accentSubtle),
            `${palette}/${colorScheme} today`,
          ).toBeGreaterThanOrEqual(4.5);
        }
      }
    }
  });

  it('refuses a range whose start is after its end', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    try {
      expect(() =>
        render(
          <CalendarButton
            label="Choose a week"
            onChange={() => undefined}
            range={{ start: '2026-10-04', end: '2026-10-03' }}
            value="2026-10-03"
          />,
        ),
      ).toThrow(RangeError);
    } finally {
      consoleError.mockRestore();
    }
  });

  it('generates the band, its rounded ends, a pill selection and forced colors', () => {
    const css = generateStylesheet();
    expect(css).toContain(
      '.sw-date-field-day-in-range {\n  background: var(--sw-color-accentSubtle);\n  border-radius: 0;\n}',
    );
    expect(css).toContain(
      '.sw-date-field-day-in-range.sw-date-field-day-outside {\n  color: var(--sw-color-text);\n}',
    );
    expect(css).toContain(
      '.sw-date-field-day-range-start {\n  border-end-start-radius: var(--sw-radius-pill);',
    );
    expect(css).toContain(
      '.sw-date-field-day-range-end {\n  border-end-end-radius: var(--sw-radius-pill);',
    );
    expect(css).toMatch(
      /\.sw-date-field-day\[aria-selected='true'\]:hover \{[^}]*border-radius: var\(--sw-radius-pill\);/,
    );
    expect(css).toContain(
      "  .sw-date-field-day-in-range,\n  .sw-date-field-day-in-range.sw-date-field-day-outside,\n  .sw-date-field-day-in-range[aria-current='date'] {\n    background: Mark;\n    color: MarkText;",
    );
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-date-field-day-in-range',
        'sw-date-field-day-range-start',
        'sw-date-field-day-range-end',
      ]),
    );
  });
});
