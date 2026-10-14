import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Box } from './components/Box.js';
import { Button } from './components/Button.js';
import { Nav } from './components/Nav.js';
import { NavCount } from './components/NavCount.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

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

  it('catalogs the shared pill', () => {
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining(['sw-nav-count', 'sw-section-nav-count']),
    );
  });
});
