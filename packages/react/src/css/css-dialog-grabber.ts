import { breakpointQuery, breakpoints } from './breakpoints.js';
import { dialogSheetClass } from './css-dialog.js';
import { dialogBandedClass } from './css-dialog-banded.js';
import { zIndex } from './stacking.js';

export const dialogGrabberClass = 'sw-dialog-grabber';
export const dialogHasGrabberClass = 'sw-dialog-has-grabber';

/* How far the grabber sits from the sheet's top edge. */
const inset = 'var(--sw-space-2)';

/*
 * A bottom sheet's grabber: a space-6 by space-1 bar on the muted colour at
 * 40 %, centered a space-2 step under the top edge. Its margins add up to
 * nothing (up into the dialog's space-5 padding to the space-2 inset, its
 * space-1 height, then a space-3 step down), so the title keeps its place
 * a space-3 under the bar. It is sticky at that inset while the content
 * scrolls (sticky insets count from the padding edge, so it steps back
 * past the space-5 padding) and sits over a banded title band, whose top padding grows to space-5 to keep the space-3
 * step under the bar. Drawn only below the sheet's breakpoint; forced colours
 * draw it in the text colour (inside the same breakpoint, at the same
 * specificity, so the override wins).
 */
function sheetGrabberRules(): string {
  return breakpoints
    .map((breakpoint) => {
      const sheet = `.${dialogSheetClass(breakpoint)}`;
      return `@media ${breakpointQuery('below', breakpoint)} {
  ${sheet} .${dialogGrabberClass} {
    background: color-mix(in srgb, var(--sw-color-muted) 40%, transparent);
    border-radius: var(--sw-radius-pill);
    display: block;
    height: var(--sw-space-1);
    margin: calc(${inset} - var(--sw-space-5)) auto var(--sw-space-3);
    position: sticky;
    top: calc(${inset} - var(--sw-space-5));
    width: var(--sw-space-6);
    ${zIndex('sheetGrabber')}
  }

  ${sheet}.${dialogBandedClass}.${dialogHasGrabberClass} .sw-dialog-header {
    padding-top: var(--sw-space-5);
  }

  @media (forced-colors: active) {
    ${sheet} .${dialogGrabberClass} { background: CanvasText; forced-color-adjust: none; }
  }
}`;
    })
    .join('\n\n');
}

export function cssDialogGrabberClasses(): string {
  return `.${dialogGrabberClass} { display: none; }

${sheetGrabberRules()}`;
}

export function dialogGrabberClassCatalog(): string[] {
  return [dialogGrabberClass, dialogHasGrabberClass];
}
