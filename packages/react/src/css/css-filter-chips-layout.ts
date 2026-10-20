/*
 * The chips' opt-in layouts.
 *
 * An inline count is set in the chip's own words, at tabular figures, after
 * a middle dot ("Open · 3"); a chosen chip keeps it in its own ink.
 *
 * Chips that scroll keep one row and scroll sideways inside their own box
 * (never the page) when they do not fit, each chip at its words' width on
 * one line (no wrapping, which overrides the wrapping row's
 * `overflow-wrap: anywhere`). The box is padded by the focus ring's reach and pulled back by
 * the same amount, so a focused chip's ring is not clipped and the chips
 * stay where a wrapped row puts them. A focused chip past the edge is
 * scrolled into view by the browser. The scrollbar stays, thin, so a
 * pointer without a sideways wheel can still reach the last chip.
 */
export const ringReach =
  'calc(var(--sw-focus-ring-width) + var(--sw-focus-ring-offset))';

export function cssFilterChipsLayoutClasses(): string {
  return `.sw-filter-chip-count-inline {
  font-variant-numeric: tabular-nums;
}

.sw-filter-chips-scroll .sw-filter-chips-options {
  flex-wrap: nowrap;
  margin: calc(-1 * ${ringReach});
  overflow-x: auto;
  overscroll-behavior-x: contain;
  padding: ${ringReach};
  scrollbar-width: thin;
}

.sw-filter-chips-scroll .sw-filter-chip {
  flex: none;
  max-width: none;
}

.sw-filter-chips-scroll .sw-filter-chip-face {
  white-space: nowrap;
}`;
}

export function filterChipsLayoutClassCatalog(): string[] {
  return ['sw-filter-chip-count-inline', 'sw-filter-chips-scroll'];
}
