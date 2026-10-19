/** Fit width is 1; a page can be drawn up to four times as wide. */
export const minZoom = 1;
export const maxZoom = 4;
/** One key press's step: a quarter of the fitted width. */
export const zoomStep = 0.25;

/** A zoom kept between fit width and the most, to two decimals. */
export function clampZoom(zoom: number): number {
  if (!Number.isFinite(zoom)) return minZoom;
  return Math.round(Math.min(maxZoom, Math.max(minZoom, zoom)) * 100) / 100;
}

/** The zoom a key asks for on the page: `+` or `=` in, `-` out, `0` fit. */
export function zoomForKey(key: string, zoom: number): number | null {
  if (key === '+' || key === '=') return clampZoom(zoom + zoomStep);
  if (key === '-' || key === '_') return clampZoom(zoom - zoomStep);
  if (key === '0') return minZoom;
  return null;
}

/** A box on the screen, as `getBoundingClientRect` gives it. */
export type ScreenBox = {
  left: number;
  top: number;
  width: number;
  height: number;
};

/**
 * How far to scroll, across and down, so the spot of the page that was
 * under `point` before a zoom (the page at `before`) is under it again
 * after (the page at `after`). Both boxes are the page's own, so the
 * stage's padding and where the page sits on the screen count.
 */
export function anchorShift(
  before: ScreenBox,
  after: ScreenBox,
  point: { x: number; y: number },
): { x: number; y: number } {
  if (before.width <= 0 || before.height <= 0) return { x: 0, y: 0 };
  const across = (point.x - before.left) / before.width;
  const down = (point.y - before.top) / before.height;
  return {
    x: after.left + across * after.width - point.x,
    y: after.top + down * after.height - point.y,
  };
}
