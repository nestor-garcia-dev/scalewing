import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { StatTile, statTileAppearances } from './components/StatTile.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('StatTile appearance', () => {
  it('is a card by default and plain on request, its parts unchanged', () => {
    render(
      <>
        <StatTile label="Counted" value="1,284" />
        <StatTile
          appearance="plain"
          caption="from Monday's count and every move since"
          label="Expected"
          tone="danger"
          value="−6"
        />
      </>,
    );
    const card = screen.getByText('1,284').closest('section');
    expect(card?.className).toBe('sw-stat-tile');
    const plain = screen.getByText('−6').closest('section');
    expect(plain?.className).toBe('sw-stat-tile sw-stat-tile-plain');
    expect(plain?.querySelector('.sw-stat-tile-label')?.textContent).toBe(
      'Expected',
    );
    expect(screen.getByText('−6').style.color).toBe('var(--sw-color-danger)');
    expect(statTileAppearances).toEqual(['card', 'plain']);
  });

  it('refuses an unknown appearance and a plain primary tile', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() =>
      render(
        <StatTile appearance={'flat' as never} label="Counted" value="1" />,
      ),
    ).toThrow('Unknown StatTile appearance: flat');
    expect(() =>
      render(
        <StatTile
          appearance="plain"
          emphasis="primary"
          label="Counted"
          value="1"
        />,
      ),
    ).toThrow(
      'A plain StatTile has no surface to fill; emphasis primary needs appearance card',
    );
  });

  it('drops the surface, edge, radius and padding, top-aligned', () => {
    expect(generateStylesheet()).toContain(
      '.sw-stat-tile-plain {\n  align-items: flex-start;\n  background: transparent;\n  border: 0;\n  border-radius: 0;\n  padding: 0;\n}',
    );
    expect(utilityClassCatalog()).toContain('sw-stat-tile-plain');
  });
});
