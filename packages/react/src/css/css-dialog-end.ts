import { breakpointQuery, type Breakpoint } from './breakpoints.js';

/**
 * Where a Dialog sits from the layout breakpoint up: `center` (the
 * default) in the middle of the window, `end` as a side panel docked to
 * the inline end (the right, the left in right-to-left).
 */
export const dialogPlacements = ['center', 'end'] as const;

export type DialogPlacement = (typeof dialogPlacements)[number];

export const dialogEndClass = 'sw-dialog-end';

/** The side panel takes its place from this breakpoint up. */
export const dialogEndFrom: Breakpoint = 'md';

const end = `.${dialogEndClass}`;

/*
 * From md up, `placement="end"` is a side panel: the window's full height
 * at the inline end, square corners, one hairline on its inline-start
 * edge, the size's width (md 32rem, lg 56rem, xl 65rem) with a space-8
 * strip of backdrop always in view. Its column grows to the full height so
 * the pinned footer sits on the bottom edge even when the content is short;
 * longer content scrolls inside the panel under the sticky footer, as in
 * the centred dialog. It slides in from its edge unless reduced motion is
 * asked for. Below md the class draws nothing: the dialog is centred, or a
 * bottom sheet with `sheetBelow`. Emitted after the banded and grabber
 * rules so its edges win at equal specificity.
 */
export function cssDialogEndClasses(): string {
  return `@media ${breakpointQuery('from', dialogEndFrom)} {
  ${end} {
    border-color: var(--sw-color-border);
    border-radius: 0;
    border-width: 0;
    border-inline-start-width: 1px;
    height: 100%;
    inset-block: 0;
    margin: 0;
    margin-inline-start: auto;
    max-height: none;
  }

  ${end}[open] {
    animation: sw-dialog-end-in var(--sw-motion-default) var(--sw-motion-easing);
    display: flex;
    flex-direction: column;
  }

  ${end}[open]:dir(rtl) {
    animation-name: sw-dialog-end-in-rtl;
  }

  ${end} > .sw-stack {
    flex: 1 0 auto;
  }

  ${end} .sw-dialog-footer {
    margin-top: auto;
  }
}

@keyframes sw-dialog-end-in {
  from { translate: 100% 0; }
}

@keyframes sw-dialog-end-in-rtl {
  from { translate: -100% 0; }
}

@media (prefers-reduced-motion: reduce) {
  ${end}[open] { animation: none; }
}

@media (forced-colors: active) {
  ${end} { border-inline-start-color: CanvasText; }
}`;
}

export function dialogEndClassCatalog(): string[] {
  return [dialogEndClass];
}
