'use client';

import { type HTMLAttributes, useId } from 'react';

import { cx } from '../class-names.js';
import { assertTaskList } from './task-list/assert-task-list.js';
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
};

function TaskRow({
  item,
  labels,
  titleId,
}: {
  item: TaskListItem;
  labels: TaskListLabels;
  titleId: string;
}) {
  const action =
    typeof item.action === 'function' ? item.action({ titleId }) : item.action;
  const hasAction = action !== undefined && action !== null && action !== false;
  return (
    <li className={cx('sw-task-list-item', `sw-task-list-item-${item.status}`)}>
      <span aria-hidden="true" className="sw-task-list-marker" />
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
 * line and an optional action at the row's end. Each title is followed by
 * its status word for assistive technology. Scalewing holds no order
 * rules: the consumer sets every task's status and action.
 */
export function TaskList({
  label,
  items,
  labels,
  className,
  ...rest
}: TaskListProps) {
  const words = taskListWords(labels);
  assertTaskList(label, items, words);
  const baseId = useId();
  // role="list" keeps the list a list where list-style: none drops it (Safari).
  return (
    <ol
      aria-label={label}
      className={cx('sw-task-list', className)}
      role="list"
      {...rest}
    >
      {items.map((item, index) => (
        <TaskRow
          item={item}
          key={item.id}
          labels={words}
          titleId={`${baseId}-${index}`}
        />
      ))}
    </ol>
  );
}
