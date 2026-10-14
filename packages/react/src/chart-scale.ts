/**
 * A value axis: its ends and the values its grid lines and labels mark,
 * from `min` to `max` a whole `step` apart, always through zero.
 */
export type ChartScale = {
  min: number;
  max: number;
  step: number;
  ticks: readonly number[];
};

/** How many steps a value axis aims for between its ends. */
export const chartScaleSteps = 4;

/** The multipliers a step takes within each power of ten. */
const niceMultipliers = [1, 2, 2.5, 5, 10] as const;

/**
 * The smallest round step (1, 2, 2.5 or 5 times a power of ten) that
 * covers `span` in at most `steps` steps.
 */
export function niceStep(span: number, steps: number): number {
  if (!(span > 0)) return 1;
  const raw = span / steps;
  const power = 10 ** Math.floor(Math.log10(raw));
  for (const multiplier of niceMultipliers) {
    const step = multiplier * power;
    if (step >= raw * (1 - 1e-9)) return step;
  }
  return 10 * power;
}

/** The least and greatest of some values, both stretched to reach zero. */
export function extentThroughZero(values: Iterable<number>): {
  min: number;
  max: number;
} {
  let min = 0;
  let max = 0;
  for (const value of values) {
    if (value < min) min = value;
    if (value > max) max = value;
  }
  return { min, max };
}

/** Rounds away the floating-point dust of a step multiple. */
function tidy(value: number, step: number): number {
  // toFixed takes at most 100 digits.
  const decimals = Math.min(
    100,
    Math.max(0, -Math.floor(Math.log10(step)) + 2),
  );
  return Number(value.toFixed(decimals)) + 0;
}

function scaleFrom(step: number, below: number, above: number): ChartScale {
  const ticks: number[] = [];
  for (let index = -below; index <= above; index += 1)
    ticks.push(tidy(index * step, step));
  return {
    min: tidy(-below * step, step),
    max: tidy(above * step, step),
    step,
    ticks,
  };
}

/** Whole steps below and above zero for an extent at one step. */
function stepsAround(extent: { min: number; max: number }, step: number) {
  return {
    below: Math.ceil(-extent.min / step - 1e-9),
    above: Math.ceil(extent.max / step - 1e-9),
  };
}

/** A scale for an extent aiming at a number of steps. */
function scaleAiming(
  extent: { min: number; max: number },
  steps: number,
): ChartScale {
  const span = extent.max - extent.min;
  if (span === 0) return scaleFrom(1, 0, 1);
  let step = niceStep(span, steps);
  let { below, above } = stepsAround(extent, step);
  // Rounding each side up can add a step; widen the step once if so.
  if (below + above > steps + 1 && steps > 1) {
    step = niceStep(span, steps - 1);
    ({ below, above } = stepsAround(extent, step));
  }
  return scaleFrom(step, Math.max(below, 0), Math.max(above, 0));
}

/**
 * A value axis for an extent through zero: a round step, and as many whole
 * steps either side of zero as the extent needs. An extent of only zero
 * reads 0 to 1.
 */
export function chartScale(extent: { min: number; max: number }): ChartScale {
  return scaleAiming(extent, chartScaleSteps);
}

/** Whole steps a scale has below and above zero. */
function sides(scale: ChartScale): { below: number; above: number } {
  return {
    below: Math.round(-scale.min / scale.step),
    above: Math.round(scale.max / scale.step),
  };
}

/**
 * Two value axes drawn on one plot, such as columns on the left and a
 * running total on the right: each keeps its own round step, and both have
 * the same number of steps below and above zero, so zero and every grid
 * line fall at the same height on both. When the two lean different ways
 * (one mostly above zero, the other below), both take fewer, longer steps
 * so the plot keeps about as many grid lines as one scale would.
 */
export function alignedChartScales(
  first: { min: number; max: number },
  second: { min: number; max: number },
): [ChartScale, ChartScale] {
  let aligned: [ChartScale, ChartScale] = [
    chartScale(first),
    chartScale(second),
  ];
  for (let steps = chartScaleSteps; steps >= 1; steps -= 1) {
    const a = scaleAiming(first, steps);
    const b = scaleAiming(second, steps);
    const below = Math.max(sides(a).below, sides(b).below);
    const above = Math.max(sides(a).above, sides(b).above);
    aligned = [
      scaleFrom(a.step, below, above),
      scaleFrom(b.step, below, above),
    ];
    if (below + above <= chartScaleSteps + 1) break;
  }
  return aligned;
}

/** Where a value falls on a scale, as a share from its bottom (0) to top (1). */
export function scaleShare(value: number, scale: ChartScale): number {
  return (value - scale.min) / (scale.max - scale.min);
}
