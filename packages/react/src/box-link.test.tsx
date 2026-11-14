import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Box, type BoxLink } from './components/Box.js';
import { boxLinkAppearances } from './index.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => cleanup());

describe('Box link', () => {
  it('lists its looks', () => {
    expect(boxLinkAppearances).toEqual(['accent', 'quiet', 'inline']);
  });

  it('keeps the canvas link by default and for accent', () => {
    render(
      <>
        <Box as="a" href="#heron">
          Heron
        </Box>
        <Box as="a" href="#egret" link="accent">
          Egret
        </Box>
      </>,
    );
    expect(screen.getByRole('link', { name: 'Heron' }).className).toBe('');
    expect(screen.getByRole('link', { name: 'Egret' }).className).toBe('');
  });

  it('marks a quiet link with its generated class, before a consumer class', () => {
    render(
      <Box as="a" className="row-title" href="#heron" link="quiet">
        Heron
      </Box>,
    );
    expect(screen.getByRole('link', { name: 'Heron' }).className).toBe(
      'sw-link-quiet row-title',
    );
  });

  it('marks an inline link with its generated class, before a consumer class', () => {
    render(
      <Box as="a" className="field-note" href="#heron" link="inline">
        Heron
      </Box>,
    );
    expect(screen.getByRole('link', { name: 'Heron' }).className).toBe(
      'sw-link-inline field-note',
    );
  });

  it('throws for an unknown look', () => {
    expect(() =>
      render(
        <Box as="a" href="#heron" link={'loud' as BoxLink}>
          Heron
        </Box>,
      ),
    ).toThrow(new RangeError('Unknown Box link: loud'));
  });

  it.each(boxLinkAppearances)(
    'throws for link="%s" when the box is not a link',
    (link) => {
      expect(() => render(<Box link={link}>Heron</Box>)).toThrow(
        new TypeError('Box link is for a link (as="a")'),
      );
    },
  );

  it('generates the quiet look: the text colour at 600, underlined on hover and focus', () => {
    const css = generateStylesheet();
    expect(utilityClassCatalog()).toContain('sw-link-quiet');
    expect(css).toContain(`[data-theme] a.sw-link-quiet {
  color: inherit;
  font-weight: 600;
}`);
    expect(css).toContain(`[data-theme] a.sw-link-quiet:hover,
[data-theme] a.sw-link-quiet:focus-visible {
  color: inherit;
  text-decoration-line: underline;
}`);
    // After the canvas link rules it overrides.
    expect(css.indexOf('[data-theme] a.sw-link-quiet {')).toBeGreaterThan(
      css.indexOf('[data-theme] a:hover {'),
    );
  });

  it('generates the inline look: the accent, always underlined, stronger on hover and focus', () => {
    const css = generateStylesheet();
    expect(utilityClassCatalog()).toContain('sw-link-inline');
    expect(css).toContain(`[data-theme] a.sw-link-inline {
  color: var(--sw-color-accent);
  text-decoration-color: color-mix(in srgb, currentColor 60%, transparent);
  text-decoration-line: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.18em;
}`);
    expect(css).toContain(`[data-theme] a.sw-link-inline:hover,
[data-theme] a.sw-link-inline:focus-visible {
  color: var(--sw-color-accent);
  text-decoration-color: currentColor;
  text-decoration-thickness: var(--sw-focus-ring-width);
}`);
    // After the canvas link rules it overrides, the hover's text colour too.
    expect(css.indexOf('[data-theme] a.sw-link-inline {')).toBeGreaterThan(
      css.indexOf('[data-theme] a:hover {'),
    );
  });
});
