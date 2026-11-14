/** Where a tile's description and error start: under the label's words. */
const besideBox = 'calc(var(--sw-space-5) + var(--sw-space-2))';

/** A tile's chosen or invalid edge: its border plus an inset hairline, so nothing moves. */
function edge(color: string): string {
  return `border-color: ${color};
  box-shadow: inset 0 0 0 1px ${color};`;
}

/*
 * A tile Checkbox: the box, the label and the description inside one
 * bordered tile as wide as its column, at least the 44 px target plus its
 * padding. The label's `::after` stretches over the whole tile, so a press
 * anywhere on it (the description included) toggles the box. A chosen or
 * mixed tile takes the accent edge, an invalid one the danger edge (which
 * wins), twice the hairline through an inset shadow. The description and
 * the error start under the label's words. Forced colours keep the edges
 * as CanvasText, Highlight and Mark.
 */
export function cssCheckboxTileClasses(): string {
  return `.sw-checkbox-tile {
  border: 1px solid var(--sw-color-border);
  border-radius: var(--sw-radius-md);
  box-sizing: border-box;
  gap: 0;
  padding: var(--sw-space-2) var(--sw-space-3);
  position: relative;
  width: 100%;
}

.sw-checkbox-tile .sw-checkbox-label {
  min-height: var(--sw-control-sm-min-height);
  width: 100%;
}

.sw-checkbox-tile .sw-checkbox-label::after {
  border-radius: inherit;
  content: '';
  inset: 0;
  position: absolute;
}

.sw-checkbox-tile :is(.sw-checkbox-description, .sw-checkbox-error) {
  padding-inline-start: ${besideBox};
}

.sw-checkbox-tile-checked {
  ${edge('var(--sw-color-accent)')}
}

.sw-checkbox-tile-invalid {
  ${edge('var(--sw-color-danger)')}
}

.sw-checkbox-tile:has(.sw-checkbox-input:disabled) { cursor: not-allowed; }

@media (forced-colors: active) {
  .sw-checkbox-tile { border-color: CanvasText; }
  .sw-checkbox-tile-checked { border-color: Highlight; box-shadow: inset 0 0 0 1px Highlight; }
  .sw-checkbox-tile-invalid { border-color: Mark; box-shadow: inset 0 0 0 1px Mark; }
}`;
}

export function checkboxTileClassCatalog(): string[] {
  return [
    'sw-checkbox-tile',
    'sw-checkbox-tile-checked',
    'sw-checkbox-tile-invalid',
  ];
}
