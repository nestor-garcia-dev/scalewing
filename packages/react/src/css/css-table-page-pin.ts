/*
 * Where a table's pinned rows pin. A table's region is a scroll box (it
 * scrolls a wide table sideways), and a sticky cell pins to its nearest
 * scroll box: the region, which never scrolls vertically, so on a page
 * that scrolls nothing would stay in view. While the table fits its width
 * (`sw-scroll-fits`, set once the region is measured) a region that holds
 * a sticky footer, or a table whose header pins to the page
 * (`stickyHeader="page"`, `sw-table-sticky-page`), stops being a scroll
 * box, so the footer pins to the page's bottom edge and the sticky header
 * to its top, under any sticky top chrome (an AppHeader covers it). A
 * table wider than its region scrolls sideways in it and pins to the
 * region instead.
 */
export function cssTablePagePinClasses(): string {
  return `.sw-table-wrap.sw-scroll-fits:has(> .sw-table > .sw-table-footer-sticky),
.sw-table-wrap.sw-scroll-fits:has(> .sw-table-sticky-page) {
  overflow: visible;
}`;
}

export function tablePagePinClassCatalog(): string[] {
  return ['sw-scroll-fits', 'sw-table-sticky-page'];
}
