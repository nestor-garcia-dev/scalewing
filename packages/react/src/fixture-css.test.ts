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
      'grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) auto auto auto;',
    );
    // The row spans every column but the action's.
    expect(css).toContain('.sw-fixture-row {\n  grid-column: 1 / -2;\n}');
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

  it('puts the action in the last column, outside the row, on its first line', () => {
    const action = rule('\n.sw-fixture-action');
    expect(action).toContain('grid-column: -2 / -1;');
    expect(action).toContain('grid-row: 1;');
    expect(action).toContain('padding-inline-end: var(--sw-space-2);');
    expect(css).toContain(
      '.sw-fixture-item-action:has(> .sw-fixture-row-pressable:hover) {',
    );
    const narrow = css.indexOf(
      '@media not all and (min-width: 48rem) {\n  .sw-fixture-list {',
    );
    expect(rule('  .sw-fixture-list', narrow)).toContain(
      'grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) auto auto;',
    );
  });

  it('draws the flag at the home side start in its tone, CanvasText in forced colours', () => {
    const flag = rule('\n.sw-fixture-flag');
    expect(flag).toContain('grid-column: 1;');
    expect(flag).toContain('justify-self: start;');
    expect(rule('.sw-fixture-row-flagged .sw-fixture-team-home')).toContain(
      'padding-inline-start: calc(var(--sw-space-4) + var(--sw-space-2));',
    );
    // Below md it leads the details' line instead.
    expect(css).toContain('  .sw-fixture-flag { grid-row: 2; }');
    const mark = rule('\n.sw-fixture-flag-mark');
    expect(mark).toContain('border: 1px solid currentColor;');
    expect(mark).toContain('height: var(--sw-space-4);');
    expect(css).toContain(".sw-fixture-flag-mark::after { content: '!'; }");
    expect(rule('.sw-fixture-flag-warning .sw-fixture-flag-mark')).toContain(
      'background: color-mix(in srgb, var(--sw-color-warning) 10%, var(--sw-color-surface));',
    );
    expect(rule('.sw-fixture-flag-danger .sw-fixture-flag-mark')).toContain(
      'color: color-mix(in srgb, var(--sw-color-danger) 70%, var(--sw-color-text));',
    );
    expect(css).toContain(
      '.sw-fixture-flag .sw-fixture-flag-mark { color: CanvasText; }',
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
    expect(rule('  .sw-fixture-item-action', fallback)).toContain(
      'display: flex;',
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
        'sw-fixture-flag-warning',
        'sw-fixture-flag-danger',
        'sw-fixture-action',
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
