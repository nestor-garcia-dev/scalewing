import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  DenominationGrid,
  denominationNegativeAppearances,
  denominationTransposeBreakpoints,
} from './components/DenominationGrid.js';
import { breakpointQuery } from './css/breakpoints.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

let narrow = true;

beforeEach(() => {
  narrow = true;
  vi.stubGlobal('matchMedia', (query: string) => ({
    get matches() {
      return query === breakpointQuery('below', 'md') ? narrow : false;
    },
    media: query,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  }));
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const columns = [
  { key: 'one', label: '1' },
  { key: 'five', label: '5', caption: '× 20' },
];

describe('DenominationGrid negativeAppearance', () => {
  it('draws a plain row’s negative counts in the text colour, with the minus', () => {
    narrow = false;
    render(
      <DenominationGrid
        columns={columns}
        label="Feathers"
        rows={[
          {
            id: 'out',
            label: 'Shed',
            cells: [-3, -1],
            negativeAppearance: 'plain',
          },
          { id: 'short', label: 'Lost', cells: [-2, 0] },
        ]}
      />,
    );
    const shed = within(screen.getByRole('row', { name: /Shed/ }))
      .getAllByRole('cell')
      .map((cell) => cell.className);
    expect(shed[0]).toBe(
      'sw-denomination-cell sw-denomination-cell-negative sw-denomination-cell-plain',
    );
    expect(screen.getByText('−3')).toBeTruthy();
    const lost = within(screen.getByRole('row', { name: /Lost/ })).getAllByRole(
      'cell',
    )[0];
    expect(lost?.className).toBe(
      'sw-denomination-cell sw-denomination-cell-negative',
    );
    expect(denominationNegativeAppearances).toEqual(['danger', 'plain']);
    expect(generateStylesheet()).toContain(
      '.sw-denomination-cell-negative.sw-denomination-cell-plain {\n  color: var(--sw-color-text);\n}',
    );
  });
});

describe('DenominationGrid transposeBelow', () => {
  const rows = [
    { id: 'in', label: 'Collected', cells: [12, 3], total: '27' },
    {
      id: 'out',
      label: 'Released',
      cells: [-4, -1],
      signed: true,
      negativeAppearance: 'plain' as const,
      total: '−9',
      tone: 'neutral' as const,
    },
  ];

  it('is the strip from md up, and transposed below it', () => {
    narrow = false;
    const { rerender, container } = render(
      <DenominationGrid
        columns={columns}
        label="Pebbles"
        rows={rows}
        totalLabel="Total"
        transposeBelow="md"
      />,
    );
    expect(container.querySelector('.sw-denomination-strip')).not.toBeNull();
    narrow = true;
    rerender(
      <DenominationGrid
        columns={columns}
        label="Pebbles"
        rows={[...rows]}
        totalLabel="Total"
        transposeBelow="md"
      />,
    );
    expect(container.querySelector('.sw-denomination-strip')).toBeNull();
    expect(
      container.querySelector('.sw-denomination-transposed'),
    ).not.toBeNull();
    expect(denominationTransposeBreakpoints).toEqual(['md', 'lg']);
  });

  it('puts a row per denomination and a column per grid row, totals last', () => {
    render(
      <DenominationGrid
        columns={columns}
        label="Pebbles"
        rows={rows}
        totalLabel="Total"
        transposeBelow="md"
      />,
    );
    const table = screen.getByRole('table', { name: 'Pebbles' });
    const heads = within(table)
      .getAllByRole('columnheader')
      .map((head) => head.textContent);
    expect(heads).toEqual(['Collected', 'Released']);
    const five = screen.getByRole('row', { name: /5 × 20/ });
    expect(
      within(five)
        .getAllByRole('cell')
        .map((cell) => cell.textContent),
    ).toEqual(['3', '−1']);
    const released = within(five).getAllByRole('cell')[1];
    expect(released?.className).toContain('sw-denomination-cell-plain');
    const total = screen.getByRole('row', { name: /Total/ });
    expect(
      within(total)
        .getAllByRole('cell')
        .map((cell) => cell.textContent),
    ).toEqual(['27', '−9']);
  });

  it('keeps entry steppers named by row and column, a value line beside them', () => {
    const onChange = vi.fn();
    render(
      <DenominationGrid
        columns={columns}
        label="Keep on hand"
        rows={[
          {
            id: 'keep',
            label: 'Keep',
            cells: [40, null],
            entry: {
              onChange,
              decrementLabel: 'One less',
              incrementLabel: 'One more',
            },
            valueRow: { label: 'Value', cells: ['40', null] },
            total: '40',
          },
        ]}
        totalLabel="Total"
        transposeBelow="md"
      />,
    );
    const one = screen.getByRole('spinbutton', { name: 'Keep 1' });
    expect(one).toHaveProperty('value', '40');
    expect(
      document.getElementById(one.getAttribute('aria-describedby') ?? '')
        ?.textContent,
    ).toBe('40');
    expect(
      screen.getByRole('spinbutton', { name: 'Keep 5 × 20' }),
    ).toBeTruthy();
    expect(
      screen.getByRole('columnheader', { name: 'Keep Value' }).textContent,
    ).toBe('Value');
    const total = screen.getByRole('row', { name: /Total/ });
    expect(
      within(total)
        .getAllByRole('cell')
        .map((cell) => cell.textContent),
    ).toEqual(['', '40']);
  });
});

describe('DenominationGrid transposed quiet and disabled rows', () => {
  it('fills a quiet column, and fades a disabled one and says so on its heads', () => {
    render(
      <DenominationGrid
        columns={columns}
        label="Pebbles"
        rows={[
          {
            id: 'keep',
            label: 'Keep',
            cells: [1, 2],
            emphasis: 'quiet',
            entry: {
              onChange: vi.fn(),
              decrementLabel: 'One less',
              incrementLabel: 'One more',
            },
          },
          {
            id: 'back',
            label: 'Returned',
            cells: [3, null],
            disabled: true,
            cellTones: ['danger', null],
            valueRow: { label: 'Value', cells: ['3', null] },
            total: '3',
          },
        ]}
        transposeBelow="md"
      />,
    );
    const keepHead = screen.getByRole('columnheader', { name: 'Keep' });
    expect(keepHead.className).toContain('sw-denomination-transposed-quiet');
    const entry = screen
      .getByRole('spinbutton', { name: 'Keep 1' })
      .closest('td');
    expect(entry?.className).toContain('sw-denomination-transposed-quiet');
    const returned = screen.getByRole('columnheader', { name: 'Returned' });
    expect(returned.getAttribute('aria-disabled')).toBe('true');
    expect(
      screen
        .getByRole('columnheader', { name: 'Returned Value' })
        .getAttribute('aria-disabled'),
    ).toBe('true');
    const toned = screen.getByText('3', {
      selector: '.sw-denomination-cell-value',
    });
    expect(toned.closest('td')?.className).toContain(
      'sw-denomination-transposed-disabled',
    );
    // The fade outranks a toned count's full strength.
    expect(generateStylesheet()).toContain(
      '.sw-denomination-grid.sw-denomination-transposed .sw-denomination-transposed-disabled:is(',
    );
  });

  it('transposes below lg on request, and leaves the totals row unnamed without totalLabel', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query === breakpointQuery('below', 'lg'),
      media: query,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    }));
    const { container } = render(
      <DenominationGrid
        columns={columns}
        label="Pebbles"
        rows={[{ id: 'a', label: 'A', cells: [1, 2], total: '11' }]}
        transposeBelow="lg"
      />,
    );
    expect(
      container.querySelector('.sw-denomination-transposed'),
    ).not.toBeNull();
    const foot = container.querySelector('tfoot tr')!;
    expect(foot.firstElementChild?.className).toBe('sw-denomination-corner');
    expect(foot.textContent).toBe('11');
  });
});

describe('DenominationGrid countDigits', () => {
  it('gives entry counts room for that many digits', () => {
    narrow = false;
    const { container } = render(
      <DenominationGrid
        columns={columns}
        countDigits={4}
        label="Keep on hand"
        rows={[
          {
            id: 'keep',
            label: 'Keep',
            cells: [1200, 5],
            entry: {
              onChange: vi.fn(),
              decrementLabel: 'One less',
              incrementLabel: 'One more',
            },
          },
        ]}
      />,
    );
    const table = container.querySelector('table')!;
    expect(table.classList).toContain('sw-denomination-count-digits');
    expect(table.style.getPropertyValue('--sw-denomination-count-digits')).toBe(
      '4',
    );
    expect(generateStylesheet()).toContain(
      'minmax(calc(var(--sw-denomination-count-digits) * 1ch + 2 * var(--sw-space-1) + 2px), 1fr)',
    );
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-denomination-count-digits',
        'sw-denomination-transposed',
        'sw-denomination-cell-plain',
      ]),
    );
  });

  it('refuses options it cannot draw', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const plain = [{ id: 'a', label: 'A', cells: [1, 2] }];
    expect(() =>
      render(
        <DenominationGrid
          columns={columns}
          label="Grid"
          rows={[{ ...plain[0]!, negativeAppearance: 'grey' as never }]}
        />,
      ),
    ).toThrow("negativeAppearance must be 'danger' or 'plain'");
    expect(() =>
      render(
        <DenominationGrid
          columns={columns}
          label="Grid"
          rows={plain}
          transposeBelow={'sm' as never}
        />,
      ),
    ).toThrow("transposeBelow must be 'md' or 'lg'");
    expect(() =>
      render(
        <DenominationGrid
          columns={columns}
          label="Grid"
          layout="tiles"
          rows={plain}
          transposeBelow="md"
        />,
      ),
    ).toThrow('transposeBelow needs the strip layout');
    expect(() =>
      render(
        <DenominationGrid
          columns={columns}
          countDigits={4}
          label="Grid"
          rows={plain}
        />,
      ),
    ).toThrow('countDigits needs entry rows');
    expect(() =>
      render(
        <DenominationGrid
          columns={columns}
          countDigits={9}
          label="Grid"
          rows={plain}
        />,
      ),
    ).toThrow('countDigits must be a whole number from 3 to 6');
  });
});
