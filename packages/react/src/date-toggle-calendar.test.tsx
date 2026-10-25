import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { weekdayOf } from './calendar-month.js';
import {
  DateToggleCalendar,
  type DateToggleCalendarProps,
} from './components/DateToggleCalendar.js';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const notSunday = (date: string) => weekdayOf(date) !== 0;

function renderCalendar(props: Partial<DateToggleCalendarProps> = {}) {
  const onChange = vi.fn();
  const view = render(
    <DateToggleCalendar
      isDateDisabled={notSunday}
      label="Days off"
      locale="en-US"
      max="2027-05-30"
      min="2027-03-28"
      onChange={onChange}
      value={[]}
      {...props}
    />,
  );
  return { ...view, onChange };
}

function Controlled() {
  const [value, setValue] = useState<string[]>(['2027-04-11']);
  return (
    <DateToggleCalendar
      isDateDisabled={notSunday}
      label="Days off"
      locale="en-US"
      max="2027-05-30"
      min="2027-03-28"
      onChange={setValue}
      toggledLabel="day off"
      value={value}
    />
  );
}

describe('DateToggleCalendar', () => {
  it('draws a named grid per month from min to max in a named group', () => {
    renderCalendar();
    const group = screen.getByRole('group', { name: 'Days off' });
    const grids = within(group).getAllByRole('grid');
    expect(grids).toHaveLength(3);
    expect(screen.getByRole('grid', { name: 'March 2027' })).toBeTruthy();
    expect(screen.getByRole('grid', { name: 'May 2027' })).toBeTruthy();
    expect(
      within(grids[0]!)
        .getAllByRole('columnheader')
        .map((header) => header.getAttribute('abbr')),
    ).toEqual([
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]);
  });

  it('makes each day that can be toggled a toggle button named by its date', () => {
    renderCalendar({ value: ['2027-04-04'] });
    const day = screen.getByRole('button', { name: 'Sunday, April 4, 2027' });
    expect(day.getAttribute('aria-pressed')).toBe('true');
    expect(day.className).toBe('sw-date-toggle-day sw-date-toggle-day-on');
    expect(day.textContent).toBe('4');
    const off = screen.getByRole('button', { name: 'Sunday, April 11, 2027' });
    expect(off.getAttribute('aria-pressed')).toBe('false');
    // Days before min, and days that are disabled, are not buttons.
    expect(screen.queryByRole('button', { name: /March 21/ })).toBeNull();
    const monday = screen.getByRole('gridcell', {
      name: 'Monday, April 5, 2027',
    });
    expect(monday.getAttribute('aria-disabled')).toBe('true');
    expect(monday.querySelector('button')).toBeNull();
    // Ten Sundays from March 28 to May 30.
    expect(screen.getAllByRole('button')).toHaveLength(10);
  });

  it('has one Tab stop: the first toggled day, else the first enabled day', () => {
    renderCalendar({ value: ['2027-04-18'] });
    const stops = screen
      .getAllByRole('button')
      .filter((button) => button.tabIndex === 0);
    expect(stops.map((button) => button.getAttribute('data-date'))).toEqual([
      '2027-04-18',
    ]);
    cleanup();
    renderCalendar();
    expect(screen.getByRole('button', { name: /March 28/ }).tabIndex).toBe(0);
  });

  it('toggles a day on a press, sorted, and reads the toggled words', () => {
    render(<Controlled />);
    const toggled = screen.getByRole('button', {
      name: 'Sunday, April 11, 2027, day off',
    });
    expect(toggled.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(
      screen.getByRole('button', { name: 'Sunday, April 4, 2027' }),
    );
    expect(
      screen
        .getByRole('button', { name: 'Sunday, April 4, 2027, day off' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    fireEvent.click(toggled);
    expect(
      screen.getByRole('button', { name: 'Sunday, April 11, 2027' }),
    ).toBeTruthy();
  });

  it('hands the sorted days to onChange', () => {
    const { onChange } = renderCalendar({ value: ['2027-05-02'] });
    fireEvent.click(screen.getByRole('button', { name: /April 4/ }));
    expect(onChange).toHaveBeenCalledWith(['2027-04-04', '2027-05-02']);
  });

  it('moves focus between enabled days across months with the keys', () => {
    renderCalendar();
    const first = screen.getByRole('button', { name: /March 28/ });
    first.focus();
    fireEvent.keyDown(first, { key: 'ArrowRight' });
    const next = screen.getByRole('button', { name: /April 4/ });
    expect(document.activeElement).toBe(next);
    expect(next.tabIndex).toBe(0);
    expect(first.tabIndex).toBe(-1);
    fireEvent.keyDown(next, { key: 'PageDown' });
    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: /May 2,/ }),
    );
    fireEvent.keyDown(document.activeElement!, { key: 'End' });
    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: /May 30/ }),
    );
    const event = fireEvent.keyDown(document.activeElement!, {
      key: 'ArrowRight',
    });
    // At the last day the key does nothing, but the page stays still.
    expect(event).toBe(false);
    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: /May 30/ }),
    );
  });

  it('keeps days focusable but unchanged while disabled', () => {
    const { onChange } = renderCalendar({ disabled: true });
    const day = screen.getByRole('button', { name: /April 4/ });
    expect(day.getAttribute('aria-disabled')).toBe('true');
    fireEvent.click(day);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('starts the week on Monday and follows the locale', () => {
    renderCalendar({ locale: 'es-ES', weekStartsOn: 1 });
    expect(screen.getByRole('grid', { name: 'marzo de 2027' })).toBeTruthy();
    expect(
      within(screen.getByRole('grid', { name: 'abril de 2027' }))
        .getAllByRole('columnheader')[0]!
        .getAttribute('abbr'),
    ).toBe('lunes');
    expect(
      screen.getByRole('button', { name: 'domingo, 4 de abril de 2027' }),
    ).toBeTruthy();
  });

  it.each<[string, Partial<DateToggleCalendarProps>, string]>([
    [
      'a blank label',
      { label: '' },
      'DateToggleCalendar label must be nonempty',
    ],
    [
      'blank toggled words',
      { toggledLabel: ' ' },
      'DateToggleCalendar toggledLabel must be nonempty when given',
    ],
    [
      'a bad bound',
      { min: '2027-3-28' },
      'DateToggleCalendar min and max must be YYYY-MM-DD dates',
    ],
    [
      'min after max',
      { min: '2027-06-01' },
      'DateToggleCalendar min must not be after max',
    ],
    [
      'too many months',
      { min: '2025-01-01' },
      'DateToggleCalendar draws at most 24 months',
    ],
    [
      'a bad value',
      { value: ['April 4'] },
      'DateToggleCalendar value must hold YYYY-MM-DD dates',
    ],
    [
      'an unknown week start',
      { weekStartsOn: 3 as never },
      'weekStartsOn must be 0 or 1',
    ],
  ])('refuses %s', (_, props, message) => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => renderCalendar(props)).toThrow(new RangeError(message));
  });
});
