import {
  useCallback,
  useRef,
  useState,
  type FocusEvent,
  type PointerEvent,
  type FocusEventHandler,
  type PointerEventHandler,
} from 'react';

type ToastHoldOptions = {
  open: boolean;
  /** Only a toast that takes the pointer (an action or the line) holds. */
  enabled: boolean;
  onBlur?: FocusEventHandler<HTMLDivElement>;
  onFocus?: FocusEventHandler<HTMLDivElement>;
  onPointerEnter?: PointerEventHandler<HTMLDivElement>;
  onPointerLeave?: PointerEventHandler<HTMLDivElement>;
};

/**
 * Whether the toast's time is held: the pointer is over it or focus is
 * inside it. Each time it opens or closes it starts unheld (a toast that
 * closes under the pointer gets no pointerleave). It also remembers where
 * focus came from, so `returnFocus` can give it back when the toast closes
 * with focus inside (its own action, or the consumer closing it).
 */
export function useToastHold({
  enabled,
  onBlur,
  onFocus,
  onPointerEnter,
  onPointerLeave,
  open,
}: ToastHoldOptions) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [wasOpen, setWasOpen] = useState(open);
  const cameFromRef = useRef<HTMLElement | null>(null);
  if (wasOpen !== open) {
    setWasOpen(open);
    setHovered(false);
    setFocused(false);
  }

  const returnFocus = useCallback((node: HTMLElement): void => {
    const cameFrom = cameFromRef.current;
    cameFromRef.current = null;
    if (!node.contains(node.ownerDocument.activeElement)) return;
    if (cameFrom?.isConnected) cameFrom.focus();
  }, []);

  return {
    paused: enabled && (hovered || focused),
    returnFocus,
    handlers: {
      onBlur: (event: FocusEvent<HTMLDivElement>) => {
        onBlur?.(event);
        if (!event.currentTarget.contains(event.relatedTarget as Node | null))
          setFocused(false);
      },
      onFocus: (event: FocusEvent<HTMLDivElement>) => {
        onFocus?.(event);
        const from = event.relatedTarget;
        if (from instanceof HTMLElement && !event.currentTarget.contains(from))
          cameFromRef.current = from;
        setFocused(true);
      },
      onPointerEnter: (event: PointerEvent<HTMLDivElement>) => {
        onPointerEnter?.(event);
        setHovered(true);
      },
      onPointerLeave: (event: PointerEvent<HTMLDivElement>) => {
        onPointerLeave?.(event);
        setHovered(false);
      },
    },
  };
}
