import { ringReach } from './css-filter-chips-layout.js';

/*
 * A chips row lays several FilterChips groups on one line, a space-2 apart
 * as chips are, their chips level along the bottom (a group may draw its
 * label above; an error under one lifts its chips above the others'). The
 * `end` group sits at the row's end, or at its own line's end when the row
 * wraps.
 *
 * Wrapping, a group is as wide as its chips and wraps them itself when it
 * is wider than the row. Scrolling, every group's chips stay on one line
 * and the row is the one box that scrolls sideways (never the page),
 * padded by the focus ring's reach and pulled back as a scrolling group
 * is; a group's own scroll gives way, so its chips scroll with the rest.
 * A scrolling group is as wide as its chips (min-content: the chips do not
 * wrap), so a drawn label or an error wraps under them instead of widening
 * the group. The scrolling row is positioned, so a group's visually hidden
 * legend (absolutely placed where it would sit, past the edge) stays inside
 * the box it scrolls in rather than widening the page. These rules follow
 * the groups' own layout rules, which they override.
 */
export function cssFilterChipsRowClasses(): string {
  const scroll = '.sw-filter-chips-row-scroll';
  return `.sw-filter-chips-row {
  align-items: flex-end;
  display: flex;
  flex-wrap: wrap;
  gap: var(--sw-space-2);
  max-width: 100%;
  min-width: 0;
}

.sw-filter-chips-row-end {
  display: flex;
  margin-inline-start: auto;
  max-width: 100%;
  min-width: 0;
}

${scroll} {
  flex-wrap: nowrap;
  margin: calc(-1 * ${ringReach});
  overflow-x: auto;
  overscroll-behavior-x: contain;
  padding: ${ringReach};
  position: relative;
  scrollbar-width: thin;
}

${scroll} .sw-filter-chips,
${scroll} > .sw-filter-chips-row-end {
  flex: none;
  max-width: none;
}

${scroll} .sw-filter-chips { width: min-content; }

${scroll} .sw-filter-chips-options {
  flex-wrap: nowrap;
  margin: 0;
  overflow: visible;
  padding: 0;
}

${scroll} .sw-filter-chip {
  flex: none;
  max-width: none;
}

${scroll} .sw-filter-chip-face {
  white-space: nowrap;
}`;
}

export function filterChipsRowClassCatalog(): string[] {
  return [
    'sw-filter-chips-row',
    'sw-filter-chips-row-end',
    'sw-filter-chips-row-scroll',
  ];
}
