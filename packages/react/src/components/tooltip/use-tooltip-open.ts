'use client';

import {
  useEffect,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react';

import { focusIsVisible, tapActs } from './tooltip-open.js';

export type TooltipOpenOptions = {
  /** Whether the tooltip is enabled: only a shown tooltip takes Escape. */
  disabled: boolean;
  /**
   * The toggletip: a press of the trigger (a tap, a click, Enter or Space)
   * shows the tooltip and keeps it shown, and the next press hides it.
   * Without it, a tap toggles only a trigger that does nothing else.
   */
  pressToggles: boolean;
  tooltipRef: RefObject<HTMLElement | null>;
  wrapperRef: RefObject<HTMLElement | null>;
};

function isHover(event: ReactPointerEvent) {
  return event.pointerType === 'mouse' || event.pointerType === 'pen';
}

/**
 * Whether a tooltip is open, and the anchor's handlers that open and close
 * it. `open` follows focus, hover, touch and presses even while disabled;
 * `shown` is what the page gets. `pressed` is a tooltip a press opened: it
 * stays open when the pointer leaves, until the next press, Escape, blur or
 * a press outside the anchor.
 */
export function useTooltipOpen({
  disabled,
  pressToggles,
  tooltipRef,
  wrapperRef,
}: TooltipOpenOptions) {
  const [open, setOpen] = useState(false);
  const [pressed, setPressed] = useState(false);
  const shown = open && !disabled;

  function close() {
    setOpen(false);
    setPressed(false);
  }

  useEffect(() => {
    if (!open) return;
    function dismissOutside(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !wrapperRef.current?.contains(event.target)
      ) {
        setOpen(false);
        setPressed(false);
      }
    }
    document.addEventListener('pointerdown', dismissOutside);
    return () => document.removeEventListener('pointerdown', dismissOutside);
  }, [open, wrapperRef]);

  const handlers = {
    onBlurCapture(event: FocusEvent<HTMLElement>) {
      if (!event.currentTarget.contains(event.relatedTarget)) close();
    },
    onFocusCapture(event: FocusEvent<HTMLElement>) {
      // A click or a tap focuses the trigger too; only a visible focus
      // (the keyboard) opens the tooltip, so a clicked control does not
      // keep its help shown until the focus moves.
      if (focusIsVisible(event.target)) setOpen(true);
    },
    onKeyDownCapture(event: KeyboardEvent<HTMLElement>) {
      // Escape hides a visible tooltip and nothing else, so a surrounding
      // Dialog does not also close. A hidden tooltip leaves Escape alone.
      if (event.key !== 'Escape' || !shown) return;
      event.preventDefault();
      close();
    },
    onPointerEnter(event: ReactPointerEvent<HTMLElement>) {
      if (isHover(event)) setOpen(true);
    },
    onPointerLeave(event: ReactPointerEvent<HTMLElement>) {
      if (isHover(event) && !pressed) setOpen(false);
    },
    onPointerDownCapture(event: ReactPointerEvent<HTMLElement>) {
      // A toggletip's tap is a press, which its click handles.
      if (event.pointerType !== 'touch' || pressToggles) return;
      // A tap on a control does what the control does; only a trigger
      // that does nothing else on a tap toggles its help.
      if (tapActs(event.target, event.currentTarget)) setOpen(false);
      else setOpen((current) => !current);
    },
    onClick: pressToggles
      ? (event: MouseEvent<HTMLElement>) => {
          // A press inside the bubble is not a press of the trigger.
          if (
            event.target instanceof Node &&
            tooltipRef.current?.contains(event.target)
          )
            return;
          if (pressed) close();
          else {
            setOpen(true);
            setPressed(true);
          }
        }
      : undefined,
  };

  return { handlers, pressed, shown };
}
