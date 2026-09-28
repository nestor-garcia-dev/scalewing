import { spacingScale } from '@scalewing/tokens';
import { useLayoutEffect, useRef, type RefObject } from 'react';

import { anchoredPosition, type InlineAlign } from '../anchored-position.js';

export type AnchoredPopoverPlacement = {
  /** The anchor edge the popover prefers to line up with (default start). */
  align?: InlineAlign;
  /** Line up with the anchor's other edge when the preferred one overflows. */
  flipInline?: boolean;
};

/**
 * The viewport a fixed popover can use: the root's client box, which leaves
 * out a classic scrollbar (`innerWidth` and `100vw` include it). Falls back
 * to the window size where nothing is laid out, as in jsdom.
 */
function layoutViewport(): { width: number; height: number } {
  const root = document.documentElement;
  return {
    width: root.clientWidth || window.innerWidth,
    height: root.clientHeight || window.innerHeight,
  };
}

function placePopover(
  node: HTMLElement,
  anchor: HTMLElement,
  { align = 'start', flipInline = false }: AnchoredPopoverPlacement,
) {
  const position = anchoredPosition(
    anchor.getBoundingClientRect(),
    { width: node.offsetWidth, height: node.offsetHeight },
    layoutViewport(),
    {
      gap: spacingScale[1],
      inset: spacingScale[2],
      rtl: getComputedStyle(anchor).direction === 'rtl',
      align,
      flipInline,
    },
  );
  node.style.left = `${position.left}px`;
  node.style.top = `${position.top}px`;
}

/**
 * Shows a mounted element on the top layer as a manual popover, keeps it
 * beside `anchorRef` through scroll, window resize, and a change in its own
 * or the anchor's size, a `space-1` gap from it and a
 * `space-2` inset from the viewport edges, and calls `onDismiss` for a press
 * outside it and outside `ignoreRef` (the button that toggles it).
 * Browsers without the popover API get the same fixed placement.
 */
export function useAnchoredPopover(
  popoverRef: RefObject<HTMLElement | null>,
  anchorRef: RefObject<HTMLElement | null>,
  ignoreRef: RefObject<HTMLElement | null>,
  onDismiss: () => void,
  { align = 'start', flipInline = false }: AnchoredPopoverPlacement = {},
) {
  const dismissRef = useRef(onDismiss);
  useLayoutEffect(() => {
    dismissRef.current = onDismiss;
  });

  useLayoutEffect(() => {
    const node = popoverRef.current;
    const anchor = anchorRef.current;
    if (!node || !anchor) return;
    const supportsPopover = typeof node.showPopover === 'function';
    // Set only where supported: an unsupported runtime would hide a
    // `[popover]` element that it can never show.
    if (supportsPopover) {
      node.setAttribute('popover', 'manual');
      if (!node.matches(':popover-open')) node.showPopover();
    }
    placePopover(node, anchor, { align, flipInline });

    function onPointerDown(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (node?.contains(target) || ignoreRef.current?.contains(target)) return;
      dismissRef.current();
    }
    function onMove() {
      if (node && anchor) placePopover(node, anchor, { align, flipInline });
    }
    // A popover or anchor that changes size while open (new commands, a
    // month with another row of weeks, a relabelled trigger) moves too.
    // ResizeObserver is missing in some runtimes, such as jsdom.
    const resizes =
      typeof ResizeObserver === 'function' ? new ResizeObserver(onMove) : null;
    resizes?.observe(node);
    resizes?.observe(anchor);
    document.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('resize', onMove);
    window.addEventListener('scroll', onMove, true);
    return () => {
      resizes?.disconnect();
      document.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('resize', onMove);
      window.removeEventListener('scroll', onMove, true);
      if (supportsPopover && node.matches(':popover-open')) node.hidePopover();
    };
  }, [align, anchorRef, flipInline, ignoreRef, popoverRef]);
}
