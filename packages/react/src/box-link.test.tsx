import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Box, type BoxLink } from './components/Box.js';
import { boxLinkAppearances } from './index.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => cleanup());

describe('Box link', () => {
  it('lists its looks', () => {
    expect(boxLinkAppearances).toEqual(['accent', 'quiet']);
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
});
