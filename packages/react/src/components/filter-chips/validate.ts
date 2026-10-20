import { assertRequiredMark } from '../FieldLabelText.js';
import {
  filterChipCountAppearances,
  type FilterChipsProps,
  filterChipsOverflows,
  filterChipTones,
} from './options.js';

function isCount(count: number | undefined): boolean {
  return count === undefined || (Number.isInteger(count) && count >= 0);
}

function chosenValues(props: FilterChipsProps): readonly string[] {
  if (props.multiple) return props.value;
  return props.value === '' ? [] : [props.value];
}

/**
 * Fails closed on chips it cannot draw: an empty label, no options, blank
 * or repeated values, a chosen value that is no option, a count that is
 * not a whole number from 0, an unknown chip tone, count appearance or
 * overflow, and a multiple choice asked to be required or given a value
 * that is not a list.
 */
export function assertFilterChips(props: FilterChipsProps): void {
  const { label, options } = props;
  if (!label.trim()) throw new RangeError('label must not be empty');
  assertRequiredMark(props.requiredMark ?? 'visible');
  if (
    options.length === 0 ||
    options.some((option) => !option.value.trim() || !option.label.trim())
  )
    throw new RangeError('options must have nonempty values and labels');
  const values = options.map((option) => option.value);
  if (new Set(values).size !== values.length)
    throw new RangeError('options must have unique values');
  if (props.multiple) {
    if (!Array.isArray(props.value))
      throw new RangeError('a multiple FilterChips value must be a list');
    if (props.required)
      throw new RangeError(
        'a multiple FilterChips cannot be required; say what is needed in error',
      );
  }
  const chosen = chosenValues(props);
  if (chosen.some((value) => !values.includes(value)))
    throw new RangeError(
      props.multiple
        ? 'every value must match an option'
        : 'value must match an option or be empty',
    );
  if (options.some((option) => !isCount(option.count)))
    throw new RangeError('count must be a non-negative integer');
  const unknownTone = options.find(
    (option) =>
      option.tone !== undefined &&
      !(filterChipTones as readonly unknown[]).includes(option.tone),
  );
  if (unknownTone)
    throw new RangeError(
      `Unknown FilterChips option tone: ${String(unknownTone.tone)}`,
    );
  const countAppearance = props.countAppearance ?? 'figure';
  if (
    !(filterChipCountAppearances as readonly unknown[]).includes(
      countAppearance,
    )
  )
    throw new RangeError(
      `Unknown FilterChips countAppearance: ${String(countAppearance)}`,
    );
  const overflow = props.overflow ?? 'wrap';
  if (!(filterChipsOverflows as readonly unknown[]).includes(overflow))
    throw new RangeError(`Unknown FilterChips overflow: ${String(overflow)}`);
}
