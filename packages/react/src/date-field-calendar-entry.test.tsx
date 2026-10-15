import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  DateField,
  dateFieldEntries,
  type DateFieldProps,
} from './components/DateField.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

beforeEach(() => {
  // Only Date is faked, so user-event timers still run. Today is 2024-03-20.
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date(2024, 2, 20, 12));
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

function DayField(
  props: Partial<DateFieldProps> & {
    initial?: string;
    spy?: (v: string) => void;
  },
) {
  const { initial = '', spy, ...rest } = props;
  const [value, setValue] = useState(initial);
  return (
    <DateField
      entry="calendar"
      label="Survey day"
      labels={{ chooseDate: 'Choose a day' }}
      locale="en-US"
      {...rest}
      onChange={(next) => {
        spy?.(next);
        setValue(next);
      }}
      value={value}
    />
  );
}

describe('DateField entry="calendar"', () => {
  it('is one button named by the label and its words, with no text entry', () => {
    render(<DayField description="The first night of the count" />);
    expect(screen.queryByRole('textbox')).toBeNull();
    const button = screen.getByRole('button', {
      name: 'Survey day Choose a day',
    });
    expect(button.className).toContain('sw-button-neutral');
    expect(button.className).toContain('sw-date-field-calendar-entry');
    expect(button.getAttribute('aria-haspopup')).toBe('dialog');
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(button).toHaveProperty('tabIndex', 0);
    expect(
      document.getElementById(button.getAttribute('aria-describedby')!)
        ?.textContent,
    ).toBe('The first night of the count');
    expect(dateFieldEntries).toEqual(['typed', 'calendar']);
  });

  it('opens the calendar, picks a day and shows it', async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    render(<DayField spy={spy} />);
    await user.click(screen.getByRole('button', { name: /Choose a day/ }));
    expect(screen.getByRole('dialog', { name: 'Survey day' })).toBeTruthy();
    await user.click(
      screen.getByRole('gridcell', { name: 'Friday, March 22, 2024' }),
    );
    expect(spy).toHaveBeenLastCalledWith('2024-03-22');
    expect(screen.queryByRole('dialog')).toBeNull();
    const button = screen.getByRole('button', {
      name: 'Survey day Mar 22, 2024',
    });
    // Focus returns to the button.
    expect(document.activeElement).toBe(button);
  });

  it('a label press opens it, and an optional day can be cleared', async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    render(<DayField initial="2024-03-10" spy={spy} />);
    await user.click(screen.getByText('Survey day'));
    await user.click(screen.getByRole('button', { name: 'Clear' }));
    expect(spy).toHaveBeenLastCalledWith('');
    expect(
      screen.getByRole('button', { name: 'Survey day Choose a day' }),
    ).toBeTruthy();
  });

  it('says required after its name, and marks an error on its edge', () => {
    render(<DayField error="Choose the survey day" required />);
    const button = screen.getByRole('button', { name: /Choose a day/ });
    const described = button
      .getAttribute('aria-describedby')!
      .split(' ')
      .map((id) => document.getElementById(id)?.textContent);
    expect(described).toEqual(['Required', 'Choose the survey day']);
    expect(button.className).toContain('sw-date-field-calendar-entry-invalid');
    expect(screen.getByText('Survey day').textContent).toContain('*');
  });

  it('is disabled with the field', () => {
    render(<DayField disabled />);
    expect(screen.getByRole('button', { name: /Choose a day/ })).toHaveProperty(
      'disabled',
      true,
    );
  });

  it('refuses an unknown entry', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => render(<DayField entry={'wheel' as never} />)).toThrow(
      'Unknown DateField entry: wheel',
    );
  });

  it('draws the button as a field control with the danger edge', () => {
    const css = generateStylesheet();
    expect(css).toContain(
      '.sw-button.sw-date-field-calendar-entry {\n  align-self: flex-start;\n  border-radius: var(--sw-radius-sm);',
    );
    expect(css).toContain(
      '.sw-button.sw-date-field-calendar-entry.sw-date-field-calendar-entry-invalid {\n  border-color: var(--sw-color-danger);\n}',
    );
    expect(css).toContain(
      '.sw-date-field-calendar-entry-text {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}',
    );
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-date-field-calendar-entry',
        'sw-date-field-calendar-entry-text',
        'sw-date-field-calendar-entry-invalid',
      ]),
    );
  });
});
