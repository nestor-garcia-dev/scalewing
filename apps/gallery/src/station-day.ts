/**
 * The reef station's own day for the `today` demos: a station keeps
 * Honolulu time, so its day can differ from the device's.
 */
const stationDayParts = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Pacific/Honolulu',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/**
 * The station's calendar date, `YYYY-MM-DD`, at an instant. Built from the
 * parts, since a locale's own date order is locale data, not a contract.
 */
export function stationToday(now: Date = new Date()): string {
  const parts = stationDayParts.formatToParts(now);
  const part = (type: 'year' | 'month' | 'day') =>
    parts.find((p) => p.type === type)?.value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}
