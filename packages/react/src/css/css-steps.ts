import { typographyVariants } from '@scalewing/tokens';
import { checkStrokeIn } from './chevron.js';
import {
  cssStepsTitleDetailClasses,
  stepsTitleDetailClassCatalog,
} from './css-steps-title-detail.js';

const body = typographyVariants.body;
const caption = typographyVariants.caption;
const label = typographyVariants.label;
const title = typographyVariants.title;

/** The marker's size: the xs control height. */
const marker = 'var(--sw-control-xs-min-height)';

/** The marker's look per status: its fill, ring and number color. */
function markerRules(): string {
  return `.sw-steps-item-upcoming .sw-steps-marker,
.sw-steps-item-skipped .sw-steps-marker {
  box-shadow: inset 0 0 0 2px var(--sw-color-border);
  color: var(--sw-color-muted);
}

.sw-steps-item-current .sw-steps-marker {
  background: var(--sw-color-accent);
  color: var(--sw-color-onAccent);
}

.sw-steps-item-error .sw-steps-marker {
  background: var(--sw-color-danger);
  color: var(--sw-color-onDanger);
}

.sw-steps-item-done .sw-steps-marker {
  background: var(--sw-color-success);
}

/* Private chrome: a check drawn with two borders, as Checkbox's. */
.sw-steps-item-done .sw-steps-marker::after {
  ${checkStrokeIn('var(--sw-color-surface)')}
  content: '';
  height: var(--sw-space-3);
  margin-top: calc(-1 * var(--sw-space-1) / 2);
  transform: rotate(45deg);
  width: calc(var(--sw-space-3) / 2);
}`;
}

/*
 * A line from each marker down to the next step's, through the gap between
 * the panels: the success color below a done step, the hairline otherwise.
 */
function connectorRules(): string {
  return `.sw-steps-item:not(:last-child)::after {
  background: var(--sw-color-border);
  bottom: calc(-1 * var(--sw-space-2) - 1px);
  content: '';
  inset-inline-start: calc(var(--sw-space-4) + ${marker} / 2 - 1px);
  position: absolute;
  top: calc(var(--sw-steps-padding) + ${marker} + var(--sw-space-1));
  width: 2px;
}

.sw-steps-item-done:not(:last-child)::after {
  background: var(--sw-color-success);
}`;
}

function forcedColorRules(): string {
  return `@media (forced-colors: active) {
  .sw-steps-marker { border: 2px solid CanvasText; box-shadow: none; }
  .sw-steps-item-current .sw-steps-marker { border-color: Highlight; }
  .sw-steps-item-done .sw-steps-marker::after { border-color: CanvasText; }
  .sw-steps-item:not(:last-child)::after { background: CanvasText; }
  .sw-steps-item-upcoming .sw-steps-title,
  .sw-steps-item-skipped .sw-steps-title { color: GrayText; }
}`;
}

/**
 * The one-page vertical stepper: an ordered list of glass panels a small
 * gap apart. Each has a header line (marker, title, an open step's muted
 * words beside it, and on a done step its summary and Edit) and, while open (current or error), a body indented to
 * the title. An open step's title is the title variant; a folded one's is
 * body size at label weight, muted ahead of the form or skipped. In an
 * open list (`sw-steps-open`) every step is open: each panel takes the open
 * padding and title, its header and body in one region.
 */
export function cssStepsClasses(): string {
  return `.sw-steps {
  display: flex;
  flex-direction: column;
  gap: var(--sw-space-2);
  list-style: none;
  margin: 0;
  padding: 0;
}

.sw-steps-item {
  --sw-steps-padding: var(--sw-space-3);
  background: var(--sw-glass-fill);
  border: 1px solid var(--sw-glass-border);
  border-radius: var(--sw-radius-md);
  box-shadow: inset 0 1px 0 var(--sw-glass-specular);
  color: var(--sw-color-text);
  display: flex;
  flex-direction: column;
  gap: var(--sw-space-4);
  padding: var(--sw-steps-padding) var(--sw-space-4);
  position: relative;
}

.sw-steps-item-current,
.sw-steps-item-error,
.sw-steps-open > .sw-steps-item {
  --sw-steps-padding: var(--sw-space-4);
}

/* An open list's step is a region holding its header and body, spaced as
   the item spaces them in a stepped list. */
.sw-steps-region {
  display: flex;
  flex-direction: column;
  gap: var(--sw-space-4);
  min-width: 0;
}

/* The marker sits at the top of the header, so the connector always starts
   under it; each line of the header is centred on the marker's height. */
.sw-steps-header {
  align-items: flex-start;
  display: flex;
  gap: var(--sw-space-3);
  min-height: ${marker};
  min-width: 0;
}

.sw-steps-marker {
  align-items: center;
  border-radius: var(--sw-radius-pill);
  box-sizing: border-box;
  display: inline-flex;
  flex: none;
  font-family: var(--sw-font-sans);
  font-size: ${caption.fontSize}px;
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  height: ${marker};
  justify-content: center;
  line-height: ${caption.lineHeight}px;
  width: ${marker};
}

.sw-steps-title {
  font-family: var(--sw-font-sans);
  font-size: ${body.fontSize}px;
  font-weight: ${label.fontWeight};
  letter-spacing: ${body.letterSpacing}px;
  line-height: ${body.lineHeight}px;
  margin: 0;
  min-width: 0;
  padding-block: calc((${marker} - ${body.lineHeight}px) / 2);
}

.sw-steps-item-current .sw-steps-title,
.sw-steps-item-error .sw-steps-title,
.sw-steps-open > .sw-steps-item .sw-steps-title {
  font-size: ${title.fontSize}px;
  letter-spacing: ${title.letterSpacing}px;
  line-height: ${title.lineHeight}px;
  padding-block: calc((${marker} - ${title.lineHeight}px) / 2);
}

.sw-steps-item-upcoming .sw-steps-title,
.sw-steps-item-skipped .sw-steps-title,
.sw-steps-reason {
  color: var(--sw-color-muted);
}

.sw-steps-summary {
  flex: 1 1 0;
  font-size: ${label.fontSize}px;
  letter-spacing: ${label.letterSpacing}px;
  line-height: ${label.lineHeight}px;
  min-width: 25%;
  overflow: hidden;
  padding-block: calc((${marker} - ${label.lineHeight}px) / 2);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sw-button.sw-steps-edit {
  flex: none;
  margin-block: calc((${marker} - var(--sw-control-sm-min-height)) / 2);
  margin-inline-start: auto;
}

.sw-steps-body {
  margin-inline-start: calc(${marker} + var(--sw-space-3));
  min-width: 0;
}

${cssStepsTitleDetailClasses()}

${markerRules()}

${connectorRules()}

${forcedColorRules()}`;
}

export function stepsClassCatalog(): string[] {
  return [
    'sw-steps',
    'sw-steps-open',
    'sw-steps-item',
    'sw-steps-item-upcoming',
    'sw-steps-item-current',
    'sw-steps-item-done',
    'sw-steps-item-error',
    'sw-steps-item-skipped',
    'sw-steps-header',
    'sw-steps-marker',
    'sw-steps-title',
    'sw-steps-reason',
    'sw-steps-summary',
    'sw-steps-edit',
    'sw-steps-body',
    'sw-steps-region',
    ...stepsTitleDetailClassCatalog(),
  ];
}
