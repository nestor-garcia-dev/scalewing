import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  type TableSort,
} from './components/Table.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => cleanup());

function renderSightings(sorts: { date: TableSort; count: TableSort }): {
  onDate: () => void;
  onCount: () => void;
} {
  const onDate = vi.fn();
  const onCount = vi.fn();
  render(
    <Table aria-label="Sightings">
      <TableHeader>
        <TableRow>
          <TableCell as="th" onSort={onDate} sort={sorts.date}>
            Date
          </TableCell>
          <TableCell as="th">Species</TableCell>
          <TableCell as="th" numeric onSort={onCount} sort={sorts.count}>
            Count
          </TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Sep 1</TableCell>
          <TableCell>Grey heron</TableCell>
          <TableCell numeric>4</TableCell>
        </TableRow>
      </TableBody>
    </Table>,
  );
  return { onDate, onCount };
}

describe('TableCell sort', () => {
  it('makes a header a button named by its text, with aria-sort only on the sorted column', () => {
    const { onDate, onCount } = renderSightings({
      date: 'ascending',
      count: 'none',
    });
    const date = screen.getByRole('columnheader', { name: 'Date' });
    const count = screen.getByRole('columnheader', { name: 'Count' });
    expect(date.getAttribute('aria-sort')).toBe('ascending');
    expect(count.hasAttribute('aria-sort')).toBe(false);
    expect(
      screen.getByRole('columnheader', { name: 'Species' }).children,
    ).toHaveLength(0);

    const dateButton = screen.getByRole('button', { name: 'Date' });
    expect(dateButton.className).toBe('sw-table-sort');
    expect(dateButton.getAttribute('type')).toBe('button');
    const glyph = dateButton.lastElementChild;
    expect(glyph?.getAttribute('aria-hidden')).toBe('true');
    expect(glyph?.className).toBe(
      'sw-table-sort-glyph sw-table-sort-ascending',
    );
    expect(count.className).toBe('sw-table-numeric');
    expect(
      screen.getByRole('button', { name: 'Count' }).lastElementChild?.className,
    ).toBe('sw-table-sort-glyph sw-table-sort-none');

    fireEvent.click(dateButton);
    expect(onDate).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: 'Count' }));
    expect(onCount).toHaveBeenCalledTimes(1);
  });

  it('marks a descending column and draws its glyph down', () => {
    renderSightings({ date: 'none', count: 'descending' });
    expect(
      screen
        .getByRole('columnheader', { name: 'Count' })
        .getAttribute('aria-sort'),
    ).toBe('descending');
    expect(
      screen.getByRole('button', { name: 'Count' }).lastElementChild?.className,
    ).toBe('sw-table-sort-glyph sw-table-sort-descending');
  });

  it('refuses sort on a data cell, sort without onSort, and an unknown sort', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    try {
      const table = (cell: React.ReactNode) => (
        <table>
          <tbody>
            <tr>{cell}</tr>
          </tbody>
        </table>
      );
      expect(() =>
        render(
          table(
            // @ts-expect-error sort is for header cells only.
            <TableCell onSort={() => undefined} sort="ascending">
              Sep 1
            </TableCell>,
          ),
        ),
      ).toThrow(TypeError);
      expect(() =>
        render(
          table(
            <TableCell as="th" sort="ascending">
              Date
            </TableCell>,
          ),
        ),
      ).toThrow('TableCell sort and onSort are passed together');
      expect(() =>
        render(
          table(
            <TableCell as="th" onSort={() => undefined}>
              Date
            </TableCell>,
          ),
        ),
      ).toThrow(TypeError);
      expect(() =>
        render(
          table(
            <TableCell
              as="th"
              onSort={() => undefined}
              // @ts-expect-error not a sort.
              sort="up"
            >
              Date
            </TableCell>,
          ),
        ),
      ).toThrow(RangeError);
    } finally {
      consoleError.mockRestore();
    }
  });

  it('generates the header-style button, the chevrons and a coarse-pointer target', () => {
    const css = generateStylesheet();
    expect(css).toContain('.sw-table-sort {\n  align-items: center;');
    expect(css).toContain('font: inherit;');
    expect(css).toMatch(
      /\.sw-table \.sw-table-numeric \.sw-table-sort,\n\.sw-table \.sw-table-end \.sw-table-sort \{\n {2}flex-direction: row-reverse;/,
    );
    expect(css).toContain(
      '.sw-table-sort:hover,\n.sw-table th[aria-sort] .sw-table-sort {\n  color: var(--sw-color-text);',
    );
    expect(css).toMatch(
      /\.sw-table-sort-ascending::before,\n\.sw-table-sort-none::before \{[^}]*transform: rotate\(-135deg\);/,
    );
    expect(css).toMatch(
      /\.sw-table-sort-descending::after,\n\.sw-table-sort-none::after \{[^}]*transform: rotate\(45deg\);/,
    );
    expect(css).toContain(
      '@media (pointer: coarse) {\n  .sw-table-sort { min-height: var(--sw-control-md-min-height); }',
    );
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-table-sort',
        'sw-table-sort-glyph',
        'sw-table-sort-ascending',
        'sw-table-sort-descending',
        'sw-table-sort-none',
      ]),
    );
  });
});
