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

/**
 * Where a fixed popover goes beside its anchor: below and aligned to the
 * anchor's inline start (its end in right-to-left), above when it does not
 * fit below but does above, and always kept inside the viewport by `inset`.
 */
export function anchoredPosition(
  anchor: AnchorRect,
  size: PopoverSize,
  viewport: Viewport,
  { gap = 0, inset = 0, rtl = false } = {},
): AnchoredPosition {
  const preferredLeft = rtl ? anchor.right - size.width : anchor.left;
  const maxLeft = viewport.width - inset - size.width;
  const left = Math.max(inset, Math.min(preferredLeft, maxLeft));

  const below = anchor.bottom + gap;
  const above = anchor.top - gap - size.height;
  const fitsBelow = below + size.height <= viewport.height - inset;
  const fitsAbove = above >= inset;
  const top = fitsBelow || !fitsAbove ? below : above;
  const maxTop = viewport.height - inset - size.height;
  return { left, top: Math.max(inset, Math.min(top, maxTop)) };
}
