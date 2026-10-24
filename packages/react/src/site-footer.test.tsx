import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { SiteFooter, type SiteFooterGroup } from './components/SiteFooter.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => cleanup());

const css = generateStylesheet();

const groups: SiteFooterGroup[] = [
  {
    id: 'visit',
    label: 'Visit',
    links: [
      { id: 'marsh', label: 'North marsh', href: '/marsh' },
      { id: 'hide', label: 'Heron hide', href: '/hide', current: true },
    ],
  },
  {
    id: 'about',
    label: 'About',
    links: [{ id: 'team', label: 'Field team', href: '/team' }],
  },
];

describe('SiteFooter', () => {
  it('draws the brand, tagline, named link groups and the bottom row on the inverse band', () => {
    render(
      <SiteFooter
        brand={<img alt="Wetland Trust" src="/logo.svg" />}
        end={
          <a href="/es" hrefLang="es" lang="es">
            Español
          </a>
        }
        groups={groups}
        legal="© Wetland Trust"
        tagline="Counting birds since 1990."
      />,
    );
    const footer = screen.getByRole('contentinfo');
    expect(footer.className).toBe(
      'sw-band sw-band-inverse sw-padding-y-8 sw-padding-bottom-6 sw-site-footer',
    );
    expect(
      within(footer).getByRole('img', { name: 'Wetland Trust' }),
    ).toBeTruthy();
    expect(footer.querySelector('.sw-site-footer-tagline')?.textContent).toBe(
      'Counting birds since 1990.',
    );

    const visit = within(footer).getByRole('navigation', { name: 'Visit' });
    const links = within(visit).getAllByRole('link');
    expect(links.map((link) => link.textContent)).toEqual([
      'North marsh',
      'Heron hide',
    ]);
    expect(links[0]!.getAttribute('aria-current')).toBeNull();
    expect(links[1]!.getAttribute('aria-current')).toBe('page');
    expect(links[1]!.getAttribute('tabindex')).toBe('0');
    expect(
      visit.querySelector('.sw-site-footer-label')?.getAttribute('aria-hidden'),
    ).toBe('true');
    expect(
      within(footer).getByRole('navigation', { name: 'About' }),
    ).toBeTruthy();

    const bottom = footer.querySelector('.sw-site-footer-bottom')!;
    expect(bottom.querySelector('.sw-site-footer-legal')?.textContent).toBe(
      '© Wetland Trust',
    );
    const language = within(bottom as HTMLElement).getByRole('link', {
      name: 'Español',
    });
    expect(language.getAttribute('lang')).toBe('es');
  });

  it('passes a link’s language and target language', () => {
    render(
      <SiteFooter
        brand="Trust"
        groups={[
          {
            id: 'g',
            label: 'Language',
            links: [
              {
                id: 'es',
                label: 'Español',
                href: '/es',
                hrefLang: 'es',
                lang: 'es',
              },
            ],
          },
        ]}
      />,
    );
    const link = screen.getByRole('link', { name: 'Español' });
    expect(link.getAttribute('lang')).toBe('es');
    expect(link.getAttribute('hreflang')).toBe('es');
  });

  it('leaves out the tagline and the bottom row when they are not given', () => {
    const { container } = render(<SiteFooter brand="Trust" groups={groups} />);
    expect(container.querySelector('.sw-site-footer-tagline')).toBeNull();
    expect(container.querySelector('.sw-site-footer-bottom')).toBeNull();
  });

  it('treats an empty or false slot as left out', () => {
    const { container } = render(
      <SiteFooter
        brand="Trust"
        end={false}
        groups={groups}
        legal=""
        tagline=""
      />,
    );
    expect(container.querySelector('.sw-site-footer-tagline')).toBeNull();
    expect(container.querySelector('.sw-site-footer-bottom')).toBeNull();
  });

  it('draws a bottom row with only its end', () => {
    const { container } = render(
      <SiteFooter brand="Trust" end="English" groups={groups} />,
    );
    const bottom = container.querySelector('.sw-site-footer-bottom')!;
    expect(bottom.querySelector('.sw-site-footer-legal')).toBeNull();
    expect(bottom.querySelector('.sw-site-footer-end')?.textContent).toBe(
      'English',
    );
  });

  it.each([
    [[], 'SiteFooter needs at least one group'],
    [
      [{ id: ' ', label: 'Visit', links: groups[0]!.links }],
      'SiteFooter groups need nonempty ids and labels',
    ],
    [
      [{ id: 'v', label: ' ', links: groups[0]!.links }],
      'SiteFooter groups need nonempty ids and labels',
    ],
    [[groups[0]!, groups[0]!], 'SiteFooter groups need unique ids'],
    [
      [{ id: 'v', label: 'Visit', links: [] }],
      'SiteFooter group v needs a link',
    ],
    [
      [
        {
          id: 'v',
          label: 'Visit',
          links: [{ id: 'a', label: 'A', href: ' ' }],
        },
      ],
      'SiteFooter group v links need nonempty ids, labels and hrefs',
    ],
    [
      [
        {
          id: 'v',
          label: 'Visit',
          links: [{ id: 'a', label: '', href: '/a' }],
        },
      ],
      'SiteFooter group v links need nonempty ids, labels and hrefs',
    ],
    [
      [
        {
          id: 'v',
          label: 'Visit',
          links: [{ id: '', label: 'A', href: '/a' }],
        },
      ],
      'SiteFooter group v links need nonempty ids, labels and hrefs',
    ],
    [
      [
        {
          id: 'v',
          label: 'Visit',
          links: [
            { id: 'a', label: 'A', href: '/a' },
            { id: 'a', label: 'B', href: '/b' },
          ],
        },
      ],
      'SiteFooter group v links need unique ids',
    ],
  ] as const)('throws on invalid groups (%#)', (invalid, message) => {
    expect(() => render(<SiteFooter brand="Trust" groups={invalid} />)).toThrow(
      message,
    );
  });
});

describe('SiteFooter CSS', () => {
  it('lays the groups in two columns on a phone and one spread row from md', () => {
    expect(css).toContain(
      '.sw-site-footer-top {\n  display: grid;\n  gap: var(--sw-space-6) var(--sw-space-5);\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n}',
    );
    expect(css).toContain('  grid-column: 1 / -1;\n  max-width: 20rem;');
    expect(css).toContain(
      '@media (min-width: 48rem) {\n  .sw-site-footer-top {\n    display: flex;',
    );
  });

  it('draws links in the band’s muted words, the current one and hover in its words', () => {
    expect(css).toContain(
      '[data-theme] .sw-band-inverse a.sw-site-footer-link {\n  color: var(--sw-color-muted);',
    );
    expect(css).toContain(
      '[data-theme] .sw-band-inverse a.sw-site-footer-link:is(:hover, :focus-visible) {\n  color: var(--sw-color-text);\n  text-decoration-color: currentColor;\n}',
    );
    expect(css).toContain(
      "[data-theme] .sw-band-inverse a.sw-site-footer-link[aria-current='page'] {\n  color: var(--sw-color-text);\n  font-weight: 600;\n}",
    );
    // After the band's running-text link rule, which it overrides.
    expect(
      css.indexOf('[data-theme] .sw-band-inverse a.sw-site-footer-link {'),
    ).toBeGreaterThan(
      css.indexOf('[data-theme] .sw-band-inverse a:not(.sw-button) {'),
    );
  });

  it('gives links the touch target on a coarse pointer and link colours in forced colours', () => {
    expect(css).toContain(
      '  [data-theme] .sw-band-inverse a.sw-site-footer-link {\n    align-items: center;\n    min-height: var(--sw-control-md-min-height);\n  }',
    );
    expect(css).toContain(
      '  [data-theme] .sw-band-inverse a.sw-site-footer-link {\n    color: LinkText;\n  }',
    );
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-site-footer',
        'sw-site-footer-link',
        'sw-site-footer-bottom',
      ]),
    );
  });
});
