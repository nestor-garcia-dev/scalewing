export const appHeaderAppearances = ['glass', 'bar'] as const;

/**
 * How an AppHeader is drawn: `glass` (the default) is a rounded frosted
 * card; `bar` is a full-width band of the solid surface with a hairline
 * under it and no rounding, set against the page's edges.
 */
export type AppHeaderAppearance = (typeof appHeaderAppearances)[number];

export const appHeaderBarClass = 'sw-app-header-bar';

const bar = `.${appHeaderBarClass}`;

/*
 * A bar header: the surface with no blur or specular line, no radius, and
 * the border hairline under it only. One class, emitted after the glass
 * header, so it wins by order; the Box border classes are emitted later
 * still, so a Box `border` prop on the header wins over it, as on any
 * Box-based frame. Reduce Transparency sets the same surface. Forced
 * colors keep the hairline.
 */
export function cssAppHeaderBarClasses(): string {
  return `${bar} {
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  background: var(--sw-color-surface);
  border-color: var(--sw-color-border);
  border-radius: 0;
  border-style: solid;
  border-width: 0 0 1px;
  box-shadow: none;
}`;
}

export function appHeaderBarClassCatalog(): string[] {
  return [appHeaderBarClass];
}
