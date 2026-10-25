import { useEffect, useRef } from 'react';

/** How long after the last − / + press or arrow key a count commits, in ms. */
export const defaultStepperCommitDelay = 600;

/** Refuses a commit delay that is not a finite number of zero or more ms. */
export function assertStepperCommitDelay(delay: number): void {
  if (!Number.isFinite(delay) || delay < 0)
    throw new RangeError(
      'Stepper commitDelay must be a finite number of zero or more',
    );
}

/** What a Stepper calls as its count is edited and finished. */
export type StepperCommit = {
  /** A typed change: it waits for blur or Enter. */
  edited: () => void;
  /** A − / + press or a step key: it commits once the presses settle. */
  stepped: () => void;
  /** Blur or Enter: commits now. */
  finish: () => void;
};

/**
 * Turns a Stepper's edits into one `onCommit` per finished entry: on blur,
 * on Enter, and `delay` ms after the last − / + press or step key. A
 * commit gives the count the consumer holds then, and only when it differs
 * from the last committed count (or the count before the first edit). A
 * count the consumer changes while nothing is waiting becomes the new
 * baseline. A commit still waiting when the Stepper unmounts is made then.
 */
export function useStepperCommit(
  value: number | null,
  onCommit: ((value: number | null) => void) | undefined,
  delay: number,
): StepperCommit {
  const latest = useRef({ value, onCommit });
  const baseline = useRef(value);
  const pending = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    latest.current = { value, onCommit };
    if (!pending.current) baseline.current = value;
  }, [value, onCommit]);

  function clearTimer() {
    if (timer.current === null) return;
    clearTimeout(timer.current);
    timer.current = null;
  }

  function finish() {
    clearTimer();
    if (!pending.current) return;
    pending.current = false;
    const { value: current, onCommit: commit } = latest.current;
    if (current === baseline.current) return;
    baseline.current = current;
    commit?.(current);
  }

  // The latest finish, for the timer and the unmount to call.
  const finishRef = useRef(finish);
  useEffect(() => {
    finishRef.current = finish;
  });
  useEffect(() => () => finishRef.current(), []);

  function edited() {
    if (latest.current.onCommit === undefined) return;
    pending.current = true;
  }

  function stepped() {
    if (latest.current.onCommit === undefined) return;
    pending.current = true;
    clearTimer();
    timer.current = setTimeout(() => {
      timer.current = null;
      finishRef.current();
    }, delay);
  }

  return { edited, stepped, finish };
}
