import { trackInset, typographyVariants } from '@scalewing/tokens';

const body = typographyVariants.body;
const data = typographyVariants.data;

/*
 * The control and its error message. The wrapper takes the track's place in
 * the layout: inline beside text and stretched in a Stack (compact), block
 * wide and stretched (filled), and the track fills it. The message has
 * inline-size containment, so its length never widens the field by itself;
 * while it has text the field is at least 24ch wide, capped at its
 * container (the percentage resolves against the Stack or Inline, not the
 * field), so a short track does not squeeze the message into a column. In
 * a Stack that changes nothing; in an Inline the field grows and the row
 * moves, while the track keeps its labels' width.
 */
function fieldRules(): string {
  return `.sw-segmented-field {
  display: inline-flex;
  flex-direction: column;
  gap: var(--sw-space-1);
}

.sw-segmented-field-filled {
  display: flex;
}

.sw-segmented-field > .sw-field-error {
  contain: inline-size;
}

.sw-segmented-field:has(> .sw-field-error:not(:empty)) {
  min-inline-size: min(100%, 24ch);
}

.sw-inline > .sw-segmented-field > .sw-segmented {
  align-self: flex-start;
}

.sw-segmented[aria-invalid='true'] {
  border-color: var(--sw-color-danger);
}

@media (forced-colors: active) {
  .sw-segmented[aria-invalid='true'] { border-color: Mark; }
}`;
}

export function cssSegmentedClasses(): string {
  return `${fieldRules()}

.sw-segmented {
  background: var(--sw-glass-fill);
  border: 1px solid var(--sw-glass-border);
  border-radius: var(--sw-radius-pill);
  box-sizing: border-box;
  display: inline-flex;
  gap: ${trackInset}px;
  padding: ${trackInset}px;
}

.sw-segmented-item {
  appearance: none;
  background: transparent;
  border: 0;
  border-radius: var(--sw-radius-pill);
  color: var(--sw-color-muted);
  cursor: pointer;
  font-family: var(--sw-font-sans);
  font-size: ${data.fontSize}px;
  font-weight: 600;
  letter-spacing: ${data.letterSpacing}px;
  line-height: ${data.lineHeight}px;
  min-height: var(--sw-control-xs-min-height);
  padding-inline: var(--sw-control-xs-padding-inline);
}

.sw-segmented-item:focus-visible {
  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);
  outline-offset: var(--sw-focus-ring-offset);
}

.sw-segmented-item-selected {
  background: var(--sw-color-surface);
  color: var(--sw-color-text);
}

.sw-segmented-filled {
  display: grid;
  grid-auto-columns: minmax(0, 1fr);
  grid-auto-flow: column;
}

.sw-segmented-filled .sw-segmented-item {
  align-items: center;
  color: var(--sw-color-text);
  display: inline-flex;
  font-size: ${body.fontSize}px;
  justify-content: center;
  letter-spacing: ${body.letterSpacing}px;
  line-height: ${body.lineHeight}px;
  min-height: var(--sw-control-md-min-height);
  min-width: 0;
  padding-inline: var(--sw-control-md-padding-inline);
}

.sw-segmented-filled .sw-segmented-item-selected {
  background: var(--sw-color-accent);
  color: var(--sw-color-onAccent);
}

.sw-segmented-disabled {
  opacity: var(--sw-disabled-opacity);
}

.sw-segmented-item:disabled {
  cursor: not-allowed;
}`;
}

export function segmentedClassCatalog(): string[] {
  return [
    'sw-segmented-field',
    'sw-segmented-field-filled',
    'sw-segmented',
    'sw-segmented-item',
    'sw-segmented-item-selected',
    'sw-segmented-filled',
    'sw-segmented-disabled',
  ];
}
