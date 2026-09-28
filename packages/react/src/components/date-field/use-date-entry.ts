import { useState } from 'react';

import {
  formatDateEntry,
  parseDateEntry,
  type DateEntryPattern,
} from '../../date-entry.js';

/** Text the person typed, tied to the value it was typed against. */
type Draft = {
  text: string;
  value: string;
  /** Set once the person leaves the text or presses Enter. */
  checked: boolean;
};

export type DateEntry = {
  text: string;
  /** Typed text that is not a date, after the person left the field. */
  invalid: boolean;
  change: (text: string) => void;
  check: () => void;
  reset: () => void;
};

/**
 * Typed entry over a controlled date-only value. Each keystroke that forms
 * a date calls `onCommit` with it; text that is not (yet) a date stays on
 * screen and leaves the value alone. When `value` changes from outside, the
 * text follows it.
 */
export function useDateEntry(
  value: string,
  pattern: DateEntryPattern,
  onCommit: (value: string) => void,
): DateEntry {
  const [draft, setDraft] = useState<Draft | null>(null);
  const current = draft !== null && draft.value === value ? draft : null;
  const text = current ? current.text : formatDateEntry(value, pattern);
  const parsed = parseDateEntry(text, pattern);

  function change(next: string) {
    const nextValue = parseDateEntry(next, pattern);
    if (nextValue !== null && nextValue !== value) {
      setDraft({ text: next, value: nextValue, checked: false });
      onCommit(nextValue);
      return;
    }
    setDraft({ text: next, value, checked: false });
  }

  function check() {
    if (current === null) return;
    // A date shows in the locale's padded form; anything else is flagged.
    setDraft(parsed === null ? { ...current, checked: true } : null);
  }

  return {
    text,
    invalid: current !== null && current.checked && parsed === null,
    change,
    check,
    reset: () => setDraft(null),
  };
}
