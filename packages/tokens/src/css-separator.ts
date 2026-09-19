export function cssSeparatorClasses(): string {
  return `.sw-separator {
  background: var(--sw-color-border);
  border: 0;
  flex: none;
  margin: 0;
}

.sw-separator-horizontal {
  height: 1px;
  width: 100%;
}

.sw-separator-vertical {
  align-self: stretch;
  min-height: var(--sw-space-4);
  width: 1px;
}

@media (forced-colors: active) {
  .sw-separator { background: CanvasText; }
}`;
}

export function separatorClassCatalog(): string[] {
  return ['sw-separator', 'sw-separator-horizontal', 'sw-separator-vertical'];
}
