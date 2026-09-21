import { typographyVariants } from '@scalewing/tokens';

const label = typographyVariants.label;
const caption = typographyVariants.caption;

export function cssSwitchClasses(): string {
  return `.sw-switch {
  align-items: center;
  cursor: pointer;
  display: inline-flex;
  gap: var(--sw-space-2);
  min-height: var(--sw-control-md-min-height);
}

.sw-switch-control {
  align-items: center;
  display: inline-flex;
  flex: 0 0 var(--sw-space-8);
  min-height: var(--sw-control-md-min-height);
  position: relative;
}

.sw-switch-input {
  cursor: inherit;
  height: 100%;
  inset: 0;
  margin: 0;
  opacity: 0;
  position: absolute;
  width: 100%;
}

.sw-switch-track {
  background: var(--sw-color-border);
  border: 1px solid var(--sw-color-border);
  border-radius: var(--sw-radius-pill);
  box-sizing: border-box;
  display: block;
  height: var(--sw-space-5);
  pointer-events: none;
  position: relative;
  width: var(--sw-space-8);
}

.sw-switch-thumb {
  background: var(--sw-color-surface);
  border-radius: var(--sw-radius-pill);
  height: var(--sw-space-4);
  inset-block-start: var(--sw-space-1);
  inset-inline-start: var(--sw-space-1);
  position: absolute;
  transition: inset-inline-start var(--sw-motion-fast) var(--sw-motion-easing);
  width: var(--sw-space-4);
}

.sw-switch-input:checked + .sw-switch-track {
  background: var(--sw-color-accent);
  border-color: var(--sw-color-accent);
}

.sw-switch-input:checked + .sw-switch-track .sw-switch-thumb {
  inset-inline-start: calc(var(--sw-space-8) - var(--sw-space-4) - var(--sw-space-1));
}

.sw-switch-input:focus-visible + .sw-switch-track {
  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);
  outline-offset: var(--sw-focus-ring-offset);
}

.sw-switch:has(.sw-switch-input:disabled) {
  cursor: not-allowed;
  opacity: var(--sw-disabled-opacity);
}

.sw-switch-copy {
  display: flex;
  flex-direction: column;
}

.sw-switch-label {
  color: var(--sw-color-text);
  font-family: var(--sw-font-sans);
  font-size: ${label.fontSize}px;
  font-weight: ${label.fontWeight};
  line-height: ${label.lineHeight}px;
}

.sw-switch-description {
  color: var(--sw-color-muted);
  font-family: var(--sw-font-sans);
  font-size: ${caption.fontSize}px;
  line-height: ${caption.lineHeight}px;
}

@media (prefers-reduced-motion: reduce) {
  .sw-switch-thumb { transition: none; }
}

@media (forced-colors: active) {
  .sw-switch-track { background: Canvas; border-color: CanvasText; }
  .sw-switch-thumb { background: CanvasText; }
  .sw-switch-input:checked + .sw-switch-track { background: Highlight; border-color: Highlight; }
  .sw-switch-input:checked + .sw-switch-track .sw-switch-thumb { background: HighlightText; }
}`;
}

export function switchClassCatalog(): string[] {
  return [
    'sw-switch',
    'sw-switch-control',
    'sw-switch-input',
    'sw-switch-track',
    'sw-switch-thumb',
    'sw-switch-copy',
    'sw-switch-label',
    'sw-switch-description',
  ];
}
