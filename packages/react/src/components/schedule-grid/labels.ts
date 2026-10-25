import { type ScheduleGridLabels } from './types.js';

export const defaultScheduleGridLabels: ScheduleGridLabels = {
  open: 'Open',
  movingFrom: 'Moving from here',
  releaseToMove: 'Release to move here',
  releaseToSwap: 'Release to swap',
  instructions:
    'To move an item, press M or Space on it, choose a cell with the arrow keys, then press Enter to drop it or Escape to cancel. Dropping it on another item swaps the two.',
  pickedUp: (item) =>
    `Picked up ${item}. Choose a cell with the arrow keys, then press Enter to drop it or Escape to cancel.`,
  moved: (item, row, column) => `Moved ${item} to ${row}, ${column}.`,
  swapped: (item, other) => `Swapped ${item} with ${other}.`,
  cancelled: (item) => `Cancelled. ${item} stays where it was.`,
};

const wordKeys = [
  'open',
  'movingFrom',
  'releaseToMove',
  'releaseToSwap',
  'instructions',
] as const;

const messageKeys = ['pickedUp', 'moved', 'swapped', 'cancelled'] as const;

/**
 * The default words with the consumer's in place (an `undefined` entry
 * keeps the default); blank words or a message that is not a function
 * throw a `RangeError`.
 */
export function scheduleGridLabels(
  labels: Partial<ScheduleGridLabels> = {},
): ScheduleGridLabels {
  const given = Object.fromEntries(
    Object.entries(labels).filter(([, value]) => value !== undefined),
  );
  const merged = { ...defaultScheduleGridLabels, ...given };
  for (const key of messageKeys) {
    if (typeof merged[key] !== 'function')
      throw new RangeError(`ScheduleGrid labels.${key} must be a function`);
  }
  for (const key of wordKeys) {
    const words: unknown = merged[key];
    if (typeof words !== 'string' || !words.trim())
      throw new RangeError(`ScheduleGrid labels.${key} must be nonempty`);
  }
  return merged;
}
