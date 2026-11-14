import { cleanup, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it } from 'vitest';

import {
  SiteHeader,
  type SiteHeaderProps,
  type SiteHeaderSearchOptions,
} from './components/SiteHeader.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(cleanup);

const css = generateStylesheet();

const search: SiteHeaderSearchOptions = {
  action: '/docs/search/',
  label: 'Search the field guide',
  placeholder: 'Search the guide',
  labels: { open: 'Search', close: 'Close search' },
  icon: <svg data-glyph="search" />,
};

function header(props: Partial<SiteHeaderProps> = {}) {
  return (
    <SiteHeader
      brand={<a href="/">Wetland Trust</a>}
      closeIcon={<svg data-glyph="close" />}
      items={[{ id: 'marsh', label: 'Marsh', href: '/marsh' }]}
      labels={{ openMenu: 'Open the menu', closeMenu: 'Close the menu' }}
      menuIcon={<svg data-glyph="menu" />}
      navLabel="Main"
      search={search}
      {...props}
    />
  );
}

describe('SiteHeader search', () => {
  it('draws one GET form with a named search field in a popover the buttons open and close', () => {
    const { container } = render(header());
    const form = screen.getByRole('search', { hidden: true });
    expect(form.getAttribute('action')).toBe('/docs/search/');
    expect(form.getAttribute('method')).toBe('get');
    const field = screen.getByRole('searchbox', {
      hidden: true,
      name: 'Search the field guide',
    });
    expect(field.getAttribute('name')).toBe('q');
    expect(field.getAttribute('placeholder')).toBe('Search the guide');
    expect(field.getAttribute('enterkeyhint')).toBe('search');
    const panel = container.querySelector('.sw-site-header-search')!;
    expect(panel.getAttribute('popover')).toBe('auto');
    const open = screen.getByRole('button', { name: 'Search' });
    const close = screen.getByRole('button', {
      hidden: true,
      name: 'Close search',
    });
    expect(open.getAttribute('popovertarget')).toBe(panel.id);
    expect(open.getAttribute('popovertargetaction')).toBe('show');
    expect(close.getAttribute('popovertarget')).toBe(panel.id);
    expect(close.getAttribute('popovertargetaction')).toBe('hide');
    expect(form.contains(close)).toBe(true);
    // Neither button submits the form.
    expect(open.getAttribute('type')).toBe('button');
    expect(close.getAttribute('type')).toBe('button');
  });

  it('shows the cancel word, named by it, in place of the close glyph when given', () => {
    const { container } = render(
      header({
        search: {
          ...search,
          labels: { open: 'Search', close: 'Close search', cancel: 'Cancel' },
        },
      }),
    );
    const panel = container.querySelector('.sw-site-header-search')!;
    const cancel = screen.getByRole('button', { hidden: true, name: 'Cancel' });
    expect(cancel.textContent).toBe('Cancel');
    expect(cancel.hasAttribute('aria-label')).toBe(false);
    expect(cancel.className).toBe(
      'sw-site-header-search-close sw-site-header-search-cancel',
    );
    expect(cancel.querySelector('[data-glyph="close"]')).toBeNull();
    expect(cancel.getAttribute('popovertarget')).toBe(panel.id);
    expect(cancel.getAttribute('popovertargetaction')).toBe('hide');
    expect(cancel.getAttribute('type')).toBe('button');
    expect(
      screen.queryByRole('button', { hidden: true, name: 'Close search' }),
    ).toBeNull();
  });

  it('keeps the named close glyph without a cancel word', () => {
    render(header());
    const close = screen.getByRole('button', {
      hidden: true,
      name: 'Close search',
    });
    expect(close.getAttribute('aria-label')).toBe('Close search');
    expect(close.className).toBe('sw-site-header-search-close');
    expect(close.querySelector('[data-glyph="close"]')).not.toBeNull();
  });

  it('leaves an empty hidden results panel, named by the field, with a row template', () => {
    const { container } = render(header());
    const field = screen.getByRole('searchbox', { hidden: true });
    const results = container.querySelector<HTMLElement>(
      '.sw-site-header-search-results',
    )!;
    expect(results.hidden).toBe(true);
    expect(field.getAttribute('aria-controls')).toBe(results.id);
    expect(
      results
        .querySelector('.sw-site-header-search-status')!
        .getAttribute('aria-live'),
    ).toBe('polite');
    expect(
      results.querySelector('.sw-site-header-search-list')!.children,
    ).toHaveLength(0);
    expect(
      results.querySelector('template.sw-site-header-search-row'),
    ).not.toBeNull();
  });

  it('sits after the destinations and before the actions, with a custom parameter name', () => {
    const { container } = render(
      header({
        actions: <a href="/es">ES</a>,
        search: { ...search, name: 'query' },
      }),
    );
    const bar = container.querySelector('.sw-site-header-bar')!;
    const classes = [...bar.children].map((child) => child.className);
    expect(classes).toEqual([
      'sw-site-header-brand',
      'sw-site-header-nav',
      'sw-site-header-search-button',
      'sw-site-header-search',
      'sw-site-header-actions',
      'sw-site-header-compact',
    ]);
    expect(
      screen.getByRole('searchbox', { hidden: true }).getAttribute('name'),
    ).toBe('query');
  });

  it('renders on the server with the row inside the template’s markup', () => {
    const html = renderToString(header());
    expect(html).toContain('popover="auto"');
    expect(html).toContain(
      '<template class="sw-site-header-search-row"><li><a class="sw-site-header-search-result" href="/" tabindex="0">',
    );
  });

  it('draws nothing without the prop', () => {
    const { container } = render(header({ search: undefined }));
    expect(container.querySelector('[class*="sw-site-header-search"]')).toBe(
      null,
    );
  });

  it.each([
    [{ action: ' ' }, 'SiteHeader search needs a nonempty action'],
    [{ label: '' }, 'SiteHeader search needs a nonempty action'],
    [{ placeholder: ' ' }, 'SiteHeader search needs a nonempty action'],
    [
      { labels: { open: ' ', close: 'Close' } },
      'SiteHeader search needs a nonempty action',
    ],
    [
      { labels: { open: 'Search', close: '' } },
      'SiteHeader search needs a nonempty action',
    ],
    [{ name: 'q&x' }, 'SiteHeader search name must be a plain parameter name'],
    [{ icon: null }, 'SiteHeader search needs an icon'],
    [{ labels: undefined }, 'SiteHeader search needs a nonempty action'],
    [
      { labels: { open: 'Search', close: 'Close', cancel: ' ' } },
      'SiteHeader search labels.cancel must be nonempty words when given',
    ],
    [
      { labels: { open: 'Search', close: 'Close', cancel: 3 as never } },
      'SiteHeader search labels.cancel must be nonempty words when given',
    ],
  ] as const)('throws on invalid search words (%#)', (change, message) => {
    expect(() => render(header({ search: { ...search, ...change } }))).toThrow(
      message,
    );
  });
});

describe('SiteHeader search CSS', () => {
  it('steps the search button aside while the menu is open, and draws no search without Popover support', () => {
    expect(css).toContain(
      '.sw-site-header-bar:has(.sw-site-header-menu[open]) > .sw-site-header-search-button {\n  display: none;',
    );
    expect(css).toContain('@supports not selector(:popover-open) {');
  });

  it('opens over the whole window below lg and sits in the bar from lg', () => {
    expect(css).toContain(
      '.sw-site-header-search:popover-open {\n  background: var(--sw-color-surface);',
    );
    expect(css).toContain('  height: 100dvh;\n  inset: 0;');
    expect(css).toContain(
      '  .sw-site-header-search[popover]:not(:popover-open) {\n    background: transparent;',
    );
    expect(css).toContain('    position: relative;');
  });

  it('keeps the phone’s field at the body size and drops the results under the field from lg', () => {
    const size =
      /input\.sw-site-header-search-input \{[^}]*font-size: (\d+)px;/.exec(css);
    expect(Number(size?.[1])).toBeGreaterThanOrEqual(16);
    expect(css).toContain(
      '  .sw-site-header-search-results:not([hidden]) {\n    background: var(--sw-color-surface);',
    );
    expect(css).toContain('    top: calc(100% + var(--sw-space-2));');
  });

  it('gives the field up to its 10rem floor before the destinations and actions shrink from lg', () => {
    const wide = css.slice(
      css.indexOf('  .sw-site-header-search[popover]:not(:popover-open) {'),
    );
    expect(wide.slice(0, wide.indexOf('}'))).toContain(
      'flex: 1 1 10rem;\n    max-width: 16rem;\n    min-width: 10rem;',
    );
    expect(css).not.toContain('flex: 0 1 16rem');
  });

  it('draws the cancel word in the accent at the 44 px height', () => {
    const rule = /\.sw-site-header-search-cancel \{([^}]*)\}/.exec(css)?.[1];
    expect(rule).toContain('color: var(--sw-color-accent);');
    expect(rule).toContain('min-width: var(--sw-control-md-min-height);');
    expect(rule).toContain('width: auto;');
    expect(css).toContain(
      '.sw-site-header-search-close {\n  align-items: center;',
    );
  });

  it('lists its classes', () => {
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-site-header-search',
        'sw-site-header-search-button',
        'sw-site-header-search-cancel',
        'sw-site-header-search-results',
        'sw-site-header-search-result',
      ]),
    );
  });
});
