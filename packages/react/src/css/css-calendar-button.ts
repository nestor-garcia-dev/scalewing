import { buttonSizes } from '@scalewing/tokens';

import { coarsePointerQuery, touchTarget } from './touch-target.js';

/* Square at every Button size: as wide as the size's control height. */
function squareRules(): string {
  return buttonSizes
    .map(
      (size) =>
        `.sw-button-${size}.sw-calendar-button { min-width: var(--sw-control-${size}-min-height); }`,
    )
    .join('\n');
}

export function cssCalendarButtonClasses(): string {
  return `.sw-button.sw-calendar-button {
  flex: none;
  padding-inline: 0;
}

${squareRules()}

.sw-calendar-button:not(.sw-button-md) .sw-date-field-glyph {
  height: var(--sw-space-4);
  width: var(--sw-space-4);
}

/* A coarse pointer gets the full touch target at the smaller sizes too. */
@media ${coarsePointerQuery} {
  .sw-button.sw-calendar-button {
    min-height: ${touchTarget};
    min-width: ${touchTarget};
  }
}`;
}

export function calendarButtonClassCatalog(): string[] {
  return ['sw-calendar-button'];
}
