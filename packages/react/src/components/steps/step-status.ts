/** Where a step stands in its form. */
export const stepStatuses = [
  'upcoming',
  'current',
  'done',
  'error',
  'skipped',
] as const;

export type StepStatus = (typeof stepStatuses)[number];

/** A step title's heading level. */
export type StepHeadingLevel = 2 | 3 | 4;

export const stepHeadingLevels: readonly StepHeadingLevel[] = [2, 3, 4];

/** The words assistive technology hears after a folded step's title. */
export type StepsLabels = {
  done: string;
  error: string;
  skipped: string;
  upcoming: string;
};

export const defaultStepsLabels: StepsLabels = {
  done: 'Done',
  error: 'Needs attention',
  skipped: 'Not needed',
  upcoming: 'Not started',
};

/** A current or error step shows its fields; the others fold to one line. */
export function isOpenStep(status: StepStatus): boolean {
  return status === 'current' || status === 'error';
}

/**
 * Whether a step that was `previous` and is now `next` should take focus: it
 * became current from a folded state (upcoming, done, skipped). A first
 * render (`previous` undefined), a move between current and error, and a
 * step that turns to error keep focus where it is: after a refused submit
 * the consumer focuses the first invalid field, as `Field` asks.
 */
export function stepTakesFocus(
  previous: StepStatus | undefined,
  next: StepStatus,
): boolean {
  return previous !== undefined && !isOpenStep(previous) && next === 'current';
}

/** The status word read after a step's title, or none (current, or a skipped step that shows its reason). */
export function stepStatusWord(
  status: StepStatus,
  labels: StepsLabels,
  hasReason: boolean,
): string | null {
  if (status === 'current') return null;
  if (status === 'skipped' && hasReason) return null;
  return labels[status];
}
