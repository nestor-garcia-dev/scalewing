import { typographyVariants } from '@scalewing/tokens';

import { zIndex } from './stacking.js';
import { quietFill } from './quiet-fill.js';

const caption = typographyVariants.caption;
const label = typographyVariants.label;

/*
 * The combobox input is a Field's input. Its list is a glass popover on
 * the popup layer (as Select's list), at least as wide as the input: a
 * caption heading per group, then options at the md control height with
 * the label, a badge and a muted description on one wrapping line. The
 * active option (the one aria-activedescendant names) takes the soft
 * muted fill; a hairline parts each option from the one before it, as
 * the boards draw it; a disabled option is muted and not pressable; the action
 * ends the list in the accent colour over a hairline. The empty text and
 * the note are muted captions under the list.
 */
export function cssComboboxClasses(): string {
  return `.sw-combobox {
  max-width: 100%;
  min-width: 0;
}

.sw-combobox-popup {
  background: var(--sw-glass-fill);
  border: 1px solid var(--sw-glass-border);
  border-radius: var(--sw-radius-sm);
  box-shadow: var(--sw-elevation-sm), inset 0 1px 0 var(--sw-glass-specular);
  backdrop-filter: blur(var(--sw-glass-blur)) saturate(var(--sw-glass-saturate));
  -webkit-backdrop-filter: blur(var(--sw-glass-blur)) saturate(var(--sw-glass-saturate));
  box-sizing: border-box;
  color: var(--sw-color-text);
  inset: auto;
  margin: 0;
  max-height: min(var(--sw-select-max), calc(100% - var(--sw-space-2) - var(--sw-space-2)));
  max-width: calc(100% - var(--sw-space-2) - var(--sw-space-2));
  overflow: auto;
  padding: var(--sw-space-1);
  position: fixed;
  ${zIndex('popup')}
}

.sw-combobox-heading {
  color: var(--sw-color-muted);
  font-family: var(--sw-font-sans);
  font-size: ${caption.fontSize}px;
  font-weight: ${label.fontWeight};
  letter-spacing: ${caption.letterSpacing}px;
  line-height: ${caption.lineHeight}px;
  padding: var(--sw-space-2) var(--sw-space-3) var(--sw-space-1);
}

.sw-combobox-option {
  align-items: center;
  border-radius: var(--sw-radius-sm);
  box-sizing: border-box;
  column-gap: var(--sw-space-2);
  cursor: pointer;
  display: flex;
  flex-wrap: wrap;
  font-family: var(--sw-font-sans);
  font-size: ${label.fontSize}px;
  letter-spacing: ${label.letterSpacing}px;
  line-height: ${label.lineHeight}px;
  min-height: var(--sw-control-md-min-height);
  overflow-wrap: anywhere;
  padding: var(--sw-space-1) var(--sw-space-3);
}

.sw-combobox-option + .sw-combobox-option {
  border-top: 1px solid var(--sw-color-border);
}

.sw-combobox-label {
  font-weight: ${label.fontWeight};
}

.sw-combobox-description {
  color: var(--sw-color-muted);
  font-size: ${caption.fontSize}px;
  letter-spacing: ${caption.letterSpacing}px;
  line-height: ${caption.lineHeight}px;
}

.sw-combobox-option[aria-selected='true'] {
  background: ${quietFill};
}

.sw-combobox-option[aria-disabled='true'] {
  cursor: not-allowed;
}

.sw-combobox-option[aria-disabled='true'] .sw-combobox-label {
  color: var(--sw-color-muted);
}

.sw-combobox-action {
  border-top: 1px solid var(--sw-color-border);
  color: var(--sw-color-accent);
  margin-top: var(--sw-space-1);
}

.sw-combobox-empty,
.sw-combobox-note {
  color: var(--sw-color-muted);
  font-family: var(--sw-font-sans);
  font-size: ${caption.fontSize}px;
  letter-spacing: ${caption.letterSpacing}px;
  line-height: ${caption.lineHeight}px;
  padding: var(--sw-space-2) var(--sw-space-3);
}

@media (forced-colors: active) {
  .sw-combobox-popup { border-color: CanvasText; }
  .sw-combobox-option[aria-selected='true'] { background: Highlight; color: HighlightText; forced-color-adjust: none; }
  .sw-combobox-option[aria-selected='true'] .sw-combobox-description { color: HighlightText; }
  .sw-combobox-option[aria-selected='true'] .sw-badge { forced-color-adjust: auto; }
  .sw-combobox-option[aria-disabled='true'] .sw-combobox-label { color: GrayText; }
  .sw-combobox-option[aria-selected='true'][aria-disabled='true'] .sw-combobox-label { color: HighlightText; }
  .sw-combobox-option + .sw-combobox-option { border-color: CanvasText; }
  .sw-combobox-action { border-color: CanvasText; }
}`;
}

export function comboboxClassCatalog(): string[] {
  return [
    'sw-combobox',
    'sw-combobox-popup',
    'sw-combobox-list',
    'sw-combobox-heading',
    'sw-combobox-option',
    'sw-combobox-label',
    'sw-combobox-description',
    'sw-combobox-action',
    'sw-combobox-empty',
    'sw-combobox-note',
  ];
}
