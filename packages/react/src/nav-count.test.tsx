import { contrastRatio } from '@scalewing/tokens';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Box } from './components/Box.js';
import { Button } from './components/Button.js';
import { Nav } from './components/Nav.js';
import { NavCount, navCountTones } from './components/NavCount.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';
import {
  forEveryTheme,
  glassOverBackground,
} from './every-theme.test-support.js';

afterEach(() => cleanup());

describe('NavCount', () => {
  it('reads a count after a word in its link’s name, as a pill', () => {
    render(
      <Nav appearance="words" aria-label="Areas">
        <Box as="a" href="#vault">
          Vault
        </Box>
        <Box aria-current="page" as="a" href="#tasks">
          Tasks
          <NavCount count={8} />
        </Box>
      </Nav>,
    );
    const link = screen.getByRole('link', { name: 'Tasks 8' });
    const pill = link.querySelector('.sw-nav-count');
    expect(pill?.textContent).toBe('8');
    expect(pill?.hasAttribute('aria-hidden')).toBe(false);
    expect(link.textContent).toBe('Tasks 8');
  });

  it('says what the count means in place of the bare number', () => {
    render(
      <Nav appearance="words" aria-label="Areas">
        <Button onPress={() => undefined} size="sm" variant="ghost">
          Tasks
          <NavCount count={8} countLabel="8 tasks to do" />
        </Button>
      </Nav>,
    );
    const button = screen.getByRole('button', { name: 'Tasks 8 tasks to do' });
    expect(
      button.querySelector('.sw-nav-count')?.getAttribute('aria-hidden'),
    ).toBe('true');
    expect(button.querySelector('.sw-sr-only')?.textContent).toBe(
      '8 tasks to do',
    );
  });

  it('shows nothing for no count', () => {
    render(
      <Box as="a" href="#tasks">
        Tasks
        <NavCount count={0} countLabel="nothing to do" />
      </Box>,
    );
    expect(screen.getByRole('link', { name: 'Tasks' }).textContent).toBe(
      'Tasks',
    );
  });

  it('refuses a count that is not a whole number and an empty label', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    for (const count of [-1, 2.5, Number.NaN])
      expect(() => render(<NavCount count={count} />)).toThrow(
        'NavCount count must be a whole number from 0',
      );
    expect(() => render(<NavCount count={3} countLabel=" " />)).toThrow(
      'NavCount countLabel must be non-empty text',
    );
  });

  it('counts a destination in a default-appearance Nav too', () => {
    render(
      <Nav aria-label="Areas">
        <Box as="a" href="#tasks">
          Tasks
          <NavCount count={2} />
        </Box>
      </Nav>,
    );
    expect(screen.getByRole('link', { name: 'Tasks 2' })).toBeTruthy();
  });

  it('lays out a link with a count as SectionNav’s, the pill a space-2 after the words', () => {
    expect(generateStylesheet()).toContain(
      ':where(.sw-nav a:has(> .sw-nav-count)) {\n  align-items: center;\n  display: inline-flex;\n  gap: var(--sw-space-2);\n}',
    );
  });

  it('draws a danger pill by default and an accent pill for news', () => {
    render(
      <Nav appearance="words" aria-label="Areas">
        <Box as="a" href="#tasks">
          Tasks
          <NavCount count={8} />
        </Box>
        <Box as="a" href="#library">
          Library
          <NavCount count={3} countLabel="3 new" tone="accent" />
        </Box>
        <Box as="a" href="#alerts">
          Alerts
          <NavCount count={2} tone="danger" />
        </Box>
      </Nav>,
    );
    const tasks = screen.getByRole('link', { name: 'Tasks 8' });
    expect(tasks.querySelector('.sw-nav-count')?.className).toBe(
      'sw-nav-count',
    );
    const library = screen.getByRole('link', { name: 'Library 3 new' });
    expect(library.querySelector('.sw-nav-count')?.className).toBe(
      'sw-nav-count sw-nav-count-accent',
    );
    expect(
      library.querySelector('.sw-nav-count')?.getAttribute('aria-hidden'),
    ).toBe('true');
    expect(
      screen
        .getByRole('link', { name: 'Alerts 2' })
        .querySelector('.sw-nav-count')?.className,
    ).toBe('sw-nav-count');
    expect(navCountTones).toEqual(['danger', 'accent']);
  });

  it('fills the accent pill from the accent colour with its on-colour figures', () => {
    expect(generateStylesheet()).toContain(
      '[data-theme] .sw-nav-count.sw-nav-count-accent {\n  background: var(--sw-color-accent);\n  color: var(--sw-color-onAccent);\n}',
    );
  });

  it('keeps the accent pill legible and apart from the page in every palette', () => {
    forEveryTheme((colors, label, theme) => {
      expect(
        contrastRatio(colors.onAccent, colors.accent),
        label,
      ).toBeGreaterThanOrEqual(4.5);
      // The pill against the light or dark canvas and the glass bar.
      expect(
        contrastRatio(colors.accent, colors.background),
        label,
      ).toBeGreaterThanOrEqual(3);
      expect(
        contrastRatio(colors.accent, glassOverBackground(theme)),
        label,
      ).toBeGreaterThanOrEqual(3);
      expect(colors.accent).not.toBe(colors.danger);
    });
  });

  it('refuses an unknown tone', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() =>
      render(<NavCount count={3} tone={'warning' as never} />),
    ).toThrow('Unknown NavCount tone: warning');
    expect(() => render(<NavCount count={3} tone={null as never} />)).toThrow(
      'Unknown NavCount tone: null',
    );
  });

  it('catalogs the shared pill and its accent tone', () => {
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-nav-count',
        'sw-nav-count-accent',
        'sw-section-nav-count',
      ]),
    );
  });
});
