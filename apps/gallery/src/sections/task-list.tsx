import {
  Button,
  Card,
  Progress,
  Stack,
  TaskList,
  type TaskListItem,
  type TaskListStatus,
} from '@scalewing/react';
import { useState } from 'react';

import { Section } from '../layout/Section.js';

type SurveyTask = {
  id: string;
  title: string;
  doneDetail: string;
  todoDetail: string;
  start: string;
  /** What a waiting task waits for, while the task before it is not done. */
  waitingDetail?: string;
};

const tasks: SurveyTask[] = [
  {
    id: 'site',
    title: 'The site',
    doneDetail: 'North marsh · by the boardwalk',
    todoDetail: 'Pick where the colony nests',
    start: 'Pick the site',
  },
  {
    id: 'count',
    title: 'The count',
    doneDetail: '12 herons · 4 nests',
    todoDetail: 'Count the herons at dawn',
    start: 'Start counting',
  },
  {
    id: 'photos',
    title: 'Photos',
    doneDetail: '8 photos',
    todoDetail: 'Add a photo of each nest',
    start: 'Add photos',
  },
  {
    id: 'report',
    title: 'Send the report',
    doneDetail: 'Sent to the ranger station',
    todoDetail: 'Ready to send',
    start: 'Send…',
    waitingDetail: 'Needs the count',
  },
  {
    id: 'share',
    title: 'Share with volunteers',
    doneDetail: 'Shared',
    todoDetail: 'Share the report',
    start: 'Share',
    waitingDetail:
      'After sending; last spring’s report stays shared until then',
  },
];

/** The first unfinished task is next; one that needs an earlier task waits. */
function statusOf(index: number, done: number): TaskListStatus {
  if (index < done) return 'done';
  if (index === done) return 'next';
  return tasks[index]!.waitingDetail ? 'waiting' : 'todo';
}

function detailOf(task: SurveyTask, status: TaskListStatus): string {
  if (status === 'done') return task.doneDetail;
  if (status === 'waiting') return task.waitingDetail!;
  return task.todoDetail;
}

/**
 * A heron survey's checklist in a card under its progress: done tasks
 * with a neutral Change, the next one with the page's one primary action,
 * a task to do, and tasks waiting on earlier ones, with no action. Each
 * Change is described by its task's title.
 */
function SurveyChecklist() {
  const [done, setDone] = useState(1);
  const items: TaskListItem[] = tasks.map((task, index) => {
    const status = statusOf(index, done);
    const item: TaskListItem = {
      id: task.id,
      title: task.title,
      detail: detailOf(task, status),
      status,
    };
    if (status === 'done')
      item.action = ({ titleId }) => (
        <Button
          aria-describedby={titleId}
          onPress={() => setDone(index)}
          size="sm"
          variant="neutral"
        >
          Change
        </Button>
      );
    if (status === 'next')
      item.action = (
        <Button onPress={() => setDone(index + 1)} size="sm">
          {task.start}
        </Button>
      );
    return item;
  });
  return (
    <Card padding={4}>
      <Stack gap={3}>
        <Progress
          label="Get the spring survey ready"
          max={tasks.length}
          value={done}
        />
        <TaskList items={items} label="Get the spring survey ready" />
      </Stack>
    </Card>
  );
}

export function TaskListSection() {
  return (
    <Section
      id="task-list"
      purpose="TaskList is a setup checklist: an ordered list of tasks, each with a status marker (done: a check on the success fill; next: an accent ring round a dot; todo: a grey ring; waiting: a muted lock), its title, a muted detail line and an optional action at the row's end that wraps under the words on a narrow column. Each title is read with its status word (English by default, labels takes yours). Scalewing holds no order rules: you set every status and action. Press the next task's action, or Change on a done one."
      title="TaskList"
      usage={`<TaskList
  label="Get the spring survey ready"
  labels={{ done: 'Listo', next: 'Siguiente paso' }}
  items={[
    { id: 'site', title: 'The site', detail: 'North marsh', status: 'done',
      action: ({ titleId }) => (
        <Button size="sm" variant="neutral" aria-describedby={titleId}
          onPress={change}>Change</Button>
      ) },
    { id: 'count', title: 'The count', detail: 'Count the herons at dawn',
      status: 'next',
      action: <Button size="sm" onPress={count}>Start counting</Button> },
    { id: 'report', title: 'Send the report', detail: 'Needs the count',
      status: 'waiting' },
  ]}
/>`}
    >
      <div data-testid="task-list-card">
        <SurveyChecklist />
      </div>
    </Section>
  );
}
