import { typographyVariants } from '@scalewing/tokens';

import { cssTableBoundedEdgeClasses } from './css-table-bounded-edges.js';
import {
  tableCellPadding,
  tableRuleWidth,
  tableSortMinHeight,
} from './css-table-metrics.js';
import { coarsePointerQuery, touchTarget } from './touch-target.js';

const body = typographyVariants.body;
const caption = typographyVariants.caption;

/** A header row whose line is `line` tall: that line and its padding twice. */
function headBlock(line: string): string {
  return `calc(${line} + 2 * var(--sw-table-cell-pad))`;
}

/*
 * A bounded table (`Table maxHeight`, `sw-table-bounded` on its region)
 * is as tall as its row count (`--sw-table-max-rows`) of single-line body
 * rows, plus one header row when it has a `thead` and one footer row when
 * it has a `tfoot`, from the measures its cells are drawn with
 * (`css-table-metrics.ts`): a body row is the body line, the cell padding
 * twice and its rule; a header row is the caption line and the padding
 * twice (a pinned header cell draws its rule inside itself), or the sort
 * button's height where a header sorts (the touch target on a coarse
 * pointer). Compact density swaps the padding. Rows of two lines or with
 * controls, a second header or footer row, and a horizontal scrollbar
 * that takes room (classic scrollbars) leave fewer rows showing.
 *
 * The region already scrolls (`overflow: auto`), so the rows past that
 * height scroll inside it, and the pinned header group (`thead`, top 0)
 * and a sticky footer (bottom 0) pin to the region's own edges: it is
 * their nearest scroll box. A bounded region is never marked
 * `sw-scroll-fits`, so it never stops being a scroll box for the page
 * pinning in `css-table-page-pin.ts`. Printed, every row shows.
 */
function heightRules(): string {
  const sorting = '.sw-table-bounded:has(> .sw-table > thead .sw-table-sort)';
  return `.sw-table-bounded {
  --sw-table-cell-pad: ${tableCellPadding.comfortable.block};
  --sw-table-head-block: 0px;
  --sw-table-foot-rows: 0;
  max-height: calc((var(--sw-table-max-rows) + var(--sw-table-foot-rows)) * (${body.lineHeight}px + 2 * var(--sw-table-cell-pad) + ${tableRuleWidth}) + var(--sw-table-head-block));
}

.sw-table-bounded:has(> .sw-table-compact) {
  --sw-table-cell-pad: ${tableCellPadding.compact.block};
}

.sw-table-bounded:has(> .sw-table > thead) {
  --sw-table-head-block: ${headBlock(`${caption.lineHeight}px`)};
}

${sorting} {
  --sw-table-head-block: ${headBlock(`max(${caption.lineHeight}px, ${tableSortMinHeight})`)};
}

@media ${coarsePointerQuery} {
  ${sorting} {
    --sw-table-head-block: ${headBlock(`max(${caption.lineHeight}px, ${touchTarget})`)};
  }
}

.sw-table-bounded:has(> .sw-table > tfoot) {
  --sw-table-foot-rows: 1;
}

@media print {
  .sw-table-bounded { max-height: none; }
}`;
}

export function cssTableBoundedClasses(): string {
  return `${heightRules()}

${cssTableBoundedEdgeClasses()}`;
}

export function tableBoundedClassCatalog(): string[] {
  return ['sw-table-bounded'];
}
