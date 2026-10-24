import { describe, expect, it } from 'vitest';

import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

const css = generateStylesheet();

function rule(selector: string, from = 0): string {
  const start = css.indexOf(`${selector} {\n`, from);
  expect(start, selector).toBeGreaterThanOrEqual(0);
  return css.slice(start, css.indexOf('}', start));
}

describe('FixtureRow CSS', () => {
  it('lines rows up on one grid, each row a subgrid', () => {
    expect(rule('.sw-fixture-list')).toContain(
      'grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) auto auto;',
    );
    expect(rule('.sw-fixture-item,\n.sw-fixture-row')).toContain(
      'grid-template-columns: subgrid;',
    );
    expect(rule('\n.sw-fixture-team-home')).toContain(
      'justify-content: flex-end;',
    );
    expect(rule('\n.sw-fixture-center')).toContain(
      'font-variant-numeric: tabular-nums;',
    );
    expect(css).toContain('.sw-fixture-row {\n  align-items: center;');
    expect(css).toContain(
      'min-height: var(--sw-control-md-min-height);\n  padding: var(--sw-space-2);',
    );
  });

  it('puts the end under the sides below md, after the row rules', () => {
    const narrow = css.indexOf(
      '@media not all and (min-width: 48rem) {\n  .sw-fixture-list {',
    );
    expect(narrow).toBeGreaterThan(css.indexOf('\n.sw-fixture-end {'));
    expect(rule('  .sw-fixture-end', narrow)).toContain('grid-row: 2;');
    expect(rule('  .sw-fixture-end', narrow)).toContain(
      'justify-content: flex-start;',
    );
  });

  it('spaces the columns with their own margins, so empty tracks add no gap', () => {
    expect(rule('.sw-fixture-list')).not.toContain('column-gap');
    expect(rule('\n.sw-fixture-center')).toContain(
      'margin-inline: var(--sw-space-3);',
    );
    expect(rule('\n.sw-fixture-end')).toContain(
      'margin-inline-start: var(--sw-space-3);',
    );
  });

  it('falls back to a grid per row without subgrid', () => {
    const fallback = css.indexOf(
      '@supports not (grid-template-columns: subgrid) {',
    );
    expect(fallback).toBeGreaterThan(0);
    expect(rule('  .sw-fixture-item', fallback)).toContain('display: block;');
    expect(rule('  .sw-fixture-row', fallback)).toContain(
      'grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) auto auto;',
    );
  });

  it('marks presses and forced colours', () => {
    expect(rule('.sw-fixture-row-pressable:focus-visible')).toContain(
      'outline-offset: calc(-1 * var(--sw-focus-ring-width));',
    );
    expect(css).toContain(
      '.sw-fixture-chevron:dir(rtl) { transform: rotate(135deg); }',
    );
    expect(css).toContain(
      '.sw-fixture-center-time { border: 1px solid CanvasText; }',
    );
  });

  it('lists its classes once', () => {
    const catalog = utilityClassCatalog();
    expect(catalog).toEqual(
      expect.arrayContaining([
        'sw-fixture-list',
        'sw-fixture-row',
        'sw-fixture-center-score',
      ]),
    );
    expect(new Set(catalog).size).toBe(catalog.length);
  });
});

describe('FixtureRow CSS braces', () => {
  it('opens and closes every block it writes', () => {
    const start = css.indexOf('.sw-fixture-group {');
    const fallback = css.indexOf(
      '@supports not (grid-template-columns: subgrid)',
    );
    const end = css.indexOf('    }\n  }\n}', fallback) + 11;
    const block = css.slice(start, end);
    expect(block.split('{').length).toBe(block.split('}').length);
  });
});
