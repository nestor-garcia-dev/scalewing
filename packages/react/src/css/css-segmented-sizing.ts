import { breakpointQuery, type Breakpoint } from './breakpoints.js';

/** The class that stretches a SegmentedControl's field below a breakpoint. */
export function segmentedFullWidthClass(breakpoint: Breakpoint): string {
  return `sw-segmented-field-full-below-${breakpoint}`;
}

/**
 * `md` (the default) is each track's own segment padding; `sm` pads every
 * segment a step less and keeps its label on one line, ending in an
 * ellipsis past its share, so a few segments fit a phone's card.
 */
export const segmentedSizes = ['md', 'sm'] as const;
export type SegmentedSize = (typeof segmentedSizes)[number];

export const segmentedSmClass = 'sw-segmented-sm';

/*
 * Below the breakpoint a full-width field fills its column and its track
 * shares that width equally among its segments (the filled track's grid),
 * whatever its variant, a raised one included (three classes, after the
 * raised and Inline rules that size it to its segments).
 *
 * A small track pads each segment without a mark a space-2 step on both
 * sides (a segment with a mark keeps its variant's padding), never wraps a
 * label and ends a label that does not fit its segment in an ellipsis on
 * the label's own block box (`sw-segmented-item-label`; an inline box
 * cannot clip), so a plain segment and a flex item (a
 * filled or marked segment) truncate too; the radio's name still reads
 * the whole label. After every variant's padding.
 */
export function cssSegmentedSizingClasses(): string {
  const full = segmentedFullWidthClass('md');
  return `@media ${breakpointQuery('below', 'md')} {
  .sw-segmented-field.${full} {
    align-self: stretch;
    display: flex;
    width: 100%;
  }
  .sw-segmented-field.${full} > .sw-segmented {
    align-self: stretch;
    display: grid;
    grid-auto-columns: minmax(0, 1fr);
    grid-auto-flow: column;
  }
}

.sw-segmented.${segmentedSmClass} .sw-segmented-item {
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
}

.sw-segmented.${segmentedSmClass}:not(.sw-segmented-with-icons) .sw-segmented-item {
  padding-inline: var(--sw-space-2);
}

.${segmentedSmClass} .sw-segmented-item-label {
  display: block;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}`;
}

export function segmentedSizingClassCatalog(): string[] {
  return [
    segmentedFullWidthClass('md'),
    segmentedSmClass,
    'sw-segmented-item-label',
  ];
}
