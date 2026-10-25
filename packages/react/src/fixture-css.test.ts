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
      'grid-template-columns: auto minmax(0, 1fr) auto minmax(0, 1fr) auto auto auto;',
    );
    // The row spans every column but the select's and the action's.
    expect(css).toContain('.sw-fixture-row {\n  grid-column: 2 / -2;\n}');
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
      ':is(.sw-fixture-item-action, .sw-fixture-item-select):has(> .sw-fixture-row-pressable:hover) {',
    );
    const narrow = css.indexOf(
      '@media not all and (min-width: 48rem) {\n  .sw-fixture-list {',
    );
    expect(rule('  .sw-fixture-list', narrow)).toContain(
      'grid-template-columns: auto minmax(0, 1fr) auto minmax(0, 1fr) auto auto;',
    );
  });

  it('puts the select in the first column, outside the row, its box a 44 px target on touch', () => {
    const select = rule('\n.sw-fixture-select');
    expect(select).toContain('grid-column: 1;');
    expect(select).toContain('grid-row: 1;');
    expect(select).toContain('align-self: center;');
    expect(select).toContain('padding-inline-start: var(--sw-space-2);');
    expect(css).toContain(
      '@media (pointer: coarse) {\n  .sw-fixture-select { padding-inline-start: 0; }\n}',
    );
    // The box is Checkbox's hidden-label control, which grows on a coarse pointer.
    const coarse = css.indexOf(
      '@media (pointer: coarse) {\n  .sw-checkbox-label-hidden {',
    );
    expect(coarse).toBeGreaterThan(0);
    expect(rule('  .sw-checkbox-label-hidden', coarse)).toContain(
      'min-height: var(--sw-control-md-min-height);',
    );
    expect(rule('  .sw-checkbox-label-hidden', coarse)).toContain(
      'min-width: var(--sw-control-md-min-height);',
    );
  });

  it('keeps a flag inline below md when the row has no details line there', () => {
    const narrow = css.indexOf('  .sw-fixture-flag { grid-row: 2; }');
    const inline = css.indexOf(
      '  .sw-fixture-row-flag-inline .sw-fixture-flag { grid-row: 1; }',
    );
    expect(inline).toBeGreaterThan(narrow);
    expect(
      rule('  .sw-fixture-row-flag-inline .sw-fixture-team-home', narrow),
    ).toContain(
      'padding-inline-start: calc(var(--sw-space-4) + var(--sw-space-2));',
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
    expect(rule('  .sw-fixture-item-select', fallback)).toContain(
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

  it('draws score boxes as sm squares, the 44 px target on touch, after the canvas', () => {
    const box = rule('[data-theme] input.sw-fixture-score-box');
    expect(box).toContain('block-size: var(--sw-control-sm-min-height);');
    expect(box).toContain('inline-size: var(--sw-control-sm-min-height);');
    expect(box).toContain('min-height: 0;');
    expect(box).toContain('font-variant-numeric: tabular-nums;');
    expect(box).toContain('text-align: center;');
    expect(css).toContain(
      '@media (pointer: coarse) {\n  [data-theme] input.sw-fixture-score-box {\n    block-size: var(--sw-control-md-min-height);\n    inline-size: var(--sw-control-md-min-height);',
    );
    expect(css).toContain(
      '@media not all and (min-width: 48rem) {\n  .sw-fixture-score { margin-inline: var(--sw-space-2); }\n}',
    );
    // Later than the canvas's text-control rule of the same specificity.
    expect(
      css.indexOf('[data-theme] input.sw-fixture-score-box {'),
    ).toBeGreaterThan(css.indexOf("[data-theme] :is(input[type='text']"));
    expect(
      rule("[data-theme] input.sw-fixture-score-box[aria-invalid='true']"),
    ).toContain('border-color: var(--sw-color-danger);');
    expect(css).toContain(
      "[data-theme] input.sw-fixture-score-box[aria-invalid='true'] { border-color: Mark; }",
    );
  });

  it('puts the score message and the detail under the row, from the home side to the action', () => {
    const error = rule('.sw-fixture-score-error');
    expect(error).toContain('grid-column: 2 / -1;');
    expect(error).toContain('grid-row: 2;');
    expect(error).toContain('color: var(--sw-color-danger);');
    expect(rule('.sw-fixture-score-error:not(:empty)')).toContain(
      'padding-block-end: var(--sw-space-2);',
    );
    const detail = rule('.sw-fixture-detail');
    expect(detail).toContain('grid-column: 2 / -1;');
    expect(detail).toContain('grid-row: 3;');
    expect(detail).toContain('padding: 0 var(--sw-space-2) var(--sw-space-2);');
    expect(rule('.sw-fixture-item-below > .sw-fixture-row')).toContain(
      'grid-row: 1;',
    );
    expect(css).toContain(
      // Without subgrid the action stays on the row's line; the parts wrap after it.
      '.sw-fixture-item-below > :is(.sw-fixture-score-error, .sw-fixture-detail) {\n    flex: 1 0 100%;\n    order: 1;',
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
        'sw-fixture-select',
        'sw-fixture-item-select',
        'sw-fixture-row-flag-inline',
        'sw-fixture-score',
        'sw-fixture-score-box',
        'sw-fixture-score-dash',
        'sw-fixture-score-error',
        'sw-fixture-item-below',
        'sw-fixture-detail',
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
