import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  type TableRowVariant,
  tableRowVariants,
} from './index.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => cleanup());

function Statement({
  variant,
  struck,
}: {
  variant?: TableRowVariant;
  struck?: boolean;
}) {
  return (
    <Table aria-label="Waders">
      <TableBody>
        <TableRow>
          <TableCell as="th" scope="row">
            Counted at dawn
          </TableCell>
          <TableCell numeric>120</TableCell>
        </TableRow>
        <TableRow struck={struck} variant={variant}>
          <TableCell as="th" scope="row">
            Expected at dusk
          </TableCell>
          <TableCell numeric tone="success">
            136
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

function totalRow() {
  return screen.getByRole('rowheader', { name: 'Expected at dusk' })
    .parentElement!;
}

describe('TableRow variant="total"', () => {
  it('is a known variant', () => {
    expect(tableRowVariants).toEqual(['default', 'sub', 'total']);
  });

  it('marks the row as a total and keeps it an ordinary row', () => {
    render(<Statement variant="total" />);
    const row = totalRow();
    expect(row.className).toBe('sw-table-row-total');
    expect(row.getAttribute('role')).toBeNull();
    expect(row.closest('tbody')).not.toBeNull();
    // Its row header names it for table navigation.
    expect(screen.getByRole('row', { name: 'Expected at dusk 136' })).toBe(row);
  });

  it('keeps a cell tone and works with struck', () => {
    render(<Statement struck variant="total" />);
    expect(totalRow().className).toBe('sw-table-row-total sw-table-row-struck');
    expect(screen.getByRole('cell', { name: '136' }).className).toContain(
      'sw-table-tone-success',
    );
  });

  it('leaves default and sub rows unmarked', () => {
    render(<Statement />);
    expect(totalRow().className).toBe('');
    cleanup();
    render(<Statement variant="sub" />);
    expect(totalRow().className).toBe('sw-table-row-sub');
  });
});

describe('TableRow variant="total" CSS', () => {
  const css = generateStylesheet();

  it('lists its class', () => {
    expect(utilityClassCatalog()).toContain('sw-table-row-total');
  });

  it('sets its cells at weight 600 under a 2 px rule, with no fill', () => {
    expect(css).toContain(
      '.sw-table .sw-table-row-total > :is(th, td) {\n  border-top: 2px solid var(--sw-color-border);\n  font-weight: 600;\n}',
    );
    const rule = css.slice(
      css.indexOf('.sw-table .sw-table-row-total > :is(th, td) {'),
    );
    expect(rule.slice(0, rule.indexOf('}'))).not.toContain('background');
  });

  it('keeps the rule in forced colors', () => {
    expect(css).toContain(
      '@media (forced-colors: active) {\n  .sw-table .sw-table-row-total > :is(th, td) { border-top-color: CanvasText; }\n}',
    );
  });

  it('outranks the body row header reset, so its name is bold too', () => {
    // The reset is in :where (specificity 0,1,1); the total's rule is 0,2,1
    // and comes later, so a row header in a total row is at 600.
    const reset = css.indexOf(
      ":where(.sw-table tbody, .sw-table tfoot) th[scope='row'] {\n  color: inherit;\n  font: inherit;",
    );
    const total = css.indexOf('.sw-table .sw-table-row-total > :is(th, td) {');
    expect(reset).toBeGreaterThan(-1);
    expect(total).toBeGreaterThan(reset);
  });
});
