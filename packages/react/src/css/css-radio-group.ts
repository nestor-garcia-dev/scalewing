import { typographyVariants } from '@scalewing/tokens';

const label = typographyVariants.label;
const caption = typographyVariants.caption;

export function cssRadioGroupClasses(): string {
  return `.sw-radio-group {
  border: 0;
  display: flex;
  flex-direction: column;
  gap: var(--sw-space-2);
  margin: 0;
  max-width: 100%;
  min-width: 0;
  padding: 0;
}

.sw-radio-group-legend {
  color: var(--sw-color-text);
  font-family: var(--sw-font-sans);
  font-size: ${label.fontSize}px;
  font-weight: ${label.fontWeight};
  line-height: ${label.lineHeight}px;
  padding: 0;
}

.sw-radio-group-options {
  display: flex;
  flex-direction: column;
  gap: var(--sw-space-1);
  min-width: 0;
}

.sw-radio-group-option {
  align-items: center;
  cursor: pointer;
  display: inline-flex;
  gap: var(--sw-space-2);
  max-width: 100%;
  min-height: var(--sw-control-md-min-height);
  width: max-content;
}

.sw-radio-group-control {
  align-items: center;
  display: inline-flex;
  flex: 0 0 var(--sw-space-5);
  height: var(--sw-space-5);
  position: relative;
}

.sw-radio-group-input {
  cursor: inherit;
  height: 100%;
  inset: 0;
  margin: 0;
  opacity: 0;
  position: absolute;
  width: 100%;
}

.sw-radio-group-mark {
  background: var(--sw-glass-fill);
  border: 1px solid var(--sw-color-border);
  border-radius: var(--sw-radius-pill);
  box-sizing: border-box;
  height: var(--sw-space-5);
  pointer-events: none;
  position: relative;
  width: var(--sw-space-5);
}

.sw-radio-group-mark::after {
  background: var(--sw-color-surface);
  border-radius: var(--sw-radius-pill);
  content: '';
  display: none;
  height: var(--sw-space-2);
  inset-block-start: calc((var(--sw-space-5) - var(--sw-space-2)) / 2);
  inset-inline-start: calc((var(--sw-space-5) - var(--sw-space-2)) / 2);
  position: absolute;
  width: var(--sw-space-2);
}

.sw-radio-group-input:checked + .sw-radio-group-mark {
  background: var(--sw-color-accent);
  border-color: var(--sw-color-accent);
}

.sw-radio-group-input:checked + .sw-radio-group-mark::after { display: block; }

.sw-radio-group-input:focus-visible + .sw-radio-group-mark {
  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);
  outline-offset: var(--sw-focus-ring-offset);
}

.sw-radio-group:has(.sw-radio-group-error) .sw-radio-group-mark {
  border-color: var(--sw-color-danger);
}

.sw-radio-group-option:has(.sw-radio-group-input:disabled) {
  cursor: not-allowed;
  opacity: var(--sw-disabled-opacity);
}

.sw-radio-group-text {
  color: var(--sw-color-text);
  font-family: var(--sw-font-sans);
  font-size: ${label.fontSize}px;
  font-weight: ${label.fontWeight};
  line-height: ${label.lineHeight}px;
  min-width: 0;
}

.sw-radio-group-description,
.sw-radio-group-error {
  font-family: var(--sw-font-sans);
  font-size: ${caption.fontSize}px;
  line-height: ${caption.lineHeight}px;
}

.sw-radio-group-description { color: var(--sw-color-muted); }
.sw-radio-group-error { color: var(--sw-color-danger); }

@media (prefers-reduced-transparency: reduce) {
  .sw-radio-group-mark { background: var(--sw-color-surface); }
  .sw-radio-group-input:checked + .sw-radio-group-mark { background: var(--sw-color-accent); }
}

@media (forced-colors: active) {
  .sw-radio-group-mark { background: Canvas; border-color: CanvasText; }
  .sw-radio-group-input:checked + .sw-radio-group-mark { background: Highlight; border-color: Highlight; }
  .sw-radio-group-input:checked + .sw-radio-group-mark::after { background: HighlightText; }
  .sw-radio-group:has(.sw-radio-group-error) .sw-radio-group-mark { border-color: CanvasText; }
}`;
}

export function radioGroupClassCatalog(): string[] {
  return [
    'sw-radio-group',
    'sw-radio-group-legend',
    'sw-radio-group-options',
    'sw-radio-group-option',
    'sw-radio-group-control',
    'sw-radio-group-input',
    'sw-radio-group-mark',
    'sw-radio-group-text',
    'sw-radio-group-description',
    'sw-radio-group-error',
  ];
}
