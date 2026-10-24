/** A web `Stepper`'s bounds: whole numbers, `min <= max`, `step > 0`. */
export type StepperBounds = {
  min: number;
  max: number;
  step: number;
};

/** Where one press of − and of + lands, or null where that button is stopped. */
export type StepperMoves = {
  down: number | null;
  up: number | null;
};

/** A typed text: no count (empty), a whole count, or text the box refuses. */
export type StepperEntry =
  { kind: 'empty' } | { kind: 'count'; value: number } | { kind: 'refused' };

/** A consumer bug, not a runtime state: the bounds must describe a range. */
export function assertStepperBounds(bounds: StepperBounds): void {
  const { min, max, step } = bounds;
  if (!Number.isSafeInteger(min) || !Number.isSafeInteger(step))
    throw new RangeError('Stepper min and step must be whole numbers');
  if (max !== Number.POSITIVE_INFINITY && !Number.isSafeInteger(max))
    throw new RangeError('Stepper max must be a whole number');
  if (min > max)
    throw new RangeError(`Stepper min ${min} is greater than max ${max}`);
  if (step <= 0)
    throw new RangeError(`Stepper step ${step} must be greater than zero`);
}

function clamp(value: number, bounds: StepperBounds): number {
  return Math.min(Math.max(value, bounds.min), bounds.max);
}

/**
 * The counts − and + would move to. An empty box counts as `min`. A count
 * outside the bounds (typed) moves back inside them; a bound stops its own
 * direction, and a locked (disabled or read-only) stepper stops both.
 */
export function stepperMoves(
  value: number | null,
  bounds: StepperBounds,
  locked: boolean,
): StepperMoves {
  if (locked) return { down: null, up: null };
  const base = value ?? bounds.min;
  return {
    down: base > bounds.min ? clamp(base - bounds.step, bounds) : null,
    up: base < bounds.max ? clamp(base + bounds.step, bounds) : null,
  };
}

/**
 * Reads what the person typed. Digits make a count, with a leading minus
 * only when the range goes below zero; an empty box, or a lone minus on its
 * way to a negative count, is no count. Anything else, or a count too large
 * to be exact, is refused and the box keeps its last text.
 */
export function readStepperEntry(
  text: string,
  allowsNegative: boolean,
): StepperEntry {
  if (text === '' || (allowsNegative && text === '-')) return { kind: 'empty' };
  const pattern = allowsNegative ? /^-?\d+$/ : /^\d+$/;
  if (!pattern.test(text)) return { kind: 'refused' };
  const value = Number(text);
  if (!Number.isSafeInteger(value)) return { kind: 'refused' };
  return { kind: 'count', value: Object.is(value, -0) ? 0 : value };
}

/** The box's text for a count: the plain number, or empty for none. */
export function stepperText(value: number | null): string {
  return value === null ? '' : String(value);
}

/** A consumer bug: a unit, when given, is a word to show after the count. */
export function assertStepperUnit(unit: string | undefined): void {
  if (unit !== undefined && unit.trim() === '')
    throw new RangeError('Stepper unit must not be blank');
}

/**
 * The count in words for assistive technology: the consumer's own words
 * when given, otherwise the count and its unit ("90 min"), or nothing extra
 * (the bare count is `aria-valuenow`) when there is no unit or no count.
 */
export function stepperValueText(
  value: number | null,
  unit: string | undefined,
  valueText: string | undefined,
): string | undefined {
  if (valueText !== undefined) return valueText;
  if (unit === undefined || value === null) return undefined;
  return `${value} ${unit.trim()}`;
}
