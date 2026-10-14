import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import {
  DateRangeButton,
  type DateRangeButtonValue,
} from './components/DateRangeButton.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';
import { formatRangeLong, formatRangeShort } from './date-range-words.js';

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function close() {
    this.removeAttribute('open');
  };
});

type Listener = () => void;
let wide = false;
const listeners = new Set<Listener>();

beforeEach(() => {
  wide = false;
  vi.stubGlobal('matchMedia', (query: string) => ({
    get matches() {
      return query === '(min-width: 48rem)' ? wide : false;
    },
    media: query,
    addEventListener: (_: string, listener: Listener) =>
      listeners.add(listener),
    removeEventListener: (_: string, listener: Listener) =>
      listeners.delete(listener),
  }));
});

afterEach(() => {
  cleanup();
  listeners.clear();
  vi.unstubAllGlobals();
});

const week = { start: '2026-10-06', end: '2026-10-12' };
const NAME = `Choose survey period, ${formatRangeShort(week, 'en-US')}`;

function Harness({
  onRange,
}: {
  onRange?: (value: DateRangeButtonValue) => void;
}) {
  const [value, setValue] = useState<DateRangeButtonValue>(week);
  return (
    <DateRangeButton
      label="Choose survey period"
      labels={{ apply: 'Show' }}
      max="2026-10-13"
      onChange={(next) => {
        onRange?.(next);
        setValue(next);
      }}
      presets={[
        { id: 'week', label: 'Last 7 days', range: week },
        {
          id: 'month',
          label: 'This month',
          range: { start: '2026-10-01', end: '2026-10-13' },
        },
      ]}
      today="2026-10-13"
      value={value}
    />
  );
}

describe('DateRangeButton below md', () => {
  it('is a bottom sheet titled by its label with one month and the presets in a row', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: NAME }));
    const sheet = screen.getByRole('dialog', { name: 'Choose survey period' });
    expect(sheet.tagName).toBe('DIALOG');
    expect(sheet.className).toContain('sw-dialog-sheet-below-md');
    expect(sheet.className).toContain('sw-date-range-sheet');
    expect(
      screen.getByRole('button', { name: NAME }).getAttribute('aria-controls'),
    ).toBe(sheet.id);
    const description = document.getElementById(
      sheet.getAttribute('aria-describedby') ?? '',
    );
    expect(description?.textContent).toBe(
      `${formatRangeLong(week, 'en-US')} · 7 days`,
    );
    expect(within(sheet).getAllByRole('grid')).toHaveLength(1);
    expect(
      within(sheet).getByRole('grid', { name: 'October 2026' }),
    ).toBeTruthy();
    expect(
      within(sheet).getByRole('button', { name: 'Previous month' }),
    ).toBeTruthy();
    expect(
      within(sheet)
        .getByRole('button', { name: 'Next month' })
        .getAttribute('aria-disabled'),
    ).toBe('true');
    const group = within(sheet).getByRole('group', { name: 'Presets' });
    expect(group.className).toBe(
      'sw-date-range-presets sw-date-range-presets-row',
    );
    expect(
      within(group)
        .getByRole('button', { name: 'Last 7 days' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(
      within(sheet).getByText('Choose a first and a last day.'),
    ).toBeTruthy();
    // The range being picked is still a status, for assistive technology only.
    const status = sheet.querySelector('.sw-sr-only [role="status"]');
    expect(status?.textContent).toBe(
      `${formatRangeLong(week, 'en-US')} 7 days`,
    );
  });

  it('picks a range and applies it with the sheet’s own words', async () => {
    const user = userEvent.setup();
    const onRange = vi.fn();
    render(<Harness onRange={onRange} />);
    await user.click(screen.getByRole('button', { name: NAME }));
    await user.click(
      screen.getByRole('gridcell', { name: 'Thursday, October 1, 2026' }),
    );
    await user.click(
      screen.getByRole('gridcell', { name: 'Saturday, October 3, 2026' }),
    );
    const sheet = screen.getByRole('dialog');
    expect(
      document.getElementById(sheet.getAttribute('aria-describedby') ?? '')
        ?.textContent,
    ).toContain('3 days');
    await user.click(within(sheet).getByRole('button', { name: 'Show' }));
    expect(onRange).toHaveBeenCalledExactlyOnceWith({
      start: '2026-10-01',
      end: '2026-10-03',
    });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('keeps the value when its close button or Escape closes it', async () => {
    const user = userEvent.setup();
    const onRange = vi.fn();
    render(<Harness onRange={onRange} />);
    const button = screen.getByRole('button', { name: NAME });
    await user.click(button);
    await user.click(
      screen.getByRole('gridcell', { name: 'Thursday, October 1, 2026' }),
    );
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(button);
    await user.click(button);
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    await user.click(button);
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(onRange).not.toHaveBeenCalled();
  });

  it('turns into the popover when the screen widens, keeping the range being picked', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: NAME }));
    await user.click(
      screen.getByRole('gridcell', { name: 'Thursday, October 1, 2026' }),
    );
    wide = true;
    const { act } = await import('react');
    act(() => listeners.forEach((listener) => listener()));
    const popover = screen.getByRole('dialog', {
      name: 'Choose survey period',
    });
    expect(popover.tagName).toBe('DIV');
    expect(within(popover).getAllByRole('grid')).toHaveLength(2);
    expect(within(popover).getByRole('status').textContent).toContain('1 day');
  });
});

describe('DateRangeButton CSS', () => {
  const css = generateStylesheet();

  it('catalogs its classes', () => {
    const catalog = utilityClassCatalog();
    for (const name of [
      'sw-date-range-button',
      'sw-date-range-popover',
      'sw-date-range-months',
      'sw-date-range-month-title',
      'sw-date-range-footer',
      'sw-date-range-status',
      'sw-date-range-sheet',
      'sw-date-range-presets',
      'sw-date-range-presets-row',
      'sw-date-range-preset',
    ])
      expect(catalog).toContain(name);
  });

  it('draws the days between a range’s ends as the band, not as selected circles', () => {
    expect(css).toContain(
      ".sw-date-range-months .sw-date-field-day-in-range[aria-selected='true']:not(.sw-date-field-day-range-start, .sw-date-field-day-range-end) {\n  background: color-mix(in srgb, var(--sw-color-accent) 16%, transparent);\n  border-color: transparent;\n  border-radius: 0;",
    );
  });

  it('brightens only pickable days between the ends under the pointer', () => {
    expect(css).toContain(
      ":not(.sw-date-field-day-range-start, .sw-date-field-day-range-end):hover:not([aria-disabled='true']) { background: color-mix(in srgb, var(--sw-color-accent) 24%, transparent); }",
    );
  });

  it('lists the presets beside the months from lg and above them below it', () => {
    expect(css).toContain(
      '@media (min-width: 64rem) {\n  .sw-date-range-body { flex-direction: row; }',
    );
    expect(css).toMatch(
      /\.sw-date-range-presets \{\n {2}contain: inline-size;/,
    );
    expect(css).toContain(
      '.sw-date-range-footer {\n  align-items: center;\n  border-top: 1px solid var(--sw-color-border);\n  contain: inline-size;',
    );
  });

  it('gives touch screens a 44 px button and presets', () => {
    expect(css).toContain(
      '.sw-button.sw-date-range-button,\n  .sw-date-range-actions > .sw-button { min-height: var(--sw-control-md-min-height); }',
    );
    expect(css).toContain(
      '.sw-date-range-preset { min-height: var(--sw-control-md-min-height); }',
    );
  });

  it('marks the pressed preset and the band in forced colours', () => {
    expect(css).toMatch(
      /\.sw-date-range-presets-row \.sw-date-range-preset\[aria-pressed='true'\] \{\n {4}background: Highlight;/,
    );
    expect(css).toMatch(/background: Mark;\n {4}color: MarkText;/);
  });
});
