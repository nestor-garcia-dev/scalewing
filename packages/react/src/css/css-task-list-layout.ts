import { typographyVariants } from '@scalewing/tokens';

import {
  type Breakpoint,
  breakpointQuery,
  breakpoints,
} from './breakpoints.js';

const label = typographyVariants.label;
const caption = typographyVariants.caption;

/** Where the words start: the marker's side (space 5) and the row's gap (space 3). */
const wordsStart = 'calc(var(--sw-space-5) + var(--sw-space-3))';

const openMarker =
  ':is(.sw-task-list-item-todo, .sw-task-list-item-next) .sw-task-list-marker';

/** The class that puts a TaskList's actions under the words below `breakpoint`. */
export function taskListActionBelowClass(breakpoint: Breakpoint): string {
  return `sw-task-list-action-below-${breakpoint}`;
}

/*
 * A numbered list draws an open task's place inside its ring, at the
 * caption size and the label weight: a todo task's number in the muted
 * colour on the hairline ring, the next task's in the accent on the accent
 * ring, its dot dropped. Forced colours draw the numbers in CanvasText.
 */
function numberedRules(): string {
  return `.sw-task-list-numbered ${openMarker} {
  font-family: var(--sw-font-sans);
  font-size: ${caption.fontSize}px;
  font-weight: ${label.fontWeight};
  line-height: 1;
}

.sw-task-list-numbered .sw-task-list-item-todo .sw-task-list-marker {
  color: var(--sw-color-muted);
}

.sw-task-list-numbered .sw-task-list-item-next .sw-task-list-marker {
  color: var(--sw-color-accent);
}

.sw-task-list-numbered .sw-task-list-item-next .sw-task-list-marker::after {
  content: none;
}

@media (forced-colors: active) {
  .sw-task-list-numbered ${openMarker} { color: CanvasText; }
}`;
}

/*
 * Below the breakpoint each action takes a line of its own under the
 * words, starting where they start and as wide as them, and its control
 * stretches to fill that line.
 */
function actionBelowRules(breakpoint: Breakpoint): string {
  const list = `.${taskListActionBelowClass(breakpoint)}`;
  return `@media ${breakpointQuery('below', breakpoint)} {
  ${list} .sw-task-list-action {
    display: flex;
    flex-basis: calc(100% - ${wordsStart});
    margin-inline-start: ${wordsStart};
  }
  ${list} .sw-task-list-action > * { flex: 1 1 auto; }
}`;
}

/** A TaskList's optional layouts: numbered open tasks, actions under the words. */
export function cssTaskListLayoutClasses(): string {
  return [numberedRules(), ...breakpoints.map(actionBelowRules)].join('\n\n');
}

export function taskListLayoutClassCatalog(): string[] {
  return [
    'sw-task-list-numbered',
    ...breakpoints.map(taskListActionBelowClass),
  ];
}
