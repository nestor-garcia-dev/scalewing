import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DateField, type DateFieldProps } from './components/DateField.js';

beforeEach(() => {
  // Only Date is faked, so user-event timers still run. Today is 2024-03-20.
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date(2024, 2, 20, 12));
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

function ControlledField(
  props: Partial<DateFieldProps> & {
    initial?: string;
    spy?: (value: string) => void;
  },
) {
  const { initial = '', spy, ...rest } = props;
  const [value, setValue] = useState(initial);
  return (
    <>
      <DateField
        label="Sighting date"
        {...rest}
        onChange={(next) => {
          spy?.(next);
          setValue(next);
        }}
        value={value}
      />
      <output data-testid="value">{value || 'empty'}</output>
      <button type="button">Outside</button>
    </>
  );
}

function entry(name = 'Sighting date') {
  return screen.getByRole('textbox', { name });
}

function calendarButton() {
  return screen.getByRole('button', { name: 'Choose date' });
}

function dialog() {
  return screen.getByRole('dialog', { name: 'Sighting date' });
}

function focusedDate() {
  return document.activeElement?.getAttribute('data-date');
}

describe('DateField typed entry', () => {
  it('labels and describes a text entry in the locale order', () => {
    render(
      <DateField
        description="Use the local calendar date"
        label="Sighting date"
        max="2024-12-31"
        min="2024-01-01"
        onChange={vi.fn()}
        required
        value="2024-03-10"
      />,
    );
    const input = entry();
    expect(input).toHaveProperty('type', 'text');
    expect(input).toHaveProperty('value', '03/10/2024');
    expect(input).toHaveProperty('required', true);
    expect(input.getAttribute('placeholder')).toBe('MM/DD/YYYY');
    expect(input.getAttribute('aria-invalid')).toBe('false');
    const descriptionId = input.getAttribute('aria-describedby') ?? '';
    expect(document.getElementById(descriptionId)?.textContent).toBe(
      'Use the local calendar date',
    );
    const button = calendarButton();
    expect(button.getAttribute('aria-haspopup')).toBe('dialog');
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(
      document.getElementById(button.getAttribute('aria-describedby') ?? '')
        ?.textContent,
    ).toBe('Sighting date');
    // The field label names only the text entry, so label lookups stay unique.
    expect(screen.getAllByLabelText('Sighting date')).toEqual([input]);
  });

  it('commits a typed date once it is complete, without UTC conversion', async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    render(<ControlledField spy={spy} />);
    await user.type(entry(), '11/3/202');
    expect(spy).not.toHaveBeenCalled();
    await user.type(entry(), '4');
    expect(spy).toHaveBeenCalledExactlyOnceWith('2024-11-03');
    expect(entry()).toHaveProperty('value', '11/3/2024');
    await user.tab();
    expect(entry()).toHaveProperty('value', '11/03/2024');
    expect(screen.getByTestId('value').textContent).toBe('2024-11-03');
  });

  it('accepts ISO text and compact digits, and follows outside value changes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(
      <DateField label="Sighting date" onChange={onChange} value="" />,
    );
    fireEvent.change(entry(), { target: { value: '2024-03-10' } });
    expect(onChange).toHaveBeenLastCalledWith('2024-03-10');
    await user.clear(entry());
    await user.type(entry(), '05141961');
    expect(onChange).toHaveBeenLastCalledWith('1961-05-14');
    rerender(
      <DateField
        label="Sighting date"
        onChange={onChange}
        value="2024-11-03"
      />,
    );
    expect(entry()).toHaveProperty('value', '11/03/2024');
  });

  it('flags text that is not a date after leaving it and keeps the value', async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    render(<ControlledField initial="2024-03-10" spy={spy} />);
    await user.clear(entry());
    spy.mockClear();
    await user.type(entry(), '13/45/2024');
    expect(entry().getAttribute('aria-invalid')).toBe('false');
    await user.tab();
    expect(spy).not.toHaveBeenCalled();
    expect(entry()).toHaveProperty('value', '13/45/2024');
    expect(entry().getAttribute('aria-invalid')).toBe('true');
    const messageId = entry().getAttribute('aria-describedby') ?? '';
    expect(document.getElementById(messageId)?.textContent).toBe(
      'Enter a valid date.',
    );
    await user.clear(entry());
    await user.type(entry(), '12/25/2024');
    expect(spy).toHaveBeenLastCalledWith('2024-12-25');
    expect(entry().getAttribute('aria-invalid')).toBe('false');
    expect(entry().hasAttribute('aria-describedby')).toBe(false);
  });

  it('clears an emptied field and shows range and supplied errors', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(
      <DateField
        error="Choose a later date"
        label="Sighting date"
        min="2024-03-10"
        onChange={onChange}
        value="2024-03-09"
      />,
    );
    expect(entry().getAttribute('aria-invalid')).toBe('true');
    expect(
      document.getElementById(entry().getAttribute('aria-describedby') ?? '')
        ?.textContent,
    ).toBe('Choose a later date');
    rerender(
      <DateField
        label="Sighting date"
        min="2024-03-10"
        onChange={onChange}
        value="2024-03-09"
      />,
    );
    expect(entry().getAttribute('aria-invalid')).toBe('true');
    await user.clear(entry());
    expect(onChange).toHaveBeenLastCalledWith('');
  });

  it('shows a consumer-supplied error for an empty required date', () => {
    render(
      <DateField
        error="Choose a date"
        label="Sighting date"
        onChange={vi.fn()}
        required
        value=""
      />,
    );
    expect(entry()).toHaveProperty('required', true);
    expect(entry().getAttribute('aria-invalid')).toBe('true');
    expect(
      document.getElementById(entry().getAttribute('aria-describedby') ?? '')
        ?.textContent,
    ).toBe('Choose a date');
  });

  it('keeps a disabled field inert', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <DateField
        disabled
        label="Sighting date"
        onChange={onChange}
        value="2024-03-10"
      />,
    );
    expect(entry()).toHaveProperty('disabled', true);
    expect(calendarButton()).toHaveProperty('disabled', true);
    await user.click(calendarButton());
    await user.type(entry(), '1');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('rejects malformed values, inverted bounds, and bad options', () => {
    const onChange = vi.fn();
    expect(() =>
      render(<DateField label="Date" onChange={onChange} value="2024-02-30" />),
    ).toThrow(RangeError);
    expect(() =>
      render(
        <DateField
          label="Date"
          max="2024-01-01"
          min="2024-12-31"
          onChange={onChange}
          value="2024-06-01"
        />,
      ),
    ).toThrow(RangeError);
    expect(() =>
      render(
        <DateField label="Date" locale="en_US" onChange={onChange} value="" />,
      ),
    ).toThrow(RangeError);
    expect(() =>
      render(
        <DateField
          label="Date"
          labels={{ clear: '' }}
          onChange={onChange}
          value=""
        />,
      ),
    ).toThrow(RangeError);
  });
});

describe('DateField calendar', () => {
  it('opens a labelled modal dialog on the selected day and closes with Escape', async () => {
    const user = userEvent.setup();
    render(<ControlledField initial="2024-03-10" />);
    await user.click(calendarButton());
    const calendar = dialog();
    expect(calendar.getAttribute('aria-modal')).toBe('true');
    expect(calendarButton().getAttribute('aria-expanded')).toBe('true');
    expect(calendarButton().getAttribute('aria-controls')).toBe(calendar.id);
    const grid = within(calendar).getByRole('grid', { name: 'March 2024' });
    expect(within(grid).getAllByRole('columnheader')).toHaveLength(7);
    expect(within(grid).getAllByRole('gridcell')).toHaveLength(42);
    const selected = within(grid).getByRole('gridcell', {
      name: 'Sunday, March 10, 2024',
    });
    expect(selected.getAttribute('aria-selected')).toBe('true');
    expect(selected).toBe(document.activeElement);
    expect(selected.tabIndex).toBe(0);
    const today = within(grid).getByRole('gridcell', {
      name: 'Wednesday, March 20, 2024',
    });
    expect(today.getAttribute('aria-current')).toBe('date');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(calendarButton()).toBe(document.activeElement);
  });

  it('opens on today when empty and closes on a press outside', async () => {
    const user = userEvent.setup();
    render(<ControlledField />);
    await user.click(calendarButton());
    expect(focusedDate()).toBe('2024-03-20');
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Outside' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('toggles closed from the calendar button', async () => {
    const user = userEvent.setup();
    render(<ControlledField />);
    await user.click(calendarButton());
    await user.click(calendarButton());
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('moves by day, week, month, and year from the keyboard and selects with Enter', async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    render(<ControlledField initial="2024-03-10" spy={spy} />);
    await user.click(calendarButton());
    await user.keyboard('{ArrowRight}');
    expect(focusedDate()).toBe('2024-03-11');
    await user.keyboard('{ArrowDown}');
    expect(focusedDate()).toBe('2024-03-18');
    await user.keyboard('{ArrowLeft}{ArrowUp}');
    expect(focusedDate()).toBe('2024-03-10');
    await user.keyboard('{End}');
    expect(focusedDate()).toBe('2024-03-16');
    await user.keyboard('{Home}');
    expect(focusedDate()).toBe('2024-03-10');
    await user.keyboard('{PageDown}');
    expect(focusedDate()).toBe('2024-04-10');
    expect(screen.getByRole('grid', { name: 'April 2024' })).toBeTruthy();
    await user.keyboard('{Shift>}{PageUp}{/Shift}');
    expect(focusedDate()).toBe('2023-04-10');
    await user.keyboard('{PageUp}');
    expect(focusedDate()).toBe('2023-03-10');
    await user.keyboard('{Enter}');
    expect(spy).toHaveBeenCalledExactlyOnceWith('2023-03-10');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(calendarButton()).toBe(document.activeElement);
    expect(entry()).toHaveProperty('value', '03/10/2023');
  });

  it('selects with Space and with a press', async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    render(<ControlledField initial="2024-03-10" spy={spy} />);
    await user.click(calendarButton());
    await user.keyboard('{ArrowRight} ');
    expect(spy).toHaveBeenLastCalledWith('2024-03-11');
    await user.click(calendarButton());
    await user.click(
      screen.getByRole('gridcell', { name: 'Friday, March 22, 2024' }),
    );
    expect(spy).toHaveBeenLastCalledWith('2024-03-22');
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('marks days outside min and max disabled and keeps focus inside them', async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    render(
      <ControlledField
        initial="2024-03-12"
        max="2024-03-25"
        min="2024-03-05"
        spy={spy}
      />,
    );
    await user.click(calendarButton());
    const early = screen.getByRole('gridcell', {
      name: 'Monday, March 4, 2024',
    });
    expect(early.getAttribute('aria-disabled')).toBe('true');
    expect(
      screen
        .getByRole('gridcell', { name: 'Tuesday, March 5, 2024' })
        .hasAttribute('aria-disabled'),
    ).toBe(false);
    await user.click(early);
    expect(spy).not.toHaveBeenCalled();
    expect(dialog()).toBeTruthy();
    const previous = screen.getByRole('button', { name: 'Previous month' });
    expect(previous.getAttribute('aria-disabled')).toBe('true');
    await user.click(previous);
    expect(screen.getByRole('grid', { name: 'March 2024' })).toBeTruthy();
    screen.getByRole('gridcell', { name: 'Tuesday, March 12, 2024' }).focus();
    await user.keyboard('{PageUp}');
    expect(focusedDate()).toBe('2024-03-05');
    await user.keyboard('{Shift>}{PageDown}{/Shift}');
    expect(focusedDate()).toBe('2024-03-25');
    await user.keyboard('{Enter}');
    expect(spy).toHaveBeenCalledExactlyOnceWith('2024-03-25');
  });

  it('steps months with the header buttons without moving focus', async () => {
    const user = userEvent.setup();
    render(<ControlledField initial="2024-01-31" />);
    await user.click(calendarButton());
    const next = screen.getByRole('button', { name: 'Next month' });
    await user.click(next);
    expect(screen.getByRole('grid', { name: 'February 2024' })).toBeTruthy();
    expect(next).toBe(document.activeElement);
    expect(
      screen
        .getByRole('gridcell', { name: 'Thursday, February 29, 2024' })
        .getAttribute('tabindex'),
    ).toBe('0');
    await user.click(screen.getByRole('button', { name: 'Previous month' }));
    expect(screen.getByRole('grid', { name: 'January 2024' })).toBeTruthy();
  });

  it('jumps decades with the year and month selectors', async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    render(<ControlledField spy={spy} />);
    await user.click(calendarButton());
    await user.click(screen.getByRole('combobox', { name: 'Year' }));
    await user.click(screen.getByRole('option', { name: '1961' }));
    await user.click(screen.getByRole('combobox', { name: 'Month' }));
    await user.click(screen.getByRole('option', { name: 'May' }));
    expect(screen.getByRole('grid', { name: 'May 1961' })).toBeTruthy();
    expect(dialog()).toBeTruthy();
    await user.click(
      screen.getByRole('gridcell', { name: 'Sunday, May 14, 1961' }),
    );
    expect(spy).toHaveBeenCalledExactlyOnceWith('1961-05-14');
  });

  it('keeps Tab inside the dialog', async () => {
    const user = userEvent.setup();
    render(<ControlledField initial="2024-03-10" />);
    await user.click(calendarButton());
    const today = screen.getByRole('button', { name: 'Today' });
    const previous = screen.getByRole('button', { name: 'Previous month' });
    today.focus();
    await user.keyboard('{Tab}');
    expect(previous).toBe(document.activeElement);
    await user.keyboard('{Shift>}{Tab}{/Shift}');
    expect(today).toBe(document.activeElement);
    expect(dialog()).toBeTruthy();
  });

  it('selects today and clears an optional date', async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    render(<ControlledField initial="2024-03-10" spy={spy} />);
    await user.click(calendarButton());
    await user.click(screen.getByRole('button', { name: 'Today' }));
    expect(spy).toHaveBeenLastCalledWith('2024-03-20');
    await user.click(calendarButton());
    await user.click(screen.getByRole('button', { name: 'Clear' }));
    expect(spy).toHaveBeenLastCalledWith('');
    expect(entry()).toHaveProperty('value', '');
    await user.click(calendarButton());
    expect(
      screen.getByRole('button', { name: 'Clear' }).hasAttribute('disabled'),
    ).toBe(true);
  });

  it('offers no Clear when required and no Today outside the bounds', async () => {
    const user = userEvent.setup();
    render(<ControlledField initial="2024-01-10" max="2024-02-01" required />);
    await user.click(calendarButton());
    expect(screen.queryByRole('button', { name: 'Clear' })).toBeNull();
    expect(
      screen.getByRole('button', { name: 'Today' }).hasAttribute('disabled'),
    ).toBe(true);
  });

  it('starts weeks on Monday when asked', async () => {
    const user = userEvent.setup();
    render(<ControlledField initial="2024-03-10" weekStartsOn={1} />);
    await user.click(calendarButton());
    const headers = screen.getAllByRole('columnheader');
    expect(headers[0]?.getAttribute('abbr')).toBe('Monday');
    expect(headers[6]?.getAttribute('abbr')).toBe('Sunday');
  });

  it('closes when the field becomes disabled', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <DateField label="Sighting date" onChange={vi.fn()} value="" />,
    );
    await user.click(calendarButton());
    rerender(
      <DateField disabled label="Sighting date" onChange={vi.fn()} value="" />,
    );
    expect(screen.queryByRole('dialog')).toBeNull();
    rerender(<DateField label="Sighting date" onChange={vi.fn()} value="" />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});

describe('DateField locales', () => {
  const spanish = {
    chooseDate: 'Elegir fecha',
    previousMonth: 'Mes anterior',
    nextMonth: 'Mes siguiente',
    month: 'Mes',
    year: 'Año',
    today: 'Hoy',
    clear: 'Borrar',
    invalidEntry: 'Escribe una fecha válida.',
    yearPlaceholder: 'AAAA',
  };

  it('speaks and orders dates in Spanish with consumer labels', async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    render(
      <ControlledField
        initial="2024-03-10"
        label="Fecha del avistamiento"
        labels={spanish}
        locale="es"
        spy={spy}
        weekStartsOn={1}
      />,
    );
    const input = entry('Fecha del avistamiento');
    expect(input).toHaveProperty('value', '10/03/2024');
    expect(input.getAttribute('placeholder')).toBe('DD/MM/AAAA');
    await user.click(screen.getByRole('button', { name: 'Elegir fecha' }));
    const calendar = screen.getByRole('dialog', {
      name: 'Fecha del avistamiento',
    });
    expect(
      within(calendar).getByRole('grid', { name: 'marzo de 2024' }),
    ).toBeTruthy();
    expect(
      within(calendar).getAllByRole('columnheader')[0]?.getAttribute('abbr'),
    ).toBe('lunes');
    expect(
      within(calendar).getByRole('combobox', { name: 'Mes' }).textContent,
    ).toBe('marzo');
    expect(
      within(calendar).getByRole('button', { name: 'Mes anterior' }),
    ).toBeTruthy();
    expect(within(calendar).getByRole('button', { name: 'Hoy' })).toBeTruthy();
    expect(
      within(calendar).getByRole('gridcell', {
        name: 'domingo, 10 de marzo de 2024',
      }),
    ).toBe(document.activeElement);
    await user.keyboard('{Escape}');
    await user.clear(input);
    await user.type(input, '3/11/2024');
    expect(spy).toHaveBeenLastCalledWith('2024-11-03');
    await user.clear(input);
    await user.type(input, '31/02/2024');
    await user.tab();
    expect(screen.getByText('Escribe una fecha válida.')).toBeTruthy();
  });

  it('takes the locale from the nearest lang attribute by default', () => {
    render(
      <div lang="es-MX">
        <DateField label="Fecha" onChange={vi.fn()} value="2024-03-10" />
      </div>,
    );
    expect(entry('Fecha')).toHaveProperty('value', '10/03/2024');
    expect(entry('Fecha').getAttribute('placeholder')).toBe('DD/MM/YYYY');
  });
});

describe('DateField accessibility', () => {
  it('names every control, uses unique ids, and exposes grid semantics', async () => {
    const user = userEvent.setup();
    render(
      <>
        <ControlledField
          description="Local calendar date"
          initial="2024-03-10"
          max="2024-12-31"
          min="2024-01-01"
        />
        <DateField label="Review date" onChange={vi.fn()} value="" />
      </>,
    );
    await user.click(
      screen.getAllByRole('button', { name: 'Choose date' })[0]!,
    );
    const ids = [...document.querySelectorAll('[id]')].map((node) => node.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const attribute of [
      'aria-describedby',
      'aria-labelledby',
      'aria-controls',
    ])
      for (const node of document.querySelectorAll(`[${attribute}]`))
        for (const id of (node.getAttribute(attribute) ?? '').split(' '))
          expect(document.getElementById(id)).not.toBeNull();
    const calendar = dialog();
    for (const role of ['button', 'combobox', 'gridcell'] as const)
      for (const node of within(calendar).getAllByRole(role))
        expect(
          (
            node.getAttribute('aria-label') ??
            node.getAttribute('aria-labelledby') ??
            node.textContent ??
            ''
          ).trim(),
        ).not.toBe('');
    expect(
      within(calendar).getAllByRole('gridcell', { selected: true }),
    ).toHaveLength(1);
    expect(
      within(calendar)
        .getAllByRole('gridcell')
        .filter((cell) => cell.tabIndex === 0),
    ).toHaveLength(1);
    expect(
      within(calendar)
        .getByRole('heading', { name: 'March 2024' })
        .getAttribute('aria-live'),
    ).toBe('polite');
    for (const svg of document.querySelectorAll('svg'))
      expect(svg.getAttribute('aria-hidden')).toBe('true');
  });
});
