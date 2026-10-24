import { typographyVariants } from '@scalewing/tokens';

import { checkStrokeIn } from './chevron.js';
import {
  contextSwitcherTriggerClassCatalog,
  cssContextSwitcherTriggerClasses,
} from './css-context-switcher-trigger.js';
import { quietFill } from './quiet-fill.js';
import { zIndex } from './stacking.js';
import { coarsePointerQuery, touchTarget } from './touch-target.js';

const caption = typographyVariants.caption;
const label = typographyVariants.label;

/* The popup's least width, a named geometry of this control. */
const popupMinWidth = '15rem';

/** The trigger's width, set on the open popup so it is never narrower. */
export const contextSwitcherTriggerWidthVariable =
  '--sw-context-switcher-trigger-width';

const viewportCap = 'calc(100% - var(--sw-space-2) - var(--sw-space-2))';

/*
 * The popup: a glass panel on the top layer beside the trigger (placed by
 * script, as the menus are), at least 15rem and as wide as the trigger
 * (its width set by the component), capped by the dialog width (or the
 * trigger's, when wider) and the viewport. A column: the filter field,
 * the listbox (the only part that scrolls), the empty words, the footer.
 */
function popupRules(): string {
  return `.sw-context-switcher-popup {
  background: var(--sw-glass-fill);
  border: 1px solid var(--sw-glass-border);
  border-radius: var(--sw-radius-sm);
  box-shadow: var(--sw-elevation-sm), inset 0 1px 0 var(--sw-glass-specular);
  backdrop-filter: blur(var(--sw-glass-blur)) saturate(var(--sw-glass-saturate));
  -webkit-backdrop-filter: blur(var(--sw-glass-blur)) saturate(var(--sw-glass-saturate));
  box-sizing: border-box;
  color: var(--sw-color-text);
  display: flex;
  flex-direction: column;
  gap: var(--sw-space-1);
  inset: auto;
  margin: 0;
  max-height: ${viewportCap};
  max-width: min(max(var(--sw-dialog-max), var(${contextSwitcherTriggerWidthVariable}, 0px)), ${viewportCap});
  min-width: min(max(${popupMinWidth}, var(${contextSwitcherTriggerWidthVariable}, 0px)), ${viewportCap});
  padding: var(--sw-space-1);
  position: fixed;
  width: max-content;
  ${zIndex('popup')}
}

.sw-context-switcher-filter {
  box-sizing: border-box;
  flex: none;
  margin: var(--sw-space-1);
  width: calc(100% - var(--sw-space-2));
}

.sw-context-switcher-list {
  flex: 1 1 auto;
  max-height: var(--sw-select-max);
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.sw-context-switcher-list:focus {
  outline: none;
}

.sw-context-switcher-heading {
  color: var(--sw-color-muted);
  font-family: var(--sw-font-sans);
  font-size: ${caption.fontSize}px;
  font-weight: 600;
  letter-spacing: ${caption.letterSpacing}px;
  line-height: ${caption.lineHeight}px;
  padding: var(--sw-space-2) var(--sw-space-2) var(--sw-space-1);
}

.sw-context-switcher-empty {
  color: var(--sw-color-muted);
  font-family: var(--sw-font-sans);
  font-size: ${caption.fontSize}px;
  letter-spacing: ${caption.letterSpacing}px;
  line-height: ${caption.lineHeight}px;
  margin: 0;
  padding: var(--sw-space-2);
}

.sw-context-switcher-footer {
  border-top: 1px solid var(--sw-color-border);
  display: flex;
  flex: none;
  flex-wrap: wrap;
  gap: var(--sw-space-1);
  padding-top: var(--sw-space-1);
}

.sw-context-switcher-action-icon {
  display: inline-flex;
  flex: none;
}`;
}

/*
 * An option: the mark, the label over its muted detail, then the badge,
 * the count pill and the current one's check at the inline end. The sm
 * control height (44 px on a coarse pointer). The active row (the arrow
 * keys' or the pointer's) takes the quiet fill, and an accent ring while
 * the list itself has visible focus; the current one is at label weight
 * with the accent check. Forced colours draw the active row in Highlight.
 */
function optionRules(): string {
  return `.sw-context-switcher-option {
  align-items: center;
  border-radius: var(--sw-radius-sm);
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  font-family: var(--sw-font-sans);
  font-size: ${label.fontSize}px;
  gap: var(--sw-space-2);
  letter-spacing: ${label.letterSpacing}px;
  line-height: ${label.lineHeight}px;
  min-height: var(--sw-control-sm-min-height);
  overflow-wrap: anywhere;
  padding: var(--sw-space-1) var(--sw-space-2);
}

.sw-context-switcher-option[data-active='true'] {
  background: ${quietFill};
}

/* On the quiet fill the muted detail moves toward the text colour, keeping 4.5:1. */
.sw-context-switcher-option[data-active='true'] .sw-context-switcher-detail {
  color: color-mix(in srgb, var(--sw-color-muted) 70%, var(--sw-color-text));
}

.sw-context-switcher-list:focus-visible .sw-context-switcher-option[data-active='true'] {
  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);
  outline-offset: calc(-1 * var(--sw-focus-ring-width));
}

.sw-context-switcher-icon {
  display: inline-flex;
  flex: none;
}

.sw-context-switcher-words {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-width: 0;
}

.sw-context-switcher-option[aria-selected='true'] .sw-context-switcher-label {
  font-weight: ${label.fontWeight};
}

.sw-context-switcher-detail {
  color: var(--sw-color-muted);
  font-size: ${caption.fontSize}px;
  letter-spacing: ${caption.letterSpacing}px;
  line-height: ${caption.lineHeight}px;
}

.sw-context-switcher-count {
  flex: none;
}

.sw-context-switcher-check {
  ${checkStrokeIn('var(--sw-color-accent)')}
  box-sizing: border-box;
  flex: none;
  height: var(--sw-space-3);
  margin-inline: var(--sw-space-1);
  transform: rotate(45deg);
  width: var(--sw-space-2);
}

@media ${coarsePointerQuery} {
  .sw-context-switcher-option { min-height: ${touchTarget}; }
}

@media (forced-colors: active) {
  .sw-context-switcher-popup { border-color: CanvasText; }
  .sw-context-switcher-option[data-active='true'] { background: Highlight; color: HighlightText; forced-color-adjust: none; }
  .sw-context-switcher-option[data-active='true'] .sw-context-switcher-detail { color: HighlightText; }
  .sw-context-switcher-option[data-active='true'] .sw-badge,
  .sw-context-switcher-option[data-active='true'] .sw-context-switcher-count { forced-color-adjust: auto; }
  .sw-context-switcher-check { border-color: CanvasText; }
  .sw-context-switcher-option[data-active='true'] .sw-context-switcher-check { border-color: HighlightText; }
  .sw-context-switcher-footer { border-color: CanvasText; }
}`;
}

/*
 * ContextSwitcher (see components/ContextSwitcher.tsx): the trigger is
 * \`css-context-switcher-trigger.ts\`; its count joins the shared pill
 * (\`css-count-pill.ts\`).
 */
export function cssContextSwitcherClasses(): string {
  return `${cssContextSwitcherTriggerClasses()}

${popupRules()}

${optionRules()}`;
}

export function contextSwitcherClassCatalog(): string[] {
  return [
    ...contextSwitcherTriggerClassCatalog(),
    'sw-context-switcher-popup',
    'sw-context-switcher-filter',
    'sw-context-switcher-list',
    'sw-context-switcher-heading',
    'sw-context-switcher-option',
    'sw-context-switcher-icon',
    'sw-context-switcher-words',
    'sw-context-switcher-label',
    'sw-context-switcher-detail',
    'sw-context-switcher-check',
    'sw-context-switcher-empty',
    'sw-context-switcher-footer',
    'sw-context-switcher-action-icon',
    // sw-context-switcher-count is the shared pill's (css-count-pill.ts).
  ];
}
