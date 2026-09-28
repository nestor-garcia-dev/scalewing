export type AnchorRect = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

export type PopoverSize = {
  width: number;
  height: number;
};

export type Viewport = {
  width: number;
  height: number;
};

export type AnchoredPosition = {
  left: number;
  top: number;
};

export type AnchoredPositionOptions = {
  /** Space between the anchor and the popover, in px. */
  gap?: number;
  /** Space the popover keeps from every viewport edge, in px. */
  inset?: number;
  /** Right-to-left text: the anchor's inline start is its right edge. */
  rtl?: boolean;
  /**
   * When the popover would cross the viewport's inline end aligned to the
   * anchor's start, align it to the anchor's end instead (a menu opened from
   * a trigger at the end of a row), as long as that fits.
   */
  flipInline?: boolean;
};

function fitsInline(
  left: number,
  width: number,
  viewport: Viewport,
  inset: number,
) {
  return left >= inset && left + width <= viewport.width - inset;
}

function inlineLeft(
  anchor: AnchorRect,
  size: PopoverSize,
  viewport: Viewport,
  { inset = 0, rtl = false, flipInline = false }: AnchoredPositionOptions,
): number {
  const startAligned = rtl ? anchor.right - size.width : anchor.left;
  const endAligned = rtl ? anchor.left : anchor.right - size.width;
  const preferred =
    flipInline &&
    !fitsInline(startAligned, size.width, viewport, inset) &&
    fitsInline(endAligned, size.width, viewport, inset)
      ? endAligned
      : startAligned;
  const maxLeft = viewport.width - inset - size.width;
  return Math.max(inset, Math.min(preferred, maxLeft));
}

/**
 * Where a fixed popover goes beside its anchor: below and aligned to the
 * anchor's inline start (its end in right-to-left), above when it does not
 * fit below but does above, and always kept inside the viewport by `inset`.
 * With `flipInline`, a popover that does not fit start-aligned lines up with
 * the anchor's end instead.
 */
export function anchoredPosition(
  anchor: AnchorRect,
  size: PopoverSize,
  viewport: Viewport,
  options: AnchoredPositionOptions = {},
): AnchoredPosition {
  const { gap = 0, inset = 0 } = options;
  const left = inlineLeft(anchor, size, viewport, options);

  const below = anchor.bottom + gap;
  const above = anchor.top - gap - size.height;
  const fitsBelow = below + size.height <= viewport.height - inset;
  const fitsAbove = above >= inset;
  const top = fitsBelow || !fitsAbove ? below : above;
  const maxTop = viewport.height - inset - size.height;
  return { left, top: Math.max(inset, Math.min(top, maxTop)) };
}
