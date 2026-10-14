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
