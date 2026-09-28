import { useId, useRef, useState, type RefObject } from 'react';

import { todayDateOnly } from '../../date-only.js';

export type CalendarPopupOptions = {
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
  /** Runs before a chosen date closes the calendar, such as a text reset. */
  beforeSelect?: () => void;
};

export type CalendarPopup = {
  /** The button that toggles the calendar and takes focus back. */
  buttonRef: RefObject<HTMLButtonElement | null>;
  shown: boolean;
  toggle: () => void;
  /** ARIA for the toggling button, as the WAI-ARIA date picker asks. */
  trigger: {
    'aria-controls': string | undefined;
    'aria-expanded': boolean;
    'aria-haspopup': 'dialog';
  };
  /**
   * CalendarDialog props that belong to the open and close cycle; pass
   * `buttonRef` beside them.
   */
  dialog: {
    id: string;
    onClose: (restoreFocus: boolean) => void;
    onSelect: (value: string) => void;
    today: string;
  };
};

/**
 * The open state of a calendar dialog toggled by one button, shared by
 * DateField and CalendarButton. Disabling closes it for good; choosing a
 * date closes it, returns focus to the button, and reports a changed date.
 */
export function useCalendarPopup({
  value,
  disabled,
  onChange,
  beforeSelect,
}: CalendarPopupOptions): CalendarPopup {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  // Disabling closes the calendar for good, not just while disabled.
  if (disabled && open) setOpen(false);
  const shown = open && !disabled;
  const id = useId();

  function close(restoreFocus: boolean) {
    setOpen(false);
    if (restoreFocus) buttonRef.current?.focus();
  }

  function select(next: string) {
    beforeSelect?.();
    close(true);
    if (next !== value) onChange(next);
  }

  return {
    buttonRef,
    shown,
    toggle: () => (shown ? close(true) : setOpen(true)),
    trigger: {
      'aria-controls': shown ? id : undefined,
      'aria-expanded': shown,
      'aria-haspopup': 'dialog',
    },
    dialog: {
      id,
      onClose: close,
      onSelect: select,
      today: todayDateOnly(),
    },
  };
}
