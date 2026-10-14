import { typographyVariants } from '@scalewing/tokens';

import { breakpointQuery } from './breakpoints.js';
import { quietFill } from './quiet-fill.js';
import { coarsePointerQuery, touchTarget } from './touch-target.js';

const label = typographyVariants.label;
const body = typographyVariants.body;

/*
 * DateRangeButton's presets. In the popover they are a list beside the
 * months from `lg` up, the pressed one on the quiet fill in the label
 * weight; from `md` to `lg`, where two months and a list do not fit side
 * by side, the same list wraps in a row above the months and takes no
 * width of its own. In the sheet they are one row of pills that scrolls
 * sideways, the pressed one in the text colour.
 */
export function cssDateRangePresetsClasses(): string {
  return `.sw-date-range-presets {
  contain: inline-size;
  display: flex;
  flex-wrap: wrap;
  gap: var(--sw-space-1);
  padding: var(--sw-space-3) var(--sw-space-3) 0;
}

@media ${breakpointQuery('from', 'lg')} {
  .sw-date-range-presets:not(.sw-date-range-presets-row) {
    border-inline-end: 1px solid var(--sw-color-border);
    contain: none;
    flex-direction: column;
    flex-wrap: nowrap;
    padding: var(--sw-space-3) var(--sw-space-2);
  }
}

.sw-date-range-preset {
  appearance: none;
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--sw-radius-sm);
  box-sizing: border-box;
  color: var(--sw-color-text);
  cursor: pointer;
  flex: none;
  font-family: var(--sw-font-sans);
  font-size: ${label.fontSize}px;
  font-weight: ${body.fontWeight};
  line-height: ${label.lineHeight}px;
  margin: 0;
  min-height: var(--sw-control-sm-min-height);
  padding: 0 var(--sw-control-sm-padding-inline);
  text-align: start;
  white-space: nowrap;
}

.sw-date-range-preset:hover,
.sw-date-range-preset[aria-pressed='true'] {
  background: ${quietFill};
}

.sw-date-range-preset[aria-pressed='true'] {
  font-weight: ${label.fontWeight};
}

.sw-date-range-preset:focus { outline: none; }

.sw-date-range-preset:focus-visible {
  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);
  outline-offset: var(--sw-focus-ring-offset);
}

.sw-date-range-presets-row {
  contain: none;
  flex-wrap: nowrap;
  gap: var(--sw-space-2);
  overflow-x: auto;
  padding: var(--sw-focus-ring-width) var(--sw-focus-ring-offset);
}

.sw-date-range-presets-row .sw-date-range-preset {
  background: ${quietFill};
  border-radius: var(--sw-radius-pill);
}

.sw-date-range-presets-row .sw-date-range-preset[aria-pressed='true'] {
  background: var(--sw-color-text);
  color: var(--sw-color-surface);
}

@media ${coarsePointerQuery} {
  .sw-date-range-preset { min-height: ${touchTarget}; }
}

@media (forced-colors: active) {
  .sw-date-range-presets { border-color: CanvasText; }
  .sw-date-range-presets-row .sw-date-range-preset { border-color: ButtonText; }
  .sw-date-range-preset[aria-pressed='true'],
  .sw-date-range-presets-row .sw-date-range-preset[aria-pressed='true'] {
    background: Highlight;
    color: HighlightText;
    forced-color-adjust: none;
  }
}`;
}

export function dateRangePresetsClassCatalog(): string[] {
  return [
    'sw-date-range-presets',
    'sw-date-range-presets-row',
    'sw-date-range-preset',
  ];
}
