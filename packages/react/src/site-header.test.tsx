import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ButtonLink } from './components/ButtonLink.js';
import {
  SiteHeader,
  type SiteHeaderItem,
  type SiteHeaderProps,
} from './components/SiteHeader.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const css = generateStylesheet();

const items: SiteHeaderItem[] = [
  { id: 'marsh', label: 'Marsh', href: '/marsh' },
  { id: 'hide', label: 'Hide', href: '/hide', current: 'page' },
  { id: 'trails', label: 'Trails', href: '/trails', current: true },
];

function header(props: Partial<SiteHeaderProps> = {}) {
  return (
    <SiteHeader
      actions={<a href="/sign-in">Sign in</a>}
      brand={<a href="/">Wetland Trust</a>}
      closeIcon={<svg data-glyph="close" />}
      compactActions={
        <a href="/es" lang="es">
          Español
        </a>
      }
      items={items}
      labels={{ openMenu: 'Open the menu', closeMenu: 'Close the menu' }}
      menuActions={<ButtonLink href="/contact">Contact the rangers</ButtonLink>}
      menuIcon={<svg data-glyph="menu" />}
      navLabel="Main"
      {...props}
    />
  );
}

function menu(container: HTMLElement): HTMLDetailsElement {
  return container.querySelector('details.sw-site-header-menu')!;
}

describe('SiteHeader', () => {
  it('draws the brand, the destinations twice (bar and menu) and every action slot', () => {
    const { container } = render(header());
    const banner = screen.getByRole('banner');
    expect(banner.className).toBe('sw-site-header sw-site-header-sticky');
    const navs = container.querySelectorAll('nav[aria-label="Main"]');
    expect([...navs].map((nav) => nav.className)).toEqual([
      'sw-site-header-nav',
      'sw-site-header-menu-nav',
    ]);
    const bar = within(navs[0] as HTMLElement).getAllByRole('link');
    expect(bar.map((link) => link.getAttribute('aria-current'))).toEqual([
      null,
      'page',
      'true',
    ]);
    expect(bar.map((link) => link.getAttribute('tabindex'))).toEqual([
      '0',
      '0',
      '0',
    ]);
    expect(
      container.querySelector('.sw-site-header-actions')?.textContent,
    ).toBe('Sign in');
    expect(
      container.querySelector(
        '.sw-site-header-compact > .sw-site-header-compact-actions > a',
      )?.textContent,
    ).toBe('Español');
    expect(
      container.querySelector('.sw-site-header-menu-actions')?.textContent,
    ).toBe('Contact the rangers');
  });

  it('names the menu button by its state and hides its glyphs', () => {
    const { container } = render(header());
    const summary = container.querySelector('summary')!;
    expect(summary.className).toBe('sw-site-header-menu-button');
    expect(
      summary.querySelector('.sw-site-header-menu-open .sw-sr-only')
        ?.textContent,
    ).toBe('Open the menu');
    expect(
      summary.querySelector('.sw-site-header-menu-close .sw-sr-only')
        ?.textContent,
    ).toBe('Close the menu');
    for (const glyph of summary.querySelectorAll('.sw-site-header-glyph'))
      expect(glyph.getAttribute('aria-hidden')).toBe('true');
    expect(summary.querySelector('[data-glyph="menu"]')).not.toBeNull();
    expect(summary.querySelector('[data-glyph="close"]')).not.toBeNull();
  });

  it('renders on the server as a closed native details with every link', () => {
    const html = renderToString(header());
    expect(html).toContain('<details class="sw-site-header-menu">');
    expect(html).not.toContain('<details class="sw-site-header-menu" open');
    expect(html.match(/href="\/hide"/g)).toHaveLength(2);
  });

  it('closes on Escape and puts focus back on the menu button', () => {
    const { container } = render(header());
    const details = menu(container);
    details.open = true;
    const link = details.querySelector<HTMLAnchorElement>(
      '.sw-site-header-menu-nav a',
    )!;
    link.focus();
    fireEvent.keyDown(link, { key: 'Escape' });
    expect(details.open).toBe(false);
    expect(document.activeElement).toBe(details.querySelector('summary'));
  });

  it('ignores other keys and Escape while closed', () => {
    const { container } = render(header());
    const details = menu(container);
    details.open = true;
    fireEvent.keyDown(details, { key: 'Enter' });
    expect(details.open).toBe(true);
    details.open = false;
    const summary = details.querySelector('summary')!;
    fireEvent.keyDown(summary, { key: 'Escape' });
    expect(details.open).toBe(false);
    expect(document.activeElement).not.toBe(summary);
  });

  it('closes when a link in the menu is chosen, not on another press', () => {
    const { container } = render(header());
    const details = menu(container);
    details.open = true;
    fireEvent.click(details.querySelector('.sw-site-header-panel')!);
    expect(details.open).toBe(true);
    fireEvent.click(
      within(details).getByRole('link', { name: 'Contact the rangers' }),
    );
    expect(details.open).toBe(false);
  });

  it('closes when focus leaves the menu, and stays open while it moves inside or to nowhere', () => {
    const { container } = render(header());
    const details = menu(container);
    const [first, second] = details.querySelectorAll('a');
    details.open = true;
    fireEvent.focusOut(first!, { relatedTarget: second });
    expect(details.open).toBe(true);
    fireEvent.focusOut(first!, { relatedTarget: null });
    expect(details.open).toBe(true);
    fireEvent.focusOut(first!, {
      relatedTarget: screen.getByRole('link', { name: 'Wetland Trust' }),
    });
    expect(details.open).toBe(false);
  });

  it('closes on a press outside it, not on one inside it', () => {
    const { container } = render(header());
    const details = menu(container);
    details.open = true;
    fireEvent.pointerDown(details.querySelector('.sw-site-header-panel')!);
    expect(details.open).toBe(true);
    fireEvent.pointerDown(screen.getByRole('link', { name: 'Wetland Trust' }));
    expect(details.open).toBe(false);
  });

  it('closes when the window widens to the row of destinations', () => {
    let matches = false;
    let onChange: (() => void) | undefined;
    const removed: unknown[] = [];
    vi.stubGlobal('matchMedia', (query: string) => ({
      get matches() {
        return query === '(min-width: 64rem)' && matches;
      },
      addEventListener: (_type: string, listener: () => void) => {
        onChange = listener;
      },
      removeEventListener: (_type: string, listener: () => void) => {
        removed.push(listener);
      },
    }));
    const { container, unmount } = render(header());
    const details = menu(container);
    details.open = true;
    onChange?.();
    expect(details.open).toBe(true);
    matches = true;
    onChange?.();
    expect(details.open).toBe(false);
    unmount();
    expect(removed).toEqual([onChange]);
  });

  it('removes its listeners when it unmounts', () => {
    const { container, unmount } = render(header());
    const details = menu(container);
    unmount();
    details.open = true;
    fireEvent.keyDown(details, { key: 'Escape' });
    fireEvent.pointerDown(document.body);
    expect(details.open).toBe(true);
  });

  it('can stay in the page flow and leave out its optional slots', () => {
    const { container } = render(
      header({
        actions: undefined,
        compactActions: undefined,
        menuActions: undefined,
        sticky: false,
      }),
    );
    expect(screen.getByRole('banner').className).toBe('sw-site-header');
    expect(container.querySelector('.sw-site-header-actions')).toBeNull();
    expect(container.querySelector('.sw-site-header-menu-actions')).toBeNull();
    expect(
      container.querySelector('.sw-site-header-compact')?.children,
    ).toHaveLength(1);
    expect(
      container.querySelector('.sw-site-header-compact-actions'),
    ).toBeNull();
  });

  it('puts the skip link first, before every other focusable element', () => {
    const { container } = render(
      header({ skipLink: { label: 'Skip to content', href: '#main' } }),
    );
    const banner = screen.getByRole('banner');
    const skip = screen.getByRole('link', { name: 'Skip to content' });
    expect(banner.firstElementChild).toBe(skip);
    expect(skip.className).toBe('sw-site-header-skip-link');
    expect(skip.getAttribute('href')).toBe('#main');
    expect(skip.getAttribute('tabindex')).toBe('0');
    expect(container.querySelector('a, button, summary')).toBe(skip);
  });

  it('draws no skip link without the prop', () => {
    const { container } = render(header());
    expect(container.querySelector('.sw-site-header-skip-link')).toBeNull();
    expect(screen.getByRole('banner').firstElementChild?.className).toBe(
      'sw-site-header-bar',
    );
  });

  it('renders the skip link on the server', () => {
    const html = renderToString(
      header({ skipLink: { label: 'Skip to content', href: '#main' } }),
    );
    expect(html).toContain(
      '<header class="sw-site-header sw-site-header-sticky"><a class="sw-site-header-skip-link" href="#main" tabindex="0">Skip to content</a>',
    );
  });

  it.each([
    [{ items: [] }, 'SiteHeader needs at least one item'],
    [
      { items: [{ id: 'a', label: ' ', href: '/a' }] },
      'SiteHeader items need nonempty ids and labels',
    ],
    [
      {
        items: [
          { id: 'a', label: 'A', href: '/a' },
          { id: 'a', label: 'B', href: '/b' },
        ],
      },
      'SiteHeader items need unique ids',
    ],
    [
      { items: [{ id: 'a', label: 'A', href: ' ' }] },
      'SiteHeader items need nonempty hrefs',
    ],
    [{ navLabel: ' ' }, 'SiteHeader needs a nonempty navLabel'],
    [
      { labels: { openMenu: '', closeMenu: 'Close' } },
      'SiteHeader labels need nonempty openMenu and closeMenu',
    ],
    [
      { labels: { openMenu: 'Open', closeMenu: ' ' } },
      'SiteHeader labels need nonempty openMenu and closeMenu',
    ],
    [
      { skipLink: { label: ' ', href: '#main' } },
      'SiteHeader skipLink needs a nonempty label',
    ],
    [
      { skipLink: { label: 'Skip to content', href: '/main' } },
      'SiteHeader skipLink href must be a fragment such as #main',
    ],
    [
      { skipLink: { label: 'Skip to content', href: '#' } },
      'SiteHeader skipLink href must be a fragment such as #main',
    ],
    [
      { skipLink: { label: 'Skip to content', href: '/page#main' } },
      'SiteHeader skipLink href must be a fragment such as #main',
    ],
  ] as const)('throws on invalid props (%#)', (props, message) => {
    expect(() => render(header(props))).toThrow(message);
  });
});

describe('SiteHeader CSS', () => {
  it('shows the menu below lg and the row of destinations and actions from lg', () => {
    expect(css).toContain(
      '.sw-site-header-nav,\n.sw-site-header-actions {\n  display: none;\n}',
    );
    expect(css).toContain(
      '@media (min-width: 64rem) {\n  .sw-site-header { --sw-site-header-height: calc(var(--sw-control-md-min-height) + var(--sw-space-5) + var(--sw-space-1)); }\n  .sw-site-header-nav { display: block; }\n  .sw-site-header-actions { display: flex; }\n  .sw-site-header-compact { display: none; }\n}',
    );
    expect(css).toContain(
      '  --sw-site-header-height: calc(var(--sw-control-md-min-height) + var(--sw-space-3));',
    );
  });

  it('sticks to the top under the popups and marks the current destination', () => {
    expect(css).toContain(
      '.sw-site-header-sticky {\n  position: sticky;\n  top: 0;\n  z-index: 5;\n}',
    );
    expect(css).toContain(
      '[data-theme] .sw-site-header-nav .sw-site-header-link[aria-current] {\n  box-shadow: inset 0 -2px 0 currentColor;\n  font-weight: 600;\n}',
    );
    expect(css).toContain(
      '[data-theme] .sw-site-header-menu-nav .sw-site-header-link[aria-current] {\n  color: var(--sw-color-accent);\n}',
    );
  });

  it('swaps the button’s glyph and name with the open state and lays the panel under the bar', () => {
    expect(css).toContain(
      '.sw-site-header-menu[open] .sw-site-header-menu-open,\n.sw-site-header-menu:not([open]) .sw-site-header-menu-close {\n  display: none;\n}',
    );
    expect(css).toContain(
      '.sw-site-header-menu > summary::-webkit-details-marker {\n  display: none;\n}',
    );
    expect(css).toContain(
      '  height: calc(100dvh - var(--sw-site-header-height) - 1px);',
    );
    expect(css).toContain('  position: absolute;\n  top: calc(100% + 1px);');
  });

  it('draws the hairlines and the current destination in forced colours and lists its classes', () => {
    expect(css).toContain(
      '  [data-theme] .sw-site-header-nav .sw-site-header-link[aria-current] {\n    text-decoration: underline;\n    text-decoration-thickness: 2px;',
    );
    expect(css).toContain(
      '  [data-theme] .sw-site-header-link[aria-current] {\n    color: Highlight;\n  }',
    );
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-site-header',
        'sw-site-header-menu',
        'sw-site-header-panel',
        'sw-site-header-link',
        'sw-site-header-compact-actions',
        'sw-site-header-skip-link',
      ]),
    );
  });

  it('hides the compact actions while the menu is open, without a box of their own otherwise', () => {
    expect(css).toContain(
      '.sw-site-header-compact-actions {\n  display: contents;\n}',
    );
    expect(css).toContain(
      '.sw-site-header-compact:has(> .sw-site-header-menu[open]) > .sw-site-header-compact-actions {\n  display: none;\n}',
    );
  });

  it('pads the document’s scroll past a sticky bar and a gap at each width', () => {
    expect(css).toContain(
      'html:has(.sw-site-header-sticky) {\n  scroll-padding-top: calc(calc(var(--sw-control-md-min-height) + var(--sw-space-3)) + 1px + var(--sw-space-3));\n}',
    );
    expect(css).toContain(
      '@media (min-width: 64rem) {\n  html:has(.sw-site-header-sticky) {\n    scroll-padding-top: calc(calc(var(--sw-control-md-min-height) + var(--sw-space-5) + var(--sw-space-1)) + 1px + var(--sw-space-3));\n  }\n}',
    );
    expect(css).not.toMatch(/html:has\(\.sw-site-header\)/);
  });

  it('hides the skip link until it has focus, then lays it over the bar’s start with the ring', () => {
    expect(css).toContain(
      '.sw-site-header-skip-link:not(:focus) { position: absolute; width: 1px; height: 1px;',
    );
    expect(css).toContain(
      '[data-theme] .sw-site-header-skip-link:focus {\n  min-height: var(--sw-control-md-min-height);\n  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);',
    );
    expect(css).toContain(
      '  background: var(--sw-color-surface);\n  border-radius: var(--sw-radius-pill);',
    );
    expect(css).toContain(
      '  inset-inline-start: calc(max(0px, (100% - calc(var(--sw-container-max) + 2 * var(--sw-space-5))) / 2) + var(--sw-space-4));',
    );
    expect(css).toContain(
      '@media (min-width: 48rem) {\n  .sw-site-header-skip-link { inset-inline-start: calc(max(0px, (100% - calc(var(--sw-container-max) + 2 * var(--sw-space-5))) / 2) + var(--sw-space-5)); }\n}',
    );
  });
});
