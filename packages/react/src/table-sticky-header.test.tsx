import { describe, expect, it } from 'vitest';

import { generateStylesheet } from './css/stylesheet.js';
import { stackingOrder } from './css/stacking.js';

function block(css: string, selector: string): string {
  const start = css.indexOf(`${selector} {`);
  expect(start).toBeGreaterThanOrEqual(0);
  return css.slice(start, css.indexOf('}', start) + 1);
}

describe('Table sticky header CSS', () => {
  const css = generateStylesheet();

  it('pins the whole head group, so every head row stays in view under the one above', () => {
    expect(block(css, '.sw-table-sticky thead')).toBe(
      `.sw-table-sticky thead {\n  position: sticky;\n  top: 0;\n  z-index: ${stackingOrder.stickyCell};\n}`,
    );
  });

  it('puts every head cell, th and td, on the glass with no collapsed bottom border, positioned for its rules', () => {
    const cells = block(css, '.sw-table-sticky thead :is(th, td)');
    expect(cells).toContain('background: var(--sw-glass-fill);');
    expect(cells).toContain(
      'backdrop-filter: blur(var(--sw-glass-blur)) saturate(var(--sw-glass-saturate));',
    );
    expect(cells).toContain('border-bottom: 0;');
    expect(cells).toContain('position: relative;');
    expect(cells).not.toContain('position: sticky;');
    expect(css).not.toContain('.sw-table-sticky thead th {');
  });

  it("draws each pinned cell's row rule on its own ::before, kept in forced colours", () => {
    const rule = block(css, '.sw-table-sticky thead :is(th, td)::before');
    expect(rule).toContain('border-bottom: 1px solid var(--sw-color-border);');
    expect(rule).toContain('inset-block-end: 0;');
    expect(rule).toContain('position: absolute;');
    expect(css).toContain(
      '.sw-table-sticky thead :is(th, td)::before { border-color: CanvasText; }',
    );
  });

  it('swaps the pinned cells to the solid surface under Reduce Transparency', () => {
    const start = css.indexOf(
      '@media (prefers-reduced-transparency: reduce) {\n  .sw-card-glass',
    );
    expect(start).toBeGreaterThanOrEqual(0);
    const selectors = css.slice(
      start,
      css.indexOf('{', css.indexOf('\n', start)),
    );
    expect(selectors).toContain('.sw-table-sticky thead :is(th, td),');
  });
});
