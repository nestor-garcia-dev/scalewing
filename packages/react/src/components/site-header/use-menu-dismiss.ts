import { type RefObject, useEffect } from 'react';

import { breakpointQuery } from '../../css/breakpoints.js';

/** From here the bar shows its row of destinations and hides the menu. */
const wideQuery = breakpointQuery('from', 'lg');

/**
 * What script adds to the menu, a native `details` that opens and closes
 * without it: Escape closes it and puts focus back on its button; choosing
 * a link in it, focus leaving it, a press outside it, or the window
 * widening to the row of destinations closes it. Nothing traps focus.
 */
export function useMenuDismiss(menuRef: RefObject<HTMLDetailsElement | null>) {
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    const close = () => {
      menu.open = false;
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || !menu.open) return;
      event.preventDefault();
      close();
      menu.querySelector('summary')?.focus();
    };
    const onClick = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest('a')) close();
    };
    const onFocusOut = (event: FocusEvent) => {
      const next = event.relatedTarget;
      if (next instanceof Node && menu.contains(next)) return;
      if (next !== null) close();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && menu.contains(event.target)) return;
      close();
    };
    const wide =
      typeof window.matchMedia === 'function'
        ? window.matchMedia(wideQuery)
        : undefined;
    const onWiden = () => {
      if (wide?.matches) close();
    };
    menu.addEventListener('keydown', onKeyDown);
    menu.addEventListener('click', onClick);
    menu.addEventListener('focusout', onFocusOut);
    document.addEventListener('pointerdown', onPointerDown);
    wide?.addEventListener('change', onWiden);
    return () => {
      menu.removeEventListener('keydown', onKeyDown);
      menu.removeEventListener('click', onClick);
      menu.removeEventListener('focusout', onFocusOut);
      document.removeEventListener('pointerdown', onPointerDown);
      wide?.removeEventListener('change', onWiden);
    };
  }, [menuRef]);
}
