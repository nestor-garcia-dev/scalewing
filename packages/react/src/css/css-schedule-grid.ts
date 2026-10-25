import { typographyVariants } from '@scalewing/tokens';

import { tableColumnSizes } from './css-table-layout.js';
import { quietFill } from './quiet-fill.js';
import { toneTintFill, toneTintInk } from './tone-tint.js';
import { coarsePointerQuery, touchTarget } from './touch-target.js';

const caption = typographyVariants.caption;
const label = typographyVariants.label;

const ring = 'var(--sw-focus-ring-width)';

/*
 * The frame: the table scrolls sideways inside its own box, never the
 * page. The columns share the width equally (a fixed layout), each at
 * least the `md` table column (8rem) wide, from the column count the
 * component sets in `--sw-schedule-grid-columns`; the rows' labels take
 * the `sm` column; cells sit a space-2 apart (and a space-2 inside the
 * box: a negative margin would be cut off at the scroll box's start).
 * Headers are caption type in the muted colour.
 */
function frameRules(): string {
  return `.sw-schedule-grid {
  max-width: 100%;
  overflow-x: auto;
}

.sw-schedule-grid-table {
  border-collapse: separate;
  border-spacing: var(--sw-space-2);
  min-width: calc(
    ${tableColumnSizes.sm}rem + var(--sw-schedule-grid-columns) * ${tableColumnSizes.md}rem +
      (var(--sw-schedule-grid-columns) + 2) * var(--sw-space-2)
  );
  table-layout: fixed;
  width: 100%;
}

.sw-schedule-grid-column,
.sw-schedule-grid-corner,
.sw-schedule-grid-row {
  color: var(--sw-color-muted);
  font-family: var(--sw-font-sans);
  font-size: ${caption.fontSize}px;
  font-weight: 600;
  letter-spacing: ${caption.letterSpacing}px;
  line-height: ${caption.lineHeight}px;
  text-align: start;
}

.sw-schedule-grid-column,
.sw-schedule-grid-corner {
  padding: 0 var(--sw-space-1);
}

.sw-schedule-grid-row,
.sw-schedule-grid-corner {
  width: ${tableColumnSizes.sm}rem;
}

.sw-schedule-grid-row {
  font-variant-numeric: tabular-nums;
  padding-top: var(--sw-space-3);
  vertical-align: top;
  white-space: nowrap;
}`;
}

/*
 * A cell: a slot at least the touch target plus a space-3 high, rounded,
 * its words in label type. An item is a card on the surface with a
 * hairline (grab cursor where it moves); an open cell a dashed hairline
 * with muted "Open"; a disabled cell the quiet fill with its reason in the
 * muted colour. The cell itself takes focus; the ring is drawn on its slot.
 */
function cellRules(): string {
  return `.sw-schedule-grid-cell {
  height: 100%;
  outline: none;
  padding: 0;
  vertical-align: top;
}

.sw-schedule-grid-slot {
  border: 1px solid transparent;
  border-radius: var(--sw-radius-md);
  box-sizing: border-box;
  color: var(--sw-color-text);
  display: flex;
  flex-direction: column;
  font-family: var(--sw-font-sans);
  font-size: ${label.fontSize}px;
  gap: var(--sw-space-1);
  height: 100%;
  justify-content: center;
  letter-spacing: ${label.letterSpacing}px;
  line-height: ${label.lineHeight}px;
  min-height: calc(${touchTarget} + var(--sw-space-3));
  padding: var(--sw-space-2);
}

.sw-schedule-grid-cell:focus-visible > .sw-schedule-grid-slot {
  outline: ${ring} solid var(--sw-color-accent);
  outline-offset: var(--sw-focus-ring-offset);
}

.sw-schedule-grid-cell-item > .sw-schedule-grid-slot {
  background: var(--sw-color-surface);
  border-color: var(--sw-color-border);
}

.sw-schedule-grid-cell-movable > .sw-schedule-grid-slot {
  cursor: grab;
  touch-action: manipulation;
  user-select: none;
  -webkit-user-select: none;
}

@media (hover: hover) {
  .sw-schedule-grid-cell-movable:hover > .sw-schedule-grid-slot { background: ${quietFill}; }
}

.sw-schedule-grid-cell-open > .sw-schedule-grid-slot {
  border: 1px dashed var(--sw-color-border);
  color: var(--sw-color-muted);
}

.sw-schedule-grid-cell-disabled > .sw-schedule-grid-slot {
  background: var(--sw-color-subtle);
  color: var(--sw-color-muted);
}

.sw-schedule-grid-item {
  min-width: 0;
  overflow-wrap: anywhere;
}

.sw-schedule-grid-caption,
.sw-schedule-grid-reason {
  font-size: ${caption.fontSize}px;
  letter-spacing: ${caption.letterSpacing}px;
  line-height: ${caption.lineHeight}px;
}

.sw-schedule-grid-caption { font-weight: 600; }

@media ${coarsePointerQuery} {
  .sw-schedule-grid-cell-movable > .sw-schedule-grid-slot { cursor: default; }
}`;
}

/*
 * While an item is carried: its own cell takes a dashed muted edge and
 * "Moving from here" (its card is not faded, so its words keep their
 * contrast); a blocked cell takes a warning-ink edge and its reason in
 * the warning ink (amber: it needs the person to look elsewhere); the one
 * target (the drag's hover cell, or the focused cell while keys carry)
 * has the accent ring, or a warning one when it is blocked. Only an open
 * cell is filled (the warning tint and ink when blocked, the accent tint
 * with the text colour as the target, since muted words miss 4.5:1 on it):
 * an item's card stays on the surface its words were made for.
 * Dragging grabs the whole grid and stops text selection.
 */
function carryRules(): string {
  const warningInk = toneTintInk('warning');
  return `.sw-schedule-grid-cell-source > .sw-schedule-grid-slot {
  border-color: var(--sw-color-muted);
  border-style: dashed;
}

.sw-schedule-grid-cell-blocked > .sw-schedule-grid-slot {
  border-color: ${warningInk};
  cursor: not-allowed;
}

.sw-schedule-grid-cell-open.sw-schedule-grid-cell-blocked > .sw-schedule-grid-slot {
  background: ${toneTintFill('warning')};
  color: ${warningInk};
}

.sw-schedule-grid-cell-blocked .sw-schedule-grid-caption { color: ${warningInk}; }

.sw-schedule-grid-cell-target > .sw-schedule-grid-slot {
  border-color: var(--sw-color-accent);
  outline: ${ring} solid var(--sw-color-accent);
  outline-offset: calc(-1 * ${ring});
}

.sw-schedule-grid-cell-open.sw-schedule-grid-cell-target:not(.sw-schedule-grid-cell-blocked) > .sw-schedule-grid-slot {
  background: var(--sw-color-accentSubtle);
  color: var(--sw-color-text);
}

.sw-schedule-grid-cell-target.sw-schedule-grid-cell-blocked > .sw-schedule-grid-slot {
  border-color: ${warningInk};
  outline-color: ${warningInk};
}

.sw-schedule-grid-dragging,
.sw-schedule-grid-dragging .sw-schedule-grid-slot {
  cursor: grabbing;
  user-select: none;
  -webkit-user-select: none;
}`;
}

/* Forced colours keep the edges: every slot and ring in the system colours. */
function forcedColorRules(): string {
  return `@media (forced-colors: active) {
  .sw-schedule-grid-cell-item > .sw-schedule-grid-slot,
  .sw-schedule-grid-cell-open > .sw-schedule-grid-slot,
  .sw-schedule-grid-cell-disabled > .sw-schedule-grid-slot,
  .sw-schedule-grid-cell-blocked > .sw-schedule-grid-slot {
    border-color: CanvasText;
  }
  .sw-schedule-grid-cell-disabled > .sw-schedule-grid-slot { color: GrayText; }
  .sw-schedule-grid-cell-blocked > .sw-schedule-grid-slot { border-style: dotted; }
  .sw-schedule-grid-cell-target > .sw-schedule-grid-slot,
  .sw-schedule-grid-cell:focus-visible > .sw-schedule-grid-slot {
    outline-color: Highlight;
  }
}`;
}

/* ScheduleGrid (see components/ScheduleGrid.tsx). */
export function cssScheduleGridClasses(): string {
  return `${frameRules()}

${cellRules()}

${carryRules()}

${forcedColorRules()}`;
}

export function scheduleGridClassCatalog(): string[] {
  return [
    'sw-schedule-grid',
    'sw-schedule-grid-dragging',
    'sw-schedule-grid-table',
    'sw-schedule-grid-corner',
    'sw-schedule-grid-column',
    'sw-schedule-grid-row',
    'sw-schedule-grid-cell',
    'sw-schedule-grid-cell-item',
    'sw-schedule-grid-cell-movable',
    'sw-schedule-grid-cell-open',
    'sw-schedule-grid-cell-disabled',
    'sw-schedule-grid-cell-source',
    'sw-schedule-grid-cell-move',
    'sw-schedule-grid-cell-swap',
    'sw-schedule-grid-cell-blocked',
    'sw-schedule-grid-cell-target',
    'sw-schedule-grid-slot',
    'sw-schedule-grid-item',
    'sw-schedule-grid-open',
    'sw-schedule-grid-reason',
    'sw-schedule-grid-caption',
  ];
}
