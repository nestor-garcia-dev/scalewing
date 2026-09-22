export const statTileTones = [
  'default',
  'accent',
  'success',
  'danger',
  'warning',
] as const;

export type StatTileTone = (typeof statTileTones)[number];

/** The figure tile: a glyph circle before a label, a tabular value and a caption. Text colours come from `Text color`. */
export function cssStatTileClasses(): string {
  return `.sw-stat-tile {
  align-items: center;
  background: var(--sw-color-surface);
  border: 1px solid var(--sw-color-border);
  border-radius: var(--sw-radius-lg);
  box-sizing: border-box;
  color: var(--sw-color-text);
  display: flex;
  gap: var(--sw-space-3);
  min-width: 0;
  padding: var(--sw-space-4);
}

.sw-stat-tile-glyph {
  align-items: center;
  background: var(--sw-glass-fill);
  border: 1px solid var(--sw-color-border);
  border-radius: var(--sw-radius-pill);
  color: var(--sw-color-accent);
  display: inline-flex;
  flex: none;
  height: var(--sw-control-md-min-height);
  justify-content: center;
  width: var(--sw-control-md-min-height);
}

.sw-stat-tile-body {
  display: grid;
  gap: var(--sw-space-1);
  min-width: 0;
}

.sw-stat-tile-value {
  font-variant-numeric: tabular-nums;
  overflow-wrap: anywhere;
}

.sw-stat-tile-primary {
  background: var(--sw-color-accent);
  border-color: transparent;
}

.sw-stat-tile-primary .sw-stat-tile-glyph {
  background: transparent;
  border-color: var(--sw-color-onAccent);
  color: var(--sw-color-onAccent);
}

@media (forced-colors: active) {
  .sw-stat-tile { border-color: CanvasText; }
  .sw-stat-tile-primary { background: Highlight; }
}`;
}

export function statTileClassCatalog(): string[] {
  return [
    'sw-stat-tile',
    'sw-stat-tile-primary',
    'sw-stat-tile-glyph',
    'sw-stat-tile-body',
    'sw-stat-tile-label',
    'sw-stat-tile-value',
    'sw-stat-tile-caption',
  ];
}
