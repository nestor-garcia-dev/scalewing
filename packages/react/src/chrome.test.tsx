import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AppHeader } from './components/AppHeader.js';
import { Nav } from './components/Nav.js';
import { Text } from './components/Text.js';
import { ThemeProvider } from './theme/ThemeProvider.js';

describe('AppHeader', () => {
  it('renders a sticky glass header landmark', () => {
    render(
      <ThemeProvider colorScheme="light">
        <AppHeader>
          <Text>Sunday kickoff</Text>
        </AppHeader>
      </ThemeProvider>,
    );

    const header = screen.getByRole('banner');
    expect(header.tagName).toBe('HEADER');
    expect(header.className).toContain('sw-app-header');
    expect(header.className).toContain('sw-app-header-sticky');
    expect(header.className).toContain('sw-padding-4');
  });
});

describe('Nav', () => {
  it('renders a nav cluster for layout links', () => {
    render(
      <ThemeProvider colorScheme="light">
        <Nav aria-label="Workspace">
          <a aria-current="page" href="#board">
            Board
          </a>
          <a href="#teams">Teams</a>
        </Nav>
      </ThemeProvider>,
    );

    const navigation = screen.getByRole('navigation', { name: 'Workspace' });
    expect(navigation.className).toContain('sw-nav');
    expect(
      screen.getByRole('link', { name: 'Board' }).getAttribute('aria-current'),
    ).toBe('page');
  });
});
