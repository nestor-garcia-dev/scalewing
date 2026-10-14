/** Which inline edges of a scroll box have content scrolled out past them. */
export type ScrollOverflow = { start: boolean; end: boolean };

/** Which block edges of a scroll box have content scrolled out past them. */
export type BlockScrollOverflow = { top: boolean; bottom: boolean };

export const noScrollOverflow: ScrollOverflow = { start: false, end: false };

export const noBlockScrollOverflow: BlockScrollOverflow = {
  top: false,
  bottom: false,
};

/**
 * Sub-pixel layout can leave a box a fraction of a pixel wider than its
 * content, or a scroll position a fraction short of its end; within this
 * many pixels an edge counts as reached.
 */
const edgeTolerance = 1;

/**
 * Whether one axis has content past its leading and its trailing edge, or
 * `null` when the content fits that axis. `travelled` is how far the box
 * has scrolled from its leading edge.
 */
function axisOverflow(
  travelled: number,
  scrollSize: number,
  clientSize: number,
): [leading: boolean, trailing: boolean] | null {
  const hidden = scrollSize - clientSize;
  if (hidden <= edgeTolerance) return null;
  return [travelled > edgeTolerance, travelled < hidden - edgeTolerance];
}

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
  const edges = axisOverflow(Math.abs(scrollLeft), scrollWidth, clientWidth);
  if (edges === null) return noScrollOverflow;
  return { start: edges[0], end: edges[1] };
}

/**
 * Reads a box's vertical overflow from its scroll metrics: `scrollTop` is 0
 * at the top and grows toward the bottom.
 */
export function blockScrollOverflow(
  scrollTop: number,
  scrollHeight: number,
  clientHeight: number,
): BlockScrollOverflow {
  const edges = axisOverflow(scrollTop, scrollHeight, clientHeight);
  if (edges === null) return noBlockScrollOverflow;
  return { top: edges[0], bottom: edges[1] };
}

export function sameScrollOverflow(
  a: ScrollOverflow,
  b: ScrollOverflow,
): boolean {
  return a.start === b.start && a.end === b.end;
}

export function sameBlockScrollOverflow(
  a: BlockScrollOverflow,
  b: BlockScrollOverflow,
): boolean {
  return a.top === b.top && a.bottom === b.bottom;
}
