import { typographyVariants } from './typography.js';

const body = typographyVariants.body;
const label = typographyVariants.label;
const caption = typographyVariants.caption;

export function cssDateFieldClasses(): string {
  return `.sw-date-field {
  display: flex;
  flex-direction: column;
  gap: var(--sw-space-1);
  max-width: 100%;
  min-width: 0;
  width: max-content;
}

.sw-date-field-label {
  color: var(--sw-color-text);
  font-family: var(--sw-font-sans);
  font-size: ${label.fontSize}px;
  font-weight: ${label.fontWeight};
  line-height: ${label.lineHeight}px;
}

.sw-date-field-input {
  background: var(--sw-glass-fill);
  border: 1px solid var(--sw-color-border);
  border-radius: var(--sw-radius-sm);
  box-sizing: border-box;
  color: var(--sw-color-text);
  font-family: var(--sw-font-sans);
  font-size: ${body.fontSize}px;
  min-height: var(--sw-control-md-min-height);
  min-width: 0;
  padding-inline: var(--sw-control-md-padding-inline);
  width: 100%;
}

.sw-date-field-input:focus-visible {
  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);
  outline-offset: var(--sw-focus-ring-offset);
}

.sw-date-field-input[aria-invalid='true'] {
  border-color: var(--sw-color-danger);
}

.sw-date-field-input:disabled {
  cursor: not-allowed;
  opacity: var(--sw-disabled-opacity);
}

.sw-date-field-description,
.sw-date-field-error {
  font-family: var(--sw-font-sans);
  font-size: ${caption.fontSize}px;
  line-height: ${caption.lineHeight}px;
}

.sw-date-field-description { color: var(--sw-color-muted); }
.sw-date-field-error { color: var(--sw-color-danger); }

@media (prefers-reduced-transparency: reduce) {
  .sw-date-field-input { background: var(--sw-color-surface); }
}

@media (forced-colors: active) {
  .sw-date-field-input[aria-invalid='true'] { border-color: CanvasText; }
}`;
}

export function dateFieldClassCatalog(): string[] {
  return [
    'sw-date-field',
    'sw-date-field-label',
    'sw-date-field-input',
    'sw-date-field-description',
    'sw-date-field-error',
  ];
}
