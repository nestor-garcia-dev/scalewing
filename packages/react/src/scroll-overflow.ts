/** Which inline edges of a scroll box have content scrolled out past them. */
export type ScrollOverflow = { start: boolean; end: boolean };

export const noScrollOverflow: ScrollOverflow = { start: false, end: false };

/**
 * Sub-pixel layout can leave a box a fraction of a pixel wider than its
 * content, or a scroll position a fraction short of its end; within this
 * many pixels an edge counts as reached.
 */
const edgeTolerance = 1;

/**
 * Reads a box's horizontal overflow from its scroll metrics. `scrollLeft` is
 * 0 at the inline start and grows toward the end in a left-to-right box; in
 * a right-to-left box it is 0 at the start and negative toward the end, so
 * the distance travelled is its magnitude in both.
 */
export function scrollOverflow(
  scrollLeft: number,
  scrollWidth: number,
  clientWidth: number,
): ScrollOverflow {
  const hidden = scrollWidth - clientWidth;
  if (hidden <= edgeTolerance) return noScrollOverflow;
  const travelled = Math.abs(scrollLeft);
  return {
    start: travelled > edgeTolerance,
    end: travelled < hidden - edgeTolerance,
  };
}

export function sameScrollOverflow(
  a: ScrollOverflow,
  b: ScrollOverflow,
): boolean {
  return a.start === b.start && a.end === b.end;
}
