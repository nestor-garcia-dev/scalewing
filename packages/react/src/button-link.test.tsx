import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { ButtonLink } from './components/ButtonLink.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => cleanup());

const css = generateStylesheet();

describe('ButtonLink', () => {
  it('is a link with the primary md Button classes and a tab stop', () => {
    render(<ButtonLink href="/contact">Contact the rangers</ButtonLink>);
    const link = screen.getByRole('link', { name: 'Contact the rangers' });
    expect(link.getAttribute('href')).toBe('/contact');
    expect(link.className).toBe(
      'sw-button sw-button-primary sw-button-md sw-button-link',
    );
    expect(link.getAttribute('tabindex')).toBe('0');
  });

  it('takes a variant, size, width, class, current page and a ref', () => {
    let element: HTMLAnchorElement | null = null;
    render(
      <ButtonLink
        aria-current="page"
        className="extra"
        href="/contact"
        hrefLang="es"
        ref={(node) => {
          element = node;
        }}
        size="sm"
        tabIndex={-1}
        variant="neutral"
        width="full"
      >
        Contacto
      </ButtonLink>,
    );
    const link = screen.getByRole('link', { name: 'Contacto' });
    expect(link.className).toBe(
      'sw-button sw-button-neutral sw-button-sm sw-button-link sw-button-full extra',
    );
    expect(link.getAttribute('aria-current')).toBe('page');
    expect(link.getAttribute('hreflang')).toBe('es');
    expect(link.getAttribute('tabindex')).toBe('-1');
    expect(element).toBe(link);
  });

  it('throws on an unknown variant, size or width', () => {
    expect(() =>
      render(
        <ButtonLink href="/" variant={'link' as never}>
          x
        </ButtonLink>,
      ),
    ).toThrow('Unknown ButtonLink variant: link');
    expect(() =>
      render(
        <ButtonLink href="/" size={'lg' as never}>
          x
        </ButtonLink>,
      ),
    ).toThrow('Unknown ButtonLink size: lg');
    expect(() =>
      render(
        <ButtonLink href="/" width={'wide' as never}>
          x
        </ButtonLink>,
      ),
    ).toThrow('Unknown ButtonLink width: wide');
  });
});

describe('ButtonLink CSS', () => {
  it('keeps each variant’s words over the canvas link colour, hover included', () => {
    expect(css).toContain(
      '[data-theme] a.sw-button-link {\n  text-decoration: none;\n}',
    );
    for (const [variant, words] of [
      ['primary', 'onAccent'],
      ['secondary', 'onSecondary'],
      ['tertiary', 'onTertiary'],
      ['ghost', 'accent'],
      ['danger', 'onDanger'],
      ['neutral', 'text'],
    ])
      expect(css).toContain(
        `[data-theme] a.sw-button-link.sw-button-${variant},\n[data-theme] a.sw-button-link.sw-button-${variant}:hover { color: var(--sw-color-${words}); }`,
      );
    // After the canvas's link rules, so equal specificity resolves to it.
    expect(css.indexOf('[data-theme] a.sw-button-link {')).toBeGreaterThan(
      css.indexOf('[data-theme] a:hover {'),
    );
  });

  it('rings the current page as a pressed button, a Highlight ring and link words in forced colours', () => {
    expect(css).toContain(
      "[data-theme] a.sw-button-link[aria-current='page'] {\n  box-shadow: 0 0 0 2px var(--sw-color-background), 0 0 0 4px var(--sw-color-accent);\n}",
    );
    expect(css).toContain(
      "[data-theme] a.sw-button-link[aria-current='page']:focus-visible {\n  outline-offset: calc(var(--sw-focus-ring-offset) + 4px);\n}",
    );
    expect(css).toContain(
      "  [data-theme] a.sw-button-link[aria-current='page'] { border-color: Highlight; position: relative; }",
    );
    expect(css).toContain(
      "  [data-theme] a.sw-button-link[aria-current='page']::after { border: 2px solid Highlight; border-radius: inherit; content: ''; inset: calc(-1px - 4px); pointer-events: none; position: absolute; }",
    );
    expect(css).toContain(
      '  [data-theme] a.sw-button-link { color: LinkText; }',
    );
    expect(utilityClassCatalog()).toContain('sw-button-link');
  });
});
