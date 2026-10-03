import { typographyVariants } from '@scalewing/tokens';

import {
  type Breakpoint,
  breakpointQuery,
  breakpoints,
} from './breakpoints.js';
import { coarsePointerQuery, touchTarget } from './touch-target.js';

const title = typographyVariants.title;

/* The modal's height cap: a space-8 strip of backdrop stays in view. */
const maxHeight = 'min(100vh - var(--sw-space-8), 100dvh - var(--sw-space-8))';

export function dialogSheetClass(sheetBelow: Breakpoint): string {
  return `sw-dialog-sheet-below-${sheetBelow}`;
}

/*
 * Below the breakpoint the dialog is a bottom sheet: docked to the bottom
 * edge at the full viewport width, the top corners rounded and the bottom
 * ones square, the same height cap (so the whole space-8 strip of backdrop
 * shows above it), and padding that clears the safe areas. Emitted after
 * `sw-dialog-lg` so it wins at equal specificity. No grabber: there is no
 * drag gesture.
 */
function sheetRules(): string {
  return breakpoints
    .map(
      (breakpoint) => `@media ${breakpointQuery('below', breakpoint)} {
  .${dialogSheetClass(breakpoint)} {
    border-radius: var(--sw-radius-lg) var(--sw-radius-lg) 0 0;
    border-width: 1px 0 0;
    margin: auto 0 0;
    max-height: ${maxHeight};
    max-width: none;
    padding-bottom: calc(var(--sw-space-5) + env(safe-area-inset-bottom, 0px));
    padding-left: max(var(--sw-space-5), env(safe-area-inset-left, 0px));
    padding-right: max(var(--sw-space-5), env(safe-area-inset-right, 0px));
    width: 100%;
  }

  .${dialogSheetClass(breakpoint)}[open] {
    animation: sw-dialog-sheet-in var(--sw-motion-default) var(--sw-motion-easing);
  }
}`,
    )
    .join('\n\n');
}

function sheetMotionRules(): string {
  const still = breakpoints
    .map(
      (breakpoint) =>
        `  .${dialogSheetClass(breakpoint)}[open] { animation: none; }`,
    )
    .join('\n');
  return `@keyframes sw-dialog-sheet-in {
  from { translate: 0 100%; }
}

@media (prefers-reduced-motion: reduce) {
${still}
}`;
}

/*
 * The title row when the dialog has a close button: the title takes the
 * row and the button ends it. The button's negative margins keep the row
 * as tall as one title line and put the glyph's end on the padding edge,
 * at the sm control size and at the 44 px touch target alike.
 */
function closeButtonRules(): string {
  const square = (size: string) => `min-width: ${size};
    margin-block: calc((${title.lineHeight}px - ${size}) / 2);
    margin-inline-end: calc((var(--sw-space-4) - ${size}) / 2);`;

  return `.sw-dialog-header {
  align-items: flex-start;
  display: flex;
  gap: var(--sw-space-2);
}

.sw-dialog-header > :first-child {
  flex: 1 1 auto;
  min-width: 0;
}

.sw-button.sw-dialog-close {
  flex: none;
  padding-inline: 0;
  ${square('var(--sw-control-sm-min-height)')}
}

@media ${coarsePointerQuery} {
  .sw-button.sw-dialog-close {
    min-height: ${touchTarget};
    ${square(touchTarget)}
  }
}

/* Private control chrome: two strokes crossed in a space-4 square, in the
   button's color; borders, so forced colors keep them. */
.sw-dialog-close-glyph {
  flex: none;
  height: var(--sw-space-4);
  position: relative;
  width: var(--sw-space-4);
}

.sw-dialog-close-glyph::before,
.sw-dialog-close-glyph::after {
  border-top: 2px solid currentColor;
  border-radius: 1px;
  box-sizing: border-box;
  content: '';
  left: 0;
  margin-top: -1px;
  position: absolute;
  top: 50%;
  width: 100%;
}

.sw-dialog-close-glyph::before { transform: rotate(45deg); }
.sw-dialog-close-glyph::after { transform: rotate(-45deg); }`;
}

export function cssDialogClasses(): string {
  return `.sw-dialog {
  background: var(--sw-glass-fill);
  border: 1px solid var(--sw-glass-border);
  border-radius: var(--sw-radius-lg);
  box-shadow: inset 0 1px 0 var(--sw-glass-specular);
  backdrop-filter: blur(var(--sw-glass-blur)) saturate(var(--sw-glass-saturate));
  -webkit-backdrop-filter: blur(var(--sw-glass-blur)) saturate(var(--sw-glass-saturate));
  box-sizing: border-box;
  color: var(--sw-color-text);
  margin: auto;
  max-height: ${maxHeight};
  max-width: min(var(--sw-dialog-max), calc(100vw - var(--sw-space-8)));
  overflow: auto;
  width: calc(100% - var(--sw-space-8));
}

.sw-dialog-lg {
  max-width: min(var(--sw-dialog-max-lg), calc(100vw - var(--sw-space-8)));
}

${sheetRules()}

${sheetMotionRules()}

.sw-dialog::backdrop {
  background: color-mix(in srgb, var(--sw-color-text) 28%, transparent);
}

.sw-dialog:focus-visible {
  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);
  outline-offset: var(--sw-focus-ring-offset);
}

${closeButtonRules()}`;
}

export function dialogClassCatalog(): string[] {
  return [
    'sw-dialog',
    'sw-dialog-lg',
    ...breakpoints.map((breakpoint) => dialogSheetClass(breakpoint)),
    'sw-dialog-header',
    'sw-dialog-close',
    'sw-dialog-close-glyph',
  ];
}
