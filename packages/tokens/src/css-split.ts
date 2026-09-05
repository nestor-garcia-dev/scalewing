export function cssSplitClasses(): string {
  return `.sw-split {
  align-items: stretch;
  align-self: start;
  display: flex;
  flex: 0 0 auto;
  flex-direction: row;
  min-width: 0;
}

.sw-split-pane {
  box-sizing: border-box;
  max-width: var(--sw-split-max);
  min-width: 0;
  overflow: auto;
  width: var(--sw-split-size);
}

.sw-split[data-collapsed] .sw-split-pane {
  display: none;
}

.sw-split-handle {
  align-items: flex-start;
  background: transparent;
  border: 0;
  box-sizing: border-box;
  cursor: col-resize;
  display: flex;
  flex: none;
  justify-content: center;
  margin: 0;
  min-height: var(--sw-control-md-min-height);
  min-width: var(--sw-control-xs-min-height);
  padding: var(--sw-space-5) 0 0;
  touch-action: none;
  user-select: none;
}

.sw-split-handle:hover,
.sw-split-handle:focus-visible {
  background: color-mix(in srgb, var(--sw-color-muted) 16%, transparent);
}

.sw-split-handle:focus-visible {
  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);
  outline-offset: var(--sw-focus-ring-offset);
}

.sw-split[data-collapsed] .sw-split-handle {
  cursor: e-resize;
}

.sw-split-grip {
  border-inline-end: var(--sw-focus-ring-width) solid var(--sw-color-muted);
  border-inline-start: var(--sw-focus-ring-width) solid var(--sw-color-muted);
  box-sizing: border-box;
  display: block;
  height: var(--sw-space-6);
  position: sticky;
  top: var(--sw-space-5);
  width: var(--sw-space-2);
}`;
}

export function splitClassCatalog(): string[] {
  return ['sw-split', 'sw-split-pane', 'sw-split-handle', 'sw-split-grip'];
}
