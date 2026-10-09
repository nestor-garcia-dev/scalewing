import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from './components/Table.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => cleanup());

describe('Table layout, column widths and vertical alignment', () => {
  it('keeps the defaults: an auto table, middle aligned, no width class', () => {
    render(
      <Table aria-label="Debts">
        <TableBody>
          <TableRow>
            <TableCell>Sep 25</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByRole('table', { name: 'Debts' }).className).toBe(
      'sw-table sw-table-sticky',
    );
    expect(screen.getByRole('cell').className).toBe('');
  });

  it('maps layout, verticalAlign and each width to its class', () => {
    render(
      <Table aria-label="Movements" layout="fixed" verticalAlign="top">
        <TableHeader>
          <TableRow>
            <TableCell as="th" width="lg">
              Date and time
            </TableCell>
            <TableCell as="th" width="xs">
              Count
            </TableCell>
            <TableCell as="th">Description</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell width="min">Sep 25</TableCell>
            <TableCell numeric width="sm">
              4
            </TableCell>
            <TableCell>Heron</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByRole('table', { name: 'Movements' }).className).toBe(
      'sw-table sw-table-fixed sw-table-sticky sw-table-top',
    );
    expect(
      screen.getByRole('columnheader', { name: 'Date and time' }).className,
    ).toBe('sw-table-col-lg');
    expect(screen.getByRole('columnheader', { name: 'Count' }).className).toBe(
      'sw-table-col-xs',
    );
    const [date, count] = screen.getAllByRole('cell');
    expect(date?.className).toBe('sw-table-col-min');
    expect(count?.className).toBe('sw-table-numeric sw-table-col-sm');
    // The deprecated HTML width attribute is never written.
    expect(date?.hasAttribute('width')).toBe(false);
  });

  it('refuses an unknown layout, alignment or width', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    try {
      expect(() =>
        // @ts-expect-error not a layout.
        render(<Table aria-label="Bad" layout="grid" />),
      ).toThrow(RangeError);
      expect(() =>
        // @ts-expect-error not an alignment.
        render(<Table aria-label="Bad" verticalAlign="bottom" />),
      ).toThrow(RangeError);
      expect(() =>
        render(
          <table>
            <tbody>
              <tr>
                {/* @ts-expect-error not a width. */}
                <TableCell width="200px">Heron</TableCell>
              </tr>
            </tbody>
          </table>,
        ),
      ).toThrow('Unknown TableCell width: 200px');
    } finally {
      consoleError.mockRestore();
    }
  });

  it('generates the fixed layout, min, the rem sizes and top alignment', () => {
    const css = generateStylesheet();
    expect(css).toContain('.sw-table-fixed {\n  table-layout: fixed;\n}');
    expect(css).toContain(
      '.sw-table .sw-table-col-min {\n  white-space: nowrap;\n  width: 1%;\n}',
    );
    // A fixed table never measures content: min is no width there, and the
    // rule comes after the auto one it ties.
    const fixedMin = css.indexOf(
      '.sw-table-fixed .sw-table-col-min {\n  width: auto;\n}',
    );
    expect(fixedMin).toBeGreaterThan(
      css.indexOf('.sw-table .sw-table-col-min {'),
    );
    for (const [size, rem] of [
      ['xs', 4],
      ['sm', 6],
      ['md', 8],
      ['lg', 12],
      ['xl', 16],
    ] as const)
      expect(css).toContain(
        `.sw-table .sw-table-col-${size} { width: ${rem}rem; }`,
      );
    expect(css).toContain(
      '.sw-table.sw-table-top th,\n.sw-table.sw-table-top td {\n  vertical-align: top;\n}',
    );
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-table-fixed',
        'sw-table-top',
        'sw-table-col-min',
        'sw-table-col-xs',
        'sw-table-col-xl',
      ]),
    );
  });
});
