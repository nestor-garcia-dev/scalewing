import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  DateRangeButton,
  type DateRangeButtonProps,
  type DateRangeButtonValue,
} from './components/DateRangeButton.js';
import { formatRangeLong, formatRangeShort } from './date-range-words.js';

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date(2026, 9, 13, 12));
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const week = { start: '2026-10-06', end: '2026-10-12' };
const presets = [
  { id: 'week', label: 'Last 7 days', range: week },
  {
    id: 'month',
    label: 'This month',
    range: { start: '2026-10-01', end: '2026-10-13' },
  },
];
const NAME = `Choose survey period, ${formatRangeShort(week, 'en-US')}`;

type HarnessProps = Partial<DateRangeButtonProps> & {
  onRange?: (value: DateRangeButtonValue) => void;
};

function Harness({ onRange, ...props }: HarnessProps) {
  const [value, setValue] = useState<DateRangeButtonValue>(props.value ?? week);
  return (
    <>
      <DateRangeButton
        label="Choose survey period"
        max="2026-10-13"
        presets={presets}
        today="2026-10-13"
        {...props}
        onChange={(next) => {
          onRange?.(next);
          setValue(next);
        }}
        value={value}
      />
      <output>{`${value.start} to ${value.end}`}</output>
    </>
  );
}

function day(name: string) {
  return screen.getByRole('gridcell', { name });
}

function popover() {
  return screen.getByRole('dialog', { name: 'Choose survey period' });
}

function status() {
  return within(popover()).getByRole('status');
}

describe('DateRangeButton', () => {
  it('is a neutral Button named by its label and the range it shows', () => {
    render(<Harness />);
    const button = screen.getByRole('button', { name: NAME });
    expect(button.getAttribute('aria-haspopup')).toBe('dialog');
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(button.hasAttribute('aria-controls')).toBe(false);
    expect(button.className).toBe(
      'sw-button sw-button-neutral sw-button-md sw-date-range-button',
    );
    expect(button.querySelector('.sw-sr-only')?.textContent).toBe(NAME);
    expect(button.querySelector('svg')?.getAttribute('aria-hidden')).toBe(
      'true',
    );
    expect(button.lastElementChild?.textContent).toBe(
      formatRangeShort(week, 'en-US'),
    );
    expect(button.lastElementChild?.getAttribute('aria-hidden')).toBe('true');
  });

  it('opens a popover with the presets and two months, the end in the last', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const button = screen.getByRole('button', { name: NAME });
    await user.click(button);
    const dialog = popover();
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(button.getAttribute('aria-controls')).toBe(dialog.id);
    const grids = within(dialog).getAllByRole('grid');
    expect(
      grids.map(
        (grid) =>
          document.getElementById(grid.getAttribute('aria-labelledby') ?? '')
            ?.textContent,
      ),
    ).toEqual(['September 2026', 'October 2026']);
    expect(grids[0]?.getAttribute('aria-multiselectable')).toBe('true');
    // The focus day is the range's end; each day shows once.
    expect(document.activeElement).toBe(day('Monday, October 12, 2026'));
    expect(
      within(grids[0]!).queryByRole('gridcell', {
        name: 'Thursday, October 1, 2026',
      }),
    ).toBeNull();
    // The range is selected, its ends drawn as ends.
    for (const date of [
      'Tuesday, October 6, 2026',
      'Friday, October 9, 2026',
      'Monday, October 12, 2026',
    ])
      expect(day(date).getAttribute('aria-selected')).toBe('true');
    expect(day('Monday, October 5, 2026').getAttribute('aria-selected')).toBe(
      'false',
    );
    expect(day('Tuesday, October 6, 2026').className).toContain(
      'sw-date-field-day-range-start',
    );
    // Days after max are disabled; today is marked.
    expect(
      day('Wednesday, October 14, 2026').getAttribute('aria-disabled'),
    ).toBe('true');
    expect(day('Tuesday, October 13, 2026').getAttribute('aria-current')).toBe(
      'date',
    );
    const group = within(dialog).getByRole('group', { name: 'Presets' });
    expect(
      within(group)
        .getByRole('button', { name: 'Last 7 days' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(
      within(group)
        .getByRole('button', { name: 'This month' })
        .getAttribute('aria-pressed'),
    ).toBe('false');
    expect(status().getAttribute('aria-atomic')).toBe('true');
    expect(status().textContent).toBe(
      `${formatRangeLong(week, 'en-US')} 7 days`,
    );
    expect(
      within(dialog).getByText('Choose a first and a last day.'),
    ).toBeTruthy();
  });

  it('sets the start, then the end, and gives the range on Apply', async () => {
    const user = userEvent.setup();
    const onRange = vi.fn();
    render(<Harness onRange={onRange} />);
    const button = screen.getByRole('button', { name: NAME });
    await user.click(button);
    await user.click(day('Monday, September 14, 2026'));
    expect(status().textContent).toBe(
      `${formatRangeLong({ start: '2026-09-14', end: '2026-09-14' }, 'en-US')} 1 day`,
    );
    expect(day('Tuesday, October 6, 2026').getAttribute('aria-selected')).toBe(
      'false',
    );
    // A press before the start starts over from it.
    await user.click(day('Thursday, September 10, 2026'));
    await user.click(day('Sunday, September 20, 2026'));
    expect(status().textContent).toContain('11 days');
    expect(
      within(popover())
        .getByRole('group', { name: 'Presets' })
        .querySelector('[aria-pressed="true"]'),
    ).toBeNull();
    await user.click(within(popover()).getByRole('button', { name: 'Apply' }));
    expect(onRange).toHaveBeenCalledExactlyOnceWith({
      start: '2026-09-10',
      end: '2026-09-20',
    });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByText('2026-09-10 to 2026-09-20')).toBeTruthy();
    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: /^Choose survey period, Sep 10/ }),
    );
    expect(button.getAttribute('aria-expanded')).toBe('false');
  });

  it('applies one day when only the start is pressed', async () => {
    const user = userEvent.setup();
    const onRange = vi.fn();
    render(<Harness onRange={onRange} />);
    await user.click(screen.getByRole('button', { name: NAME }));
    await user.click(day('Wednesday, October 7, 2026'));
    await user.click(within(popover()).getByRole('button', { name: 'Apply' }));
    expect(onRange).toHaveBeenCalledWith({
      start: '2026-10-07',
      end: '2026-10-07',
    });
  });

  it('applies a preset at once and does not report an unchanged range', async () => {
    const user = userEvent.setup();
    const onRange = vi.fn();
    render(<Harness onRange={onRange} />);
    await user.click(screen.getByRole('button', { name: NAME }));
    await user.click(
      within(popover()).getByRole('button', { name: 'Last 7 days' }),
    );
    expect(onRange).not.toHaveBeenCalled();
    expect(screen.queryByRole('dialog')).toBeNull();
    await user.click(screen.getByRole('button', { name: NAME }));
    await user.click(
      within(popover()).getByRole('button', { name: 'This month' }),
    );
    expect(onRange).toHaveBeenCalledExactlyOnceWith(presets[1]!.range);
    expect(document.activeElement?.className).toContain('sw-date-range-button');
  });

  it('keeps the value on Cancel, Escape and a press outside', async () => {
    const user = userEvent.setup();
    const onRange = vi.fn();
    render(<Harness onRange={onRange} />);
    const button = screen.getByRole('button', { name: NAME });
    await user.click(button);
    await user.click(day('Monday, September 14, 2026'));
    await user.click(within(popover()).getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(button);
    // Opening again starts from the value, not the abandoned draft.
    await user.click(button);
    expect(status().textContent).toContain('7 days');
    await user.click(day('Monday, September 14, 2026'));
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(button);
    await user.click(button);
    await user.click(document.body);
    expect(screen.queryByRole('dialog')).toBeNull();
    await user.click(button);
    await user.click(button);
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(onRange).not.toHaveBeenCalled();
    expect(screen.getByText('2026-10-06 to 2026-10-12')).toBeTruthy();
  });

  it('disables the days past maxDays from a pressed start', async () => {
    const user = userEvent.setup();
    render(<Harness maxDays={7} presets={[]} />);
    await user.click(screen.getByRole('button', { name: NAME }));
    expect(day('Thursday, October 1, 2026').hasAttribute('aria-disabled')).toBe(
      false,
    );
    await user.click(day('Wednesday, September 23, 2026'));
    expect(
      day('Tuesday, September 29, 2026').hasAttribute('aria-disabled'),
    ).toBe(false);
    expect(
      day('Wednesday, September 30, 2026').getAttribute('aria-disabled'),
    ).toBe('true');
    // Earlier days stay pickable: they start over.
    expect(
      day('Tuesday, September 1, 2026').hasAttribute('aria-disabled'),
    ).toBe(false);
    await user.click(day('Wednesday, September 30, 2026'));
    expect(status().textContent).toContain('1 day');
    await user.click(day('Tuesday, September 29, 2026'));
    expect(status().textContent).toContain('7 days');
    expect(
      day('Wednesday, September 30, 2026').hasAttribute('aria-disabled'),
    ).toBe(false);
  });

  it('moves by keyboard across both months and picks with Enter', async () => {
    const user = userEvent.setup();
    const onRange = vi.fn();
    render(<Harness onRange={onRange} presets={[]} />);
    await user.click(screen.getByRole('button', { name: NAME }));
    await user.keyboard('{PageUp}');
    expect(document.activeElement).toBe(day('Saturday, September 12, 2026'));
    await user.keyboard('{Enter}{ArrowDown}{ArrowRight}{Enter}');
    expect(status().textContent).toContain('9 days');
    // Past the first month the view moves back with the focus.
    await user.keyboard('{PageUp}');
    expect(screen.getByRole('grid', { name: 'August 2026' })).toBeTruthy();
    expect(screen.getByRole('grid', { name: 'September 2026' })).toBeTruthy();
    expect(screen.queryByRole('grid', { name: 'October 2026' })).toBeNull();
    expect(document.activeElement).toBe(day('Thursday, August 20, 2026'));
    // Keys stop at max.
    await user.keyboard('{Shift>}{PageDown}{/Shift}');
    expect(document.activeElement).toBe(day('Tuesday, October 13, 2026'));
    // Tab stays inside the popover.
    await user.tab();
    expect(document.activeElement?.textContent).toBe('Cancel');
    await user.tab();
    await user.tab();
    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: 'Previous month' }),
    );
    await user.keyboard('{Escape}');
    expect(onRange).not.toHaveBeenCalled();
  });

  it('steps the months with the previous and next steps', async () => {
    const user = userEvent.setup();
    render(<Harness presets={[]} />);
    await user.click(screen.getByRole('button', { name: NAME }));
    const next = screen.getByRole('button', { name: 'Next month' });
    expect(next.getAttribute('aria-disabled')).toBe('true');
    await user.click(next);
    expect(screen.getByRole('grid', { name: 'October 2026' })).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Previous month' }));
    // One polite region says the months now shown.
    const live = popover().querySelectorAll('[aria-live="polite"]');
    expect(live).toHaveLength(1);
    expect([...live[0]!.children].map((line) => line.textContent)).toEqual([
      'August 2026',
      'September 2026',
    ]);
    expect(screen.getByRole('grid', { name: 'August 2026' })).toBeTruthy();
    expect(screen.getByRole('grid', { name: 'September 2026' })).toBeTruthy();
    // The focus day moved into the view, and stays the roving stop.
    expect(day('Saturday, September 12, 2026').getAttribute('tabindex')).toBe(
      '0',
    );
    expect(next.getAttribute('aria-disabled')).toBeNull();
  });

  it('speaks Spanish words and dates, from Monday', async () => {
    const user = userEvent.setup();
    render(
      <Harness
        label="Elegir periodo"
        labels={{
          previousMonth: 'Mes anterior',
          nextMonth: 'Mes siguiente',
          presets: 'Periodos rápidos',
          apply: 'Mostrar',
          cancel: 'Cancelar',
          close: 'Cerrar',
          hint: 'Elige un primer y un último día',
          dayCount: (days) => `${days} días`,
        }}
        locale="es"
        presets={[{ id: 'week', label: 'Últimos 7 días', range: week }]}
        weekStartsOn={1}
      />,
    );
    const button = screen.getByRole('button', {
      name: `Elegir periodo, ${formatRangeShort(week, 'es')}`,
    });
    await user.click(button);
    const dialog = screen.getByRole('dialog', { name: 'Elegir periodo' });
    expect(
      within(dialog).getAllByRole('columnheader')[0]?.getAttribute('abbr'),
    ).toBe('lunes');
    expect(
      within(dialog).getByRole('group', { name: 'Periodos rápidos' }),
    ).toBeTruthy();
    expect(
      within(dialog).getByRole('button', { name: 'Mostrar' }),
    ).toBeTruthy();
    expect(within(dialog).getByRole('status').textContent).toBe(
      `${formatRangeLong(week, 'es')} 7 días`,
    );
  });

  it('closes for good when disabled, and forwards its ref and id', async () => {
    const user = userEvent.setup();
    const ref = { current: null as HTMLButtonElement | null };
    const { rerender } = render(
      <DateRangeButton
        id="period"
        label="Choose survey period"
        onChange={vi.fn()}
        ref={ref}
        value={week}
      />,
    );
    expect(ref.current?.id).toBe('period');
    await user.click(ref.current!);
    expect(screen.getByRole('dialog')).toBeTruthy();
    rerender(
      <DateRangeButton
        disabled
        id="period"
        label="Choose survey period"
        onChange={vi.fn()}
        ref={ref}
        value={week}
      />,
    );
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(ref.current?.disabled).toBe(true);
    rerender(
      <DateRangeButton
        id="period"
        label="Choose survey period"
        onChange={vi.fn()}
        ref={ref}
        value={week}
      />,
    );
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('maps sizes and variants and refuses props it cannot draw', () => {
    render(
      <DateRangeButton
        label="Choose survey period"
        onChange={vi.fn()}
        size="sm"
        value={week}
        variant="secondary"
      />,
    );
    expect(screen.getByRole('button').className).toBe(
      'sw-button sw-button-secondary sw-button-sm sw-date-range-button',
    );
    cleanup();
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() =>
      render(<DateRangeButton label="" onChange={vi.fn()} value={week} />),
    ).toThrow('label must be non-empty text');
    expect(() =>
      render(
        <DateRangeButton
          label="Choose"
          maxDays={3}
          onChange={vi.fn()}
          presets={presets}
          value={week}
        />,
      ),
    ).toThrow('preset week must not exceed maxDays');
    expect(() =>
      render(
        <DateRangeButton
          label="Choose"
          labels={{ apply: '' }}
          onChange={vi.fn()}
          value={week}
        />,
      ),
    ).toThrow('labels.apply must be non-empty text');
  });
});
