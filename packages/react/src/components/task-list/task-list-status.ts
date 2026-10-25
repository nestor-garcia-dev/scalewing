/** Where a task stands in a checklist. */
export const taskListStatuses = ['done', 'next', 'todo', 'waiting'] as const;

export type TaskListStatus = (typeof taskListStatuses)[number];

/** The status words assistive technology hears after each task's title. */
export type TaskListLabels = Record<TaskListStatus, string>;

export const defaultTaskListLabels: TaskListLabels = {
  done: 'Done',
  next: 'Next step',
  todo: 'To do',
  waiting: 'Waiting',
};

export function isTaskListStatus(value: unknown): value is TaskListStatus {
  return (taskListStatuses as readonly unknown[]).includes(value);
}

/** The words read for one task: its title, a comma, and its status word. */
export function taskSpokenTitle(
  title: string,
  status: TaskListStatus,
  labels: TaskListLabels,
): string {
  return `${title}, ${labels[status]}`;
}

/** The consumer's words over the English ones; a word left out or `undefined` stays English. */
export function taskListWords(
  labels: Partial<TaskListLabels> | undefined,
): TaskListLabels {
  return {
    done: labels?.done ?? defaultTaskListLabels.done,
    next: labels?.next ?? defaultTaskListLabels.next,
    todo: labels?.todo ?? defaultTaskListLabels.todo,
    waiting: labels?.waiting ?? defaultTaskListLabels.waiting,
  };
}
