/*
 * A range's band in a calendar: the accent at 16 % over the calendar's
 * glass, 24 % under the pointer. CalendarButton's tint and DateRangeButton's
 * days between a range's ends share it, so the two read as one band.
 */
export const rangeBand =
  'color-mix(in srgb, var(--sw-color-accent) 16%, transparent)';

export const rangeBandHover =
  'color-mix(in srgb, var(--sw-color-accent) 24%, transparent)';
