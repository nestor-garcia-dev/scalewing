import { blockEdgeShadeRules, blockShade } from './css-scroll-region.js';

const region = '.sw-table-bounded';

/*
 * While rows are scrolled out past the top or bottom of a bounded region
 * (`sw-scroll-more-top`, `sw-scroll-more-bottom`), that edge draws the
 * scroll shade, a spacing step 5 deep, in the colour of the inline edges'
 * shade. A pinned row covers the region's own edge, so the shade is cast
 * from the pinned row instead: the header's last row extends its rule's
 * `::before` downward into a gradient, and a sticky footer's first row
 * extends its 2 px rule's `::before` upward into one. Both are drawn
 * inside their pinned group's layer, over the rows that scroll under
 * them, and no cell moves. Only the header's last row casts it, so a
 * header cell that spans rows (`rowSpan`) from an earlier row casts none
 * under its column. An edge with nothing pinned on it, such as a bounded
 * table without a sticky footer, shades the region's own edge with a
 * background layer fixed to the box, under the rows as the inline shade
 * is. Forced colours draw no shade; the system scrollbar is the cue.
 */
function shadeRules(): string {
  const headCells = `${region}.sw-scroll-more-top > .sw-table-sticky > thead > tr:last-child > :is(th, td)::before`;
  const footCells = `${region}.sw-scroll-more-bottom > .sw-table > .sw-table-footer-sticky > tr:first-child > :is(th, td)::before`;
  const noHead = ':not(:has(> .sw-table > thead))';
  const noPinnedFoot = ':not(:has(> .sw-table > .sw-table-footer-sticky))';
  const ownTop = `${region}.sw-scroll-more-top${noHead}`;
  const ownBottom = `${region}.sw-scroll-more-bottom${noPinnedFoot}`;
  const ownBoth = `${region}.sw-scroll-more-top.sw-scroll-more-bottom${noHead}${noPinnedFoot}`;
  return `${headCells} {
  background: ${blockShade('bottom')};
  border-bottom: 0;
  border-top: 1px solid var(--sw-color-border);
  box-sizing: border-box;
  height: var(--sw-space-5);
  inset-block-end: auto;
  inset-block-start: calc(100% - 1px);
}

${footCells} {
  background: ${blockShade('top')};
  border-bottom: 2px solid var(--sw-color-border);
  border-top: 0;
  box-sizing: border-box;
  height: var(--sw-space-5);
  inset-block-end: calc(100% - 1px);
  inset-block-start: auto;
}

${blockEdgeShadeRules({ top: ownTop, bottom: ownBottom, both: ownBoth })}

@media (forced-colors: active) {
  ${headCells},
  ${footCells} { background: none; border-color: CanvasText; }
}`;
}

/*
 * The region's focus ring is its own outline, drawn inside its edge, and
 * the pinned header and sticky footer paint over it. While the region has
 * keyboard focus, those pinned cells carry the ring's part they cover: an
 * inset line at the top of the header's first row and the bottom of the
 * footer's last row, and at the outer side of each pinned row's first and
 * last cell (mirrored right to left). The parts are custom properties set
 * on the cell they belong to and joined in one shadow, so a corner cell
 * carries two. The side parts sit on the first and last cells, so they
 * show while the region is scrolled to that inline edge, and a header
 * cell spanning rows (`rowSpan`) puts a later row's first cell off the
 * edge, where its side part would land mid-header. Forced colours drop
 * shadows; the outline shows beside the rows there.
 */
function focusRules(): string {
  const focused = `${region}:focus-visible`;
  const head = `${focused} > .sw-table-sticky > thead`;
  const foot = `${focused} > .sw-table > .sw-table-footer-sticky`;
  const cells = (group: string, row = 'tr', cell = ':is(th, td)') =>
    `${group} > ${row} > ${cell}`;
  const both = (row: string, cell: string) =>
    `${cells(head, row, cell)},\n${cells(foot, row, cell)}`;
  const ring = 'var(--sw-focus-ring-width)';
  const line = (x: string, y: string) =>
    `inset ${x} ${y} 0 0 var(--sw-color-accent)`;
  const none = '0 0 transparent';
  return `${both('tr', ':is(th, td)')} {
  box-shadow: var(--sw-table-ring-block, ${none}), var(--sw-table-ring-start, ${none}), var(--sw-table-ring-end, ${none});
}

${cells(head, 'tr:first-child')} {
  --sw-table-ring-block: ${line('0', ring)};
}

${cells(foot, 'tr:last-child')} {
  --sw-table-ring-block: ${line('0', `calc(-1 * ${ring})`)};
}

${both('tr', ':first-child')} {
  --sw-table-ring-start: ${line(ring, '0')};
}

${both('tr', ':last-child')} {
  --sw-table-ring-end: ${line(`calc(-1 * ${ring})`, '0')};
}

${both('tr', ':first-child:dir(rtl)')} {
  --sw-table-ring-start: ${line(`calc(-1 * ${ring})`, '0')};
}

${both('tr', ':last-child:dir(rtl)')} {
  --sw-table-ring-end: ${line(ring, '0')};
}`;
}

export function cssTableBoundedEdgeClasses(): string {
  return `${shadeRules()}

${focusRules()}`;
}
