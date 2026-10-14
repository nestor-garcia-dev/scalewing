/**
 * Each date's closing point: the index of the last point on it. A balance
 * can change twice on one day; the day's markers and figures belong to its
 * closing value.
 */
export function closingIndexes<Day>(days: readonly Day[]): Map<Day, number> {
  return new Map(days.map((day, index) => [day, index]));
}
