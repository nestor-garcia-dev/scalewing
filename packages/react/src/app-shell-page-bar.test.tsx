import { act, cleanup, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { renderShell } from './app-shell.test-support.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const css = generateStylesheet();

/** The body of the first rule whose selector line is exactly `selector`. */
function rule(selector: string, from = 0): string {
  const start = css.indexOf(`${selector} {\n`, from);
  expect(start, selector).toBeGreaterThanOrEqual(0);
  return css.slice(start, css.indexOf('}', start));
}

describe('AppShell pageBar', () => {
  it('draws the band first in main, before the page', () => {
    renderShell({ pageBar: <button type="button">Spring census</button> });
    const main = screen.getByRole('main');
    const band = main.firstElementChild;
    expect(band?.className).toBe('sw-app-shell-page-bar');
    expect(band?.textContent).toBe('Spring census');
    expect(main.lastElementChild?.textContent).toBe('Otters seen at dawn.');
  });

  it('draws no band without a pageBar, or for null or false', () => {
    for (const pageBar of [undefined, null, false]) {
      renderShell({ pageBar });
      expect(document.querySelector('.sw-app-shell-page-bar')).toBeNull();
      cleanup();
    }
  });

  it('sets the compact bar’s and the band’s measured heights on the shell while there is a band', () => {
    // The bar and the band each have an observer.
    const observers: (() => void)[] = [];
    const resize = () => observers.forEach((callback) => callback());
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: () => void) {
          observers.push(callback);
        }
        observe() {}
        disconnect() {}
      },
    );
    let height = 57;
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      () => ({ height }) as DOMRect,
    );
    const { container, rerender } = renderShell({ pageBar: 'Census' });
    const shell = container.querySelector<HTMLElement>('.sw-app-shell')!;
    expect(shell.style.getPropertyValue('--sw-app-shell-bar-height')).toBe(
      '57px',
    );
    expect(shell.style.getPropertyValue('--sw-app-shell-page-bar-height')).toBe(
      '57px',
    );
    height = 0;
    act(() => resize());
    expect(shell.style.getPropertyValue('--sw-app-shell-bar-height')).toBe('');
    // A bar shown again (the window narrowed below lg) sets it once more.
    height = 61;
    act(() => resize());
    expect(shell.style.getPropertyValue('--sw-app-shell-bar-height')).toBe(
      '61px',
    );
    rerender(<div />);
    vi.restoreAllMocks();
  });

  it('keeps a focused control clear of the band and the bar when it scrolls into view', () => {
    const css = generateStylesheet();
    expect(css).toContain(
      '.sw-app-shell-main:has(> .sw-app-shell-page-bar) * {\n  scroll-margin-block-start: calc(var(--sw-app-shell-bar-height,',
    );
    expect(css).toContain(
      'scroll-margin-block-start: calc(var(--sw-app-shell-page-bar-height, calc(var(--sw-control-sm-min-height) + 2 * var(--sw-space-2) + 1px)) + var(--sw-space-2));',
    );
  });

  it('measures nothing without a band', () => {
    const { container } = renderShell();
    expect(
      container
        .querySelector<HTMLElement>('.sw-app-shell')!
        .getAttribute('style'),
    ).toBeNull();
  });
});

describe('AppShell menuCount', () => {
  it('reads the count in the menu button’s name after a comma, the pill hidden', () => {
    renderShell({ menuCount: 6, menuCountLabel: '6 need you' });
    const menu = screen.getByRole('button', { name: 'Open menu, 6 need you' });
    const pill = menu.querySelector('.sw-app-shell-count');
    expect(pill?.textContent).toBe('6');
    expect(pill?.getAttribute('aria-hidden')).toBe('true');
    expect(pill?.className).toBe('sw-app-shell-count');
  });

  it('reads the bare number without a label, and takes a tone', () => {
    renderShell({ menuCount: 4, menuCountTone: 'warning' });
    const menu = screen.getByRole('button', { name: 'Open menu, 4' });
    expect(menu.querySelector('.sw-app-shell-count')?.className).toBe(
      'sw-app-shell-count sw-app-shell-count-warning',
    );
  });

  it('shows no pill and keeps the plain name at 0', () => {
    renderShell({ menuCount: 0, menuCountLabel: 'none waiting' });
    const menu = screen.getByRole('button', { name: 'Open menu' });
    expect(menu.querySelector('.sw-app-shell-count')).toBeNull();
  });

  it.each<[string, Parameters<typeof renderShell>[0], string]>([
    [
      'a fractional count',
      { menuCount: 1.5 },
      'AppShell menuCount must be a whole number from 0: 1.5',
    ],
    [
      'a negative count',
      { menuCount: -1 },
      'AppShell menuCount must be a whole number from 0: -1',
    ],
    [
      'a blank count label',
      { menuCount: 2, menuCountLabel: ' ' },
      'AppShell menuCountLabel must be nonempty',
    ],
    [
      'an unknown tone',
      { menuCount: 2, menuCountTone: 'info' as never },
      'AppShell menuCountTone must be one of danger, accent, warning',
    ],
    [
      'a label without a count',
      { menuCountLabel: '2 to check' },
      'AppShell menuCountLabel and menuCountTone come with a menuCount',
    ],
    [
      'a tone without a count',
      { menuCountTone: 'accent' },
      'AppShell menuCountLabel and menuCountTone come with a menuCount',
    ],
  ])('refuses %s', (_, props, message) => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => renderShell(props)).toThrow(new RangeError(message));
    vi.restoreAllMocks();
  });
});

describe('AppShell page bar and menu count CSS', () => {
  it('pins a solid band under the compact bar, at the top from lg', () => {
    const band = rule('.sw-app-shell-page-bar');
    expect(band).toContain('position: sticky;');
    expect(band).toContain('background: var(--sw-color-surface);');
    expect(band).toContain('border-bottom: 1px solid var(--sw-color-border);');
    expect(band).toContain('padding: var(--sw-space-2) var(--sw-space-4);');
    expect(band).toContain(
      'top: var(--sw-app-shell-bar-height, calc(var(--sw-control-sm-min-height) + 2 * var(--sw-space-2) + 1px));',
    );
    expect(band).toContain('z-index: 5;');
    expect(css).toContain(
      '@media (pointer: coarse) {\n  .sw-app-shell-page-bar {\n    top: var(--sw-app-shell-bar-height, calc(var(--sw-control-md-min-height) + 2 * var(--sw-space-2) + 1px));',
    );
    expect(css).toContain(
      '@media (min-width: 64rem) {\n  .sw-app-shell-page-bar {\n    padding-inline: var(--sw-space-6);\n    top: 0;\n  }\n}',
    );
  });

  it('puts the menu pill on the button’s top end corner', () => {
    expect(rule('\n.sw-app-shell-menu')).toContain('position: relative;');
    const pill = rule('.sw-app-shell-menu .sw-app-shell-count');
    expect(pill).toContain('position: absolute;');
    expect(pill).toContain('inset-inline-end: calc(-1 * var(--sw-space-1));');
  });

  it('lists the band in the catalog', () => {
    expect(utilityClassCatalog()).toContain('sw-app-shell-page-bar');
  });
});
