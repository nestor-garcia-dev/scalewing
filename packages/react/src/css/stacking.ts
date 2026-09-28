/*
 * The one stacking order of the generated stylesheet. Every generated
 * `z-index` reads a layer from here, lowest first:
 *
 * 1. `stickyCell`: a sticky table header cell or row label over the cells
 *    that scroll under it.
 * 2. `bottomChrome`: the sticky ActionBar over the page flow it follows.
 * 3. `popupHost`: a glass surface (glass Card, Accordion) while it holds an
 *    open popup. Backdrop blur makes that surface its own stacking context, so
 *    its popup can only paint as high as the surface does; lifting the surface
 *    over the ActionBar keeps an open list tappable where the bar would cover
 *    it, and over the next surface in the flow.
 * 4. `topChrome`: the sticky AppHeader, over a lifted surface that scrolls up
 *    under it (the header is the page's way back, and a popup opens downward).
 * 5. `popup`: a popup outside any lifted surface (Select list, ActionMenu
 *    list, Tooltip, DateField calendar) over everything in the page.
 *
 * Dialog and Toast sit on the browser's top layer, above all of these.
 */
export const stackingOrder = {
  stickyCell: 1,
  bottomChrome: 2,
  popupHost: 3,
  topChrome: 4,
  popup: 10,
} as const;

export type StackingLayer = keyof typeof stackingOrder;

export function zIndex(layer: StackingLayer): string {
  return `z-index: ${stackingOrder[layer]};`;
}

const openPopups = [
  '.sw-select-list',
  '.sw-action-menu-list:not([hidden])',
  '.sw-tooltip:not([hidden])',
  // Rendered only while open; on the top layer where the popover API exists.
  '.sw-date-field-calendar',
].join(', ');

const popupHosts = ['.sw-card-glass', '.sw-accordion'];

export function cssPopupHostRules(): string {
  const selectors = popupHosts
    .map((host) => `${host}:has(${openPopups})`)
    .join(',\n');
  return `/* Backdrop blur makes a glass surface its own stacking context, so it lifts while it holds an open popup (see stacking.ts). */
${selectors} {
  position: relative;
  ${zIndex('popupHost')}
}`;
}
