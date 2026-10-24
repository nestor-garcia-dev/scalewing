import { typographyVariants } from '@scalewing/tokens';

import { quietFill } from './quiet-fill.js';
import { coarsePointerQuery, touchTarget } from './touch-target.js';

const label = typographyVariants.label;

/* The full trigger's least width, a named geometry of this control. */
const triggerMinWidth = '12rem';

const trigger = '.sw-command-palette-trigger';
const compact = `${trigger}.sw-command-palette-trigger-compact`;

/*
 * The trigger: a search-looking pill (the surface inside the border
 * hairline, fully rounded) holding the glyph, the placeholder words in the
 * muted colour taking the free space, and the key hint at the end; the sm
 * control height, the 44 px target on a coarse pointer. \`compact\` is the
 * glyph alone in a round quiet button. Hover takes the quiet fill.
 */
export function cssCommandPaletteTriggerClasses(): string {
  return `${trigger} {
  align-items: center;
  appearance: none;
  background: var(--sw-color-surface);
  border: 1px solid var(--sw-color-border);
  border-radius: var(--sw-radius-pill);
  box-sizing: border-box;
  color: var(--sw-color-muted);
  cursor: pointer;
  display: inline-flex;
  font-family: var(--sw-font-sans);
  font-size: ${label.fontSize}px;
  font-weight: 400;
  gap: var(--sw-space-2);
  letter-spacing: ${label.letterSpacing}px;
  line-height: ${label.lineHeight}px;
  margin: 0;
  max-width: 100%;
  min-height: var(--sw-control-sm-min-height);
  min-width: min(${triggerMinWidth}, 100%);
  padding-inline: var(--sw-space-3) var(--sw-space-2);
  text-align: start;
}

.sw-command-palette-trigger-icon {
  display: inline-flex;
  flex: none;
}

.sw-command-palette-trigger-text {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (hover: hover) {
  ${trigger}:hover { background: ${quietFill}; color: var(--sw-color-text); }
}

${trigger}:focus-visible {
  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);
  outline-offset: var(--sw-focus-ring-offset);
}

${compact} {
  background: transparent;
  border-color: transparent;
  justify-content: center;
  min-width: var(--sw-control-sm-min-height);
  padding: 0;
}

@media ${coarsePointerQuery} {
  ${trigger} { min-height: ${touchTarget}; }
  ${compact} { min-width: ${touchTarget}; }
}

@media (forced-colors: active) {
  ${trigger} { color: ButtonText; }
}`;
}

export function commandPaletteTriggerClassCatalog(): string[] {
  return [
    'sw-command-palette-trigger',
    'sw-command-palette-trigger-compact',
    'sw-command-palette-trigger-icon',
    'sw-command-palette-trigger-text',
    'sw-command-palette-key',
  ];
}
