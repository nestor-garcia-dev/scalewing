export type StepperBounds = {
  max: number;
  min: number;
  step: number;
};

/** A consumer bug, not a runtime state: the bounds must describe a range. */
export function assertStepperBounds(bounds: StepperBounds): void {
  if (![bounds.min, bounds.max, bounds.step].every(Number.isFinite)) {
    throw new Error('Stepper min, max, and step must be finite numbers.');
  }
  if (bounds.min > bounds.max) {
    throw new Error(
      `Stepper min ${bounds.min} is greater than max ${bounds.max}.`,
    );
  }
  if (bounds.step <= 0) {
    throw new Error(`Stepper step ${bounds.step} must be greater than zero.`);
  }
}

function clamp(value: number, bounds: StepperBounds): number {
  return Math.min(Math.max(value, bounds.min), bounds.max);
}

export function canStepDown(value: number, bounds: StepperBounds): boolean {
  return value > bounds.min;
}

export function canStepUp(value: number, bounds: StepperBounds): boolean {
  return value < bounds.max;
}

/** One step down, never below the minimum. */
export function stepDown(value: number, bounds: StepperBounds): number {
  return clamp(value - bounds.step, bounds);
}

/** One step up, never above the maximum. */
export function stepUp(value: number, bounds: StepperBounds): number {
  return clamp(value + bounds.step, bounds);
}

/** Where one press in each direction lands, or null where it is stopped. */
export type StepperMoves = {
  down: number | null;
  up: number | null;
};

/**
 * The values the minus and plus would move to. A bound stops its direction,
 * and a disabled stepper stops both.
 */
export function stepperMoves(
  value: number,
  bounds: StepperBounds,
  disabled: boolean,
): StepperMoves {
  return {
    down:
      !disabled && canStepDown(value, bounds) ? stepDown(value, bounds) : null,
    up: !disabled && canStepUp(value, bounds) ? stepUp(value, bounds) : null,
  };
}
