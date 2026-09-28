import { spacingScale } from '@scalewing/tokens';
import { useLayoutEffect, useRef, type RefObject } from 'react';

import { anchoredPosition } from '../../anchored-position.js';

function placePopover(node: HTMLElement, anchor: HTMLElement) {
  const position = anchoredPosition(
    anchor.getBoundingClientRect(),
    { width: node.offsetWidth, height: node.offsetHeight },
    { width: window.innerWidth, height: window.innerHeight },
    {
      gap: spacingScale[1],
      inset: spacingScale[2],
      rtl: getComputedStyle(anchor).direction === 'rtl',
    },
  );
  node.style.left = `${position.left}px`;
  node.style.top = `${position.top}px`;
}

/**
 * Shows a mounted element on the top layer as a manual popover, keeps it
 * beside `anchorRef` through scroll and resize, and calls `onDismiss` for a
 * press outside it and outside `ignoreRef` (the button that toggles it).
 * Browsers without the popover API get the same fixed placement.
 */
export function useAnchoredPopover(
  popoverRef: RefObject<HTMLElement | null>,
  anchorRef: RefObject<HTMLElement | null>,
  ignoreRef: RefObject<HTMLElement | null>,
  onDismiss: () => void,
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
    placePopover(node, anchor);

    function onPointerDown(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (node?.contains(target) || ignoreRef.current?.contains(target)) return;
      dismissRef.current();
    }
    function onMove() {
      if (node && anchor) placePopover(node, anchor);
    }
    document.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('resize', onMove);
    window.addEventListener('scroll', onMove, true);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('resize', onMove);
      window.removeEventListener('scroll', onMove, true);
      if (supportsPopover && node.matches(':popover-open')) node.hidePopover();
    };
  }, [anchorRef, ignoreRef, popoverRef]);
}
