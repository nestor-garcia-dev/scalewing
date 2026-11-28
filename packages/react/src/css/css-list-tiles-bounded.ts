import { listTileGap } from './css-list-tiles.js';
import { blockShade } from './css-scroll-region.js';
import { listCountedRowHeight } from './list-row-metrics.js';
import { zIndex } from './stacking.js';

const region = '.sw-list-group-tiles > .sw-list-group-scroll';

/* How deep the scroll shade is, as a bounded list's and table's. */
const shadeDepth = 'var(--sw-space-5)';

/* One counted row of tiles: the counted row inside its tile's two hairlines. */
const tileRow = `(${listCountedRowHeight} + 2px)`;

/*
 * A bounded grid of tiles (`variant="tiles"` with `maxHeight`) is the
 * same named scroll region as a bounded list, its grid scrolling inside
 * it. `rows` counts rows of tiles: each the counted row (a title and one
 * detail line) inside its tile's two hairlines, with the grid's gap
 * between them, so a phone's one column counts its tiles one by one.
 *
 * The tiles are opaque panels, so the shade a bounded list paints under
 * its rows would be hidden under them. Here the region's `::before` and
 * `::after` are the shade, stuck to its top and bottom edges over the
 * tiles (the sticky-cell layer of `stacking.ts`, as a table's pinned
 * head is over its scrolling cells) while `ScrollRegion` marks more past
 * that edge: each is a space-5 strip pulled out of the flow by an equal
 * negative margin, so it moves no tile, and takes no press.
 *
 * Focus scrolling keeps a space-5 margin at either edge
 * (`scroll-padding-block`), so a tile focused from the keyboard is
 * scrolled fully into view, clear of the shade, its ring whole. The
 * margin is clamped to half of what the region has over one counted row
 * of tiles, so a region one row tall (`rows: 1`) keeps no margin and a
 * focused tile is scrolled to fill it rather than centred under both
 * shades. Forced colours draw no shade (the system's scrollbar is the
 * cue); printed, every tile shows.
 */
export function cssListTilesBoundedClasses(): string {
  const rows = 'var(--sw-list-max-rows)';
  return `${region} {
  max-height: calc(${rows} * ${tileRow} + (${rows} - 1) * ${listTileGap});
  scroll-padding-block: max(0px, min(${shadeDepth}, calc((100% - ${tileRow}) / 2)));
}

${region}::before,
${region}::after {
  content: '';
  display: block;
  height: ${shadeDepth};
  pointer-events: none;
  position: sticky;
  ${zIndex('stickyCell')}
}

${region}::before {
  margin-block-end: calc(-1 * ${shadeDepth});
  top: 0;
}

${region}::after {
  bottom: 0;
  margin-block-start: calc(-1 * ${shadeDepth});
}

${region}.sw-scroll-more-top::before { background-image: ${blockShade('bottom')}; }

${region}.sw-scroll-more-bottom::after { background-image: ${blockShade('top')}; }

@media (forced-colors: active) {
  ${region}::before,
  ${region}::after { display: none; }
}

@media print {
  ${region} { max-height: none; }
}`;
}
