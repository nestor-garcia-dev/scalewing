import { describe, expect, it } from 'vitest';

import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

const css = generateStylesheet();

/** The body of the first rule whose selector line is exactly `selector`. */
function rule(selector: string, from = 0): string {
  const start = css.indexOf(`\n${selector} {\n`, from);
  expect(start, selector).toBeGreaterThanOrEqual(0);
  return css.slice(start, css.indexOf('}', start));
}

describe('ContextSwitcher CSS', () => {
  it('draws the trigger at the sm height with a chevron, 44 px on a coarse pointer', () => {
    const trigger = rule('.sw-context-switcher-trigger');
    expect(trigger).toContain('min-height: var(--sw-control-sm-min-height);');
    expect(trigger).toContain('text-align: start;');
    expect(css).toContain(
      '.sw-context-switcher-trigger:not(.sw-context-switcher-trigger-icon)::after {',
    );
    expect(css).toContain(
      '@media (pointer: coarse) {\n  .sw-context-switcher-trigger { min-height: var(--sw-control-md-min-height); }',
    );
    expect(
      rule('.sw-context-switcher-trigger.sw-context-switcher-trigger-pill'),
    ).toContain('border-radius: var(--sw-radius-pill);');
    expect(
      rule('.sw-context-switcher-trigger.sw-context-switcher-trigger-icon'),
    ).toContain('padding: 0;');
  });

  it('places the popup on the popup layer, only its list scrolling', () => {
    const popup = rule('.sw-context-switcher-popup');
    expect(popup).toContain('position: fixed;');
    expect(popup).toContain('z-index: 10;');
    expect(popup).toContain('inset: auto;');
    expect(popup).toContain(
      'min-width: min(max(15rem, var(--sw-context-switcher-trigger-width, 0px)), calc(100% - var(--sw-space-2) - var(--sw-space-2)));',
    );
    expect(rule('.sw-context-switcher-list')).toContain('overflow-y: auto;');
  });

  it('marks the active row, the current one and forced colours', () => {
    expect(rule(".sw-context-switcher-option[data-active='true']")).toContain(
      'background: color-mix(in srgb, var(--sw-color-muted) 16%, transparent);',
    );
    expect(rule('.sw-context-switcher-check')).toContain(
      'border-bottom: 2px solid var(--sw-color-accent);',
    );
    expect(css).toContain(
      ".sw-context-switcher-option[data-active='true'] { background: Highlight; color: HighlightText; forced-color-adjust: none; }",
    );
    expect(css).toContain(
      '@media (pointer: coarse) {\n  .sw-context-switcher-option { min-height: var(--sw-control-md-min-height); }',
    );
  });

  it('joins the shared count pill with its tones', () => {
    expect(css).toMatch(/\[data-theme\] \.sw-context-switcher-count \{/);
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-context-switcher-count',
        'sw-context-switcher-count-warning',
        'sw-context-switcher-popup',
        'sw-context-switcher-trigger-icon',
      ]),
    );
    const catalog = utilityClassCatalog();
    expect(new Set(catalog).size).toBe(catalog.length);
  });
});
