'use client';

import {
  type FocusEvent,
  type RefObject,
  useLayoutEffect,
  useRef,
} from 'react';

/**
 * Keeps focus when the field swaps its zone for the chosen row (or back).
 * The frame's focus handlers note whether focus is in the field. A blur
 * that leaves the button in the page, with the window still focused, means
 * the person moved on; one whose button was removed is the swap; and one
 * while the window is away is the system picker. After a swap, if focus
 * was in the field and is now nowhere, it moves to the button now there.
 * Focus the person moved elsewhere (an answer that comes later) is never
 * taken back.
 */
export function useSwapFocus(
  button: RefObject<HTMLElement | null>,
  chosen: boolean,
) {
  const inside = useRef(false);

  useLayoutEffect(() => {
    if (!inside.current) return;
    const active = document.activeElement;
    if (active === null || active === document.body) button.current?.focus();
  }, [button, chosen]);

  return {
    onFocus: () => {
      inside.current = true;
    },
    onBlur: (event: FocusEvent<HTMLElement>) => {
      const next = event.relatedTarget;
      if (next instanceof Node && event.currentTarget.contains(next)) return;
      const left = event.target;
      // Removed by the swap, the button is gone by the next microtask; and
      // while the system picker is open the window itself has lost focus,
      // which is not the person leaving the field.
      queueMicrotask(() => {
        if (left.isConnected && document.hasFocus()) inside.current = false;
      });
    },
  };
}
