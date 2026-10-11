import { contrastRatio } from '@scalewing/tokens';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import {
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  tableCellTones,
  tableRowVariants,
} from './index.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';
import { forEveryTheme } from './every-theme.test-support.js';

afterEach(() => cleanup());

function Ledger() {
  return (
    <Table aria-label="Cash moved" columnRules>
      <TableHeader>
        <TableRow>
          <TableCell as="th">Time</TableCell>
          <TableCell as="th">Entry</TableCell>
          <TableCell as="th" numeric>
            Cash
          </TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>11:42</TableCell>
          <TableCell as="th" scope="row">
            Money orders · 3
          </TableCell>
          <TableCell numeric tone="success">
            +$450.00
          </TableCell>
        </TableRow>
        <TableRow variant="sub">
          <TableCell />
          <TableCell as="th" scope="row">
            Money order 1
          </TableCell>
          <TableCell numeric>$150.00</TableCell>
        </TableRow>
        <TableRow struck variant="sub">
          <TableCell />
          <TableCell as="th" scope="row">
            Money order 3 <Badge tone="danger">Voided</Badge>
          </TableCell>
          <TableCell numeric tone="danger">
            −$150.00
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

describe('Table ledger', () => {
  it('tones cells, rules columns and marks sub and struck rows', () => {
    render(<Ledger />);
    const table = screen.getByRole('table', { name: 'Cash moved' });
    expect(table.className).toContain('sw-table-column-rules');
    expect(screen.getByText('+$450.00').className).toBe(
      'sw-table-numeric sw-table-tone-success',
    );
    const rows = screen.getAllByRole('row');
    expect(rows[1]!.className).toBe('');
    expect(rows[2]!.className).toBe('sw-table-row-sub');
    expect(rows[3]!.className).toBe('sw-table-row-sub sw-table-row-struck');
    expect(
      screen.getByRole('rowheader', { name: /Money order 3/ }).textContent,
    ).toBe('Money order 3 Voided');
  });

  it('leaves a plain table as it was', () => {
    render(
      <Table aria-label="Plain">
        <TableBody>
          <TableRow>
            <TableCell>One</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByRole('table').className).toBe(
      'sw-table sw-table-sticky',
    );
    expect(screen.getByRole('row').className).toBe('');
    expect(screen.getByRole('cell').className).toBe('');
  });

  it('fails closed on an unknown tone or variant', () => {
    expect(tableCellTones).toEqual(['success', 'danger', 'muted', 'accent']);
    expect(tableRowVariants).toEqual(['default', 'sub']);
    expect(() =>
      render(
        <table>
          <tbody>
            <tr>
              <TableCell tone={'warning' as 'success'}>x</TableCell>
            </tr>
          </tbody>
        </table>,
      ),
    ).toThrow(RangeError);
    expect(() =>
      render(
        <table>
          <tbody>
            <TableRow variant={'struck' as 'sub'} />
          </tbody>
        </table>,
      ),
    ).toThrow(RangeError);
  });

  it('keeps every tone at 4.5:1 on the surface and the canvas, but for named palette gaps', () => {
    // The tones are the theme's own colours, as Text color uses them. These
    // palettes' tokens fall under 4.5:1 there today (to be raised as
    // a tokens request; recorded in teisoro-table-ledger.md); every other pairing passes.
    const gaps = new Set([
      'sunburst light success/background',
      'harvest light success/background',
      'sunburst dark danger/surface',
      'harvest dark danger/surface',
      'harvest dark danger/background',
      'harvest dark accent/surface',
      'mocha dark danger/surface',
      'mocha dark danger/background',
    ]);
    const low: string[] = [];
    forEveryTheme((colors, label) => {
      for (const tone of tableCellTones)
        for (const ground of ['surface', 'background'] as const)
          if (contrastRatio(colors[tone], colors[ground]) < 4.5)
            low.push(`${label} ${tone}/${ground}`);
    });
    expect(new Set(low)).toEqual(gaps);
  });

  it("keeps a struck row's muted text at 4.5:1 on its subtle fill", () => {
    forEveryTheme((colors, label) => {
      expect(
        contrastRatio(colors.muted, colors.subtle),
        label,
      ).toBeGreaterThanOrEqual(4.5);
    });
  });
});

describe('Table ledger CSS', () => {
  const css = generateStylesheet();

  it('lists its classes', () => {
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-table-tone-success',
        'sw-table-tone-danger',
        'sw-table-tone-muted',
        'sw-table-tone-accent',
        'sw-table-column-rules',
        'sw-table-row-sub',
        'sw-table-row-struck',
      ]),
    );
  });

  it('colours each tone and rules columns at the inline start', () => {
    for (const tone of tableCellTones)
      expect(css).toContain(
        `.sw-table .sw-table-tone-${tone} {\n  color: var(--sw-color-${tone});`,
      );
    expect(css).toContain(
      '.sw-table-column-rules :is(th, td) + :is(th, td) {\n  border-inline-start: 1px solid var(--sw-color-border);',
    );
    // A sticky header cell draws its rule on its ::after, kept in forced colours.
    expect(css).toMatch(
      /\.sw-table-sticky\.sw-table-column-rules thead :is\(th, td\) \+ :is\(th, td\)::after \{\n {2}border-inline-start: 1px solid var\(--sw-color-border\);/,
    );
    expect(css).toMatch(
      /forced-colors: active\) \{[^@]*thead :is\(th, td\) \+ :is\(th, td\)::after \{ border-color: CanvasText; \}/,
    );
  });

  it('reads a body row header as body text and indents it in a sub row with a guide bar', () => {
    expect(css).toMatch(
      /:where\(\.sw-table tbody, \.sw-table tfoot\) th\[scope='row'\] \{\n {2}color: inherit;\n {2}font: inherit;/,
    );
    expect(css).toMatch(
      /\.sw-table-row-sub > th\[scope='row'\]::after \{[^}]*border-inline-start: 2px solid var\(--sw-color-border\);/,
    );
    expect(css).toMatch(
      /forced-colors: active\) \{[^@]*\.sw-table-row-sub > th\[scope='row'\]::after \{ border-color: CanvasText; \}/,
    );
  });

  it('lets numeric, tone and struck rules win over the row header reset', () => {
    // The reset is (0,1,1), as weak as `.sw-table th` and after it.
    const reset = css.indexOf(
      ":where(.sw-table tbody, .sw-table tfoot) th[scope='row']",
    );
    expect(reset).toBeGreaterThan(css.indexOf('.sw-table th,\n.sw-table td {'));
    expect(css).toContain('.sw-table .sw-table-numeric {');
    expect(css).toContain('.sw-table .sw-table-tone-success {');
    render(
      <table>
        <tbody>
          <TableRow>
            <TableCell as="th" numeric scope="row" tone="accent">
              12
            </TableCell>
          </TableRow>
        </tbody>
      </table>,
    );
    expect(screen.getByRole('rowheader').className).toBe(
      'sw-table-numeric sw-table-tone-accent',
    );
  });

  it('strikes a voided row on the subtle fill and mutes its toned cells', () => {
    expect(css).toMatch(
      /\.sw-table \.sw-table-row-struck > :is\(td, th\) \{\n {2}background: var\(--sw-color-subtle\);\n {2}color: var\(--sw-color-muted\);\n {2}text-decoration: line-through;/,
    );
    expect(css).toContain(
      ".sw-table .sw-table-row-struck > [class*='sw-table-tone-'] {\n  color: var(--sw-color-muted);",
    );
    // The tone rule comes first, so the struck rule (more specific) wins.
    expect(css.indexOf('.sw-table .sw-table-tone-success')).toBeLessThan(
      css.indexOf('.sw-table .sw-table-row-struck'),
    );
  });
});
