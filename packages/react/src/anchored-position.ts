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

/** Which of the anchor's inline edges the popover lines up with. */
export type InlineAlign = 'start' | 'end';

export type AnchoredPositionOptions = {
  /** Space between the anchor and the popover, in px. */
  gap?: number;
  /** Space the popover keeps from every viewport edge, in px. */
  inset?: number;
  /** Right-to-left text: the anchor's inline start is its right edge. */
  rtl?: boolean;
  /**
   * The anchor edge the popover prefers to line up with: its inline start
   * (default) or its inline end, for a menu that should stay under the end
   * of a card or row.
   */
  align?: InlineAlign;
  /**
   * When the popover would leave the viewport lined up with its preferred
   * edge, line it up with the anchor's other edge instead (a menu opened from
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
  {
    inset = 0,
    rtl = false,
    align = 'start',
    flipInline = false,
  }: AnchoredPositionOptions,
): number {
  const startAligned = rtl ? anchor.right - size.width : anchor.left;
  const endAligned = rtl ? anchor.left : anchor.right - size.width;
  const [first, other] =
    align === 'end' ? [endAligned, startAligned] : [startAligned, endAligned];
  const preferred =
    flipInline &&
    !fitsInline(first, size.width, viewport, inset) &&
    fitsInline(other, size.width, viewport, inset)
      ? other
      : first;
  const maxLeft = viewport.width - inset - size.width;
  return Math.max(inset, Math.min(preferred, maxLeft));
}

/**
 * Where a fixed popover goes beside its anchor: below and aligned to the
 * anchor's inline start (or its inline end with `align: 'end'`; start and end
 * mirror in right-to-left), above when it does not fit below but does above,
 * and always kept inside the viewport by `inset`. With `flipInline`, a
 * popover that does not fit on its preferred edge lines up with the other.
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
