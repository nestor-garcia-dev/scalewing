import { coarsePointerQuery, touchTarget } from './touch-target.js';

/*
 * EmptyState: a centred column on the surface inside a dashed hairline
 * (the md radius), spacing step 8 above and below and step 4 at the sides,
 * its parts a step 3 apart. The glyph sits in a decorative step-8 square of
 * the subtle fill in the muted colour, a direct-child SVG drawn at step 5.
 * The title and line keep a readable measure and wrap; a long word breaks.
 * The actions are a centred row that wraps, a step 2 apart, each Button a
 * 44 px target on a coarse pointer. Forced colours keep the dashed edge in
 * the system's border colour and draw the glyph in CanvasText.
 */
export function cssEmptyStateClasses(): string {
  return `.sw-empty-state {
  align-items: center;
  background: var(--sw-color-surface);
  border: 1px dashed var(--sw-color-border);
  border-radius: var(--sw-radius-md);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: var(--sw-space-3);
  min-width: 0;
  overflow-wrap: anywhere;
  padding: var(--sw-space-8) var(--sw-space-4);
  text-align: center;
  width: 100%;
}

.sw-empty-state-icon {
  align-items: center;
  background: var(--sw-color-subtle);
  border-radius: var(--sw-radius-md);
  color: var(--sw-color-muted);
  display: inline-flex;
  flex: none;
  height: var(--sw-space-8);
  justify-content: center;
  width: var(--sw-space-8);
}

.sw-empty-state-icon > svg {
  height: var(--sw-space-5);
  width: var(--sw-space-5);
}

.sw-empty-state-title,
.sw-empty-state-description {
  margin: 0;
  max-width: var(--sw-reading-max);
}

.sw-empty-state-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sw-space-2);
  justify-content: center;
  margin-top: var(--sw-space-1);
}

@media ${coarsePointerQuery} {
  .sw-empty-state-actions .sw-button { min-height: ${touchTarget}; }
}

@media (forced-colors: active) {
  .sw-empty-state { border-color: CanvasText; }
  .sw-empty-state-icon { color: CanvasText; }
}`;
}

export function emptyStateClassCatalog(): string[] {
  return [
    'sw-empty-state',
    'sw-empty-state-icon',
    'sw-empty-state-title',
    'sw-empty-state-description',
    'sw-empty-state-actions',
  ];
}
