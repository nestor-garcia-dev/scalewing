import { type KeyboardEvent, type ReactNode, type RefObject } from 'react';

import { cx } from '../../class-names.js';
import { useAnchoredPopover } from '../use-anchored-popover.js';
import { type GridFocus } from './use-grid-focus.js';
import { wrapTab } from './wrap-tab.js';

export type CalendarPopoverProps = {
  /** The element the popover sits beside, such as the field or button. */
  anchorRef: RefObject<HTMLElement | null>;
  /** The button that toggles it; a press there is not a press outside. */
  buttonRef: RefObject<HTMLElement | null>;
  popoverRef: RefObject<HTMLDivElement | null>;
  id: string;
  /** Names the dialog by an element, or by `aria-label`. */
  'aria-labelledby'?: string;
  'aria-label'?: string;
  /** `true` returns focus to the button: Escape does, a press outside does not. */
  onClose: (restoreFocus: boolean) => void;
  /** Follows focus in the grid when the popover itself holds it. */
  focusHandlers?: GridFocus['focusHandlers'];
  className?: string;
  children: ReactNode;
};

/**
 * A calendar's popover: a modal dialog on the top layer beside its anchor,
 * as the WAI-ARIA date picker dialog pattern asks. Escape closes it and
 * returns focus; Tab stays inside; a press outside closes it.
 */
export function CalendarPopover({
  anchorRef,
  buttonRef,
  popoverRef,
  id,
  'aria-labelledby': labelledBy,
  'aria-label': label,
  onClose,
  focusHandlers,
  className,
  children,
}: CalendarPopoverProps) {
  useAnchoredPopover(popoverRef, anchorRef, buttonRef, () => onClose(false));

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      onClose(true);
    } else if (event.key === 'Tab') wrapTab(event);
  }

  return (
    <div
      {...focusHandlers}
      aria-label={label}
      aria-labelledby={labelledBy}
      aria-modal="true"
      className={cx('sw-date-field-calendar', className)}
      id={id}
      onKeyDown={onKeyDown}
      ref={popoverRef}
      role="dialog"
    >
      {children}
    </div>
  );
}
