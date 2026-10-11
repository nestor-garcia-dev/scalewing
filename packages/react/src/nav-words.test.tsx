import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Box } from './components/Box.js';
import { Button } from './components/Button.js';
import { Nav, type NavAppearance } from './components/Nav.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => cleanup());

describe('Nav appearance', () => {
  it('keeps the default cluster', () => {
    render(
      <Nav aria-label="Habitats">
        <Box as="a" href="#forest">
          Forest
        </Box>
      </Nav>,
    );
    expect(screen.getByRole('navigation').className).toBe('sw-nav');
  });

  it('marks a words-only Nav and leaves its links and Buttons as they are', () => {
    render(
      <Nav appearance="words" aria-label="Habitats">
        <Box aria-current="page" as="a" href="#forest">
          Forest
        </Box>
        <Button onPress={() => undefined} size="sm" variant="ghost">
          Savanna
        </Button>
      </Nav>,
    );
    const nav = screen.getByRole('navigation', { name: 'Habitats' });
    expect(nav.className).toBe('sw-nav sw-nav-words');
    expect(
      screen.getByRole('link', { name: 'Forest' }).getAttribute('aria-current'),
    ).toBe('page');
    expect(screen.getByRole('button', { name: 'Savanna' }).className).toBe(
      'sw-button sw-button-ghost sw-button-sm',
    );
  });

  it('fails closed on an unknown appearance', () => {
    expect(() =>
      render(<Nav appearance={'pills' as NavAppearance} aria-label="x" />),
    ).toThrow(RangeError);
  });

  it('generates muted words, the current one in the text color at label weight', () => {
    const css = generateStylesheet();
    expect(utilityClassCatalog()).toContain('sw-nav-words');
    expect(css).toMatch(
      /\.sw-nav\.sw-nav-words :is\(a, \.sw-button\) \{[^}]*background: transparent;[^}]*border: 1px solid transparent;[^}]*color: var\(--sw-color-muted\);/,
    );
    expect(css).toMatch(
      /\.sw-nav\.sw-nav-words :is\(a, \.sw-button\)\[aria-current\]:not\(\[aria-current='false'\]\) \{[^}]*color: var\(--sw-color-text\);[^}]*font-weight: 600;/,
    );
    expect(css).toMatch(
      /@media \(hover: hover\) \{\s*\.sw-nav\.sw-nav-words :is\(a, \.sw-button\):hover:not\(:disabled, \[aria-disabled='true'\]\)/,
    );
    expect(css).toContain(
      ".sw-nav.sw-nav-words :is(a, .sw-button)[aria-current]:not([aria-current='false']) { border-color: Highlight; text-decoration: underline; }",
    );
    // After the Button variants, so a primary Button in the Nav loses its fill.
    expect(
      css.indexOf('.sw-nav.sw-nav-words :is(a, .sw-button) {'),
    ).toBeGreaterThan(css.indexOf('.sw-button-primary {'));
  });
});
