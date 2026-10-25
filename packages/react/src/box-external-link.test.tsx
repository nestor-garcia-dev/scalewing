import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Box } from './components/Box.js';
import { externalLinkRel } from './components/box/external-link.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => cleanup());

const map = 'https://maps.example.org/?q=north+marsh';

describe('Box external link', () => {
  it('opens a new tab without an opener and says so after its name', () => {
    render(
      <Box as="a" external href={map} newTabLabel="(opens in a new tab)">
        Check the marsh map
      </Box>,
    );
    const link = screen.getByRole('link', {
      name: /^Check the marsh map ?\(opens in a new tab\)$/,
    });
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    expect(link.getAttribute('tabindex')).toBe('0');
    const [mark, hidden] = Array.from(link.querySelectorAll('span'));
    expect(mark.className).toBe('sw-link-external-mark');
    expect(mark.getAttribute('aria-hidden')).toBe('true');
    expect(mark.textContent).toBe('');
    expect(hidden.className).toBe('sw-sr-only');
    expect(hidden.textContent).toBe(' (opens in a new tab)');
    // The mark follows the words with no space, so it never wraps alone.
    expect(link.firstChild?.textContent).toBe('Check the marsh map');
    expect(link.childNodes[1]).toBe(mark);
  });

  it('takes the words in your language', () => {
    render(
      <Box
        as="a"
        external
        href={map}
        newTabLabel="(se abre en una pestaña nueva)"
      >
        Ver el mapa
      </Box>,
    );
    expect(
      screen.getByRole('link', {
        name: /^Ver el mapa ?\(se abre en una pestaña nueva\)$/,
      }),
    ).toBeTruthy();
  });

  it('keeps your rel words and adds the new-tab ones once', () => {
    expect(externalLinkRel(undefined)).toBe('noopener noreferrer');
    expect(externalLinkRel(' nofollow  noopener ')).toBe(
      'nofollow noopener noreferrer',
    );
    render(
      <Box
        as="a"
        external
        href={map}
        link="quiet"
        newTabLabel="(opens in a new tab)"
        rel="nofollow"
        target="_self"
      >
        Map
      </Box>,
    );
    const link = screen.getByRole('link');
    expect(link.getAttribute('rel')).toBe('nofollow noopener noreferrer');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.className).toBe('sw-link-quiet');
  });

  it('leaves a link that is not external alone', () => {
    render(
      <Box as="a" external={false} href="#heron" rel="next" target="_self">
        Heron
      </Box>,
    );
    const link = screen.getByRole('link', { name: 'Heron' });
    expect(link.getAttribute('rel')).toBe('next');
    expect(link.getAttribute('target')).toBe('_self');
    expect(link.querySelector('span')).toBeNull();
  });

  it('throws when it is not a link, has no words, or words without external', () => {
    expect(() =>
      render(
        <Box external newTabLabel="(opens in a new tab)">
          Heron
        </Box>,
      ),
    ).toThrow(new TypeError('Box external is for a link (as="a")'));
    for (const newTabLabel of [undefined, ' ']) {
      expect(() =>
        render(
          <Box as="a" external href={map} newTabLabel={newTabLabel}>
            Heron
          </Box>,
        ),
      ).toThrow(new RangeError('Box external needs a non-empty newTabLabel'));
    }
    expect(() =>
      render(
        <Box as="a" href={map} newTabLabel="(opens in a new tab)">
          Heron
        </Box>,
      ),
    ).toThrow(new TypeError('Box newTabLabel is for an external link'));
    expect(() =>
      render(
        <Box
          as="a"
          external={'yes' as unknown as boolean}
          href={map}
          newTabLabel="(opens in a new tab)"
        >
          Heron
        </Box>,
      ),
    ).toThrow(new RangeError('Box external must be a boolean'));
  });

  it('generates the mark from borders in the link colour, mirrored right to left', () => {
    const css = generateStylesheet();
    expect(utilityClassCatalog()).toContain('sw-link-external-mark');
    expect(css).toContain(`.sw-link-external-mark {
  border-right: 2px solid currentColor;
  border-top: 2px solid currentColor;`);
    expect(css).toContain(`.sw-link-external-mark::after {
  border-left: 2px solid currentColor;`);
    expect(css).toContain(
      '.sw-link-external-mark:dir(rtl) { transform: scaleX(-1); }',
    );
    expect(css).not.toMatch(/sw-link-external-mark[^}]*#[0-9a-f]{3,6}/i);
  });
});
