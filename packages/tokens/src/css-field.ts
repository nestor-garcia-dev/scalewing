import { typographyVariants } from './typography.js';

const caption = typographyVariants.caption;

export function cssFieldClasses(): string {
  return `.sw-field-required { color: var(--sw-color-danger); }

.sw-field-description,
.sw-field-error {
  font-family: var(--sw-font-sans);
  font-size: ${caption.fontSize}px;
  line-height: ${caption.lineHeight}px;
}

.sw-field-description { color: var(--sw-color-muted); }
.sw-field-error { color: var(--sw-color-danger); }

[data-theme] .sw-field-invalid :is(input, select, textarea) {
  border-color: var(--sw-color-danger);
}

@media (forced-colors: active) {
  [data-theme] .sw-field-invalid :is(input, select, textarea) { border-color: Mark; }
  .sw-field-error, .sw-field-required { color: Mark; }
}`;
}

export function fieldClassCatalog(): string[] {
  return [
    'sw-field',
    'sw-field-required',
    'sw-field-description',
    'sw-field-error',
    'sw-field-invalid',
  ];
}
