import { addDays, daysBetween } from './calendar-month.js';
import { clampDateOnly, type DateOnlyRange } from './date-only.js';

/**
 * A range being picked in DateRangeButton's calendar: the days so far, and
 * whether the next press sets its end. A first press makes a one-day range
 * that waits for its end, so Apply always has a whole range to give.
 */
export type RangeDraft = {
  range: DateOnlyRange;
  awaitingEnd: boolean;
};

/** A whole range, such as the value the calendar opens on. */
export function settledDraft(range: DateOnlyRange): RangeDraft {
  return { range, awaitingEnd: false };
}

/**
 * The draft after a press on `day`: the first press sets the start, the
 * second the end. A second press before the start starts over from that
 * day, and a press on a whole range starts a new one.
 */
export function pressDay(draft: RangeDraft, day: string): RangeDraft {
  if (draft.awaitingEnd && day >= draft.range.start)
    return {
      range: { start: draft.range.start, end: day },
      awaitingEnd: false,
    };
  return { range: { start: day, end: day }, awaitingEnd: true };
}

/** The days in a range, both ends counted: 1 for a one-day range. */
export function rangeDayCount(range: DateOnlyRange): number {
  return daysBetween(range.start, range.end) + 1;
}

/**
 * The last day a press may pick: `max`, or while the draft waits for its
 * end, the day `maxDays` long from its start when that is earlier.
 */
export function latestPick(
  draft: RangeDraft,
  max: string | undefined,
  maxDays: number | undefined,
): string | undefined {
  if (!draft.awaitingEnd || maxDays === undefined) return max;
  const longest = clampDateOnly(addDays(draft.range.start, maxDays - 1));
  return max === undefined || longest < max ? longest : max;
}

export function sameRange(a: DateOnlyRange, b: DateOnlyRange): boolean {
  return a.start === b.start && a.end === b.end;
}
