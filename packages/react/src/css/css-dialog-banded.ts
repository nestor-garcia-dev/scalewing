import { breakpointQuery, breakpoints } from './breakpoints.js';
import { dialogSheetClass } from './css-dialog.js';
import { zIndex } from './stacking.js';
import { quietFill } from './quiet-fill.js';

export const dialogAppearances = ['glass', 'banded'] as const;

/**
 * How the dialog's surface reads: `glass` (the default) is one frosted
 * panel; `banded` is a solid surface whose title row and footer are bands
 * across its full width, ruled off from the content by hairlines, with the
 * close button on a quiet round fill.
 */
export type DialogAppearance = (typeof dialogAppearances)[number];

export const dialogBandedClass = 'sw-dialog-banded';

const banded = `.${dialogBandedClass}`;

/* The dialog's own padding, which a band steps past to reach its edges. */
const bleed = 'calc(-1 * var(--sw-space-5))';

/* A bottom sheet's side padding, which clears a wide safe area. */
const sheetSide = (side: 'left' | 'right') =>
  `max(var(--sw-space-5), env(safe-area-inset-${side}, 0px))`;

/*
 * In a bottom sheet the dialog's side padding clears the safe areas, so
 * the band steps past that padding instead of space-5, and pads itself
 * the same, so its hairline still meets both edges.
 */
function sheetBandRules(): string {
  return breakpoints
    .map(
      (breakpoint) => `@media ${breakpointQuery('below', breakpoint)} {
  .${dialogSheetClass(breakpoint)}${banded} .sw-dialog-header {
    margin-left: calc(-1 * ${sheetSide('left')});
    margin-right: calc(-1 * ${sheetSide('right')});
    padding-left: ${sheetSide('left')};
    padding-right: ${sheetSide('right')};
  }
}`,
    )
    .join('\n\n');
}

/*
 * A banded dialog: the solid surface (no blur) with the medium elevation in
 * place of the glass border, so it reads as a sheet over the page. The
 * title row bleeds to the top and side edges as a band, a space-4 step
 * down and the dialog's space-5 across, over a hairline, and stays at the
 * top while the content scrolls under it (the top-chrome layer, under any
 * popup the content opens); the pinned footer is already such a band at
 * the bottom. The close button sits on the muted 16 % fill as a circle
 * inside the band's padding, in the text color, and keeps its square size
 * and touch target; a hover darkens the fill where the pointer can hover.
 * Forced colors keep the hairline and outline the dialog, since its shadow
 * is not drawn there.
 */
export function cssDialogBandedClasses(): string {
  return `${banded} {
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  background: var(--sw-color-surface);
  border-color: transparent;
  box-shadow: var(--sw-elevation-md);
}

${banded} .sw-dialog-header {
  align-items: center;
  background: var(--sw-color-surface);
  border-bottom: 1px solid var(--sw-color-border);
  margin: ${bleed} ${bleed} 0;
  padding: var(--sw-space-4) var(--sw-space-5);
  position: sticky;
  top: ${bleed};
  ${zIndex('topChrome')}
}

${sheetBandRules()}

${banded} .sw-button.sw-dialog-close {
  background: ${quietFill};
  border-radius: var(--sw-radius-pill);
  color: var(--sw-color-text);
  margin: 0;
}

@media (hover: hover) {
  ${banded} .sw-button.sw-dialog-close:hover {
    background: color-mix(in srgb, var(--sw-color-muted) 24%, transparent);
  }
}

@media (forced-colors: active) {
  ${banded} { border-color: CanvasText; }
  ${banded} .sw-dialog-header { border-bottom-color: CanvasText; }
}`;
}

export function dialogBandedClassCatalog(): string[] {
  return [dialogBandedClass];
}
