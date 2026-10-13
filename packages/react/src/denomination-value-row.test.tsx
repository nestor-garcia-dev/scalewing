import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  DenominationGrid,
  type DenominationGridProps,
  type DenominationGridRow,
} from './components/DenominationGrid.js';
import { cssDenominationValueRowClasses } from './css/css-denomination-value-row.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => cleanup());

const columns = [
  { key: 'one', label: '$1' },
  { key: 'five', label: '$5' },
  { key: 'ten', label: '$10' },
];

const buttons = { decrementLabel: 'One less', incrementLabel: 'One more' };

function counted(overrides: Partial<DenominationGridRow> = {}) {
  return {
    id: 'counted',
    label: 'Counted',
    cells: [2, null, 3],
    total: '$32',
    entry: { ...buttons, onChange: vi.fn(), placeholder: '0' },
    valueRow: { label: 'Value', cells: ['$2', null, '$30'] },
    ...overrides,
  } satisfies DenominationGridRow;
}

function grid(
  rows: readonly DenominationGridRow[],
  props: Partial<DenominationGridProps> = {},
) {
  return render(
    <DenominationGrid
      columns={columns}
      label="Nest count"
      rows={rows}
      totalLabel="Total"
      {...props}
    />,
  );
}

function bodyRows() {
  return within(screen.getByRole('table')).getAllByRole('row').slice(1);
}

describe('DenominationGrid valueRow', () => {
  it('adds a named value line under its row, centred values and the total on it', () => {
    grid([counted()]);
    const [counts, values] = bodyRows();
    expect(values!.className).toBe(
      'sw-denomination-row sw-denomination-value-row sw-denomination-row-neutral',
    );
    expect(
      within(values!).getByRole('rowheader', { name: 'Counted Value' }),
    ).toBeTruthy();
    const cells = within(values!).getAllByRole('cell');
    expect(cells.map((cell) => cell.textContent)).toEqual([
      '$2',
      '',
      '$30',
      '$32',
    ]);
    expect(cells[0]!.className).toBe('sw-denomination-value');
    // The phone total sits under the value line's name, not the counts'.
    expect(
      values!.querySelector('.sw-denomination-total-inline')!.textContent,
    ).toBe('$32');
    expect(counts!.querySelector('.sw-denomination-total-inline')).toBeNull();
    const countTotal = within(counts!).getAllByRole('cell').at(-1)!;
    expect(countTotal.className).toBe('sw-denomination-total');
    expect(countTotal.textContent).toBe('');
  });

  it('describes each entry count by its value, never a tab stop of its own', () => {
    grid([counted()]);
    const [one, five, ten] = screen.getAllByRole('spinbutton');
    const describedBy = (count: HTMLElement) =>
      (count.getAttribute('aria-describedby') ?? '')
        .split(' ')
        .filter(Boolean)
        .map((id) => document.getElementById(id)?.textContent);
    expect(describedBy(one!)).toEqual(['$2']);
    // A blank value describes nothing.
    expect(five!.hasAttribute('aria-describedby')).toBe(false);
    expect(describedBy(ten!)).toEqual(['$30']);
    expect(
      screen
        .getAllByRole('cell')
        .filter((cell) => cell.className === 'sw-denomination-value')
        .every((cell) => !cell.hasAttribute('tabindex')),
    ).toBe(true);
  });

  it("keeps an entry count's error after its value in the description", () => {
    grid([
      counted({
        entry: {
          ...buttons,
          onChange: vi.fn(),
          errors: ['Only 1 in the drawer', null, null],
        },
      }),
    ]);
    const one = screen.getAllByRole('spinbutton')[0]!;
    const ids = one.getAttribute('aria-describedby')!.split(' ');
    expect(ids).toHaveLength(2);
    expect(document.getElementById(ids[0]!)!.textContent).toBe('$2');
    expect(document.getElementById(ids[1]!)!.textContent).toBe(
      'Only 1 in the drawer',
    );
  });

  it('gives a read-only row a value line too, toned and disabled with its row', () => {
    grid([
      counted(),
      {
        id: 'expected',
        label: 'Expected',
        cells: [1, 0, 3],
        total: '$31',
        tone: 'danger',
        disabled: true,
        valueRow: { label: 'Value', cells: ['$1', '', '$30'] },
      },
    ]);
    const rows = bodyRows();
    expect(rows).toHaveLength(4);
    const values = rows[3]!;
    expect(values.className).toContain('sw-denomination-row-danger');
    expect(values.getAttribute('aria-disabled')).toBe('true');
    expect(
      within(values)
        .getAllByRole('cell')
        .map((cell) => cell.textContent),
    ).toEqual(['$1', '', '$30', '$31']);
    // Two grids keep their value ids apart.
    cleanup();
    render(
      <>
        <DenominationGrid columns={columns} label="A" rows={[counted()]} />
        <DenominationGrid columns={columns} label="B" rows={[counted()]} />
      </>,
    );
    const ids = screen
      .getAllByRole('spinbutton')
      .map((count) => count.getAttribute('aria-describedby'))
      .filter(Boolean);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('describes nothing by a blank value, and takes a null valueRow as none', () => {
    grid([counted({ valueRow: { label: 'Value', cells: ['', '  ', '$30'] } })]);
    const [one, five, ten] = screen.getAllByRole('spinbutton');
    expect(one!.hasAttribute('aria-describedby')).toBe(false);
    expect(five!.hasAttribute('aria-describedby')).toBe(false);
    expect(ten!.hasAttribute('aria-describedby')).toBe(true);
    expect(
      within(bodyRows()[1]!)
        .getAllByRole('cell')
        .map((cell) => cell.textContent),
    ).toEqual(['', '', '$30', '$32']);
    cleanup();
    // An untyped consumer's null is no line, as undefined is.
    const none: unknown = null;
    grid([counted({ valueRow: none as DenominationGridRow['valueRow'] })]);
    expect(bodyRows()).toHaveLength(1);
  });

  it('leaves a row without a value line as before', () => {
    grid([counted({ valueRow: undefined })]);
    expect(bodyRows()).toHaveLength(1);
    expect(
      screen
        .getAllByRole('spinbutton')
        .some((count) => count.hasAttribute('aria-describedby')),
    ).toBe(false);
    expect(
      within(bodyRows()[0]!).getAllByRole('cell').at(-1)!.textContent,
    ).toBe('$32');
  });

  it('fails closed on a value line it cannot draw', () => {
    const bad =
      (valueRow: unknown, props: Partial<DenominationGridProps> = {}) =>
      () =>
        grid(
          [counted({ valueRow: valueRow as DenominationGridRow['valueRow'] })],
          props,
        );
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(bad({ label: ' ', cells: ['$2', null, '$30'] })).toThrow(
      'a value row needs a label',
    );
    expect(bad({ label: 'Value', cells: ['$2'] })).toThrow(
      'a value row needs one string or null per column',
    );
    expect(bad({ label: 'Value', cells: ['$2', 5, '$30'] })).toThrow(
      RangeError,
    );
    // eslint-disable-next-line no-sparse-arrays
    expect(bad({ label: 'Value', cells: ['$2', , '$30'] })).toThrow(RangeError);
    expect(bad({ label: 'Value', cells: 'abc' })).toThrow(RangeError);
    expect(bad('Value')).toThrow('a value row is an object of label and cells');
    expect(() =>
      render(
        <DenominationGrid
          columns={columns}
          label="Nest count"
          layout="tiles"
          rows={[
            {
              id: 'counted',
              label: 'Counted',
              cells: [1, 2, 3],
              valueRow: { label: 'Value', cells: ['$1', '$10', '$30'] },
            },
          ]}
        />,
      ),
    ).toThrow('value rows need the strip layout');
    vi.restoreAllMocks();
  });
});

describe('DenominationGrid value row CSS', () => {
  const css = generateStylesheet();

  it('puts the line on the subtle fill with centred tabular values, after the frame', () => {
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-denomination-value-row',
        'sw-denomination-value',
      ]),
    );
    const rules = cssDenominationValueRowClasses();
    expect(css).toContain(rules);
    expect(rules).toContain(
      '.sw-denomination-strip .sw-denomination-value-row .sw-denomination-label {\n  background: var(--sw-color-subtle);\n}',
    );
    expect(rules).toContain('font-variant-numeric: tabular-nums;');
    expect(rules).toContain('text-align: center;');
    expect(rules).toContain('background: Canvas;');
    expect(rules).toContain(
      '.sw-denomination-strip .sw-denomination-value-row.sw-denomination-row-disabled .sw-denomination-value {\n  opacity: var(--sw-disabled-opacity);\n}',
    );
    expect(css.indexOf(rules)).toBeGreaterThan(
      css.indexOf('.sw-denomination-scroll-framed {'),
    );
  });
});
