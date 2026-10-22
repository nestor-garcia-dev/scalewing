import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ListGroup } from './components/ListGroup.js';
import { ListRow } from './components/ListRow.js';
import { breakpointQuery } from './css/breakpoints.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';
import { listTileColumnCounts } from './css/css-list-tiles.js';
import { listGroupVariants } from './list-options.js';

afterEach(() => cleanup());

function Arrivals(props: { tileColumns?: 2 | 3 | 4 }) {
  return (
    <>
      <h2 id="arrivals">New arrivals</h2>
      <ListGroup aria-labelledby="arrivals" variant="tiles" {...props}>
        <ListRow detail="Wetlands" href="/heron" title="Heron calls" />
        <ListRow detail="Woodlands" href="/owl" title="Owl boxes" />
        <ListRow detail="Coast" onPress={() => undefined} title="Tern colony" />
      </ListGroup>
    </>
  );
}

describe('ListGroup tiles', () => {
  it('is still one named list, each row an item of it, three columns by default', () => {
    render(<Arrivals />);
    const list = screen.getByRole('list', { name: 'New arrivals' });
    expect(list.className).toBe('sw-list');
    expect(list.parentElement?.className).toBe(
      'sw-list-group sw-list-group-tiles sw-list-group-tiles-3',
    );
    const items = within(list).getAllByRole('listitem');
    expect(items).toHaveLength(3);
    expect(items.map((item) => item.className)).toEqual([
      'sw-list-item',
      'sw-list-item',
      'sw-list-item',
    ]);
    // Rows keep their roles and names: a link or a button per tile.
    expect(
      within(items[0]!).getByRole('link', { name: 'Heron calls' }),
    ).toBeTruthy();
    expect(
      within(items[2]!).getByRole('button', { name: 'Tern colony' }),
    ).toBeTruthy();
  });

  it('takes 2 or 4 columns', () => {
    const { rerender } = render(<Arrivals tileColumns={2} />);
    const box = () =>
      screen.getByRole('list', { name: 'New arrivals' }).parentElement;
    expect(box()?.className).toContain('sw-list-group-tiles-2');
    rerender(<Arrivals tileColumns={4} />);
    expect(box()?.className).toContain('sw-list-group-tiles-4');
    expect(listGroupVariants).toEqual(['panel', 'plain', 'tiles']);
    expect(listTileColumnCounts).toEqual([2, 3, 4]);
  });

  it('refuses columns it cannot draw, columns off tiles, and tiles that scroll or add up', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() =>
      render(
        <ListGroup tileColumns={5 as never} variant="tiles">
          {null}
        </ListGroup>,
      ),
    ).toThrow('ListGroup tileColumns must be 2, 3 or 4: 5');
    expect(() => render(<ListGroup tileColumns={2}>{null}</ListGroup>)).toThrow(
      'ListGroup tileColumns needs variant="tiles"',
    );
    expect(() =>
      render(
        <ListGroup aria-label="Nights" maxHeight={{ rows: 3 }} variant="tiles">
          {null}
        </ListGroup>,
      ),
    ).toThrow('A ListGroup of tiles takes no maxHeight or footer');
    expect(() =>
      render(
        <ListGroup footer={<ListRow title="3 nights" />} variant="tiles">
          {null}
        </ListGroup>,
      ),
    ).toThrow('A ListGroup of tiles takes no maxHeight or footer');
  });

  it('generates tiles as panels in equal columns, one a row below md', () => {
    const css = generateStylesheet();
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-list-group-tiles',
        'sw-list-group-tiles-2',
        'sw-list-group-tiles-3',
        'sw-list-group-tiles-4',
      ]),
    );
    expect(css).toContain(
      '.sw-list-group-tiles > .sw-list {\n  display: grid;\n  gap: var(--sw-space-3);\n}',
    );
    expect(css).toContain(
      '.sw-list-group-tiles-3 > .sw-list { grid-template-columns: repeat(3, minmax(0, 1fr)); }',
    );
    expect(css).toContain(`.sw-list-group-tiles > .sw-list > .sw-list-item {
  background: var(--sw-color-surface);
  border: 1px solid var(--sw-color-border);
  border-radius: var(--sw-radius-md);
  min-width: 0;
  overflow: clip;
}`);
    expect(css).toContain(`@media ${breakpointQuery('below', 'md')} {
  .sw-list-group-tiles > .sw-list { grid-template-columns: minmax(0, 1fr); }
}`);
    expect(css).toContain(
      '.sw-list-group-tiles > .sw-list > .sw-list-item { border-color: CanvasText; }',
    );
    // No hairline between tiles: the tile rule has the hairline rule's
    // specificity, so it must come after it to replace it.
    const hairline = css.indexOf('.sw-list > .sw-list-item + .sw-list-item,');
    const tile = css.indexOf(
      '.sw-list-group-tiles > .sw-list > .sw-list-item {',
    );
    expect(hairline).toBeGreaterThan(-1);
    expect(tile).toBeGreaterThan(hairline);
    expect(css).not.toContain(
      '.sw-list-group-tiles .sw-list > .sw-list-item + .sw-list-item',
    );
  });
});
