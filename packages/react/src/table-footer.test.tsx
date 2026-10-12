import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHeader,
  TableRow,
} from './index.js';
import { stackingOrder } from './css/stacking.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => cleanup());

function Census({ sticky }: { sticky?: boolean }) {
  return (
    <Table aria-label="Census">
      <TableHeader>
        <TableRow>
          <TableCell as="th">Site</TableCell>
          <TableCell as="th" numeric>
            Birds
          </TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Lake</TableCell>
          <TableCell numeric>12</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter sticky={sticky}>
        <TableRow>
          <TableCell as="th" scope="row">
            Total
          </TableCell>
          <TableCell numeric>12</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

describe('TableFooter', () => {
  it('renders a tfoot whose row header names the total', () => {
    render(<Census />);
    const footer = screen.getByRole('table').querySelector('tfoot');
    expect(footer).not.toBeNull();
    expect(footer!.className).toBe('');
    expect(
      screen.getByRole('rowheader', { name: 'Total' }).closest('tfoot'),
    ).toBe(footer);
  });

  it('marks a sticky footer', () => {
    render(<Census sticky />);
    expect(screen.getByRole('table').querySelector('tfoot')!.className).toBe(
      'sw-table-footer-sticky',
    );
  });
});

describe('TableFooter CSS', () => {
  const css = generateStylesheet();

  it('lists its classes', () => {
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining(['sw-table-footer-sticky', 'sw-scroll-fits']),
    );
  });

  it('sets a total at weight 600 under a 2px rule that forced colours keep', () => {
    expect(css).toMatch(
      /\.sw-table tfoot :is\(th, td\) \{\n {2}font-weight: 600;/,
    );
    expect(css).toMatch(
      /\.sw-table tfoot > tr:first-child > :is\(th, td\)::before \{\n {2}border-top: 2px solid var\(--sw-color-border\);/,
    );
    expect(css).toMatch(
      /forced-colors: active\) \{\n {2}\.sw-table tfoot > tr:first-child > :is\(th, td\)::before \{ border-color: CanvasText; \}/,
    );
    // Over the last body row's 1 px border, so the rule reads 2 px.
    expect(css).toMatch(
      /tr:first-child > :is\(th, td\)::before \{[^}]*inset-block-start: -1px;/,
    );
  });

  it('paints pinned footer and header cells solid in forced colours', () => {
    expect(css).toContain(
      '  .sw-table .sw-table-footer-sticky :is(th, td),\n  .sw-table-sticky thead th { background: Canvas; backdrop-filter: none; -webkit-backdrop-filter: none; }',
    );
  });

  it('pins a sticky footer to the bottom on its own layer, between the cells and the ActionBar', () => {
    const rule = css.slice(
      css.indexOf('.sw-table .sw-table-footer-sticky :is(th, td) {'),
    );
    const block = rule.slice(0, rule.indexOf('}'));
    expect(block).toContain('bottom: 0;');
    expect(block).toContain('position: sticky;');
    expect(block).toContain(`z-index: ${stackingOrder.stickyFooter};`);
    expect(stackingOrder.stickyCell).toBeLessThan(stackingOrder.stickyFooter);
    expect(stackingOrder.stickyFooter).toBeLessThan(stackingOrder.bottomChrome);
  });

  it('lets a fitting region holding a sticky footer stop being a scroll box', () => {
    expect(css).toContain(
      '.sw-table-wrap.sw-scroll-fits:has(> .sw-table > .sw-table-footer-sticky),\n',
    );
  });

  it('keeps the sticky footer solid under reduced transparency', () => {
    expect(css).toMatch(
      /prefers-reduced-transparency: reduce\) \{[^}]*\.sw-table \.sw-table-footer-sticky :is\(th, td\),/,
    );
  });
});
