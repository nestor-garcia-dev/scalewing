import { describe, expect, it } from 'vitest';

import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

const css = generateStylesheet();

function rule(selector: string, from = 0): string {
  const start = css.indexOf(`\n${selector} {\n`, from);
  expect(start, selector).toBeGreaterThanOrEqual(0);
  return css.slice(start, css.indexOf('}', start));
}

describe('CommandPalette CSS', () => {
  it('sets the palette near the top, 40rem wide, only its list scrolling', () => {
    const frame = rule('.sw-command-palette');
    expect(frame).toContain('width: 40rem;');
    expect(frame).toContain('max-width: calc(100% - 2 * var(--sw-space-2));');
    expect(frame).toContain('overflow: hidden;');
    expect(css).toContain(
      '@media (min-width: 48rem) {\n  .sw-command-palette {\n    margin-top: max(var(--sw-space-2), 10vh);',
    );
    expect(rule('.sw-command-palette-list')).toContain('overflow-y: auto;');
  });

  it('draws the field as a band over the results, its focus an accent rule', () => {
    expect(rule('[data-theme] input.sw-command-palette-field')).toContain(
      'border-bottom: 1px solid var(--sw-color-border);',
    );
    expect(css).toContain(
      '[data-theme] input.sw-command-palette-field:focus-visible {\n  border-bottom-color: var(--sw-color-accent);',
    );
  });

  it('marks the active row, keeps 44 px rows on touch and Highlight in forced colours', () => {
    expect(rule(".sw-command-palette-item[aria-selected='true']")).toContain(
      'background: color-mix(in srgb, var(--sw-color-muted) 16%, transparent);',
    );
    expect(css).toContain(
      '@media (pointer: coarse) {\n  .sw-command-palette-item { min-height: var(--sw-control-md-min-height); }',
    );
    expect(css).toContain(
      ".sw-command-palette-item[aria-selected='true'] { background: Highlight; color: HighlightText; forced-color-adjust: none; }",
    );
  });

  it('draws the trigger as a search pill, the compact one a round glyph, 44 px on touch', () => {
    const trigger = rule('.sw-command-palette-trigger');
    expect(trigger).toContain('border-radius: var(--sw-radius-pill);');
    expect(trigger).toContain('min-height: var(--sw-control-sm-min-height);');
    expect(
      rule('.sw-command-palette-trigger.sw-command-palette-trigger-compact'),
    ).toContain('padding: 0;');
    expect(css).toContain(
      '@media (pointer: coarse) {\n  .sw-command-palette-trigger { min-height: var(--sw-control-md-min-height); }\n  .sw-command-palette-trigger.sw-command-palette-trigger-compact { min-width: var(--sw-control-md-min-height); }',
    );
    expect(rule('.sw-command-palette-key')).toContain(
      'border: 1px solid var(--sw-color-border);',
    );
  });

  it('lists its classes once', () => {
    const catalog = utilityClassCatalog();
    expect(catalog).toEqual(
      expect.arrayContaining([
        'sw-command-palette',
        'sw-command-palette-trigger',
        'sw-command-palette-key',
      ]),
    );
    expect(new Set(catalog).size).toBe(catalog.length);
  });
});
