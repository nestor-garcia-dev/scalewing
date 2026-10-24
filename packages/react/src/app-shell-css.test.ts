import { describe, expect, it } from 'vitest';

import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

const css = generateStylesheet();

/** The body of the first rule whose selector line is exactly `selector`. */
function rule(selector: string, from = 0): string {
  const start = css.indexOf(`${selector} {\n`, from);
  expect(start, selector).toBeGreaterThanOrEqual(0);
  return css.slice(start, css.indexOf('}', start));
}

describe('AppShell CSS', () => {
  it('shows the bar and hides the sidebar below lg, main never a scroll box', () => {
    expect(rule('.sw-app-shell-bar')).toContain('display: flex;');
    expect(css).toContain(
      '.sw-app-shell-sidebar,\n.sw-app-shell-sidebar .sw-app-shell-rail-slot {\n  display: none;\n}',
    );
    expect(rule('.sw-app-shell-main')).not.toMatch(/overflow|height/);
    expect(css).not.toMatch(/\.sw-app-shell-main[^{]*\{[^}]*overflow/);
    expect(css).toContain('.sw-button.sw-app-shell-menu {');
  });

  it('pins a sticky full-height sidebar from lg, a rail to 75rem and full from there', () => {
    const lg = css.indexOf('@media (min-width: 64rem) {\n  .sw-app-shell {');
    expect(lg).toBeGreaterThan(0);
    const sidebar = rule('  .sw-app-shell-sidebar', lg);
    expect(sidebar).toContain('position: sticky;');
    expect(sidebar).toContain('top: 0;');
    expect(sidebar).toContain('height: 100dvh;');
    expect(sidebar).toContain(
      'width: calc(var(--sw-control-md-min-height) + 2 * var(--sw-space-3) + 1px);',
    );
    expect(rule('  .sw-app-shell-bar', lg)).toContain('display: none;');
    const rail = css.indexOf('  @media not all and (min-width: 75rem) {', lg);
    expect(rail).toBeGreaterThan(lg);
    expect(
      rule('    .sw-app-shell-sidebar .sw-app-shell-slot', rail),
    ).toContain('display: none;');
    expect(
      rule('    .sw-app-shell-sidebar .sw-app-shell-rail-slot', rail),
    ).toContain('display: block;');
    expect(css.slice(rail)).toMatch(
      /\.sw-app-shell-sidebar \.sw-app-shell-label,\n {4}\.sw-app-shell-sidebar \.sw-app-shell-group-label \{ position: absolute; width: 1px;/,
    );
    expect(
      rule(
        '    .sw-app-shell-sidebar .sw-app-shell-group + .sw-app-shell-group',
        rail,
      ),
    ).toContain('border-top: 1px solid var(--sw-color-border);');
    expect(
      rule('    .sw-app-shell-sidebar .sw-app-shell-count', rail),
    ).toContain('position: absolute;');
    expect(css).toContain(
      '@media (min-width: 75rem) {\n  .sw-app-shell-sidebar {\n    width: 15rem;\n  }\n}',
    );
  });

  it('marks the current link with the quiet fill and gives a coarse pointer 44 px', () => {
    expect(rule('[data-theme] .sw-app-shell-link[aria-current]')).toContain(
      'background: color-mix(in srgb, var(--sw-color-muted) 18%, transparent);',
    );
    expect(css).toContain(
      '@media (pointer: coarse) {\n  [data-theme] .sw-app-shell-link { min-height: var(--sw-control-md-min-height); }',
    );
    expect(css).toContain(
      '[data-theme] .sw-app-shell-link[aria-current] { border-color: Highlight; color: CanvasText; }',
    );
    expect(css).toMatch(/\[data-theme\] \.sw-app-shell-count,\n/);
    expect(rule('.sw-app-shell-group-label')).not.toContain('text-transform');
  });

  it('docks the drawer to the inline start, sliding in unless motion is reduced, mirrored in RTL', () => {
    const drawer = rule('.sw-app-shell-drawer');
    expect(drawer).toContain('inset-inline: 0 auto;');
    expect(drawer).toContain('height: 100%;');
    expect(drawer).toContain('max-width: calc(100% - var(--sw-space-8));');
    expect(css).toContain('from { translate: -100% 0; }');
    expect(css).toContain('from { translate: 100% 0; }');
    expect(css).toContain(
      '@media (prefers-reduced-motion: reduce) {\n  .sw-app-shell-drawer[open],\n  .sw-app-shell-drawer[open]:dir(rtl) { animation: none; }',
    );
    expect(css).toContain('.sw-app-shell-drawer::backdrop {');
  });

  it('lists every class in the catalog', () => {
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-app-shell',
        'sw-app-shell-bar',
        'sw-app-shell-menu',
        'sw-app-shell-sidebar',
        'sw-app-shell-slot',
        'sw-app-shell-rail-slot',
        'sw-app-shell-nav',
        'sw-app-shell-group-label',
        'sw-app-shell-link',
        'sw-app-shell-count',
        'sw-app-shell-main',
        'sw-app-shell-drawer',
        'sw-app-shell-close',
      ]),
    );
    const catalog = utilityClassCatalog();
    expect(new Set(catalog).size).toBe(catalog.length);
  });
});
