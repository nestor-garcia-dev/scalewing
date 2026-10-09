import { iconButtonRules } from './css-icon-button.js';

export function cssCalendarButtonClasses(): string {
  return `${iconButtonRules('sw-calendar-button')}

.sw-calendar-button:not(.sw-button-md) .sw-date-field-glyph {
  height: var(--sw-space-4);
  width: var(--sw-space-4);
}`;
}

export function calendarButtonClassCatalog(): string[] {
  return ['sw-calendar-button'];
}
