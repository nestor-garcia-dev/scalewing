import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { DenominationGrid } from './components/DenominationGrid.js';
import { cssDenominationGridClasses } from './css/css-denomination-grid.js';
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
      text: '\u22123',
    });
  });

  it('writes a negative count with the typographic minus, signed or not', () => {
    expect(denominationCellView(-1, true, '—').text).toBe('−1');
    expect(denominationCellView(-12, false, '—').text).toBe('−12');
  });

  it('renders a negative count with the typographic minus in an unsigned tiles row', () => {
    const { container } = render(
      <DenominationGrid
        columns={columns}
        label="Drawer"
        layout="tiles"
        rows={[
          { id: 'expected', label: 'Expected', cells: [1, 2, 3] },
          { id: 'difference', label: 'Difference', cells: [0, -2, 1] },
        ]}
      />,
    );
    const negative = container.querySelector('.sw-denomination-cell-negative');
    expect(negative?.textContent).toBe('−2');
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
    const region = screen.getByRole('group', { name: 'Cash movement by note' });
    expect(region.className).toBe('sw-denomination-scroll');
    expect(region.tabIndex).toBe(0);
    expect(region.firstElementChild).toBe(table);
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
    ).toEqual(['+2', '−1', '—', '-$3']);
    expect(within(net).getByRole('rowheader').textContent).toBe('Net-$3');
    expect(
      within(net).getByRole('rowheader').firstElementChild?.className,
    ).toBe('sw-denomination-label-body');
    expect(table.querySelector('.sw-denomination-icon')).not.toBeNull();
  });

  it('names the total column with a visually hidden header when totalLabel is given', () => {
    render(
      <DenominationGrid
        columns={columns}
        label="Cash flow"
        rows={[
          { id: 'in', label: 'In', cells: [0, 1, 0], total: '+$5' },
          { id: 'out', label: 'Out', cells: [0, 0, 0] },
        ]}
        totalLabel="Total"
      />,
    );
    const table = screen.getByRole('table', { name: 'Cash flow' });
    const heads = within(table).getAllByRole('columnheader');
    expect(heads.map((cell) => cell.textContent)).toEqual([
      '$1',
      '$5',
      '$10',
      'Total',
    ]);
    const totalHead = heads[3]!;
    expect(totalHead.getAttribute('scope')).toBe('col');
    expect(totalHead.className).toBe('sw-denomination-total-head');
    expect(totalHead.firstElementChild?.className).toBe('sw-sr-only');
    // The total cell keeps its text in the table at every width; below md
    // only its inner copy is visually hidden (see the stylesheet test).
    const total = within(
      within(table).getByRole('row', { name: /In/ }),
    ).getAllByRole('cell')[3]!;
    expect(total.textContent).toBe('+$5');
    expect(total.firstElementChild?.className).toBe(
      'sw-denomination-total-value',
    );
    expect(
      within(within(table).getByRole('row', { name: /Out/ }))
        .getAllByRole('cell')
        .at(-1)?.textContent,
    ).toBe('');
  });

  it('keeps the empty corner over the totals without a totalLabel', () => {
    render(
      <DenominationGrid
        columns={columns}
        label="Cash flow"
        rows={[{ id: 'in', label: 'In', cells: [0, 1, 0], total: '+$5' }]}
      />,
    );
    expect(screen.getAllByRole('columnheader')).toHaveLength(3);
    const corners = document.querySelectorAll('thead .sw-denomination-corner');
    expect(corners).toHaveLength(2);
    // The unnamed total corner still collapses below md with the column.
    expect(corners[1]?.className).toBe(
      'sw-denomination-corner sw-denomination-total-head',
    );
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

  it('names a lone plain row only by the grid, not by a second region', () => {
    render(
      <DenominationGrid
        columns={columns}
        label="Expected from last close"
        layout="tiles"
        rows={[
          {
            id: 'expected',
            label: 'Expected from last close',
            cells: [1, 2, 3],
          },
        ]}
      />,
    );
    const group = screen.getByRole('group', {
      name: 'Expected from last close',
    });
    // Teisoro SDAY-31: the row was also a region with the grid's name.
    expect(screen.queryByRole('region')).toBeNull();
    const row = group.querySelector('.sw-denomination-row');
    expect(row).not.toBeNull();
    expect(row!.hasAttribute('aria-label')).toBe(false);
    expect(within(group).getAllByRole('listitem')).toHaveLength(3);
  });

  it("keeps a lone plain row's own name when it differs from the grid's", () => {
    render(
      <DenominationGrid
        columns={columns}
        label="Drawer count"
        layout="tiles"
        rows={[{ id: 'expected', label: 'Expected', cells: [1, 2, 3] }]}
      />,
    );
    // Nothing on screen says "Expected" (the label line is hidden), so the
    // row keeps it as its region's name (review of PR #75).
    const group = screen.getByRole('group', { name: 'Drawer count' });
    expect(
      within(group).getByRole('region', { name: 'Expected' }),
    ).toBeTruthy();
  });

  it("shows a single row's total, with its label, even without an icon", () => {
    render(
      <DenominationGrid
        columns={columns}
        label="Cash received"
        layout="tiles"
        rows={[
          { id: 'received', label: 'Received', cells: [0, 2, 1], total: '$20' },
        ]}
      />,
    );
    const row = screen.getByRole('region', { name: 'Received' });
    expect(within(row).getByText('$20').className).toBe(
      'sw-denomination-total',
    );
    expect(within(row).getByText('Received').className).toBe(
      'sw-denomination-label-text',
    );
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

describe('DenominationGrid cellTones', () => {
  it('tones one tile in place, its count and its border, and leaves the rest', () => {
    render(
      <DenominationGrid
        columns={columns}
        label="In the vault"
        layout="tiles"
        rows={[
          {
            id: 'vault',
            label: 'In the vault',
            cells: [12, 0, 40],
            cellTones: [null, 'warning', 'danger'],
          },
        ]}
      />,
    );
    const tiles = screen.getAllByRole('listitem');
    expect(tiles.map((tile) => tile.className)).toEqual([
      'sw-denomination-tile',
      'sw-denomination-tile sw-denomination-cell-toned sw-denomination-cell-tone-warning',
      'sw-denomination-tile sw-denomination-cell-toned sw-denomination-cell-tone-danger',
    ]);
    // The toned tile stays in its row, in its column's order.
    expect(tiles[2]!.textContent).toBe('$1040');
  });

  it('tones a strip cell over its signed color, and neutral or null adds nothing', () => {
    render(
      <DenominationGrid
        columns={columns}
        label="Cash flow"
        rows={[
          {
            id: 'net',
            label: 'Net',
            cells: [2, -1, 0],
            signed: true,
            cellTones: ['neutral', 'accent', null],
          },
        ]}
      />,
    );
    const cells = within(screen.getByRole('row', { name: /Net/ })).getAllByRole(
      'cell',
    );
    expect(cells.map((cell) => cell.className)).toEqual([
      'sw-denomination-cell sw-denomination-cell-positive',
      'sw-denomination-cell sw-denomination-cell-negative sw-denomination-cell-toned sw-denomination-cell-tone-accent',
      'sw-denomination-cell sw-denomination-cell-zero',
    ]);
  });

  it('rejects cellTones of the wrong length or with an unknown tone', () => {
    const grid = (cellTones: readonly (string | null)[]) => (
      <DenominationGrid
        columns={columns}
        label="Drawer"
        layout="tiles"
        rows={[
          {
            id: 'a',
            label: 'A',
            cells: [1, 2, 3],
            cellTones: cellTones as readonly ('danger' | null)[],
          },
        ]}
      />
    );
    expect(() => render(grid(['danger', null]))).toThrow(RangeError);
    expect(() => render(grid([null, 'red', null]))).toThrow(RangeError);
    // eslint-disable-next-line no-sparse-arrays -- a sparse array from JS
    expect(() => render(grid([, 'danger', null]))).toThrow(RangeError);
    expect(() =>
      render(grid(null as unknown as readonly (string | null)[])),
    ).toThrow(RangeError);
  });

  it('generates a tone per cell from the Badge tones, over zero and signed colors', () => {
    const css = cssDenominationGridClasses();
    expect(css).toContain(
      '.sw-denomination-cell-tone-danger { --sw-denomination-cell-tone: var(--sw-color-danger); }',
    );
    expect(css).not.toContain('sw-denomination-cell-tone-neutral');
    // A toned zero stays GrayText in forced colors, not a count's CanvasText.
    expect(css).toContain(
      '.sw-denomination-grid .sw-denomination-cell-toned .sw-denomination-cell-zero { color: GrayText; }',
    );
    expect(css)
      .toContain(`.sw-denomination-grid .sw-denomination-cell.sw-denomination-cell-toned,
.sw-denomination-grid .sw-denomination-cell-toned .sw-denomination-cell {
  color: var(--sw-denomination-cell-tone);
  opacity: 1;
}`);
    expect(css).toContain(`.sw-denomination-tile.sw-denomination-cell-toned {
  border-color: var(--sw-denomination-cell-tone);
  box-shadow: inset 0 0 0 1px var(--sw-denomination-cell-tone);
}`);
  });
});

describe('DenominationGrid rowRole', () => {
  const rows = [
    { id: 'expected', label: 'Expected', cells: [1, 2, 3] },
    { id: 'counted', label: 'Counted', cells: [1, 2, 2] },
  ];

  it('makes each named tiles row a region by default', () => {
    render(
      <DenominationGrid
        columns={columns}
        label="Drawer"
        layout="tiles"
        rows={rows}
      />,
    );
    expect(screen.getAllByRole('region').map((row) => row.ariaLabel)).toEqual([
      'Expected',
      'Counted',
    ]);
    expect(
      screen.getByRole('region', { name: 'Counted' }).getAttribute('role'),
    ).toBeNull();
  });

  it('keeps each row named but out of the landmarks at rowRole="group"', () => {
    render(
      <DenominationGrid
        columns={columns}
        label="Drawer"
        layout="tiles"
        rowRole="group"
        rows={rows}
      />,
    );
    expect(screen.queryByRole('region')).toBeNull();
    const grid = screen.getByRole('group', { name: 'Drawer' });
    const expected = within(grid).getByRole('group', { name: 'Expected' });
    expect(expected.tagName).toBe('SECTION');
    expect(expected.className).toContain('sw-denomination-row');
    expect(within(expected).getAllByRole('listitem')).toHaveLength(3);
    expect(within(grid).getByRole('group', { name: 'Counted' })).toBeTruthy();
  });

  it('leaves a lone plain row unnamed and without a role at rowRole="group"', () => {
    const { container } = render(
      <DenominationGrid
        columns={columns}
        label="Drawer count"
        layout="tiles"
        rowRole="group"
        rows={[{ id: 'only', label: 'Drawer count', cells: [1, 0, 2] }]}
      />,
    );
    const row = container.querySelector('section')!;
    expect(row.getAttribute('role')).toBeNull();
    expect(row.getAttribute('aria-label')).toBeNull();
    expect(screen.getAllByRole('group')).toHaveLength(1);
  });

  it('ignores rowRole in the strip, whose rows are table rows', () => {
    render(
      <DenominationGrid
        columns={columns}
        label="Cash flow"
        rowRole="group"
        rows={rows}
      />,
    );
    const table = screen.getByRole('table', { name: 'Cash flow' });
    expect(within(table).getByRole('row', { name: /Counted/ })).toBeTruthy();
    expect(within(table).queryByRole('group')).toBeNull();
  });

  it('rejects an unknown rowRole', () => {
    expect(() =>
      render(
        <DenominationGrid
          columns={columns}
          label="Drawer"
          layout="tiles"
          rowRole={'landmark' as 'region'}
          rows={rows}
        />,
      ),
    ).toThrow(RangeError); // The strip ignores a valid rowRole but still rejects an unknown one.
    expect(() =>
      render(
        <DenominationGrid
          columns={columns}
          label="Drawer"
          rowRole={'landmark' as 'region'}
          rows={rows}
        />,
      ),
    ).toThrow(RangeError);
  });
});

describe('DenominationGrid row label line', () => {
  const row = {
    id: 'short',
    label: 'Audit shortage',
    tone: 'danger' as const,
    icon: <svg aria-hidden="true" data-testid="glyph" />,
    cells: [1, 0, 0],
    total: '-$1',
  };

  it('keeps the strip row glyph and words in one line, the total after it', () => {
    render(<DenominationGrid columns={columns} label="Drawer" rows={[row]} />);
    const header = screen.getByRole('rowheader');
    const body = header.firstElementChild!;
    expect(body.className).toBe('sw-denomination-label-body');
    const line = body.firstElementChild!;
    expect(line.className).toBe('sw-denomination-label-line');
    expect([...line.children].map((child) => child.className)).toEqual([
      'sw-denomination-icon',
      'sw-denomination-label-text',
    ]);
    expect(line.firstElementChild?.getAttribute('aria-hidden')).toBe('true');
    expect(body.lastElementChild?.className).toBe(
      'sw-denomination-total-inline',
    );
  });

  it('keeps a tiles row glyph and words in one line too', () => {
    render(
      <DenominationGrid
        columns={columns}
        label="Drawer"
        layout="tiles"
        rows={[row]}
      />,
    );
    const line = screen.getByTestId('glyph').parentElement!.parentElement!;
    expect(line.className).toBe('sw-denomination-label-line');
    expect(line.parentElement?.className).toBe('sw-denomination-label');
    expect(line.nextElementSibling?.className).toBe('sw-denomination-total');
  });

  it('never wraps the line, so its words wrap beside the glyph', () => {
    const css = cssDenominationGridClasses();
    const start = css.indexOf('.sw-denomination-label-line {');
    const rule = css.slice(start, css.indexOf('}', start));
    expect(rule).toContain('display: flex;');
    expect(rule).not.toContain('flex-wrap');
    // Teisoro DRW-28: below md the body stacks the line over the phone
    // total; the line itself stays a row, with a narrower gap.
    const phone = css.slice(
      css.indexOf('@media not all and (min-width: 48rem)'),
    );
    expect(phone).toContain(
      '.sw-denomination-label-body { flex-direction: column;',
    );
    expect(phone).toContain(
      '.sw-denomination-strip .sw-denomination-label-line { gap: var(--sw-space-1); }',
    );
    // Only the strip's pinned label column narrows its gap; a tiles row's
    // label keeps 8 px at every width, as before (review of PR #83).
    expect(phone).not.toMatch(/\n\s*\.sw-denomination-label-line \{/);
    expect(phone).not.toContain(
      '.sw-denomination-tiles .sw-denomination-label-line',
    );
    expect(phone).not.toMatch(/\.sw-denomination-label-line \{[^}]*column/);
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
      'blank total label',
      () =>
        render(
          <DenominationGrid
            columns={columns}
            label="x"
            rows={rows}
            totalLabel=" "
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
