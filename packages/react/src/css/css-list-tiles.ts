import { breakpointQuery } from './breakpoints.js';

/** How many tiles share a row from `md` up; one a row below it. */
export const listTileColumnCounts = [2, 3, 4] as const;
export type ListGroupTileColumns = (typeof listTileColumnCounts)[number];

export function listTileColumnsClass(columns: ListGroupTileColumns): string {
  return `sw-list-group-tiles-${columns}`;
}

const tiles = '.sw-list-group-tiles';

/* The space between tiles, across and down; a bounded grid counts it too. */
export const listTileGap = 'var(--sw-space-3)';

/*
 * The list a group's class lays out, the group's own child or, bounded
 * (`maxHeight`), its scroll region's: a selector list, so each keeps the
 * specificity it would have alone and the order below still decides.
 */
function tileList(group: string, inner = ''): string {
  return [
    `${group} > .sw-list${inner}`,
    `${group} > .sw-list-group-scroll > .sw-list${inner}`,
  ].join(',\n');
}

/*
 * A tiled ListGroup is still one list (`sw-list`), its rows laid out as
 * tiles: equal columns a space-3 apart from `md` up, one column below it,
 * each row its own bordered panel on the surface (the panel variant's
 * look, per row), with no hairlines between them. A row's press fill and
 * its inset focus ring stay inside its tile.
 *
 * Generated after the list's hairline rules (css-list.ts), whose
 * `.sw-list > .sw-list-item + .sw-list-item` has the same specificity as
 * the tile rule: being later is what lets a tile's own border replace the
 * hairline. `list-group-tiles.test.tsx` holds that order. A bounded
 * group's grid sits in its scroll region and takes the same rules.
 *
 * Tiles on one grid row are as tall as the tallest of them, so each tile
 * is a flex box whose row fills it (`flex: 1 1 auto`, stretched across
 * its height): a short row's press area, fill and inset ring reach its
 * tile's edges beside a taller one. A tile with an `action` stretches its
 * row the same way and keeps the action centred on it.
 */
export function cssListTilesClasses(): string {
  const columns = listTileColumnCounts.map(
    (count) =>
      `${tileList(`.${listTileColumnsClass(count)}`)} { grid-template-columns: repeat(${count}, minmax(0, 1fr)); }`,
  );
  const item = ' > .sw-list-item';
  return `${tileList(tiles)} {
  display: grid;
  gap: ${listTileGap};
}

${columns.join('\n')}

${tileList(tiles, item)} {
  align-items: stretch;
  background: var(--sw-color-surface);
  border: 1px solid var(--sw-color-border);
  border-radius: var(--sw-radius-md);
  display: flex;
  min-width: 0;
  overflow: clip;
}

${tileList(tiles, `${item} > .sw-list-row`)} {
  flex: 1 1 auto;
  min-width: 0;
}

${tileList(tiles, `${item} > .sw-list-row-action`)} { align-self: center; }

@media ${breakpointQuery('below', 'md')} {
  ${tileList(tiles).replaceAll('\n', '\n  ')} { grid-template-columns: minmax(0, 1fr); }
}

@media (forced-colors: active) {
  ${tileList(tiles, item).replaceAll('\n', '\n  ')} { border-color: CanvasText; }
}`;
}

export function listTilesClassCatalog(): string[] {
  return [
    'sw-list-group-tiles',
    ...listTileColumnCounts.map((count) => listTileColumnsClass(count)),
  ];
}
