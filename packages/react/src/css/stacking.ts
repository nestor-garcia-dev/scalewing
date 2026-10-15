/*
 * The one stacking order of the generated stylesheet. Every generated
 * `z-index` reads a layer from here, lowest first:
 *
 * 1. `stickyCell`: a sticky table head group (every row in a sticky
 *    `thead`) or row label over the cells that scroll under it.
 * 2. `stickyFooter`: a sticky table footer (a pinned total row) over the
 *    cells and pinned header cells that scroll under it, and under the
 *    ActionBar, which stays the page's last word at the bottom edge.
 * 3. `bottomChrome`: the sticky ActionBar over the page flow it follows.
 * 4. `popupHost`: a glass surface (glass Card, Accordion) while it holds an
 *    open popup. Backdrop blur makes that surface its own stacking context, so
 *    its popup can only paint as high as the surface does; lifting the surface
 *    over the ActionBar keeps an open list tappable where the bar would cover
 *    it, and over the next surface in the flow.
 * 5. `topChrome`: the sticky AppHeader or sticky Tabs strip (and a banded
 *    Dialog's title band, inside its dialog), over a lifted
 *    surface that scrolls up under it (the header is the page's way back, the
 *    strip its way between sections, and a popup opens downward).
 * 6. `sheetGrabber`: a bottom sheet's grabber, inside its dialog, over the
 *    banded title band that sticks under it.
 * 7. `popup`: a popup outside any lifted surface (Select list, ActionMenu
 *    list, MultiSelect panel, Combobox list, Tooltip, the DateField and CalendarButton
 *    calendar) over everything in the page.
 *
 * Dialog and Toast sit on the browser's top layer, above all of these.
 */
export const stackingOrder = {
  stickyCell: 1,
  stickyFooter: 2,
  bottomChrome: 3,
  popupHost: 4,
  topChrome: 5,
  sheetGrabber: 6,
  popup: 10,
} as const;

export type StackingLayer = keyof typeof stackingOrder;

/*
 * The order inside a joined control (an attached ButtonGroup), which is
 * its own stacking context (`isolation: isolate`), so these never meet the
 * page's layers: a pressed button's ring over its neighbours, and the
 * focused button's ring over both.
 */
export const joinedControlOrder = {
  pressed: 1,
  focused: 2,
} as const;

export function joinedZIndex(layer: keyof typeof joinedControlOrder): string {
  return `z-index: ${joinedControlOrder[layer]};`;
}

export function zIndex(layer: StackingLayer): string {
  return `z-index: ${stackingOrder[layer]};`;
}

const openPopups = [
  '.sw-select-list',
  // Rendered only while open; on the top layer where the popover API exists.
  '.sw-action-menu-list',
  // MultiSelect's panel. Rendered only while open; on the top layer where
  // the popover API exists.
  '.sw-multi-select-panel',
  // Combobox's list. Rendered only while open; on the top layer where the
  // popover API exists.
  '.sw-combobox-popup',
  '.sw-tooltip:not([hidden])',
  // DateField, CalendarButton and DateRangeButton share it. Rendered only
  // while open; on the top layer where the popover API exists.
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
