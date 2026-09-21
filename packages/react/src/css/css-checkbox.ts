import { typographyVariants } from '@scalewing/tokens';

const label = typographyVariants.label;
const caption = typographyVariants.caption;

export function cssCheckboxClasses(): string {
  return `.sw-checkbox {
  display: flex;
  flex-direction: column;
  gap: var(--sw-space-1);
  max-width: 100%;
}

.sw-checkbox-label {
  align-items: center;
  cursor: pointer;
  display: inline-flex;
  gap: var(--sw-space-2);
  max-width: 100%;
  min-height: var(--sw-control-md-min-height);
  width: max-content;
}

.sw-checkbox-control {
  align-items: center;
  display: inline-flex;
  flex: 0 0 var(--sw-space-5);
  height: var(--sw-space-5);
  position: relative;
}

.sw-checkbox-input {
  cursor: inherit;
  height: 100%;
  inset: 0;
  margin: 0;
  opacity: 0;
  position: absolute;
  width: 100%;
}

.sw-checkbox-mark {
  background: var(--sw-glass-fill);
  border: 1px solid var(--sw-color-border);
  border-radius: var(--sw-radius-sm);
  box-sizing: border-box;
  height: var(--sw-space-5);
  pointer-events: none;
  position: relative;
  width: var(--sw-space-5);
}

.sw-checkbox-mark::after {
  border-bottom: 2px solid var(--sw-color-surface);
  border-right: 2px solid var(--sw-color-surface);
  content: '';
  display: none;
  height: var(--sw-space-2);
  inset-block-start: var(--sw-space-1);
  inset-inline-start: var(--sw-space-2);
  position: absolute;
  transform: rotate(45deg);
  width: var(--sw-space-1);
}

.sw-checkbox-input:checked + .sw-checkbox-mark {
  background: var(--sw-color-accent);
  border-color: var(--sw-color-accent);
}

.sw-checkbox-input:checked + .sw-checkbox-mark::after { display: block; }

.sw-checkbox-input:focus-visible + .sw-checkbox-mark {
  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);
  outline-offset: var(--sw-focus-ring-offset);
}

.sw-checkbox-input[aria-invalid='true'] + .sw-checkbox-mark {
  border-color: var(--sw-color-danger);
}

.sw-checkbox-label:has(.sw-checkbox-input:disabled) {
  cursor: not-allowed;
  opacity: var(--sw-disabled-opacity);
}

.sw-checkbox-text {
  color: var(--sw-color-text);
  font-family: var(--sw-font-sans);
  font-size: ${label.fontSize}px;
  font-weight: ${label.fontWeight};
  line-height: ${label.lineHeight}px;
  min-width: 0;
}

.sw-checkbox-description,
.sw-checkbox-error {
  font-family: var(--sw-font-sans);
  font-size: ${caption.fontSize}px;
  line-height: ${caption.lineHeight}px;
}

.sw-checkbox-description { color: var(--sw-color-muted); }
.sw-checkbox-error { color: var(--sw-color-danger); }

@media (prefers-reduced-transparency: reduce) {
  .sw-checkbox-mark { background: var(--sw-color-surface); }
  .sw-checkbox-input:checked + .sw-checkbox-mark { background: var(--sw-color-accent); }
}

@media (forced-colors: active) {
  .sw-checkbox-mark { background: Canvas; border-color: CanvasText; }
  .sw-checkbox-input:checked + .sw-checkbox-mark { background: Highlight; border-color: Highlight; }
  .sw-checkbox-input:checked + .sw-checkbox-mark::after { border-color: HighlightText; }
  .sw-checkbox-input[aria-invalid='true'] + .sw-checkbox-mark { border-color: CanvasText; }
}`;
}

export function checkboxClassCatalog(): string[] {
  return [
    'sw-checkbox',
    'sw-checkbox-label',
    'sw-checkbox-control',
    'sw-checkbox-input',
    'sw-checkbox-mark',
    'sw-checkbox-text',
    'sw-checkbox-description',
    'sw-checkbox-error',
  ];
}
