export function cssDialogClasses(): string {
  return `.sw-dialog {
  background: var(--sw-glass-fill);
  border: 1px solid var(--sw-glass-border);
  border-radius: var(--sw-radius-lg);
  box-shadow: inset 0 1px 0 var(--sw-glass-specular);
  backdrop-filter: blur(var(--sw-glass-blur)) saturate(var(--sw-glass-saturate));
  -webkit-backdrop-filter: blur(var(--sw-glass-blur)) saturate(var(--sw-glass-saturate));
  box-sizing: border-box;
  color: var(--sw-color-text);
  margin: auto;
  max-height: min(100vh - var(--sw-space-8), 100dvh - var(--sw-space-8));
  max-width: min(var(--sw-dialog-max), calc(100vw - var(--sw-space-8)));
  overflow: auto;
  width: calc(100% - var(--sw-space-8));
}

.sw-dialog::backdrop {
  background: color-mix(in srgb, var(--sw-color-text) 28%, transparent);
}

.sw-dialog:focus-visible {
  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);
  outline-offset: var(--sw-focus-ring-offset);
}`;
}

export function dialogClassCatalog(): string[] {
  return ['sw-dialog'];
}
