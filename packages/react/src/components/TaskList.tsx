'use client';

import { type HTMLAttributes, useId } from 'react';

import { cx } from '../class-names.js';
import { type Breakpoint } from '../css/breakpoints.js';
import { taskListActionBelowClass } from '../css/css-task-list-layout.js';
import {
  assertActionBelow,
  assertTaskList,
} from './task-list/assert-task-list.js';
import type { TaskListItem } from './task-list/task-list-item.js';
import {
  type TaskListLabels,
  taskListWords,
  taskSpokenTitle,
} from './task-list/task-list-status.js';

export type {
  TaskListActionContext,
  TaskListItem,
} from './task-list/task-list-item.js';
export {
  defaultTaskListLabels,
  type TaskListLabels,
  type TaskListStatus,
  taskListStatuses,
} from './task-list/task-list-status.js';

export type TaskListProps = Omit<
  HTMLAttributes<HTMLOListElement>,
  'aria-label' | 'children'
> & {
  /** The list's name, such as "Get Spring 2027 ready". */
  label: string;
  /** The tasks, in order. */
  items: readonly TaskListItem[];
  /** The status words heard after each title. English by default. */
  labels?: Partial<TaskListLabels>;
  /**
   * Numbers the open tasks: a `todo` or `next` task's marker shows its
   * place in the list (1, 2, …) inside its ring, in place of the empty ring
   * and the dot, so "step 3" can be pointed at. Done and waiting markers
   * keep their check and lock. The number is drawn only; the list's own
   * order says it to assistive technology. Default `false`.
   */
  numbered?: boolean;
  /**
   * Below this breakpoint each action leaves the row's end for a line of its
   * own under the task's words, as wide as them, its control stretched to
   * fill it, so a phone shows one full-width button per task. Left out, an
   * action stays at the row's end (wrapping only when it would squeeze the
   * words). An unknown breakpoint throws a `RangeError`.
   */
  actionBelow?: Breakpoint;
};

function TaskRow({
  item,
  labels,
  titleId,
  number,
}: {
  item: TaskListItem;
  labels: TaskListLabels;
  titleId: string;
  /** The task's place in the list, drawn in an open task's marker. */
  number: number | null;
}) {
  const action =
    typeof item.action === 'function' ? item.action({ titleId }) : item.action;
  const hasAction = action !== undefined && action !== null && action !== false;
  const open = item.status === 'todo' || item.status === 'next';
  return (
    <li className={cx('sw-task-list-item', `sw-task-list-item-${item.status}`)}>
      <span aria-hidden="true" className="sw-task-list-marker">
        {number !== null && open ? number : null}
      </span>
      <span className="sw-task-list-body">
        <span className="sw-task-list-title">
          {/* One hidden line holds the spoken name ("Season, Done"): a
              hidden box is laid out as a block, so a separate status box
              would put a space before the comma. aria-hidden goes on the
              title's own box, which an action may reference by id. */}
          <span aria-hidden="true" id={titleId}>
            {item.title}
          </span>
          <span className="sw-sr-only">
            {taskSpokenTitle(item.title, item.status, labels)}
          </span>
        </span>
        {item.detail !== undefined ? (
          <span className="sw-task-list-detail">{item.detail}</span>
        ) : null}
      </span>
      {hasAction ? <span className="sw-task-list-action">{action}</span> : null}
    </li>
  );
}

/**
 * A setup checklist: an ordered list of tasks, each with a status marker
 * (done: a check on the success fill; next: an accent ring round a dot;
 * todo: a grey ring; waiting: a muted lock), its title, a muted detail
 * line and an optional action at the row's end (or, with `actionBelow`,
 * under the words on a narrow screen), the open tasks optionally numbered
 * (`numbered`). Each title is followed by
 * its status word for assistive technology. Scalewing holds no order
 * rules: the consumer sets every task's status and action.
 */
export function TaskList({
  label,
  items,
  labels,
  numbered = false,
  actionBelow,
  className,
  ...rest
}: TaskListProps) {
  const words = taskListWords(labels);
  assertTaskList(label, items, words);
  assertActionBelow(actionBelow);
  const baseId = useId();
  // role="list" keeps the list a list where list-style: none drops it (Safari).
  return (
    <ol
      aria-label={label}
      className={cx(
        'sw-task-list',
        numbered && 'sw-task-list-numbered',
        actionBelow && taskListActionBelowClass(actionBelow),
        className,
      )}
      role="list"
      {...rest}
    >
      {items.map((item, index) => (
        <TaskRow
          item={item}
          key={item.id}
          labels={words}
          number={numbered ? index + 1 : null}
          titleId={`${baseId}-${index}`}
        />
      ))}
    </ol>
  );
}
