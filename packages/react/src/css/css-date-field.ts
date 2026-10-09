import { typographyVariants } from '@scalewing/tokens';

import {
  disabledControlForcedColors,
  disabledControlSurface,
} from './css-document.js';
import { zIndex } from './stacking.js';

const body = typographyVariants.body;
const label = typographyVariants.label;
const caption = typographyVariants.caption;

/* The calendar button, month steps, and days are one square control wide. */
const square = 'var(--sw-control-md-min-height)';
/* Wide enough for "MM/DD/YYYY" in the system sans. */
const entryWidth = '12ch';
/* Outranks the canvas rule for text inputs so the button keeps its room. */
const input = '.sw-date-field .sw-date-field-control > .sw-date-field-input';

function fieldRules(): string {
  return `.sw-date-field {
  display: flex;
  flex-direction: column;
  gap: var(--sw-space-1);
  max-width: 100%;
  min-width: 0;
  width: max-content;
}

/* The label inherits the canvas's body type, as Field's does; the label
   words inside it are a Text label span. The same line box gives the same
   gap to the entry as a Field beside it. */
.sw-date-field-label {
  color: var(--sw-color-text);
}

.sw-date-field-control {
  align-self: flex-start;
  display: flex;
  max-width: 100%;
  min-width: 0;
  position: relative;
}

${input} {
  background: var(--sw-glass-fill);
  border: 1px solid var(--sw-color-border);
  border-radius: var(--sw-radius-sm);
  box-sizing: border-box;
  color: var(--sw-color-text);
  font-family: var(--sw-font-sans);
  font-size: ${body.fontSize}px;
  font-variant-numeric: tabular-nums;
  margin: 0;
  max-width: 100%;
  min-height: var(--sw-control-md-min-height);
  min-width: 0;
  padding-inline: var(--sw-control-md-padding-inline) ${square};
  width: calc(${entryWidth} + var(--sw-control-md-padding-inline) + ${square});
}

${input}::placeholder {
  color: var(--sw-color-muted);
  opacity: 1;
}

${input}:focus {
  box-shadow: none;
  outline: none;
}

${input}:focus-visible {
  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);
  outline-offset: var(--sw-focus-ring-offset);
}

${input}[aria-invalid='true'] {
  border-color: var(--sw-color-danger);
}

/* The entry looks locked as every text control does; its button fades as buttons do. */
${input}:disabled {
  ${disabledControlSurface}
}

.sw-date-field-button:disabled {
  cursor: not-allowed;
  opacity: var(--sw-disabled-opacity);
}

.sw-date-field-button {
  align-items: center;
  appearance: none;
  background: transparent;
  border: 0;
  border-radius: var(--sw-radius-sm);
  color: var(--sw-color-muted);
  cursor: pointer;
  display: flex;
  inset-block: 0;
  inset-inline-end: 0;
  justify-content: center;
  margin: 0;
  padding: 0;
  position: absolute;
  width: ${square};
}

.sw-date-field-button:hover:not(:disabled),
.sw-date-field-button[aria-expanded='true'] {
  color: var(--sw-color-text);
}

.sw-date-field-glyph {
  fill: none;
  flex: none;
  height: var(--sw-space-5);
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.75;
  width: var(--sw-space-5);
}

[dir='rtl'] .sw-date-field-glyph-directional {
  transform: scaleX(-1);
}

.sw-date-field-description,
.sw-date-field-error {
  font-family: var(--sw-font-sans);
  font-size: ${caption.fontSize}px;
  line-height: ${caption.lineHeight}px;
}

.sw-date-field-description { color: var(--sw-color-muted); }
.sw-date-field-error { color: var(--sw-color-danger); }
.sw-date-field-error:empty { position: absolute; }`;
}

function calendarRules(): string {
  return `.sw-date-field-calendar {
  background: var(--sw-glass-fill);
  border: 1px solid var(--sw-glass-border);
  border-radius: var(--sw-radius-md);
  box-shadow: var(--sw-elevation-md), inset 0 1px 0 var(--sw-glass-specular);
  backdrop-filter: blur(var(--sw-glass-blur)) saturate(var(--sw-glass-saturate));
  -webkit-backdrop-filter: blur(var(--sw-glass-blur)) saturate(var(--sw-glass-saturate));
  box-sizing: border-box;
  color: var(--sw-color-text);
  display: flex;
  flex-direction: column;
  font-family: var(--sw-font-sans);
  gap: var(--sw-space-2);
  height: auto;
  inset: auto;
  margin: 0;
  /* On the top layer 100% is the viewport without a classic scrollbar. */
  max-width: calc(100% - var(--sw-space-2) - var(--sw-space-2));
  overflow: visible;
  padding: var(--sw-space-3);
  position: fixed;
  width: max-content;
  ${zIndex('popup')}
}

.sw-date-field-header {
  align-items: center;
  display: flex;
  gap: var(--sw-space-1);
  justify-content: space-between;
}

.sw-date-field-jump {
  display: flex;
  gap: var(--sw-space-1);
  min-width: 0;
}

.sw-date-field-step {
  align-items: center;
  appearance: none;
  background: transparent;
  border: 0;
  border-radius: var(--sw-radius-pill);
  color: var(--sw-color-text);
  cursor: pointer;
  display: flex;
  flex: none;
  height: ${square};
  justify-content: center;
  margin: 0;
  padding: 0;
  width: ${square};
}

.sw-date-field-step[aria-disabled='true'] {
  cursor: not-allowed;
  opacity: var(--sw-disabled-opacity);
}

.sw-date-field-grid {
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
}

.sw-date-field-grid th {
  color: var(--sw-color-muted);
  font-size: ${caption.fontSize}px;
  font-weight: normal;
  line-height: ${caption.lineHeight}px;
  padding: 0 0 var(--sw-space-1);
  text-align: center;
}

.sw-date-field-day {
  border: 1px solid transparent;
  border-radius: var(--sw-radius-pill);
  box-sizing: border-box;
  cursor: pointer;
  font-size: ${label.fontSize}px;
  font-variant-numeric: tabular-nums;
  height: ${square};
  padding: 0;
  text-align: center;
  vertical-align: middle;
  width: ${square};
}

.sw-date-field-day-outside {
  color: var(--sw-color-muted);
}

.sw-date-field-step:hover:not([aria-disabled='true']),
.sw-date-field-day:hover:not([aria-disabled='true']) {
  background: color-mix(in srgb, var(--sw-color-muted) 16%, transparent);
}

/*
 * A range's days are one band in each week row: square-cornered, the accent
 * at low strength, rounded at the range's start and end. The selected day
 * and today's ring sit on top of it.
 */
.sw-date-field-day-in-range {
  background: color-mix(in srgb, var(--sw-color-accent) 16%, transparent);
  border-radius: 0;
}

.sw-date-field-day-range-start {
  border-end-start-radius: var(--sw-radius-pill);
  border-start-start-radius: var(--sw-radius-pill);
}

.sw-date-field-day-range-end {
  border-end-end-radius: var(--sw-radius-pill);
  border-start-end-radius: var(--sw-radius-pill);
}

.sw-date-field-day[aria-current='date'] {
  border-color: var(--sw-color-accent);
  color: var(--sw-color-accent);
  font-weight: ${label.fontWeight};
}

.sw-date-field-day[aria-selected='true'],
.sw-date-field-day[aria-selected='true']:hover {
  background: var(--sw-color-accent);
  border-color: var(--sw-color-accent);
  border-radius: var(--sw-radius-pill);
  color: var(--sw-color-onAccent);
  font-weight: ${label.fontWeight};
}

.sw-date-field-day[aria-disabled='true'] {
  cursor: not-allowed;
  opacity: var(--sw-disabled-opacity);
}

.sw-date-field-button:focus,
.sw-date-field-step:focus,
.sw-date-field-day:focus {
  outline: none;
}

.sw-date-field-button:focus-visible,
.sw-date-field-step:focus-visible,
.sw-date-field-day:focus-visible {
  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);
  outline-offset: var(--sw-focus-ring-offset);
}

.sw-date-field-footer {
  display: flex;
  gap: var(--sw-space-1);
  justify-content: flex-end;
}`;
}

function adaptiveRules(): string {
  return `@media (prefers-reduced-transparency: reduce) {
  ${input} { background: var(--sw-color-surface); }
}

@media (forced-colors: active) {
  ${input}[aria-invalid='true'] { border-color: CanvasText; }
  ${input}:disabled {
    ${disabledControlForcedColors}
  }
  .sw-date-field-calendar { border-color: CanvasText; }
  .sw-date-field-day[aria-current='date'] { border-color: CanvasText; }
  .sw-date-field-day-in-range {
    background: Mark;
    color: MarkText;
    forced-color-adjust: none;
  }
  .sw-date-field-day[aria-selected='true'] {
    background: Highlight;
    color: HighlightText;
    forced-color-adjust: none;
  }
}`;
}

export function cssDateFieldClasses(): string {
  return `${fieldRules()}

${calendarRules()}

${adaptiveRules()}`;
}

export function dateFieldClassCatalog(): string[] {
  return [
    'sw-date-field',
    'sw-date-field-label',
    'sw-date-field-control',
    'sw-date-field-input',
    'sw-date-field-button',
    'sw-date-field-glyph',
    'sw-date-field-glyph-directional',
    'sw-date-field-description',
    'sw-date-field-error',
    'sw-date-field-calendar',
    'sw-date-field-header',
    'sw-date-field-jump',
    'sw-date-field-step',
    'sw-date-field-grid',
    'sw-date-field-day',
    'sw-date-field-day-outside',
    'sw-date-field-day-in-range',
    'sw-date-field-day-range-start',
    'sw-date-field-day-range-end',
    'sw-date-field-footer',
  ];
}
