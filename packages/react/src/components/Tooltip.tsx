'use client';

import {
  cloneElement,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactElement,
} from 'react';

export type TooltipProps = {
  content: string;
  /**
   * Turns the tooltip off without unmounting its trigger: no tooltip, no
   * description and no Escape handling, while the trigger keeps its element
   * (and its focus). Focus and hover are still followed, so the tooltip shows
   * as soon as it is enabled again on a trigger that has them.
   */
  disabled?: boolean;
  trigger: ReactElement<{ 'aria-describedby'?: string }>;
};

export function Tooltip({ content, disabled = false, trigger }: TooltipProps) {
  if (!content.trim()) throw new RangeError('content must not be empty');

  // `open` follows focus, hover and touch even while disabled; `shown` is
  // what the page gets.
  const [open, setOpen] = useState(false);
  const shown = open && !disabled;
  const id = useId();
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const describedBy =
    [trigger.props['aria-describedby'], disabled ? undefined : id]
      .filter(Boolean)
      .join(' ') || undefined;

  useEffect(() => {
    if (!open) return;
    function dismissOutside(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !wrapperRef.current?.contains(event.target)
      )
        setOpen(false);
    }
    document.addEventListener('pointerdown', dismissOutside);
    return () => document.removeEventListener('pointerdown', dismissOutside);
  }, [open]);

  return (
    <span
      className="sw-tooltip-anchor"
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onFocusCapture={() => setOpen(true)}
      onKeyDownCapture={(event) => {
        // Escape hides a visible tooltip and nothing else, so a surrounding
        // Dialog does not also close. A hidden tooltip leaves Escape alone.
        if (event.key !== 'Escape' || !shown) return;
        event.preventDefault();
        setOpen(false);
      }}
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse' || event.pointerType === 'pen')
          setOpen(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === 'mouse' || event.pointerType === 'pen')
          setOpen(false);
      }}
      onPointerDownCapture={(event) => {
        if (event.pointerType === 'touch') setOpen((current) => !current);
      }}
      ref={wrapperRef}
    >
      {cloneElement(trigger, { 'aria-describedby': describedBy })}
      {disabled ? null : (
        <span className="sw-tooltip" hidden={!shown} id={id} role="tooltip">
          {content}
        </span>
      )}
    </span>
  );
}
