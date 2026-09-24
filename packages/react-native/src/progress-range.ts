/** What a progress bar shows: a count of done items out of a total. */
export type ProgressRange = { max: number; value: number };

/**
 * Fails closed on an empty label, a max that is not a positive finite
 * number, or a value outside 0..max, with the same errors as the web
 * `Progress`.
 */
export function assertProgressRange(
  label: string,
  { max, value }: ProgressRange,
): void {
  if (!label.trim()) throw new RangeError('label must not be empty');
  if (!Number.isFinite(max) || max <= 0)
    throw new RangeError('max must be a positive finite number');
  if (!Number.isFinite(value) || value < 0 || value > max)
    throw new RangeError('value must be finite and within 0..max');
}

/** The filled share of the track, from 0 to 1. */
export function progressFraction({ max, value }: ProgressRange): number {
  return value / max;
}

/** The visible count beside the label: "2 / 4". */
export function progressCount({ max, value }: ProgressRange): string {
  return `${value} / ${max}`;
}
