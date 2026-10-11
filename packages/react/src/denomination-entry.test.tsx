import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  DenominationGrid,
  type DenominationGridRow,
} from './components/DenominationGrid.js';
import { cssDenominationEntryClasses } from './css/css-denomination-entry.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => cleanup());

const columns = [
  { key: 'one', label: '$1', caption: '× 100' },
  { key: 'five', label: '$5' },
  { key: 'ten', label: '$10' },
];

const buttons = { decrementLabel: 'One less', incrementLabel: 'One more' };

function received(
  overrides: Partial<DenominationGridRow> = {},
  onChange = vi.fn(),
): DenominationGridRow {
  return {
    id: 'received',
    label: 'Received',
    caption: 'from the field team',
    cells: [2, null, 0],
    total: '$12.00',
    entry: { ...buttons, onChange, placeholder: '0' },
    ...overrides,
  };
}

const lastCount: DenominationGridRow = {
  id: 'last',
  label: 'Last count',
  caption: 'Oct 9',
  cells: [3, 1, 0],
  emphasis: 'quiet',
  total: '$8.00',
};

function grid(rows: readonly DenominationGridRow[]) {
  return render(
    <DenominationGrid
      columns={columns}
      label="Nest count"
      rows={rows}
      totalLabel="Total"
    />,
  );
}

describe('DenominationGrid entry rows', () => {
  it('renders a Stepper per column, named by the row and the column', () => {
    grid([received(), lastCount]);
    const counts = screen.getAllByRole('spinbutton');
    expect(counts.map((count) => count.getAttribute('aria-valuenow'))).toEqual([
      '2',
      null,
      '0',
    ]);
    expect(screen.getByRole('spinbutton', { name: 'Received $5' })).toBe(
      counts[1],
    );
    // A column's caption is part of each count's name, as of its header.
    expect(screen.getByRole('spinbutton', { name: 'Received $1 × 100' })).toBe(
      counts[0],
    );
    expect((counts[1] as HTMLInputElement).placeholder).toBe('0');
    // Each count sits in its own entry cell; the read-only row stays text.
    expect(counts[0]!.closest('td')!.className).toBe('sw-denomination-entry');
    expect(counts[0]!.closest('table')!.className).toContain(
      'sw-denomination-strip-entry',
    );
    const last = screen.getByRole('row', { name: /Last count/ });
    expect(within(last).queryAllByRole('spinbutton')).toHaveLength(0);
    expect(within(last).getAllByRole('cell')[0]!.textContent).toBe('3');
  });

  it('reports a change by column key', () => {
    const onChange = vi.fn();
    grid([received({}, onChange)]);
    fireEvent.click(
      within(screen.getByRole('group', { name: 'Received $5' })).getByRole(
        'button',
        { name: 'One more' },
      ),
    );
    expect(onChange).toHaveBeenLastCalledWith('five', 1);
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Received $10' }), {
      target: { value: '12' },
    });
    expect(onChange).toHaveBeenLastCalledWith('ten', 12);
  });

  it('caps each count and shows its message', () => {
    grid([
      received({
        cells: [2, 4, 0],
        entry: {
          ...buttons,
          onChange: vi.fn(),
          max: [null, 4, 10],
          errors: [null, 'Only 4 in the box.', null],
        },
      }),
    ]);
    const five = screen.getByRole('spinbutton', { name: 'Received $5' });
    expect(five.getAttribute('aria-valuemax')).toBe('4');
    expect(five.getAttribute('aria-invalid')).toBe('true');
    expect(
      within(screen.getByRole('group', { name: 'Received $5' })).getByRole(
        'button',
        { name: 'One more' },
      ),
    ).toHaveProperty('disabled', true);
    expect(screen.getByText('Only 4 in the box.').id).toBe(
      five.getAttribute('aria-describedby'),
    );
    expect(
      screen
        .getByRole('spinbutton', { name: 'Received $1 × 100' })
        .hasAttribute('aria-valuemax'),
    ).toBe(false);
  });

  it('tones an entry cell in place', () => {
    grid([received({ cellTones: [null, 'accent', 'danger'] })]);
    const cell = screen
      .getByRole('spinbutton', { name: 'Received $10' })
      .closest('td')!;
    expect(cell.className).toBe(
      'sw-denomination-entry sw-denomination-cell-toned sw-denomination-cell-tone-danger',
    );
    // An accent count is a suggestion or a change: the Stepper's changed look.
    const root = (name: string) =>
      screen.getByRole('spinbutton', { name }).closest('.sw-stepper')!;
    expect(root('Received $5').className).toContain('sw-stepper-changed');
    expect(root('Received $10').className).not.toContain('sw-stepper-changed');
  });

  it('disables a row: its entry, and the row for assistive technology', () => {
    grid([received({ disabled: true })]);
    const row = screen.getByRole('row', { name: /Received/ });
    expect(row.getAttribute('aria-disabled')).toBe('true');
    expect(row.className).toContain('sw-denomination-row-disabled');
    for (const count of within(row).getAllByRole('spinbutton'))
      expect((count as HTMLInputElement).disabled).toBe(true);
  });
});

describe('DenominationGrid captions and emphasis', () => {
  it('puts a row caption under the label and a column caption after its label', () => {
    grid([received(), lastCount]);
    const header = screen.getByRole('rowheader', { name: /Received/ });
    expect(header.textContent).toBe('Receivedfrom the field team$12.00');
    expect(within(header).getByText('from the field team').className).toBe(
      'sw-denomination-label-caption',
    );
    const strap = screen.getByRole('columnheader', { name: '$1 × 100' });
    expect(within(strap).getByText('× 100').className).toBe(
      'sw-denomination-head-caption',
    );
  });

  it('sets a quiet row apart and leaves a default row plain', () => {
    grid([received({ emphasis: 'default' }), lastCount]);
    expect(screen.getByRole('row', { name: /Last count/ }).className).toContain(
      'sw-denomination-row-quiet',
    );
    expect(
      screen.getByRole('row', { name: /Received/ }).className,
    ).not.toContain('sw-denomination-row-quiet');
  });

  it('keeps a label without a caption as it was', () => {
    grid([{ id: 'a', label: 'Seen', cells: [1, 2, 3] }]);
    const line = screen
      .getByRole('rowheader', { name: 'Seen' })
      .querySelector('.sw-denomination-label-line')!;
    expect(line.innerHTML).toBe(
      '<span class="sw-denomination-label-text">Seen</span>',
    );
  });
});

describe('DenominationGrid entry validation', () => {
  const quiet = () =>
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

  it('refuses entry outside the strip, and bad caps, messages and labels', () => {
    quiet();
    const tiles = () =>
      render(
        <DenominationGrid
          columns={columns}
          label="Nest count"
          layout="tiles"
          rows={[received()]}
        />,
      );
    expect(tiles).toThrow('entry rows need the strip layout');
    const entry = { ...buttons, onChange: vi.fn() };
    for (const bad of [
      { ...entry, max: [1, 2] },
      { ...entry, max: [1, -1, null] },
      { ...entry, max: [1, 1.5, null] },
      { ...entry, errors: ['a', null] },
      { ...entry, decrementLabel: ' ' },
    ])
      expect(() => grid([received({ entry: bad })])).toThrow(RangeError);
    vi.restoreAllMocks();
  });

  it('refuses blank captions and an unknown emphasis', () => {
    quiet();
    expect(() => grid([received({ caption: ' ' })])).toThrow(RangeError);
    expect(() =>
      render(
        <DenominationGrid
          columns={[{ key: 'one', label: '$1', caption: '' }]}
          label="Nest count"
          rows={[{ id: 'a', label: 'Seen', cells: [1] }]}
        />,
      ),
    ).toThrow(RangeError);
    expect(() => grid([received({ emphasis: 'loud' as 'quiet' })])).toThrow(
      RangeError,
    );
    expect(() =>
      grid([received({ disabled: 'yes' as unknown as boolean })]),
    ).toThrow(RangeError);
    for (const row of [
      lastCount,
      { ...lastCount, emphasis: undefined, disabled: true },
    ])
      expect(() =>
        render(
          <DenominationGrid
            columns={columns}
            label="Nest count"
            layout="tiles"
            rows={[row]}
          />,
        ),
      ).toThrow('quiet and disabled rows need the strip layout');
    vi.restoreAllMocks();
  });

  it('gives every count its own name and keeps entry counts whole and unsigned', () => {
    quiet();
    expect(() => grid([received(), received({ id: 'again' })])).toThrow(
      'entry rows need distinct labels',
    );
    expect(() =>
      render(
        <DenominationGrid
          columns={[
            { key: 'strap', label: '$1', caption: '× 100' },
            { key: 'loose', label: '$1' },
            { key: 'dup', label: '$1' },
          ]}
          label="Nest count"
          rows={[received()]}
        />,
      ),
    ).toThrow('entry rows need columns with distinct labels and captions');
    // A strap and a loose column of the same label are told apart by the caption.
    render(
      <DenominationGrid
        columns={[
          { key: 'strap', label: '$1', caption: '× 100' },
          { key: 'loose', label: '$1' },
          { key: 'five', label: '$5' },
        ]}
        label="Straps and loose"
        rows={[received()]}
      />,
    );
    expect(
      screen.getByRole('spinbutton', { name: 'Received $1' }),
    ).toBeTruthy();
    expect(() => grid([received({ cells: [1, -1, 0] })])).toThrow(
      'an entry row counts zero or more',
    );
    expect(() => grid([received({ signed: true })])).toThrow(
      'an entry row cannot be signed',
    );
    vi.restoreAllMocks();
  });
});

describe('DenominationGrid entry CSS', () => {
  const css = cssDenominationEntryClasses();

  it('is in the catalog and the stylesheet', () => {
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-denomination-entry',
        'sw-denomination-strip-entry',
        'sw-denomination-label-words',
        'sw-denomination-label-caption',
        'sw-denomination-head-caption',
        'sw-denomination-row-quiet',
        'sw-denomination-row-disabled',
      ]),
    );
    expect(generateStylesheet()).toContain(css);
  });

  it('tones an entry border unless its Stepper has an error, from tokens only', () => {
    expect(css).toContain(
      '.sw-denomination-cell-toned .sw-stepper:not(.sw-stepper-invalid) input.sw-stepper-input',
    );
    expect(css).toContain('background: var(--sw-color-subtle);');
    expect(css).toContain('opacity: var(--sw-disabled-opacity);');
    expect(css).not.toMatch(/#[0-9a-f]{3,6}\b/i);
  });
});
