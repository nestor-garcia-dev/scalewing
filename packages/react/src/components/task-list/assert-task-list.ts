import {
  isTaskListStatus,
  type TaskListLabels,
  taskListStatuses,
} from './task-list-status.js';
import type { TaskListItem } from './task-list-item.js';

function isBlank(value: unknown): boolean {
  return typeof value !== 'string' || !value.trim();
}

function assertItem(item: TaskListItem, ids: Set<string>): void {
  if (isBlank(item.id))
    throw new RangeError('TaskList item id must not be empty');
  if (ids.has(item.id))
    throw new RangeError(`TaskList item ids must be unique: ${item.id}`);
  ids.add(item.id);
  if (isBlank(item.title))
    throw new RangeError('TaskList item title must not be empty');
  if (item.detail !== undefined && isBlank(item.detail))
    throw new RangeError('TaskList item detail must not be empty');
  if (!isTaskListStatus(item.status))
    throw new RangeError(
      `Unknown TaskList status: ${String(item.status)} (use ${taskListStatuses.join(', ')})`,
    );
}

/**
 * Fails closed on what would leave a task unnamed or unread: a blank list
 * label or status word, a blank or repeated id, a blank title or detail,
 * or an unknown status.
 */
export function assertTaskList(
  label: string,
  items: readonly TaskListItem[],
  labels: TaskListLabels,
): void {
  if (isBlank(label)) throw new RangeError('TaskList label must not be empty');
  if (taskListStatuses.some((status) => isBlank(labels[status])))
    throw new RangeError('TaskList labels must not be empty');
  const ids = new Set<string>();
  for (const item of items) assertItem(item, ids);
}
