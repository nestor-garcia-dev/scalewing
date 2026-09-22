import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { DenominationGrid } from './components/DenominationGrid.js';
import { denominationCellView } from './denomination-cells.js';

const columns = [
  { key: 'one', label: '$1' },
  { key: 'five', label: '$5' },
  { key: 'ten', label: '$10' },
] as const;

afterEach(() => cleanup());

describe('denominationCellView', () => {
  it('renders zero and null as the zero label, signs deltas, and keeps magnitudes plain', () => {
    expect(denominationCellView(0, false, '—')).toEqual({
      state: 'zero',
      text: '—',
    });
    expect(denominationCellView(null, true, '–')).toEqual({
      state: 'zero',
      text: '–',
    });
    expect(denominationCellView(7, false, '—')).toEqual({
      state: 'positive',
      text: '7',
    });
    expect(denominationCellView(7, true, '—')).toEqual({
      state: 'positive',
      text: '+7',
    });
    expect(denominationCellView(-3, true, '—')).toEqual({
      state: 'negative',
      text: '-3',
    });
  });
});

describe('DenominationGrid strip', () => {
  it('renders a captioned table with column headers, row headers, tones, signed cells, and totals', () => {
    render(
      <DenominationGrid
        columns={columns}
        label="Cash movement by note"
        rows={[
          {
            id: 'in',
            label: 'Received',
            tone: 'success',
            icon: <svg aria-hidden="true" />,
            cells: [2, 0, 1],
            total: '+$12',
          },
          {
            id: 'net',
            label: 'Net',
            cells: [2, -1, null],
            signed: true,
            total: '-$3',
          },
        ]}
      />,
    );
    const table = screen.getByRole('table', { name: 'Cash movement by note' });
    expect(table.className).toBe('sw-denomination-grid sw-denomination-strip');
    expect(
      within(table)
        .getAllByRole('columnheader')
        .map((cell) => cell.textContent),
    ).toEqual(['$1', '$5', '$10']);
    const received = within(table).getByRole('row', { name: /Received/ });
    expect(received.className).toContain('sw-denomination-row-success');
    expect(
      within(received)
        .getAllByRole('cell')
        .map((cell) => [cell.className, cell.textContent]),
    ).toEqual([
      ['sw-denomination-cell sw-denomination-cell-positive', '2'],
      ['sw-denomination-cell sw-denomination-cell-zero', '—'],
      ['sw-denomination-cell sw-denomination-cell-positive', '1'],
      ['sw-denomination-total', '+$12'],
    ]);
    const net = within(table).getByRole('row', { name: /Net/ });
    expect(net.className).toContain('sw-denomination-row-neutral');
    expect(net.className).toContain('sw-denomination-row-signed');
    expect(
      within(net)
        .getAllByRole('cell')
        .map((cell) => cell.textContent),
    ).toEqual(['+2', '-1', '—', '-$3']);
    expect(within(net).getByRole('rowheader').textContent).toBe('Net-$3');
    expect(table.querySelector('.sw-denomination-icon')).not.toBeNull();
  });

  it('omits the total column when no row has a total', () => {
    render(
      <DenominationGrid
        columns={columns}
        label="Notes"
        rows={[{ id: 'a', label: 'Counted', cells: [1, 1, 1] }]}
      />,
    );
    const row = screen.getByRole('row', { name: /Counted/ });
    expect(within(row).getAllByRole('cell')).toHaveLength(3);
    expect(document.querySelector('.sw-denomination-total')).toBeNull();
  });
});

describe('DenominationGrid tiles', () => {
  it('renders one labeled tile per column with the count and a consumer-formatted subtotal', () => {
    render(
      <DenominationGrid
        columns={columns}
        label="Expected notes"
        layout="tiles"
        rows={[{ id: 'expected', label: 'Expected', cells: [12, 0, 3] }]}
        subtotal={(count, column) => `${count} × ${column.label}`}
        zeroLabel="none"
      />,
    );
    const group = screen.getByRole('group', { name: 'Expected notes' });
    expect(group.className).toBe('sw-denomination-grid sw-denomination-tiles');
    const tiles = within(group).getAllByRole('listitem');
    expect(tiles.map((tile) => tile.textContent)).toEqual([
      '$11212 × $1',
      '$5nonenone',
      '$1033 × $10',
    ]);
    expect(within(group).queryByText('Expected')).toBeNull();
  });

  it('labels each row when there are several rows or an icon', () => {
    render(
      <DenominationGrid
        columns={columns}
        label="Drawer"
        layout="tiles"
        rows={[
          { id: 'expected', label: 'Expected', cells: [1, 2, 3] },
          {
            id: 'counted',
            label: 'Counted',
            cells: [1, 2, 2],
            tone: 'danger',
            total: 'Short $10',
          },
        ]}
      />,
    );
    expect(screen.getByRole('region', { name: 'Expected' })).toBeTruthy();
    const counted = screen.getByRole('region', { name: 'Counted' });
    expect(counted.className).toContain('sw-denomination-row-danger');
    expect(within(counted).getByText('Short $10').className).toBe(
      'sw-denomination-total',
    );
  });
});

describe('DenominationGrid validation', () => {
  const rows = [{ id: 'a', label: 'A', cells: [1, 2, 3] }];
  const cases: Array<[string, () => void]> = [
    [
      'empty label',
      () =>
        render(<DenominationGrid columns={columns} label=" " rows={rows} />),
    ],
    [
      'no columns',
      () => render(<DenominationGrid columns={[]} label="x" rows={[]} />),
    ],
    [
      'duplicate column keys',
      () =>
        render(
          <DenominationGrid
            columns={[
              { key: 'a', label: '1' },
              { key: 'a', label: '2' },
            ]}
            label="x"
            rows={[]}
          />,
        ),
    ],
    [
      'cell count mismatch',
      () =>
        render(
          <DenominationGrid
            columns={columns}
            label="x"
            rows={[{ id: 'a', label: 'A', cells: [1] }]}
          />,
        ),
    ],
    [
      'fractional cell',
      () =>
        render(
          <DenominationGrid
            columns={columns}
            label="x"
            rows={[{ id: 'a', label: 'A', cells: [1.5, 0, 0] }]}
          />,
        ),
    ],
    [
      'duplicate row ids',
      () =>
        render(
          <DenominationGrid
            columns={columns}
            label="x"
            rows={[...rows, ...rows]}
          />,
        ),
    ],
    [
      'empty zero label',
      () =>
        render(
          <DenominationGrid
            columns={columns}
            label="x"
            rows={rows}
            zeroLabel=""
          />,
        ),
    ],
  ];
  it.each(cases)('rejects %s', (_name, renderCase) => {
    expect(renderCase).toThrow(RangeError);
  });
});
