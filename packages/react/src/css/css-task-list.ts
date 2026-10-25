import { typographyVariants } from '@scalewing/tokens';

import { checkStrokeIn } from './chevron.js';

const body = typographyVariants.body;
const caption = typographyVariants.caption;
const label = typographyVariants.label;

/** The marker's side: spacing step 5 (24 px). */
const marker = 'var(--sw-space-5)';

/** The width of a ring, and of the check's and the lock's strokes. */
const stroke = '2px';

/*
 * Each status's marker is private chrome drawn with borders and an inset
 * ring, so the shapes differ (a check, a ring round a dot, an empty ring,
 * a lock) and colour is never the only cue: done is the success fill with
 * a check in the surface colour, as Steps' done marker; next an accent
 * ring round an accent dot (a zero-size box with a step-1 border, so forced
 * colours keep it); todo the hairline ring of a step ahead; waiting a lock
 * in the muted colour with no ring (a shackle of three borders, 8 px
 * square, over a 12 × 8 px body that is all border).
 */
function markerRules(): string {
  return `.sw-task-list-item-todo .sw-task-list-marker {
  box-shadow: inset 0 0 0 ${stroke} var(--sw-color-border);
}

.sw-task-list-item-next .sw-task-list-marker {
  box-shadow: inset 0 0 0 ${stroke} var(--sw-color-accent);
}

.sw-task-list-item-next .sw-task-list-marker::after {
  border: var(--sw-space-1) solid var(--sw-color-accent);
  border-radius: var(--sw-radius-pill);
  content: '';
}

.sw-task-list-item-done .sw-task-list-marker {
  background: var(--sw-color-success);
}

.sw-task-list-item-done .sw-task-list-marker::after {
  ${checkStrokeIn('var(--sw-color-surface)')}
  content: '';
  height: var(--sw-space-3);
  margin-top: calc(-1 * var(--sw-space-1) / 2);
  transform: rotate(45deg);
  width: calc(var(--sw-space-3) / 2);
}

.sw-task-list-item-waiting .sw-task-list-marker {
  color: var(--sw-color-muted);
  flex-direction: column;
}

.sw-task-list-item-waiting .sw-task-list-marker::before {
  border: ${stroke} solid currentColor;
  border-bottom: 0;
  border-radius: var(--sw-space-1) var(--sw-space-1) 0 0;
  content: '';
  height: calc(var(--sw-space-2) - ${stroke});
  width: calc(var(--sw-space-2) - 2 * ${stroke});
}

.sw-task-list-item-waiting .sw-task-list-marker::after {
  border: var(--sw-space-1) solid currentColor;
  border-radius: calc(var(--sw-space-1) / 2);
  content: '';
  width: calc(var(--sw-space-3) - 2 * var(--sw-space-1));
}`;
}

/* Forced colours drop fills and inset shadows: every ring becomes a
   border, the next one Highlight, and the strokes take CanvasText. */
function forcedColorRules(): string {
  return `@media (forced-colors: active) {
  .sw-task-list-item:not(.sw-task-list-item-waiting) .sw-task-list-marker {
    border: ${stroke} solid CanvasText;
    box-shadow: none;
  }
  .sw-task-list-item-next .sw-task-list-marker { border-color: Highlight; }
  .sw-task-list-item-next .sw-task-list-marker::after { border-color: Highlight; }
  .sw-task-list-item-done .sw-task-list-marker::after { border-color: CanvasText; }
  .sw-task-list-item-waiting .sw-task-list-marker { color: CanvasText; }
  .sw-task-list-item-waiting .sw-task-list-title { color: GrayText; }
}`;
}

/**
 * A setup checklist: an ordered list of rows a hairline apart, each a
 * marker, the title (label type) over a muted caption detail, and an
 * action at the row's end. The marker and the action sit on the row's
 * middle. On a narrow column, an action that would leave the words less
 * than half the row wraps to a line of its own at the row's end. A
 * waiting task's title is muted at the body weight.
 */
export function cssTaskListClasses(): string {
  return `.sw-task-list {
  display: flex;
  flex-direction: column;
  list-style: none;
  margin: 0;
  min-width: 0;
  padding: 0;
}

.sw-task-list-item {
  align-items: center;
  color: var(--sw-color-text);
  column-gap: var(--sw-space-3);
  display: flex;
  flex-wrap: wrap;
  font-family: var(--sw-font-sans);
  min-width: 0;
  padding-block: var(--sw-space-2);
  row-gap: var(--sw-space-2);
}

.sw-task-list-item + .sw-task-list-item {
  border-top: 1px solid var(--sw-color-border);
}

.sw-task-list-marker {
  align-items: center;
  border-radius: var(--sw-radius-pill);
  box-sizing: border-box;
  display: inline-flex;
  flex: none;
  height: ${marker};
  justify-content: center;
  width: ${marker};
}

.sw-task-list-body {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  min-width: 50%;
}

.sw-task-list-title {
  font-size: ${label.fontSize}px;
  font-weight: ${label.fontWeight};
  letter-spacing: ${label.letterSpacing}px;
  line-height: ${label.lineHeight}px;
  overflow-wrap: anywhere;
}

.sw-task-list-item-waiting .sw-task-list-title {
  color: var(--sw-color-muted);
  font-weight: ${body.fontWeight};
}

.sw-task-list-detail {
  color: var(--sw-color-muted);
  font-size: ${caption.fontSize}px;
  letter-spacing: ${caption.letterSpacing}px;
  line-height: ${caption.lineHeight}px;
  overflow-wrap: anywhere;
}

.sw-task-list-action {
  display: inline-flex;
  flex: none;
  margin-inline-start: auto;
  max-width: 100%;
}

${markerRules()}

${forcedColorRules()}`;
}

export function taskListClassCatalog(): string[] {
  return [
    'sw-task-list',
    'sw-task-list-item',
    'sw-task-list-item-done',
    'sw-task-list-item-next',
    'sw-task-list-item-todo',
    'sw-task-list-item-waiting',
    'sw-task-list-marker',
    'sw-task-list-body',
    'sw-task-list-title',
    'sw-task-list-detail',
    'sw-task-list-action',
  ];
}
