export function cssSpinnerClasses(): string {
  return `.sw-spinner {
  align-items: center;
  display: inline-flex;
  flex: none;
  justify-content: center;
  vertical-align: middle;
}

.sw-spinner-sm { --sw-spinner-size: var(--sw-space-4); }
.sw-spinner-md { --sw-spinner-size: var(--sw-space-6); }
.sw-spinner-lg { --sw-spinner-size: var(--sw-space-8); }

.sw-spinner-icon {
  animation: sw-spinner-rotate var(--sw-motion-travel) var(--sw-motion-travel-easing) infinite;
  border: var(--sw-focus-ring-width) solid var(--sw-color-border);
  border-block-start-color: var(--sw-color-accent);
  border-radius: var(--sw-radius-pill);
  box-sizing: border-box;
  display: block;
  height: var(--sw-spinner-size);
  width: var(--sw-spinner-size);
}

@keyframes sw-spinner-rotate {
  to { transform: rotate(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  .sw-spinner-icon { animation: none; }
}

@media (forced-colors: active) {
  .sw-spinner-icon { border-color: CanvasText; border-block-start-color: Highlight; }
}`;
}

export function spinnerClassCatalog(): string[] {
  return [
    'sw-spinner',
    'sw-spinner-sm',
    'sw-spinner-md',
    'sw-spinner-lg',
    'sw-spinner-icon',
  ];
}
