/*
 * The strokes of Scalewing's private control chrome, drawn with borders so
 * forced colours keep them: the chevron (Accordion, Select, the menus,
 * Pagination, ListRow) and the check (Checkbox, Steps, ListRow).
 */

/**
 * A stroked chevron in `color`: two sides of a `space-2` square (its
 * bottom and right borders, so forced colours keep it), turned by each
 * surface to point where it needs.
 */
export function chevronStrokeIn(color: string): string {
  return `border-bottom: 2px solid ${color};
  border-right: 2px solid ${color};
  box-sizing: border-box;
  height: var(--sw-space-2);
  width: var(--sw-space-2);`;
}

/** The muted chevron Accordion, Select and the menus share. */
export const chevronStroke = chevronStrokeIn('var(--sw-color-muted)');

/**
 * A check's two strokes in `color`: the bottom and right borders of a box
 * the caller sizes and turns 45°, so forced colours keep them. Checkbox,
 * Steps and ListRow share it.
 */
export function checkStrokeIn(color: string): string {
  return `border-bottom: 2px solid ${color};
  border-right: 2px solid ${color};`;
}
