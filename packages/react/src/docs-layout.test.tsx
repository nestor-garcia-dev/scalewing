import { cleanup, render, within } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it } from 'vitest';

import {
  DocsLayout,
  type DocsLayoutGroup,
  type DocsLayoutProps,
} from './components/DocsLayout.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => cleanup());

const css = generateStylesheet();

const groups: DocsLayoutGroup[] = [
  {
    id: 'start',
    label: 'Start here',
    items: [
      { id: 'home', label: 'Field guide', href: '/guide/' },
      {
        id: 'first',
        label: 'Your first count',
        href: '/guide/first',
        current: 'page',
      },
    ],
  },
  {
    id: 'birds',
    label: 'Birds',
    items: [
      { id: 'herons', label: 'Herons', href: '/guide/herons' },
      {
        id: 'garzas',
        label: 'Garzas',
        href: '/es/guide/herons',
        lang: 'es',
        hrefLang: 'es',
      },
    ],
  },
];

function layout(overrides: Partial<DocsLayoutProps> = {}) {
  return (
    <DocsLayout
      groups={groups}
      labels={{ openNav: 'Browse the guide' }}
      navLabel="Guide"
      {...overrides}
    >
      {overrides.children ?? <h1>Your first count</h1>}
    </DocsLayout>
  );
}

const linkNames = (nav: Element) =>
  within(nav as HTMLElement)
    .getAllByRole('link')
    .map((link) => link.textContent);

describe('DocsLayout', () => {
  it('draws the side navigation, the disclosure and the content column in a plain wrapper', () => {
    const { container } = render(layout());
    const root = container.firstElementChild!;
    expect(root.tagName).toBe('DIV');
    expect(root.className).toBe('sw-docs-layout');
    expect([...root.children].map((child) => child.className)).toEqual([
      'sw-docs-layout-side',
      'sw-docs-layout-content',
    ]);
    const content = root.querySelector('.sw-docs-layout-content')!;
    expect(content.firstElementChild!.tagName).toBe('DETAILS');
    expect(
      content.querySelector('.sw-docs-layout-body > h1')?.textContent,
    ).toBe('Your first count');
    expect(container.querySelector('main')).toBeNull();
  });

  it('draws the same named navigation twice: the side list and the disclosure', () => {
    const { container } = render(layout());
    const navs = container.querySelectorAll('nav');
    expect(navs).toHaveLength(2);
    const [side, compact] = [...navs];
    expect(side!.getAttribute('aria-label')).toBe('Guide');
    expect(compact!.getAttribute('aria-label')).toBe('Guide');
    expect(side!.className).toBe('sw-docs-layout-nav');
    expect(compact!.className).toBe(
      'sw-docs-layout-nav sw-docs-layout-nav-compact',
    );
    expect(side!.closest('.sw-docs-layout-side')).not.toBeNull();
    expect(
      compact!.closest('details.sw-docs-layout-disclosure'),
    ).not.toBeNull();
    const names = ['Field guide', 'Your first count', 'Herons', 'Garzas'];
    expect(linkNames(side!)).toEqual(names);
    expect(linkNames(compact!)).toEqual(names);
  });

  it('names each group’s list by its caption, unique in each copy', () => {
    const { container } = render(layout());
    const lists = [...container.querySelectorAll('ul.sw-docs-layout-list')];
    expect(lists).toHaveLength(4);
    const ids = lists.map((list) => list.getAttribute('aria-labelledby')!);
    expect(new Set(ids).size).toBe(4);
    expect(
      lists.map(
        (list) =>
          document.getElementById(list.getAttribute('aria-labelledby')!)
            ?.textContent,
      ),
    ).toEqual(['Start here', 'Birds', 'Start here', 'Birds']);
    expect(
      container.querySelector('.sw-docs-layout-group-label')?.tagName,
    ).toBe('P');
  });

  it('marks the current page and passes languages and tab stops', () => {
    const { container } = render(
      layout({
        groups: [
          {
            id: 'birds',
            label: 'Birds',
            items: [
              { id: 'a', label: 'Page', href: '/a', current: 'page' },
              { id: 'b', label: 'Location', href: '/b', current: 'location' },
              { id: 'c', label: 'True', href: '/c', current: true },
              { id: 'd', label: 'None', href: '/d', current: false },
              {
                id: 'e',
                label: 'Garzas',
                href: '/e',
                lang: 'es',
                hrefLang: 'es',
              },
            ],
          },
        ],
      }),
    );
    const side = container.querySelector('.sw-docs-layout-side nav')!;
    const links = within(side as HTMLElement).getAllByRole('link');
    expect(links.map((link) => link.getAttribute('aria-current'))).toEqual([
      'page',
      'location',
      'true',
      null,
      null,
    ]);
    expect(links[4]!.getAttribute('lang')).toBe('es');
    expect(links[4]!.getAttribute('hreflang')).toBe('es');
    expect(links.every((link) => link.getAttribute('tabindex') === '0')).toBe(
      true,
    );
    expect(links[0]!.className).toBe('sw-docs-layout-link');
  });

  it('draws the disclosure’s summary with the consumer’s words and a hidden chevron', () => {
    const { container } = render(layout());
    const summary = container.querySelector('summary')!;
    expect(summary.className).toBe('sw-docs-layout-summary');
    expect(summary.textContent).toBe('Browse the guide');
    expect(
      summary
        .querySelector('.sw-docs-layout-marker')
        ?.getAttribute('aria-hidden'),
    ).toBe('true');
  });

  it('draws the aside column only when given', () => {
    const without = render(layout());
    expect(without.container.querySelector('.sw-docs-layout-aside')).toBeNull();
    cleanup();
    for (const empty of [null, false, undefined])
      expect(
        render(layout({ aside: empty })).container.querySelector(
          '.sw-docs-layout-aside',
        ),
      ).toBeNull();
    cleanup();
    const { container } = render(
      layout({ aside: <nav aria-label="On this page" /> }),
    );
    const root = container.firstElementChild!;
    expect(root.className).toBe('sw-docs-layout sw-docs-layout-with-aside');
    expect(root.lastElementChild!.className).toBe('sw-docs-layout-aside');
    expect(
      root
        .querySelector('.sw-docs-layout-aside > nav')
        ?.getAttribute('aria-label'),
    ).toBe('On this page');
  });

  it('renders on the server, with no script, as a closed native details with every link twice', () => {
    const html = renderToString(layout());
    expect(html).toContain('<details class="sw-docs-layout-disclosure">');
    expect(html).not.toContain(
      '<details class="sw-docs-layout-disclosure" open',
    );
    expect(html.match(/href="\/guide\/herons"/g)).toHaveLength(2);
  });

  it.each([
    [{ navLabel: ' ' }, 'DocsLayout needs a nonempty navLabel'],
    [{ labels: { openNav: '' } }, 'DocsLayout labels need a nonempty openNav'],
    [{ groups: [] }, 'DocsLayout needs at least one group'],
    [
      { groups: [{ id: 'a', label: 'A', items: [] }] },
      'DocsLayout group a needs an item',
    ],
    [
      { groups: [{ id: ' ', label: 'A', items: groups[0]!.items }] },
      'DocsLayout groups need nonempty ids and labels',
    ],
    [
      { groups: [{ id: 'a', label: ' ', items: groups[0]!.items }] },
      'DocsLayout groups need nonempty ids and labels',
    ],
    [
      { groups: [groups[0]!, { ...groups[1]!, id: 'start' }] },
      'DocsLayout groups need unique ids',
    ],
    [
      {
        groups: [
          groups[0]!,
          {
            ...groups[1]!,
            items: [{ id: 'home', label: 'Again', href: '/again' }],
          },
        ],
      },
      'DocsLayout items need unique ids',
    ],
    [
      {
        groups: [
          { id: 'a', label: 'A', items: [{ id: '', label: 'X', href: '/x' }] },
        ],
      },
      'DocsLayout items need nonempty ids and labels',
    ],
    [
      {
        groups: [
          { id: 'a', label: 'A', items: [{ id: 'x', label: ' ', href: '/x' }] },
        ],
      },
      'DocsLayout items need nonempty ids and labels',
    ],
    [
      {
        groups: [
          { id: 'a', label: 'A', items: [{ id: 'x', label: 'X', href: ' ' }] },
        ],
      },
      'DocsLayout items need nonempty hrefs',
    ],
  ] as const)(
    'throws a RangeError on invalid props (%#)',
    (overrides, message) => {
      expect(() =>
        render(layout(overrides as Partial<DocsLayoutProps>)),
      ).toThrow(new RangeError(message));
    },
  );
});

describe('DocsLayout CSS', () => {
  it('centres the frame on the site header bar’s width and gutters', () => {
    expect(css).toContain(
      '.sw-docs-layout {\n  --sw-docs-layout-top: var(--sw-space-5);\n  box-sizing: border-box;\n  margin-inline: auto;\n  max-width: calc(var(--sw-container-max) + 2 * var(--sw-space-5));\n  padding-block: var(--sw-space-5);\n  padding-inline: var(--sw-space-4);',
    );
    expect(css).toContain(
      '@media (min-width: 48rem) {\n  .sw-docs-layout { padding-inline: var(--sw-space-5); }\n}',
    );
    expect(css).toContain(
      '.sw-docs-layout-body {\n  max-width: var(--sw-reading-max);\n}',
    );
  });

  it('shows the side column from lg, the aside from 80rem, and hides the disclosure from lg', () => {
    expect(css).toContain(
      '.sw-docs-layout-side,\n.sw-docs-layout-aside {\n  display: none;\n}',
    );
    expect(css).toContain(
      '@media (min-width: 64rem) {\n  .sw-docs-layout {\n    align-items: start;\n    column-gap: var(--sw-space-8);\n    display: grid;\n    grid-template-columns: 15rem minmax(0, 1fr);',
    );
    expect(css).toContain(
      '  .sw-docs-layout-disclosure {\n    display: none;\n  }',
    );
    expect(css).toContain(
      '@media (min-width: 80rem) {\n  .sw-docs-layout-with-aside {\n    column-gap: var(--sw-space-6);\n    grid-template-columns: 15rem minmax(0, 1fr) 13rem;\n  }\n\n  .sw-docs-layout-aside {\n    display: block;\n  }\n}',
    );
  });

  it('sticks the side columns below a sticky SiteHeader’s wide bar', () => {
    expect(css).toContain(
      'html:has(.sw-site-header-sticky) .sw-docs-layout {\n  --sw-docs-layout-top: calc(calc(var(--sw-control-md-min-height) + var(--sw-space-5) + var(--sw-space-1)) + 1px + var(--sw-space-5));\n}',
    );
    expect(css).toContain(
      '    max-height: calc(100dvh - var(--sw-docs-layout-top) - var(--sw-space-5));\n    overflow-y: auto;\n    overscroll-behavior: contain;\n    position: sticky;\n    top: var(--sw-docs-layout-top);',
    );
  });

  it('marks the current link with the quiet fill at label weight, 44 px on a coarse pointer, Highlight in forced colours', () => {
    expect(css).toContain(
      '[data-theme] .sw-docs-layout-link[aria-current] {\n  background: color-mix(in srgb, var(--sw-color-muted) 18%, transparent);\n  font-weight: 600;\n}',
    );
    expect(css).toContain(
      '@media (pointer: coarse) {\n  [data-theme] .sw-docs-layout-link { min-height: var(--sw-control-md-min-height); }\n}',
    );
    expect(css).toContain(
      '  [data-theme] .sw-docs-layout-link { color: LinkText; }\n  [data-theme] .sw-docs-layout-link[aria-current] { border-color: Highlight; }',
    );
  });

  it('draws the disclosure’s summary at least the md control tall with no user-agent marker', () => {
    expect(css).toContain(
      '  min-height: var(--sw-control-md-min-height);\n  padding: var(--sw-space-2) var(--sw-space-4);',
    );
    expect(css).toContain(
      '.sw-docs-layout-summary::-webkit-details-marker {\n  display: none;\n}',
    );
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-docs-layout',
        'sw-docs-layout-with-aside',
        'sw-docs-layout-disclosure',
        'sw-docs-layout-link',
      ]),
    );
  });
});
