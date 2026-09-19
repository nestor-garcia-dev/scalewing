import { typographyVariants } from './typography.js';

const label = typographyVariants.label;

export function cssFilterChipsClasses(): string {
  return `.sw-filter-chips {
  border: 0;
  margin: 0;
  max-width: 100%;
  min-width: 0;
  padding: 0;
}

.sw-filter-chips-legend {
  color: var(--sw-color-text);
  font-family: var(--sw-font-sans);
  font-size: ${label.fontSize}px;
  font-weight: ${label.fontWeight};
  line-height: ${label.lineHeight}px;
  padding: 0 0 var(--sw-space-2);
}

.sw-filter-chips-options {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sw-space-2);
  min-width: 0;
}

.sw-filter-chip {
  cursor: pointer;
  display: inline-flex;
  max-width: 100%;
  position: relative;
}

.sw-filter-chip-input {
  cursor: inherit;
  height: 100%;
  inset: 0;
  margin: 0;
  opacity: 0;
  position: absolute;
  width: 100%;
}

.sw-filter-chip-face {
  align-items: center;
  background: var(--sw-glass-fill);
  border: 1px solid var(--sw-color-border);
  border-radius: var(--sw-radius-pill);
  color: var(--sw-color-text);
  display: inline-flex;
  font-family: var(--sw-font-sans);
  font-size: ${label.fontSize}px;
  line-height: ${label.lineHeight}px;
  min-height: var(--sw-control-md-min-height);
  min-width: 0;
  overflow-wrap: anywhere;
  padding: var(--sw-space-1) var(--sw-space-3);
}

.sw-filter-chip-input:checked + .sw-filter-chip-face {
  background: var(--sw-color-accent);
  border-color: var(--sw-color-accent);
  color: var(--sw-color-onAccent);
}

.sw-filter-chip-input:focus-visible + .sw-filter-chip-face {
  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);
  outline-offset: var(--sw-focus-ring-offset);
}

.sw-filter-chip:has(.sw-filter-chip-input:disabled) {
  cursor: not-allowed;
  opacity: var(--sw-disabled-opacity);
}

@media (forced-colors: active) {
  .sw-filter-chip-face { background: Canvas; border-color: CanvasText; color: CanvasText; }
  .sw-filter-chip-input:checked + .sw-filter-chip-face { background: Highlight; border-color: Highlight; color: HighlightText; }
  .sw-filter-chip-input:focus-visible + .sw-filter-chip-face { outline-color: Highlight; }
}`;
}

export function filterChipsClassCatalog(): string[] {
  return [
    'sw-filter-chips',
    'sw-filter-chips-legend',
    'sw-filter-chips-options',
    'sw-filter-chip',
    'sw-filter-chip-input',
    'sw-filter-chip-face',
  ];
}
