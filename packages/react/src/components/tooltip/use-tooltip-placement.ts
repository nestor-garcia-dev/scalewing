'use client';

import { useLayoutEffect, type RefObject } from 'react';

import { placePopover } from '../use-anchored-popover.js';

/**
 * While `shown`, puts the tooltip on the top layer as a manual popover and
 * keeps it beside its anchor and inside the viewport: under the anchor (over
 * it when there is no room below), lined up with its start or, where that
 * would leave the screen, its end, a `space-2` inset from every edge. It
 * follows scrolling, resizing, and a change in either element's size. While
 * hidden the tooltip stays in the page (it may name its trigger) and is not
 * a popover. Without the popover API it keeps the same fixed placement.
 */
export function useTooltipPlacement(
  shown: boolean,
  tooltipRef: RefObject<HTMLElement | null>,
  anchorRef: RefObject<HTMLElement | null>,
) {
  useLayoutEffect(() => {
    const node = tooltipRef.current;
    const anchor = anchorRef.current;
    if (!shown || !node || !anchor) return;
    const supportsPopover = typeof node.showPopover === 'function';
    if (supportsPopover) {
      node.setAttribute('popover', 'manual');
      if (!node.matches(':popover-open')) node.showPopover();
    }
    const place = () => {
      if (node && anchor) placePopover(node, anchor, { flipInline: true });
    };
    place();
    const resizes =
      typeof ResizeObserver === 'function' ? new ResizeObserver(place) : null;
    resizes?.observe(node);
    resizes?.observe(anchor);
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      resizes?.disconnect();
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
      if (supportsPopover) {
        if (node.matches(':popover-open')) node.hidePopover();
        node.removeAttribute('popover');
      }
    };
  }, [anchorRef, shown, tooltipRef]);
}
