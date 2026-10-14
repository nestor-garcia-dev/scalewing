import { assertWeekStart } from './calendar-month.js';
import { rangeDayCount } from './date-range-draft.js';
import {
  assertDateOnly,
  assertDateRange,
  isOutsideDateRange,
  type DateOnlyRange,
} from './date-only.js';

/** A named range a person can choose in one press, such as "Last 7 days". */
export type DateRangePreset = {
  /** Unique among the presets; never shown. */
  id: string;
  label: string;
  range: DateOnlyRange;
};

export type DateRangeInput = {
  label: string;
  value: DateOnlyRange;
  presets: readonly DateRangePreset[];
  min?: string;
  max?: string;
  maxDays?: number;
  today?: string;
  weekStartsOn: number;
};

function isBlank(text: unknown): boolean {
  return typeof text !== 'string' || text.trim() === '';
}

function assertValue(value: DateOnlyRange) {
  if (typeof value !== 'object' || value === null)
    throw new RangeError('value must be a { start, end } range');
  assertDateOnly('value.start', value.start);
  assertDateOnly('value.end', value.end);
  if (value.start > value.end)
    throw new RangeError('value.start must not be after value.end');
}

function assertBounds(min: string | undefined, max: string | undefined) {
  if (min !== undefined) assertDateOnly('min', min);
  if (max !== undefined) assertDateOnly('max', max);
  if (min !== undefined && max !== undefined && min > max)
    throw new RangeError('min must not be after max');
}

function assertPreset(
  preset: DateRangePreset,
  { min, max, maxDays }: Pick<DateRangeInput, 'min' | 'max' | 'maxDays'>,
) {
  if (isBlank(preset.id) || isBlank(preset.label))
    throw new RangeError('presets must have non-empty ids and labels');
  assertDateRange(preset.range);
  const { start, end } = preset.range;
  if (isOutsideDateRange(start, min, max) || isOutsideDateRange(end, min, max))
    throw new RangeError(`preset ${preset.id} must lie inside min and max`);
  if (maxDays !== undefined && rangeDayCount(preset.range) > maxDays)
    throw new RangeError(`preset ${preset.id} must not exceed maxDays`);
}

/**
 * Fails closed on DateRangeButton props it cannot draw: empty words, a
 * malformed or reversed value, bounds or today, a `maxDays` that is not a
 * whole number from 1, and presets that repeat an id or that a press could
 * not pick (outside the bounds or longer than `maxDays`). A value outside
 * the bounds stays the value, as on CalendarButton.
 */
export function assertDateRangeInput(input: DateRangeInput) {
  if (isBlank(input.label))
    throw new RangeError('label must be non-empty text');
  assertValue(input.value);
  assertBounds(input.min, input.max);
  if (input.today !== undefined) assertDateOnly('today', input.today);
  assertWeekStart(input.weekStartsOn);
  const { maxDays } = input;
  if (maxDays !== undefined && (!Number.isInteger(maxDays) || maxDays < 1))
    throw new RangeError('maxDays must be a whole number from 1');
  const ids = new Set<string>();
  for (const preset of input.presets) {
    assertPreset(preset, input);
    if (ids.has(preset.id))
      throw new RangeError(`presets must have unique ids: ${preset.id}`);
    ids.add(preset.id);
  }
}
