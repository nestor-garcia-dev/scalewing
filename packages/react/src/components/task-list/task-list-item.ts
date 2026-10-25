import type { ReactNode } from 'react';

import type { TaskListStatus } from './task-list-status.js';

/** What a task's action is given: the id of its drawn title. */
export type TaskListActionContext = {
  /**
   * The id of the task's drawn title, for the action's `aria-describedby`
   * (or `aria-labelledby` with the action's own id), so a "Change" button
   * is heard as "Change" for "Season" out of the list too.
   */
  titleId: string;
};

/** One task of a `TaskList`. */
export type TaskListItem = {
  /** Unique within the list; the row's React key. */
  id: string;
  title: string;
  /** One muted line under the title: what is done, or what is left. */
  detail?: string;
  status: TaskListStatus;
  /**
   * A control at the row's end, such as a small `Button`. A function gets
   * the title's id to name or describe the control by its task.
   */
  action?: ReactNode | ((context: TaskListActionContext) => ReactNode);
};
