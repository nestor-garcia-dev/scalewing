/** How a wheel row was picked: a tap on the row or a scroll that settled. */
export type WheelPick = 'tap' | 'scroll';

/**
 * The column a pick happened in. A single wheel is WheelField's only
 * column; the others are TimeField's.
 */
export type WheelColumn = 'single' | 'hours' | 'minutes' | 'period';

/**
 * Whether a pick closes its picker. A tap is a decision and closes it, except
 * a tapped hour, which leaves the minutes to choose next. A settled scroll is
 * browsing and never closes.
 */
export function closesOnPick(column: WheelColumn, pick: WheelPick): boolean {
  return pick === 'tap' && column !== 'hours';
}
