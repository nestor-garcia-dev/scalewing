import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  type TableRowRule,
  tableRowRules,
} from './index.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function Ranking({ rule }: { rule?: TableRowRule }) {
  return (
    <Table aria-label="Nesting sites">
      <TableBody>
        <TableRow rule={rule} variant="sub">
          <TableCell as="th" scope="row">
            Reed bed
          </TableCell>
          <TableCell numeric>41</TableCell>
        </TableRow>
        <TableRow>
          <TableCell as="th" scope="row">
            Salt marsh
          </TableCell>
          <TableCell numeric>38</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

function ruledRow() {
  return screen.getByRole('row', { name: 'Reed bed 41' });
}

describe('TableRow rule', () => {
  it('knows one rule, after', () => {
    expect(tableRowRules).toEqual(['after']);
  });

  it('marks the row with a rule after it, beside its variant, and stays a row', () => {
    render(<Ranking rule="after" />);
    expect(ruledRow().className).toBe(
      'sw-table-row-sub sw-table-row-rule-after',
    );
    expect(ruledRow().getAttribute('role')).toBeNull();
    expect(screen.getByRole('row', { name: 'Salt marsh 38' }).className).toBe(
      '',
    );
  });

  it('draws nothing without a rule', () => {
    render(<Ranking />);
    expect(ruledRow().className).toBe('sw-table-row-sub');
  });

  it('refuses an unknown rule', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => render(<Ranking rule={'before' as TableRowRule} />)).toThrow(
      new RangeError('Unknown TableRow rule: before'),
    );
  });

  it('draws a 2 px muted rule under every cell, CanvasText in forced colours', () => {
    const css = generateStylesheet();
    expect(css).toContain(
      '.sw-table .sw-table-row-rule-after > :is(th, td) {\n  border-bottom: 2px solid var(--sw-color-muted);\n}',
    );
    expect(css).toContain(
      '.sw-table .sw-table-row-rule-after > :is(th, td) { border-bottom-color: CanvasText; }',
    );
    // After the base cell rule, so its 1 px hairline loses.
    expect(css.indexOf('.sw-table-row-rule-after > :is')).toBeGreaterThan(
      css.indexOf('.sw-table th,\n.sw-table td {'),
    );
    expect(utilityClassCatalog()).toContain('sw-table-row-rule-after');
  });
});
