import { cssListRowClasses, listRowClassCatalog } from './css-list-row.js';
import {
  cssListRowTrailingClasses,
  listRowTrailingClassCatalog,
} from './css-list-row-trailing.js';
import {
  cssListRowTruncateClasses,
  listRowTruncateClassCatalog,
} from './css-list-row-truncate.js';
import {
  cssListTilesClasses,
  listTilesClassCatalog,
} from './css-list-tiles.js';
import { cssListSizeClasses, listSizeClassCatalog } from './css-list-size.js';
import { cssListTilesBoundedClasses } from './css-list-tiles-bounded.js';
import { blockEdgeShadeRules, scrollRegionRules } from './css-scroll-region.js';
import { listCountedRowHeight } from './list-row-metrics.js';

const scroll = '.sw-list-group-scroll';

/*
 * The region of a bounded list of rows, not of tiles: tiles are opaque
 * panels that would hide a shade drawn under them, so a bounded grid of
 * tiles draws its own over them (css-list-tiles-bounded.ts).
 */
const rowScroll = `.sw-list-group:not(.sw-list-group-tiles) > ${scroll}`;

/*
 * A ListGroup is one list (`sw-list`) with a hairline between its rows:
 * a bordered panel on the surface, or plain rows inside a surface that
 * already has one, with a hairline above the first row too. A footer sits
 * under the rows, outside any scroll, under a hairline.
 */
function groupRules(): string {
  return `.sw-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.sw-list > .sw-list-item + .sw-list-item,
.sw-list-group-plain .sw-list > .sw-list-item:first-child,
.sw-list-group-footer {
  border-top: 1px solid var(--sw-color-border);
}

.sw-list-group-panel {
  background: var(--sw-color-surface);
  border: 1px solid var(--sw-color-border);
  border-radius: var(--sw-radius-md);
  overflow: clip;
}`;
}

/*
 * A bounded list (\`maxHeight\`) is as tall as its row count
 * (\`--sw-list-max-rows\`) of rows with a title and one detail line: the
 * padding twice, the title's line, the detail's line and the hairline.
 * Taller rows show fewer at a time. Its region is the shared scroll
 * region (a named keyboard stop); while rows are past its top or bottom,
 * that edge draws the scroll shade a spacing step 5 deep, a background
 * layer under the rows. Forced colours draw no shade; printed, every row
 * shows.
 */
function boundedRules(): string {
  const top = `${rowScroll}.sw-scroll-more-top`;
  const bottom = `${rowScroll}.sw-scroll-more-bottom`;
  return `${scrollRegionRules(scroll)}

${scroll} {
  max-height: calc(var(--sw-list-max-rows) * (${listCountedRowHeight} + 1px));
}

${blockEdgeShadeRules({ top, bottom, both: `${top}.sw-scroll-more-bottom` })}

@media (forced-colors: active) {
  .sw-list > .sw-list-item + .sw-list-item,
  .sw-list-group-plain .sw-list > .sw-list-item:first-child,
  .sw-list-group-footer,
  .sw-list-group-panel { border-color: CanvasText; }
}

@media print {
  ${scroll} { max-height: none; }
}`;
}

export function cssListClasses(): string {
  return `${groupRules()}

${boundedRules()}

${cssListRowClasses()}

${cssListRowTrailingClasses()}

${cssListRowTruncateClasses()}

${cssListSizeClasses()}

${cssListTilesClasses()}

${cssListTilesBoundedClasses()}`;
}

export function listClassCatalog(): string[] {
  return [
    'sw-list',
    'sw-list-item',
    'sw-list-group',
    'sw-list-group-panel',
    'sw-list-group-plain',
    'sw-list-group-scroll',
    'sw-list-group-footer',
    ...listSizeClassCatalog(),
    ...listTilesClassCatalog(),
    ...listRowClassCatalog(),
    ...listRowTrailingClassCatalog(),
    ...listRowTruncateClassCatalog(),
  ];
}
