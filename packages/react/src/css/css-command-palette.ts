import { typographyVariants } from '@scalewing/tokens';

import { breakpointQuery } from './breakpoints.js';
import { cssCommandPaletteKeyClasses } from './css-command-palette-key.js';
import {
  commandPaletteTriggerClassCatalog,
  cssCommandPaletteTriggerClasses,
} from './css-command-palette-trigger.js';
import { quietFill } from './quiet-fill.js';
import { coarsePointerQuery, touchTarget } from './touch-target.js';

const body = typographyVariants.body;
const caption = typographyVariants.caption;
const label = typographyVariants.label;

/* The palette's width, a named geometry of this control. */
const paletteWidth = '40rem';

/* Its distance from the window's top: a tenth of the height, at least space-2. */
const paletteTop = 'max(var(--sw-space-2), 10vh)';

const fromMd = breakpointQuery('from', 'md');

/*
 * The palette: a modal dialog on the top layer near the window's top (not
 * centred, so results grow downward), glass like Dialog, 40rem wide (the
 * window less space-2 each side on a phone). Its body is a column: the
 * field, the listbox (the only part that scrolls), the message, the hint.
 */
function frameRules(): string {
  return `.sw-command-palette {
  background: var(--sw-glass-fill);
  border: 1px solid var(--sw-glass-border);
  border-radius: var(--sw-radius-lg);
  box-shadow: var(--sw-elevation-sm), inset 0 1px 0 var(--sw-glass-specular);
  backdrop-filter: blur(var(--sw-glass-blur)) saturate(var(--sw-glass-saturate));
  -webkit-backdrop-filter: blur(var(--sw-glass-blur)) saturate(var(--sw-glass-saturate));
  box-sizing: border-box;
  color: var(--sw-color-text);
  margin: var(--sw-space-2) auto auto;
  max-height: calc(100dvh - 2 * var(--sw-space-2));
  max-width: calc(100% - 2 * var(--sw-space-2));
  overflow: hidden;
  padding: 0;
  width: ${paletteWidth};
}

@media ${fromMd} {
  .sw-command-palette {
    margin-top: ${paletteTop};
    max-height: calc(100dvh - ${paletteTop} - var(--sw-space-8));
  }
}

.sw-command-palette::backdrop {
  background: color-mix(in srgb, var(--sw-color-text) 28%, transparent);
}

.sw-command-palette-body {
  display: flex;
  flex-direction: column;
  max-height: inherit;
}

[data-theme] input.sw-command-palette-field {
  background: transparent;
  border: 0;
  border-bottom: 1px solid var(--sw-color-border);
  border-radius: 0;
  box-sizing: border-box;
  flex: none;
  font-size: ${body.fontSize}px;
  letter-spacing: ${body.letterSpacing}px;
  line-height: ${body.lineHeight}px;
  min-height: ${touchTarget};
  padding: var(--sw-space-3) var(--sw-space-4);
  width: 100%;
}

[data-theme] input.sw-command-palette-field:focus,
[data-theme] input.sw-command-palette-field:focus-visible {
  border-bottom-color: var(--sw-color-accent);
  box-shadow: inset 0 -1px 0 var(--sw-color-accent);
  outline: none;
}

.sw-command-palette-list {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: var(--sw-space-1) var(--sw-space-2);
}

.sw-command-palette-heading {
  color: var(--sw-color-muted);
  font-family: var(--sw-font-sans);
  font-size: ${caption.fontSize}px;
  font-weight: 600;
  letter-spacing: ${caption.letterSpacing}px;
  line-height: ${caption.lineHeight}px;
  padding: var(--sw-space-2) var(--sw-space-2) var(--sw-space-1);
}

.sw-command-palette-message,
.sw-command-palette-hint {
  color: var(--sw-color-muted);
  font-family: var(--sw-font-sans);
  font-size: ${caption.fontSize}px;
  letter-spacing: ${caption.letterSpacing}px;
  line-height: ${caption.lineHeight}px;
  margin: 0;
  padding: var(--sw-space-3) var(--sw-space-4);
}

.sw-command-palette-hint {
  border-top: 1px solid var(--sw-color-border);
  flex: none;
}`;
}

/*
 * A result: its mark, its label over its muted detail, and on the active
 * row (\`aria-selected\`, the arrow keys' or the pointer's) the quiet fill
 * and the Enter key cap at the end. The sm control height, 44 px on a
 * coarse pointer. On the fill the detail moves toward the text colour to
 * keep 4.5:1. Forced colours draw the active row in Highlight.
 */
function itemRules(): string {
  return `.sw-command-palette-item {
  align-items: center;
  border-radius: var(--sw-radius-sm);
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  font-family: var(--sw-font-sans);
  font-size: ${label.fontSize}px;
  gap: var(--sw-space-3);
  letter-spacing: ${label.letterSpacing}px;
  line-height: ${label.lineHeight}px;
  min-height: var(--sw-control-sm-min-height);
  overflow-wrap: anywhere;
  padding: var(--sw-space-1) var(--sw-space-2);
}

.sw-command-palette-item[aria-selected='true'] {
  background: ${quietFill};
}

.sw-command-palette-icon {
  display: inline-flex;
  flex: none;
}

.sw-command-palette-words {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-width: 0;
}

.sw-command-palette-label {
  font-weight: 500;
}

.sw-command-palette-detail {
  color: var(--sw-color-muted);
  font-size: ${caption.fontSize}px;
  letter-spacing: ${caption.letterSpacing}px;
  line-height: ${caption.lineHeight}px;
}

.sw-command-palette-item[aria-selected='true'] .sw-command-palette-detail {
  color: color-mix(in srgb, var(--sw-color-muted) 70%, var(--sw-color-text));
}

@media ${coarsePointerQuery} {
  .sw-command-palette-item { min-height: ${touchTarget}; }
}

@media (forced-colors: active) {
  .sw-command-palette { border-color: CanvasText; }
  .sw-command-palette-item[aria-selected='true'] { background: Highlight; color: HighlightText; forced-color-adjust: none; }
  .sw-command-palette-item[aria-selected='true'] .sw-command-palette-detail,
  .sw-command-palette-item[aria-selected='true'] .sw-command-palette-key { border-color: HighlightText; color: HighlightText; }
  [data-theme] input.sw-command-palette-field:focus-visible { border-bottom-color: Highlight; box-shadow: inset 0 -1px 0 Highlight; }
}`;
}

/*
 * CommandPalette and CommandPaletteTrigger (see components/CommandPalette.tsx):
 * the trigger is \`css-command-palette-trigger.ts\`, the shared key cap
 * \`css-command-palette-key.ts\`.
 */
export function cssCommandPaletteClasses(): string {
  return `${cssCommandPaletteKeyClasses()}

${cssCommandPaletteTriggerClasses()}

${frameRules()}

${itemRules()}`;
}

export function commandPaletteClassCatalog(): string[] {
  return [
    ...commandPaletteTriggerClassCatalog(),
    'sw-command-palette',
    'sw-command-palette-body',
    'sw-command-palette-field',
    'sw-command-palette-list',
    'sw-command-palette-heading',
    'sw-command-palette-item',
    'sw-command-palette-icon',
    'sw-command-palette-words',
    'sw-command-palette-label',
    'sw-command-palette-detail',
    'sw-command-palette-message',
    'sw-command-palette-hint',
  ];
}
