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
  trigger: ReactElement<{ 'aria-describedby'?: string }>;
};

export function Tooltip({ content, trigger }: TooltipProps) {
  if (!content.trim()) throw new RangeError('content must not be empty');

  const [open, setOpen] = useState(false);
  const id = useId();
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const describedBy = [trigger.props['aria-describedby'], id]
    .filter(Boolean)
    .join(' ');

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
        if (event.key === 'Escape') setOpen(false);
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
      <span className="sw-tooltip" hidden={!open} id={id} role="tooltip">
        {content}
      </span>
    </span>
  );
}
