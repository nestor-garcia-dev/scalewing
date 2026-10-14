/** Where a range bar sits on its track, as shares of the track (0 to 1). */
export type DataBarGeometry = {
  /** The bar's inline start, from the track's start. */
  start: number;
  /** The bar's length. */
  size: number;
  /** Where zero falls, when the domain runs from below zero to above it. */
  zero: number | null;
  /**
   * Which end of the bar meets the zero line on such a domain: `start`
   * for a bar from zero toward the domain's end (a positive value), `end`
   * for one from below zero up to it, `null` when neither end is zero.
   */
  zeroEnd: 'start' | 'end' | null;
};

function assertFinite(name: string, value: number): void {
  if (typeof value !== 'number' || !Number.isFinite(value))
    throw new RangeError(
      `DataBar ${name} must be a finite number: ${String(value)}`,
    );
}

function share(value: number, min: number, span: number): number {
  return (Math.min(Math.max(value, min), min + span) - min) / span;
}

/**
 * Places the range from `from` to `to` on a track whose domain runs from
 * `min` to `max`: the bar starts at the smaller end and runs to the larger,
 * each clamped to the domain, so a value just past it from rounding stays
 * on the track. A domain from below zero to above it has a zero line, and
 * the bar says which of its ends meets it.
 * Non-finite numbers, or a `min` not under `max`, throw a `RangeError`.
 */
export function dataBarGeometry(
  from: number,
  to: number,
  min: number,
  max: number,
): DataBarGeometry {
  assertFinite('from', from);
  assertFinite('to', to);
  assertFinite('min', min);
  assertFinite('max', max);
  if (min >= max)
    throw new RangeError(
      `DataBar min must be under max: min ${min}, max ${max}`,
    );
  const span = max - min;
  const low = Math.min(from, to);
  const high = Math.max(from, to);
  const start = share(low, min, span);
  const end = share(high, min, span);
  const diverging = min < 0 && max > 0;
  return {
    start,
    size: end - start,
    zero: diverging ? share(0, min, span) : null,
    zeroEnd:
      !diverging || low === high
        ? null
        : low === 0
          ? 'start'
          : high === 0
            ? 'end'
            : null,
  };
}
