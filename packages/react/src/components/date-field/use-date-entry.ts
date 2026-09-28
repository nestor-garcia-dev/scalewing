import { useState } from 'react';

import {
  formatDateEntry,
  isCompleteDateEntry,
  parseDateEntry,
  type DateEntryPattern,
} from '../../date-entry.js';

/**
 * Text the person typed, tied to the value it was typed against and to the
 * value it committed, so it survives a parent that keeps the old value.
 */
type Draft = {
  text: string;
  value: string;
  /** The date this text sent to `onCommit` and the parent has not shown. */
  committed: string | null;
  /** Set once the person leaves the text or presses Enter. */
  checked: boolean;
};

export type DateEntry = {
  text: string;
  /** The date the text forms: YYYY-MM-DD, '' when blank, null when not one. */
  parsed: string | null;
  /** Typed text that is not a date, after the person left the field. */
  invalid: boolean;
  change: (text: string) => void;
  check: () => void;
  reset: () => void;
};

/**
 * Typed entry over a controlled date-only value. A keystroke that finishes
 * a date (see `isCompleteDateEntry`) or blanks the text calls `onCommit`;
 * a date whose last field may still grow commits on `check` (blur or
 * Enter). Text that is not (yet) a date stays on screen and leaves the value
 * alone. The text also stays when the parent keeps the old value; when
 * `value` changes from outside to any other date, the text follows it.
 */
export function useDateEntry(
  value: string,
  pattern: DateEntryPattern,
  onCommit: (value: string) => void,
): DateEntry {
  const [draft, setDraft] = useState<Draft | null>(null);
  const current =
    draft !== null && (draft.value === value || draft.committed === value)
      ? draft
      : null;
  // The parent adopted the commit: tie the text to it, so a later outside
  // change back to the old value replaces the text.
  if (current !== null && current.value !== value)
    setDraft({ ...current, value, committed: null });
  const text = current ? current.text : formatDateEntry(value, pattern);
  const parsed = parseDateEntry(text, pattern);

  function change(next: string) {
    const nextValue = parseDateEntry(next, pattern);
    const ready =
      nextValue === '' ||
      (nextValue !== null && isCompleteDateEntry(next, pattern));
    const committed = ready && nextValue !== value ? nextValue : null;
    setDraft({ text: next, value, committed, checked: false });
    if (committed !== null) onCommit(committed);
  }

  function check() {
    if (current === null) return;
    if (parsed === null) {
      setDraft({ ...current, checked: true });
      return;
    }
    if (parsed === value) {
      // Show the value in the locale's padded form.
      setDraft(null);
      return;
    }
    // Commit once; a parent that keeps the old value keeps the padded text.
    if (parsed !== current.committed) onCommit(parsed);
    setDraft({
      text: formatDateEntry(parsed, pattern),
      value,
      committed: parsed,
      checked: false,
    });
  }

  return {
    text,
    parsed,
    invalid: current !== null && current.checked && parsed === null,
    change,
    check,
    reset: () => setDraft(null),
  };
}
