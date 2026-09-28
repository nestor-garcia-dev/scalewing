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

import {
  CalendarButton,
  type CalendarButtonProps,
} from './components/CalendarButton.js';

beforeEach(() => {
  // Only Date is faked, so user-event timers still run. Today is 2026-09-28.
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date(2026, 8, 28, 12));
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const NAME = 'Choose survey day, Tuesday, September 22, 2026';

function ControlledButton(
  props: Partial<CalendarButtonProps> & {
    initial?: string;
    spy?: (value: string) => void;
  },
) {
  const { initial = '2026-09-22', spy, ...rest } = props;
  const [value, setValue] = useState(initial);
  return (
    <>
      <CalendarButton
        label="Choose survey day"
        {...rest}
        onChange={(next) => {
          spy?.(next);
          setValue(next);
        }}
        value={value}
      />
      <output data-testid="value">{value}</output>
      <button type="button">Outside</button>
    </>
  );
}

function trigger(name: string | RegExp = /^Choose survey day, /) {
  return screen.getByRole('button', { name });
}

function dialog() {
  return screen.getByRole('dialog', { name: 'Choose survey day' });
}

function focusedDate() {
  return document.activeElement?.getAttribute('data-date');
}

describe('CalendarButton', () => {
  it('is an icon-only ghost Button named by its label and the spoken date', () => {
    render(<ControlledButton />);
    const button = trigger(NAME);
    expect(button.getAttribute('type')).toBe('button');
    expect(button.getAttribute('aria-haspopup')).toBe('dialog');
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(button.hasAttribute('aria-controls')).toBe(false);
    expect(button.className).toBe(
      'sw-button sw-button-ghost sw-button-md sw-calendar-button',
    );
    // The name is visually hidden text, as on DateField's calendar button.
    expect(button.textContent).toBe(NAME);
    expect(button.querySelector('.sw-sr-only')?.textContent).toBe(NAME);
    expect(button.hasAttribute('aria-label')).toBe(false);
    const glyph = button.querySelector('svg');
    expect(glyph?.getAttribute('aria-hidden')).toBe('true');
    expect(glyph?.getAttribute('class')).toBe('sw-date-field-glyph');
  });

  it('maps Button sizes and variants onto the square touch-target class', () => {
    render(
      <CalendarButton
        label="Choose survey day"
        onChange={vi.fn()}
        size="sm"
        value="2026-09-22"
        variant="secondary"
      />,
    );
    expect(trigger(NAME).className).toBe(
      'sw-button sw-button-secondary sw-button-sm sw-calendar-button',
    );
  });

  it('speaks the date and names the calendar in Spanish', async () => {
    const user = userEvent.setup();
    render(
      <ControlledButton
        label="Elegir día del censo"
        labels={{
          previousMonth: 'Mes anterior',
          nextMonth: 'Mes siguiente',
          month: 'Mes',
          year: 'Año',
          today: 'Hoy',
        }}
        locale="es-US"
        weekStartsOn={1}
      />,
    );
    const button = screen.getByRole('button', {
      name: 'Elegir día del censo, martes, 22 de septiembre de 2026',
    });
    await user.click(button);
    const calendar = screen.getByRole('dialog', {
      name: 'Elegir día del censo',
    });
    expect(
      within(calendar).getByRole('grid', { name: 'septiembre de 2026' }),
    ).toBeTruthy();
    expect(
      within(calendar).getAllByRole('columnheader')[0]?.getAttribute('abbr'),
    ).toBe('lunes');
    expect(
      within(calendar).getByRole('button', { name: 'Mes anterior' }),
    ).toBeTruthy();
    expect(within(calendar).getByRole('button', { name: 'Hoy' })).toBeTruthy();
    expect(
      within(calendar).getByRole('gridcell', {
        name: 'martes, 22 de septiembre de 2026',
      }),
    ).toBe(document.activeElement);
  });

  it('takes the locale from the nearest lang attribute by default', () => {
    render(
      <div lang="es-MX">
        <CalendarButton
          label="Elegir día"
          onChange={vi.fn()}
          value="2026-09-22"
        />
      </div>,
    );
    expect(
      screen.getByRole('button', {
        name: 'Elegir día, martes, 22 de septiembre de 2026',
      }),
    ).toBeTruthy();
  });

  it('opens a labelled modal calendar on the value with a press', async () => {
    const user = userEvent.setup();
    render(<ControlledButton />);
    await user.click(trigger());
    const calendar = dialog();
    expect(calendar.getAttribute('aria-modal')).toBe('true');
    expect(trigger().getAttribute('aria-expanded')).toBe('true');
    expect(trigger().getAttribute('aria-controls')).toBe(calendar.id);
    const selected = within(calendar).getByRole('gridcell', {
      name: 'Tuesday, September 22, 2026',
    });
    expect(selected.getAttribute('aria-selected')).toBe('true');
    expect(selected).toBe(document.activeElement);
    expect(
      within(calendar)
        .getByRole('gridcell', { name: 'Monday, September 28, 2026' })
        .getAttribute('aria-current'),
    ).toBe('date');
    // The value is never empty, so the calendar offers no Clear.
    expect(within(calendar).queryByRole('button', { name: 'Clear' })).toBe(
      null,
    );
  });

  it('opens with Enter and with Space from the keyboard', async () => {
    const user = userEvent.setup();
    render(<ControlledButton />);
    await user.tab();
    expect(trigger()).toBe(document.activeElement);
    await user.keyboard('{Enter}');
    expect(dialog()).toBeTruthy();
    expect(focusedDate()).toBe('2026-09-22');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(trigger()).toBe(document.activeElement);
    await user.keyboard(' ');
    expect(dialog()).toBeTruthy();
    expect(focusedDate()).toBe('2026-09-22');
  });

  it('chooses a day with arrows and Enter, closes, and returns focus', async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    render(<ControlledButton spy={spy} />);
    await user.click(trigger());
    await user.keyboard('{ArrowRight}{ArrowDown}');
    expect(focusedDate()).toBe('2026-09-30');
    await user.keyboard('{PageDown}{ArrowLeft}');
    expect(focusedDate()).toBe('2026-10-29');
    await user.keyboard('{Enter}');
    expect(spy).toHaveBeenCalledExactlyOnceWith('2026-10-29');
    expect(screen.queryByRole('dialog')).toBeNull();
    const button = trigger('Choose survey day, Thursday, October 29, 2026');
    expect(button).toBe(document.activeElement);
    expect(button.getAttribute('aria-expanded')).toBe('false');
  });

  it('chooses with Space and with a press on a day', async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    render(<ControlledButton spy={spy} />);
    await user.click(trigger());
    await user.keyboard('{ArrowLeft} ');
    expect(spy).toHaveBeenLastCalledWith('2026-09-21');
    await user.click(trigger());
    await user.click(
      screen.getByRole('gridcell', { name: 'Friday, September 25, 2026' }),
    );
    expect(spy).toHaveBeenLastCalledWith('2026-09-25');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(trigger()).toBe(document.activeElement);
  });

  it('selects today from the footer', async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    render(<ControlledButton spy={spy} />);
    await user.click(trigger());
    await user.click(screen.getByRole('button', { name: 'Today' }));
    expect(spy).toHaveBeenCalledExactlyOnceWith('2026-09-28');
    expect(trigger()).toBe(document.activeElement);
  });

  it('closes without a change on Escape, on a press outside, and on a second press', async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    render(<ControlledButton spy={spy} />);
    await user.click(trigger());
    await user.keyboard('{ArrowRight}{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(trigger()).toBe(document.activeElement);
    await user.click(trigger());
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Outside' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    await user.click(trigger());
    await user.click(trigger());
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(trigger()).toBe(document.activeElement);
    expect(spy).not.toHaveBeenCalled();
    expect(screen.getByTestId('value').textContent).toBe('2026-09-22');
  });

  it('disables days outside min and max and keeps focus inside them', async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    render(<ControlledButton max="2026-09-24" min="2026-09-20" spy={spy} />);
    await user.click(trigger());
    const early = screen.getByRole('gridcell', {
      name: 'Saturday, September 19, 2026',
    });
    const late = screen.getByRole('gridcell', {
      name: 'Friday, September 25, 2026',
    });
    expect(early.getAttribute('aria-disabled')).toBe('true');
    expect(late.getAttribute('aria-disabled')).toBe('true');
    await user.click(late);
    expect(spy).not.toHaveBeenCalled();
    expect(dialog()).toBeTruthy();
    await user.keyboard('{ArrowDown}');
    expect(focusedDate()).toBe('2026-09-24');
    // Today, 2026-09-28, is outside the bounds.
    expect(
      (screen.getByRole('button', { name: 'Today' }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);
  });

  it('stays closed while disabled and closes when it becomes disabled', async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    const { rerender } = render(
      <CalendarButton
        disabled
        label="Choose survey day"
        onChange={spy}
        value="2026-09-22"
      />,
    );
    const button = trigger(NAME) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    await user.click(button);
    expect(screen.queryByRole('dialog')).toBeNull();
    rerender(
      <CalendarButton
        label="Choose survey day"
        onChange={spy}
        value="2026-09-22"
      />,
    );
    await user.click(trigger(NAME));
    expect(dialog()).toBeTruthy();
    rerender(
      <CalendarButton
        disabled
        label="Choose survey day"
        onChange={spy}
        value="2026-09-22"
      />,
    );
    expect(screen.queryByRole('dialog')).toBeNull();
    rerender(
      <CalendarButton
        label="Choose survey day"
        onChange={spy}
        value="2026-09-22"
      />,
    );
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(spy).not.toHaveBeenCalled();
  });

  it('rejects an empty or malformed value, bad bounds, and bad options', () => {
    const onChange = vi.fn();
    const cases: Array<[Partial<CalendarButtonProps>, string]> = [
      [{ value: '' }, 'value must be a valid YYYY-MM-DD date'],
      [{ value: '2026-02-30' }, 'value must be a valid YYYY-MM-DD date'],
      [{ min: '2026-9-1' }, 'min must be a valid YYYY-MM-DD date'],
      [{ max: 'soon' }, 'max must be a valid YYYY-MM-DD date'],
      [{ min: '2026-12-31', max: '2026-01-01' }, 'min must not be after max'],
      [{ weekStartsOn: 2 as never }, 'weekStartsOn must be 0 or 1'],
      [{ locale: 'en_US' }, 'locale must be a BCP 47 language tag'],
      [{ labels: { today: ' ' } }, 'labels.today must be non-empty text'],
      [{ label: '' }, 'label must be non-empty text'],
    ];
    for (const [props, message] of cases)
      expect(() =>
        render(
          <CalendarButton
            label="Choose survey day"
            onChange={onChange}
            value="2026-09-22"
            {...props}
          />,
        ),
      ).toThrow(new RangeError(message));
  });

  it('keeps ids unique and every ARIA reference resolvable', async () => {
    const user = userEvent.setup();
    render(
      <>
        <ControlledButton />
        <CalendarButton
          label="Choose release day"
          onChange={vi.fn()}
          value="2026-10-01"
        />
      </>,
    );
    await user.click(trigger(NAME));
    const ids = [...document.querySelectorAll('[id]')].map((node) => node.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const attribute of ['aria-labelledby', 'aria-controls'])
      for (const node of document.querySelectorAll(`[${attribute}]`))
        for (const id of (node.getAttribute(attribute) ?? '').split(' '))
          expect(document.getElementById(id)).not.toBeNull();
    expect(
      screen
        .getByRole('button', {
          name: 'Choose release day, Thursday, October 1, 2026',
        })
        .getAttribute('aria-expanded'),
    ).toBe('false');
  });
});
