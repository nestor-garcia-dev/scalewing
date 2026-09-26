/**
 * A scroll region is a full-width box that scrolls its own content when the
 * content is wider (or taller) than the box, so a wide table never widens the
 * page. It is a keyboard stop, so its focus ring is drawn inside its edge
 * where an ancestor's clipping cannot hide it. Table and the DenominationGrid
 * strip share it.
 */
export function scrollRegionRules(selector: string): string {
  return `${selector} {
  overflow: auto;
  width: 100%;
}

${selector}:focus-visible {
  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);
  outline-offset: calc(-1 * var(--sw-focus-ring-width));
}`;
}
