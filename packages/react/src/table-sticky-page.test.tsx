import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  type TableStickyHeader,
} from './index.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => cleanup());

function Census({ stickyHeader }: { stickyHeader?: TableStickyHeader }) {
  return (
    <Table aria-label="Census" stickyHeader={stickyHeader}>
      <TableHeader>
        <TableRow>
          <TableCell as="th">Site</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Lake</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

function tableClasses() {
  return [...screen.getByRole('table').classList];
}

describe('Table stickyHeader', () => {
  it('pins the header to its region by default', () => {
    render(<Census />);
    expect(tableClasses()).toContain('sw-table-sticky');
    expect(tableClasses()).not.toContain('sw-table-sticky-page');
  });

  it('pins the header to the page with "page"', () => {
    render(<Census stickyHeader="page" />);
    expect(tableClasses()).toEqual(
      expect.arrayContaining(['sw-table-sticky', 'sw-table-sticky-page']),
    );
  });

  it('lets the header scroll away with false', () => {
    render(<Census stickyHeader={false} />);
    expect(tableClasses()).not.toContain('sw-table-sticky');
    expect(tableClasses()).not.toContain('sw-table-sticky-page');
  });

  it('throws a RangeError for an unknown value', () => {
    expect(() =>
      render(<Census stickyHeader={'viewport' as TableStickyHeader} />),
    ).toThrow(new RangeError('Unknown Table stickyHeader: viewport'));
  });
});

describe('Table stickyHeader="page" CSS', () => {
  const css = generateStylesheet();

  it('lists its classes', () => {
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining(['sw-table-sticky-page', 'sw-scroll-fits']),
    );
  });

  it('lets a fitting region stop being a scroll box for a page-pinned header or a sticky footer', () => {
    expect(css).toContain(
      '.sw-table-wrap.sw-scroll-fits:has(> .sw-table > .sw-table-footer-sticky),\n.sw-table-wrap.sw-scroll-fits:has(> .sw-table-sticky-page) {\n  overflow: visible;\n}',
    );
  });
});
