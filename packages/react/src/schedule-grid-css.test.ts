import { describe, expect, it } from 'vitest';

import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

const css = generateStylesheet();

function rule(selector: string, from = 0): string {
  const start = css.indexOf(`${selector} {\n`, from);
  expect(start, selector).toBeGreaterThanOrEqual(0);
  return css.slice(start, css.indexOf('}', start));
}

describe('ScheduleGrid CSS', () => {
  it('scrolls sideways in its own box, columns at least the md table width', () => {
    expect(rule('.sw-schedule-grid')).toContain('overflow-x: auto;');
    const table = rule('.sw-schedule-grid-table');
    expect(table).toContain('table-layout: fixed;');
    expect(table).toContain('var(--sw-schedule-grid-columns) * 8rem');
    expect(rule('.sw-schedule-grid-table')).toContain(
      'border-spacing: var(--sw-space-2);',
    );
  });

  it('draws slots from tokens, at least the touch target high', () => {
    const slot = rule('.sw-schedule-grid-slot');
    expect(slot).toContain(
      'min-height: calc(var(--sw-control-md-min-height) + var(--sw-space-3));',
    );
    expect(slot).toContain('border-radius: var(--sw-radius-md);');
    expect(
      rule('.sw-schedule-grid-cell-open > .sw-schedule-grid-slot'),
    ).toContain('border: 1px dashed var(--sw-color-border);');
    expect(
      rule('.sw-schedule-grid-cell-disabled > .sw-schedule-grid-slot'),
    ).toContain('background: var(--sw-color-subtle);');
    expect(
      rule('.sw-schedule-grid-cell:focus-visible > .sw-schedule-grid-slot'),
    ).toContain(
      'outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);',
    );
  });

  it('marks blocked cells amber and the target in the accent, filling open cells only', () => {
    const ink =
      'color-mix(in srgb, var(--sw-color-warning) 70%, var(--sw-color-text))';
    expect(
      rule('.sw-schedule-grid-cell-blocked > .sw-schedule-grid-slot'),
    ).toContain(`border-color: ${ink};`);
    const openBlocked = rule(
      '.sw-schedule-grid-cell-open.sw-schedule-grid-cell-blocked > .sw-schedule-grid-slot',
    );
    expect(openBlocked).toContain(
      'background: color-mix(in srgb, var(--sw-color-warning) 10%, var(--sw-color-surface));',
    );
    expect(openBlocked).toContain(`color: ${ink};`);
    const openTarget = rule(
      '.sw-schedule-grid-cell-open.sw-schedule-grid-cell-target:not(.sw-schedule-grid-cell-blocked) > .sw-schedule-grid-slot',
    );
    expect(openTarget).toContain('background: var(--sw-color-accentSubtle);');
    expect(openTarget).toContain('color: var(--sw-color-text);');
    expect(
      rule('.sw-schedule-grid-cell-target > .sw-schedule-grid-slot'),
    ).toContain(
      'outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);',
    );
    // The carried item's card is not faded: its words keep their contrast.
    expect(
      rule('.sw-schedule-grid-cell-source > .sw-schedule-grid-slot'),
    ).toContain('border-style: dashed;');
    expect(css).not.toContain(
      '.sw-schedule-grid-cell-source .sw-schedule-grid-item',
    );
  });

  it('keeps edges and rings in forced colours', () => {
    expect(css).toContain(
      '.sw-schedule-grid-cell-blocked > .sw-schedule-grid-slot { border-style: dotted; }',
    );
    expect(css).toMatch(
      /\.sw-schedule-grid-cell-target > \.sw-schedule-grid-slot,\n {2}\.sw-schedule-grid-cell:focus-visible > \.sw-schedule-grid-slot \{\n {4}outline-color: Highlight;/,
    );
  });

  it('lists its classes once', () => {
    const catalog = utilityClassCatalog();
    expect(catalog).toEqual(
      expect.arrayContaining([
        'sw-schedule-grid',
        'sw-schedule-grid-cell-blocked',
      ]),
    );
    expect(new Set(catalog).size).toBe(catalog.length);
  });
});

describe('DateToggleCalendar CSS', () => {
  it('lays months in columns at least seven 44 px days wide', () => {
    expect(rule('.sw-date-toggle')).toContain(
      'grid-template-columns: repeat(auto-fill, minmax(min(100%, calc(7 * var(--sw-control-md-min-height))), 1fr));',
    );
    const day = rule('.sw-date-toggle-day');
    expect(day).toContain('height: var(--sw-control-md-min-height);');
    // Narrower than seven days, the grid and its days shrink with the column.
    expect(day).toContain('max-width: var(--sw-control-md-min-height);');
    expect(rule('.sw-date-toggle-grid')).toContain(
      'width: min(100%, calc(7 * var(--sw-control-md-min-height)));',
    );
  });

  it('fills a day that is on with the accent, Highlight in forced colours', () => {
    expect(
      rule(
        ".sw-date-toggle-day-on,\n.sw-date-toggle-day-on:hover:not([aria-disabled='true'])",
      ),
    ).toContain('background: var(--sw-color-accent);');
    expect(css).toContain(
      '    background: Highlight;\n    border-color: Highlight;',
    );
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining(['sw-date-toggle', 'sw-date-toggle-day-on']),
    );
  });
});
