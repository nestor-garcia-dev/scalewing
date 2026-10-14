import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from 'react';

import {
  pressDay,
  sameRange,
  settledDraft,
  type RangeDraft,
} from '../../date-range-draft.js';
import { type DateOnlyRange } from '../../date-only.js';

export type RangePopup = {
  buttonRef: RefObject<HTMLButtonElement | null>;
  id: string;
  shown: boolean;
  toggle: () => void;
  draft: RangeDraft;
  press: (day: string) => void;
  /** Closes and gives `range` to `onChange` when it is a new range. */
  apply: (range: DateOnlyRange) => void;
  /** Closes and keeps the value; `true` returns focus to the button. */
  cancel: (restoreFocus: boolean) => void;
};

/**
 * DateRangeButton's open state and the range being picked. Opening starts
 * from the value; a new value while open starts over from it. Disabling
 * closes it for good.
 */
export function useRangePopup(
  value: DateOnlyRange,
  disabled: boolean,
  onChange: (value: DateOnlyRange) => void,
): RangePopup {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const id = useId();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(() => settledDraft(value));
  const [openedWith, setOpenedWith] = useState(value);
  if (!sameRange(openedWith, value)) {
    setOpenedWith(value);
    setDraft(settledDraft(value));
  }
  if (disabled && open) setOpen(false);
  const shown = open && !disabled;

  // Focus returns once the calendar is gone: while the sheet is still a
  // modal dialog, the page behind it, the button included, is inert.
  const restoreFocus = useRef(false);
  useLayoutEffect(() => {
    if (shown || !restoreFocus.current) return;
    restoreFocus.current = false;
    buttonRef.current?.focus();
  }, [shown]);

  function cancel(restore: boolean) {
    restoreFocus.current = restore;
    setOpen(false);
  }

  return {
    buttonRef,
    id,
    shown,
    toggle: () => {
      if (shown) return cancel(true);
      setDraft(settledDraft(value));
      setOpen(true);
    },
    draft,
    press: (day) => setDraft((current) => pressDay(current, day)),
    apply: (range) => {
      cancel(true);
      if (!sameRange(range, value)) onChange(range);
    },
    cancel,
  };
}
