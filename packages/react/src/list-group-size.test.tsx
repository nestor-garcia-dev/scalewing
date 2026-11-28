import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ListGroup } from './components/ListGroup.js';
import { ListRow } from './components/ListRow.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';
import { listGroupSizes } from './list-options.js';

afterEach(() => cleanup());

const css = generateStylesheet();

describe('ListGroup size', () => {
  it('is md by default and lg on request, on any variant', () => {
    expect(listGroupSizes).toEqual(['md', 'lg']);
    const { rerender } = render(
      <ListGroup aria-label="Keepers">
        <ListRow onPress={() => undefined} title="Ana" />
      </ListGroup>,
    );
    const box = () =>
      screen.getByRole('list', { name: 'Keepers' }).parentElement;
    expect(box()?.className).toBe('sw-list-group sw-list-group-panel');
    rerender(
      <ListGroup aria-label="Keepers" size="lg" variant="tiles">
        <ListRow onPress={() => undefined} title="Ana" />
      </ListGroup>,
    );
    expect(box()?.className).toBe(
      'sw-list-group sw-list-group-tiles sw-list-group-tiles-3 sw-list-group-lg',
    );
    // The row keeps its role and name.
    expect(screen.getByRole('button', { name: 'Ana' })).toBeTruthy();
  });

  it('refuses a size it cannot draw', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() =>
      render(<ListGroup size={'xl' as never}>{null}</ListGroup>),
    ).toThrow('Unknown ListGroup size: xl');
  });

  it('generates a 56 px floor for every row, its parts centred, after the touch target', () => {
    expect(utilityClassCatalog()).toContain('sw-list-group-lg');
    // The group's own rows (its list, bounded or not, and its footer),
    // never a nested ListGroup's.
    const rule = `.sw-list-group-lg > .sw-list > .sw-list-item > .sw-list-row,
.sw-list-group-lg > .sw-list-group-scroll > .sw-list > .sw-list-item > .sw-list-row,
.sw-list-group-lg > .sw-list-group-footer > .sw-list-item > .sw-list-row {
  align-items: center;
  min-height: calc(var(--sw-space-8) + var(--sw-space-2));
}`;
    expect(css).toContain(rule);
    expect(css).not.toContain('.sw-list-group-lg .sw-list-row');
    // 48 + 8 = 56 px, past the 44 px coarse-pointer target, which it
    // outranks with its chained classes wherever the two meet.
    const coarse =
      '.sw-list-row-pressable { min-height: var(--sw-control-md-min-height); }';
    expect(css).toContain(coarse);
    expect(css.indexOf(rule)).toBeGreaterThan(css.indexOf(coarse));
  });
});
