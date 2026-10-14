import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { typographyVariants } from '@scalewing/tokens';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it } from 'vitest';

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHeader,
  type TableMaxHeight,
  TableRow,
  type TableStickyHeader,
} from './index.js';
import {
  tableCellPadding,
  tableRuleWidth,
  tableSortMinHeight,
} from './css/css-table-metrics.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => cleanup());

const sites = ['Lake', 'Marsh', 'Wood', 'Meadow', 'Dune'];

function Census({
  maxHeight,
  stickyHeader,
  footer = 'sticky',
}: {
  maxHeight?: TableMaxHeight;
  stickyHeader?: TableStickyHeader;
  footer?: 'sticky' | 'plain' | 'none';
}) {
  return (
    <Table
      aria-label="Census"
      maxHeight={maxHeight}
      stickyHeader={stickyHeader}
    >
      <TableHeader>
        <TableRow>
          <TableCell as="th">Site</TableCell>
          <TableCell as="th" numeric>
            Birds
          </TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sites.map((site) => (
          <TableRow key={site}>
            <TableCell>{site}</TableCell>
            <TableCell numeric>3</TableCell>
          </TableRow>
        ))}
      </TableBody>
      {footer === 'none' ? null : (
        <TableFooter sticky={footer === 'sticky'}>
          <TableRow>
            <TableCell as="th" scope="row">
              Total
            </TableCell>
            <TableCell numeric>15</TableCell>
          </TableRow>
        </TableFooter>
      )}
    </Table>
  );
}

function region() {
  return screen.getByRole('group', { name: 'Census' });
}

function setMetrics(box: HTMLElement, metrics: Record<string, number>) {
  for (const [key, value] of Object.entries(metrics))
    Object.defineProperty(box, key, { configurable: true, value });
}

describe('Table maxHeight', () => {
  it('bounds the region and hands it the row count', () => {
    render(<Census maxHeight={{ rows: 3 }} />);
    expect(region().className).toBe('sw-table-wrap sw-table-bounded');
    expect(region().style.getPropertyValue('--sw-table-max-rows')).toBe('3');
  });

  it('keeps the region a named keyboard stop', () => {
    render(<Census maxHeight={{ rows: 3 }} />);
    expect(region().tabIndex).toBe(0);
    expect(region().getAttribute('aria-label')).toBe('Census');
    expect(screen.getByRole('table', { name: 'Census' })).not.toBeNull();
  });

  it('pins the header to the region and keeps the sticky footer', () => {
    render(<Census maxHeight={{ rows: 3 }} />);
    const table = screen.getByRole('table');
    expect([...table.classList]).toContain('sw-table-sticky');
    expect([...table.classList]).not.toContain('sw-table-sticky-page');
    expect(table.querySelector('tfoot')!.className).toBe(
      'sw-table-footer-sticky',
    );
  });

  it('never marks a bounded region as fitting, so it stays a scroll box', () => {
    render(<Census maxHeight={{ rows: 3 }} />);
    setMetrics(region(), { scrollWidth: 390, clientWidth: 390 });
    fireEvent.scroll(region());
    expect(region().className).not.toContain('sw-scroll-fits');
  });

  it('marks the top and bottom with rows past them as the rows scroll', () => {
    render(<Census maxHeight={{ rows: 3 }} />);
    const box = region();
    setMetrics(box, { scrollTop: 0, scrollHeight: 400, clientHeight: 200 });
    fireEvent.scroll(box);
    expect(box.className).toBe(
      'sw-table-wrap sw-table-bounded sw-scroll-more-bottom',
    );
    setMetrics(box, { scrollTop: 100, scrollHeight: 400, clientHeight: 200 });
    fireEvent.scroll(box);
    expect(box.className).toBe(
      'sw-table-wrap sw-table-bounded sw-scroll-more-top sw-scroll-more-bottom',
    );
    setMetrics(box, { scrollTop: 200, scrollHeight: 400, clientHeight: 200 });
    fireEvent.scroll(box);
    expect(box.className).toBe(
      'sw-table-wrap sw-table-bounded sw-scroll-more-top',
    );
  });

  it('server-renders the bound before it is measured', () => {
    const html = renderToString(<Census maxHeight={{ rows: 12 }} />);
    expect(html).toContain('class="sw-table-wrap sw-table-bounded"');
    expect(html).toContain('style="--sw-table-max-rows:12"');
  });

  it.each([0, -1, 2.5, Number.NaN])(
    'throws a RangeError for %s rows',
    (rows) => {
      expect(() => render(<Census maxHeight={{ rows }} />)).toThrow(
        new RangeError(
          `Table maxHeight rows must be a whole number from 1: ${String(rows)}`,
        ),
      );
    },
  );

  it('throws a RangeError for a value that is not a row count', () => {
    expect(() =>
      render(<Census maxHeight={12 as unknown as TableMaxHeight} />),
    ).toThrow(
      new RangeError('Table maxHeight must be a row count, { rows }: 12'),
    );
  });

  it.each(['page', false] as const)(
    'throws with stickyHeader %s, which would not pin to the region',
    (stickyHeader) => {
      expect(() =>
        render(<Census maxHeight={{ rows: 3 }} stickyHeader={stickyHeader} />),
      ).toThrow(
        new RangeError(
          `Table maxHeight pins the header to the table's own region; stickyHeader ${String(stickyHeader)} cannot be used with it`,
        ),
      );
    },
  );
});

describe('Table without maxHeight keeps its page pinning', () => {
  it('marks a fitting region with a sticky footer, so it pins to the page', () => {
    render(<Census />);
    expect(region().className).toBe('sw-table-wrap sw-scroll-fits');
    expect(region().getAttribute('style')).toBeNull();
  });

  it('marks a fitting region whose header pins to the page', () => {
    render(<Census footer="plain" stickyHeader="page" />);
    expect(region().className).toBe('sw-table-wrap sw-scroll-fits');
    expect([...screen.getByRole('table').classList]).toEqual(
      expect.arrayContaining(['sw-table-sticky', 'sw-table-sticky-page']),
    );
  });

  it('keeps the page pin rule and adds no bound to it', () => {
    const css = generateStylesheet();
    expect(css).toContain(
      '.sw-table-wrap.sw-scroll-fits:has(> .sw-table > .sw-table-footer-sticky),\n.sw-table-wrap.sw-scroll-fits:has(> .sw-table-sticky-page) {\n  overflow: visible;\n}',
    );
    expect(css).not.toMatch(/\.sw-table-wrap[^{]*\{[^}]*max-height/);
  });
});

describe('Table maxHeight CSS', () => {
  const css = generateStylesheet();
  const body = typographyVariants.body.lineHeight;
  const caption = typographyVariants.caption.lineHeight;

  it('lists its classes', () => {
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-table-bounded',
        'sw-scroll-more-top',
        'sw-scroll-more-bottom',
      ]),
    );
  });

  it('sizes the region from the row count, the header row and the footer row', () => {
    expect(css).toContain(`.sw-table-bounded {
  --sw-table-cell-pad: ${tableCellPadding.comfortable.block};
  --sw-table-head-block: 0px;
  --sw-table-foot-rows: 0;
  max-height: calc((var(--sw-table-max-rows) + var(--sw-table-foot-rows)) * (${body}px + 2 * var(--sw-table-cell-pad) + ${tableRuleWidth}) + var(--sw-table-head-block));
}`);
    expect(css).toContain(
      `.sw-table-bounded:has(> .sw-table > thead) {\n  --sw-table-head-block: calc(${caption}px + 2 * var(--sw-table-cell-pad));\n}`,
    );
    expect(css).toContain(
      '.sw-table-bounded:has(> .sw-table > tfoot) {\n  --sw-table-foot-rows: 1;\n}',
    );
  });

  it('sizes compact rows from their own padding', () => {
    expect(css).toContain(
      `.sw-table-bounded:has(> .sw-table-compact) {\n  --sw-table-cell-pad: ${tableCellPadding.compact.block};\n}`,
    );
  });

  it('reads the padding and rule the cells are drawn with', () => {
    expect(css).toContain(`.sw-table th,
.sw-table td {
  border-bottom: ${tableRuleWidth} solid var(--sw-color-border);
  padding: ${tableCellPadding.comfortable.block} ${tableCellPadding.comfortable.inline};`);
    expect(css).toContain(`.sw-table-compact th,
.sw-table-compact td {
  padding: ${tableCellPadding.compact.block} ${tableCellPadding.compact.inline};`);
  });

  it('sizes a sorting header by its button, the touch target on a coarse pointer', () => {
    const sorting = '.sw-table-bounded:has(> .sw-table > thead .sw-table-sort)';
    expect(css).toContain(
      `${sorting} {\n  --sw-table-head-block: calc(max(${caption}px, ${tableSortMinHeight}) + 2 * var(--sw-table-cell-pad));\n}`,
    );
    expect(css).toContain(
      `@media (pointer: coarse) {\n  ${sorting} {\n    --sw-table-head-block: calc(max(${caption}px, var(--sw-control-md-min-height)) + 2 * var(--sw-table-cell-pad));\n  }\n}`,
    );
    expect(css).toContain(`min-height: ${tableSortMinHeight};`);
  });

  it('prints every row', () => {
    expect(css).toContain(
      '@media print {\n  .sw-table-bounded { max-height: none; }\n}',
    );
  });

  it('draws the focus ring on the pinned cells that cover it, mirrored right to left', () => {
    const head =
      '.sw-table-bounded:focus-visible > .sw-table-sticky > thead > tr';
    const foot =
      '.sw-table-bounded:focus-visible > .sw-table > .sw-table-footer-sticky > tr';
    expect(css).toContain(
      `${head} > :is(th, td),\n${foot} > :is(th, td) {\n  box-shadow: var(--sw-table-ring-block, 0 0 transparent), var(--sw-table-ring-start, 0 0 transparent), var(--sw-table-ring-end, 0 0 transparent);\n}`,
    );
    expect(css).toContain(
      `${head}:first-child > :is(th, td) {\n  --sw-table-ring-block: inset 0 var(--sw-focus-ring-width) 0 0 var(--sw-color-accent);\n}`,
    );
    expect(css).toContain(
      `${foot}:last-child > :is(th, td) {\n  --sw-table-ring-block: inset 0 calc(-1 * var(--sw-focus-ring-width)) 0 0 var(--sw-color-accent);\n}`,
    );
    expect(css).toContain(
      `${head} > :first-child,\n${foot} > :first-child {\n  --sw-table-ring-start: inset var(--sw-focus-ring-width) 0 0 0 var(--sw-color-accent);\n}`,
    );
    expect(css).toContain(
      `${head} > :first-child:dir(rtl),\n${foot} > :first-child:dir(rtl) {\n  --sw-table-ring-start: inset calc(-1 * var(--sw-focus-ring-width)) 0 0 0 var(--sw-color-accent);\n}`,
    );
    expect(css).toContain(
      `${head} > :last-child:dir(rtl),\n${foot} > :last-child:dir(rtl) {\n  --sw-table-ring-end: inset var(--sw-focus-ring-width) 0 0 0 var(--sw-color-accent);\n}`,
    );
  });

  it('casts the top shade from the pinned header and the bottom one from a sticky footer', () => {
    expect(css).toContain(
      '.sw-table-bounded.sw-scroll-more-top > .sw-table-sticky > thead > tr:last-child > :is(th, td)::before {\n  background: linear-gradient(to bottom, color-mix(in srgb, var(--sw-color-text) 28%, transparent), transparent);',
    );
    expect(css).toContain(
      '.sw-table-bounded.sw-scroll-more-bottom > .sw-table > .sw-table-footer-sticky > tr:first-child > :is(th, td)::before {\n  background: linear-gradient(to top, color-mix(in srgb, var(--sw-color-text) 28%, transparent), transparent);\n  border-bottom: 2px solid var(--sw-color-border);',
    );
  });

  it('shades its own edge where nothing is pinned, both edges together', () => {
    expect(css).toContain(
      '.sw-table-bounded.sw-scroll-more-bottom:not(:has(> .sw-table > .sw-table-footer-sticky)) {\n  background-image: linear-gradient(to top,',
    );
    expect(css).toContain(
      '.sw-table-bounded.sw-scroll-more-top.sw-scroll-more-bottom:not(:has(> .sw-table > thead)):not(:has(> .sw-table > .sw-table-footer-sticky)) {\n  background-image: linear-gradient(to bottom,',
    );
  });

  it('draws no shade in forced colors', () => {
    const forced = css.slice(
      css.indexOf(
        '@media (forced-colors: active) {\n  .sw-table-bounded.sw-scroll-more-top',
      ),
    );
    expect(forced).toContain(
      '.sw-table-bounded.sw-scroll-more-bottom > .sw-table > .sw-table-footer-sticky > tr:first-child > :is(th, td)::before { background: none; border-color: CanvasText; }',
    );
    expect(forced).toContain(
      '.sw-table-bounded.sw-scroll-more-top.sw-scroll-more-bottom:not(:has(> .sw-table > thead)):not(:has(> .sw-table > .sw-table-footer-sticky)) { background-image: none; }',
    );
  });
});
