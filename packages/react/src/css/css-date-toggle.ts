import { typographyVariants } from '@scalewing/tokens';

import { quietFill } from './quiet-fill.js';

const caption = typographyVariants.caption;
const label = typographyVariants.label;

/** A day: DateField's calendar day, the md control height square (44 px). */
const square = 'var(--sw-control-md-min-height)';

/*
 * The months side by side in as many columns as fit, each at least seven
 * days wide (or the whole width where that is less, so the track never
 * pushes the page wider), a space-5 apart; a month's title in label type at weight 600
 * over its weekday initials in muted caption type.
 */
function monthRules(): string {
  return `.sw-date-toggle {
  display: grid;
  gap: var(--sw-space-5);
  grid-template-columns: repeat(auto-fill, minmax(min(100%, calc(7 * ${square})), 1fr));
}

.sw-date-toggle-month {
  display: flex;
  flex-direction: column;
  gap: var(--sw-space-2);
  min-width: 0;
}

.sw-date-toggle-title {
  color: var(--sw-color-text);
  font-family: var(--sw-font-sans);
  font-size: ${label.fontSize}px;
  font-weight: 600;
  letter-spacing: ${label.letterSpacing}px;
  line-height: ${label.lineHeight}px;
}

.sw-date-toggle-grid {
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
  width: min(100%, calc(7 * ${square}));
}

.sw-date-toggle-grid th {
  color: var(--sw-color-muted);
  font-size: ${caption.fontSize}px;
  font-weight: normal;
  line-height: ${caption.lineHeight}px;
  padding: 0 0 var(--sw-space-1);
  text-align: center;
}

.sw-date-toggle-grid td {
  height: ${square};
  padding: 0;
  text-align: center;
}`;
}

/*
 * A day is the 44 px round square; in a column narrower than seven of
 * them (a phone under about 340 px) the grid takes the column's width and
 * each day its seventh, so nothing pushes the page wider. A day that
 * toggles is a round button: the text colour on no fill, the
 * quiet fill on hover, the accent fill with onAccent figures at weight 600
 * while on (Highlight in forced colours); a day that cannot is its muted
 * number at the disabled opacity. The focus ring is the accent's.
 */
function dayRules(): string {
  return `.sw-date-toggle-day {
  align-items: center;
  appearance: none;
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--sw-radius-pill);
  box-sizing: border-box;
  color: var(--sw-color-text);
  display: inline-flex;
  font-family: var(--sw-font-sans);
  font-size: ${label.fontSize}px;
  font-variant-numeric: tabular-nums;
  height: ${square};
  justify-content: center;
  margin: 0;
  max-width: ${square};
  padding: 0;
  width: 100%;
}

button.sw-date-toggle-day { cursor: pointer; }

@media (hover: hover) {
  button.sw-date-toggle-day:hover:not([aria-disabled='true'], .sw-date-toggle-day-on) {
    background: ${quietFill};
  }
}

.sw-date-toggle-day-on,
.sw-date-toggle-day-on:hover:not([aria-disabled='true']) {
  background: var(--sw-color-accent);
  border-color: var(--sw-color-accent);
  color: var(--sw-color-onAccent);
  font-weight: ${label.fontWeight};
}

.sw-date-toggle-day-disabled {
  color: var(--sw-color-muted);
  opacity: var(--sw-disabled-opacity);
}

button.sw-date-toggle-day[aria-disabled='true'] {
  cursor: not-allowed;
  opacity: var(--sw-disabled-opacity);
}

.sw-date-toggle-day:focus { outline: none; }

.sw-date-toggle-day:focus-visible {
  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);
  outline-offset: var(--sw-focus-ring-offset);
}

@media (forced-colors: active) {
  .sw-date-toggle-day-on,
  .sw-date-toggle-day-on:hover:not([aria-disabled='true']) {
    background: Highlight;
    border-color: Highlight;
    color: HighlightText;
    forced-color-adjust: none;
  }
  .sw-date-toggle-day-disabled { color: GrayText; }
}`;
}

/* DateToggleCalendar (see components/DateToggleCalendar.tsx). */
export function cssDateToggleClasses(): string {
  return `${monthRules()}

${dayRules()}`;
}

export function dateToggleClassCatalog(): string[] {
  return [
    'sw-date-toggle',
    'sw-date-toggle-month',
    'sw-date-toggle-title',
    'sw-date-toggle-grid',
    'sw-date-toggle-day',
    'sw-date-toggle-day-on',
    'sw-date-toggle-day-disabled',
  ];
}
