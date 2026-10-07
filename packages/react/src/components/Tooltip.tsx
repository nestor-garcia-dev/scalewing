'use client';

import {
  cloneElement,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactElement,
} from 'react';

import {
  tooltipTriggerAria,
  type TooltipRelationship,
  type TooltipTriggerAria,
} from './tooltip-trigger-aria.js';

export type { TooltipRelationship };

export type TooltipProps = {
  content: string;
  /**
   * Turns the tooltip off, not its trigger: no tooltip, no description and no
   * Escape handling, while the trigger stays mounted, enabled and focusable
   * (and keeps its focus). Focus, hover and touch are still followed, so the
   * tooltip shows as soon as it is enabled again on a trigger that still has
   * focus, the pointer or an open touch toggle; Escape pressed while disabled
   * reaches the page and does not stop that. It must match between the server
   * render and the first client render.
   */
  disabled?: boolean;
  /**
   * `'description'` (default) adds supplementary help to a trigger that has
   * its own name, through `aria-describedby`. `'label'` makes `content` the
   * trigger's accessible name, through `aria-labelledby`, for an icon-only
   * control: the text is read once, as its name. The tooltip stays in the
   * DOM, hidden, so it names the trigger while it is not shown. While
   * `disabled` there is no tooltip to name it, so the trigger then needs its
   * own name: visible text, or an `aria-label` (which the tooltip overrides
   * while enabled). The trigger's own `aria-labelledby` and `aria-describedby`
   * are kept. It must match between the server render and the first client
   * render.
   */
  relationship?: TooltipRelationship;
  trigger: ReactElement<TooltipTriggerAria>;
};

export function Tooltip({
  content,
  disabled = false,
  relationship = 'description',
  trigger,
}: TooltipProps) {
  if (!content.trim()) throw new RangeError('content must not be empty');

  // `open` follows focus, hover and touch even while disabled; `shown` is
  // what the page gets.
  const [open, setOpen] = useState(false);
  const shown = open && !disabled;
  const id = useId();
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const triggerAria = tooltipTriggerAria(
    trigger.props,
    disabled ? undefined : id,
    relationship,
  );

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
      {cloneElement(trigger, triggerAria)}
      {disabled ? null : (
        <span className="sw-tooltip" hidden={!shown} id={id} role="tooltip">
          {content}
        </span>
      )}
    </span>
  );
}
