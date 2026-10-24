import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { cssThemeFrameRules, themeFrames } from './css/css-theme-frame.js';
import { generateStylesheet } from './css/stylesheet.js';
import { ThemeProvider } from './theme/ThemeProvider.js';

afterEach(() => cleanup());

describe('ThemeProvider frame', () => {
  it('leaves the root unmarked by default and marks a site frame', () => {
    const { container } = render(
      <ThemeProvider colorScheme="light">
        <main>Marsh</main>
      </ThemeProvider>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.hasAttribute('data-frame')).toBe(false);
    cleanup();
    const site = render(
      <ThemeProvider colorScheme="light" frame="site">
        <header>Trust</header>
        <main>Marsh</main>
        <footer>Legal</footer>
      </ThemeProvider>,
    );
    expect(
      (site.container.firstElementChild as HTMLElement).dataset.frame,
    ).toBe('site');
    expect(screen.getByRole('main').textContent).toBe('Marsh');
  });

  it('refuses an unknown frame', () => {
    expect(() =>
      render(
        <ThemeProvider frame={'poster' as never}>
          <main>Marsh</main>
        </ThemeProvider>,
      ),
    ).toThrow(new RangeError('Unknown ThemeProvider frame: poster'));
    expect(themeFrames).toEqual(['none', 'site']);
  });

  it('makes the site root a column with its last child at its foot', () => {
    const rules = cssThemeFrameRules();
    expect(rules).toContain(
      "[data-theme][data-frame='site'] {\n  display: flex;\n  flex-direction: column;\n}",
    );
    expect(rules).toContain(
      "[data-theme][data-frame='site'] > :last-child {\n  margin-top: auto;\n}",
    );
    expect(generateStylesheet()).toContain(rules);
  });
});
