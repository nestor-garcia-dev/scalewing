import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Button } from './components/Button.js';
import {
  defaultTaskListLabels,
  TaskList,
  type TaskListItem,
  taskListStatuses,
} from './components/TaskList.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(cleanup);

const css = generateStylesheet();

const items: TaskListItem[] = [
  {
    id: 'site',
    title: 'The site',
    detail: 'North marsh · by the boardwalk',
    status: 'done',
    action: (
      <Button onPress={() => {}} size="sm" variant="neutral">
        Change
      </Button>
    ),
  },
  {
    id: 'count',
    title: 'The count',
    detail: 'Count the herons at dawn',
    status: 'next',
    action: (
      <Button onPress={() => {}} size="sm">
        Start counting
      </Button>
    ),
  },
  { id: 'photos', title: 'Photos', status: 'todo' },
  {
    id: 'report',
    title: 'Send the report',
    detail: 'Needs the count',
    status: 'waiting',
  },
];

/** The item's parts assistive technology reads, as their text. */
function exposedText(element: Element): string[] {
  return [...element.querySelectorAll('*')]
    .filter(
      (child) =>
        child.children.length === 0 &&
        !child.closest('[aria-hidden="true"]') &&
        (child.textContent ?? '') !== '',
    )
    .map((child) => child.textContent ?? '');
}

describe('TaskList', () => {
  it('is an ordered list named by its label, one item per task in order', () => {
    render(<TaskList items={items} label="Get the survey ready" />);
    const list = screen.getByRole('list', { name: 'Get the survey ready' });
    expect(list.tagName).toBe('OL');
    // Stated, since Safari drops a bulletless list's role.
    expect(list.getAttribute('role')).toBe('list');
    expect(list.className).toBe('sw-task-list');
    const rows = within(list).getAllByRole('listitem');
    expect(rows.map((row) => row.className)).toEqual([
      'sw-task-list-item sw-task-list-item-done',
      'sw-task-list-item sw-task-list-item-next',
      'sw-task-list-item sw-task-list-item-todo',
      'sw-task-list-item sw-task-list-item-waiting',
    ]);
  });

  it('reads each title, a comma and its status word as one line, then the detail and the action', () => {
    render(<TaskList items={items} label="Get the survey ready" />);
    const rows = screen.getAllByRole('listitem');
    expect(exposedText(rows[0]!)).toEqual([
      'The site, Done',
      'North marsh · by the boardwalk',
      'Change',
    ]);
    expect(exposedText(rows[1]!)).toEqual([
      'The count, Next step',
      'Count the herons at dawn',
      'Start counting',
    ]);
    expect(exposedText(rows[2]!)).toEqual(['Photos, To do']);
    expect(exposedText(rows[3]!)).toEqual([
      'Send the report, Waiting',
      'Needs the count',
    ]);
    // The spoken line is visually hidden; the drawn title and the marker are hidden from assistive technology.
    const title = rows[0]!.querySelector('.sw-task-list-title')!;
    expect(title.querySelector('.sw-sr-only')?.textContent).toBe(
      'The site, Done',
    );
    expect(title.querySelector('[aria-hidden="true"]')?.textContent).toBe(
      'The site',
    );
    expect(
      rows[0]!
        .querySelector('.sw-task-list-marker')
        ?.getAttribute('aria-hidden'),
    ).toBe('true');
  });

  it('takes the consumer status words, any it leaves out staying English', () => {
    render(
      <TaskList
        items={items}
        label="Prepara el censo"
        labels={{ done: 'Listo', next: 'Siguiente paso', todo: 'Pendiente' }}
      />,
    );
    const rows = screen.getAllByRole('listitem');
    expect(
      rows.map((row) => row.querySelector('.sw-sr-only')?.textContent),
    ).toEqual([
      'The site, Listo',
      'The count, Siguiente paso',
      'Photos, Pendiente',
      'Send the report, Waiting',
    ]);
  });

  it('keeps the English word for a label passed as undefined', () => {
    render(
      <TaskList
        items={items}
        label="Prepara el censo"
        labels={{ done: undefined, waiting: 'En espera' }}
      />,
    );
    const rows = screen.getAllByRole('listitem');
    expect(rows[0]!.querySelector('.sw-sr-only')?.textContent).toBe(
      'The site, Done',
    );
    expect(rows[3]!.querySelector('.sw-sr-only')?.textContent).toBe(
      'Send the report, En espera',
    );
  });

  it('draws no action box for an action that renders nothing', () => {
    render(
      <TaskList
        items={[
          { id: 'a', title: 'A', status: 'done', action: () => null },
          { id: 'b', title: 'B', status: 'todo', action: false },
          { id: 'c', title: 'C', status: 'waiting', action: null },
        ]}
        label="Tasks"
      />,
    );
    expect(document.querySelector('.sw-task-list-action')).toBeNull();
  });

  it('draws the detail and the action only when given', () => {
    render(<TaskList items={items} label="Get the survey ready" />);
    const rows = screen.getAllByRole('listitem');
    expect(rows[2]!.querySelector('.sw-task-list-detail')).toBeNull();
    expect(rows[2]!.querySelector('.sw-task-list-action')).toBeNull();
    expect(rows[0]!.querySelector('.sw-task-list-action')?.textContent).toBe(
      'Change',
    );
  });

  it('hands a function action the drawn title id, so the action can be described by its task', () => {
    render(
      <TaskList
        items={[
          {
            id: 'site',
            title: 'The site',
            status: 'done',
            action: ({ titleId }) => (
              <Button
                aria-describedby={titleId}
                onPress={() => {}}
                size="sm"
                variant="neutral"
              >
                Change
              </Button>
            ),
          },
          {
            id: 'count',
            title: 'The count',
            status: 'next',
            action: ({ titleId }) => (
              <Button aria-describedby={titleId} onPress={() => {}} size="sm">
                Change
              </Button>
            ),
          },
        ]}
        label="Get the survey ready"
      />,
    );
    const buttons = screen.getAllByRole('button', { name: 'Change' });
    const describedBy = buttons.map((button) =>
      button.getAttribute('aria-describedby'),
    );
    expect(new Set(describedBy).size).toBe(2);
    expect(document.getElementById(describedBy[0]!)?.textContent).toBe(
      'The site',
    );
    expect(document.getElementById(describedBy[1]!)?.textContent).toBe(
      'The count',
    );
  });

  it('draws an empty list for no tasks', () => {
    render(<TaskList items={[]} label="Nothing yet" />);
    const list = screen.getByRole('list', { name: 'Nothing yet' });
    expect(list.children).toHaveLength(0);
  });

  it('passes the list attributes through and adds the class name', () => {
    render(
      <TaskList
        className="survey"
        data-testid="tasks"
        items={items}
        label="Get the survey ready"
      />,
    );
    expect(screen.getByTestId('tasks').className).toBe('sw-task-list survey');
  });

  it('fails closed on what would leave a task unnamed or unread', () => {
    const one = items[2]!;
    const cases: Array<[string, () => unknown]> = [
      ['label', () => render(<TaskList items={items} label=" " />)],
      [
        'labels',
        () =>
          render(
            <TaskList items={items} label="Tasks" labels={{ done: '' }} />,
          ),
      ],
      [
        'id',
        () => render(<TaskList items={[{ ...one, id: '' }]} label="Tasks" />),
      ],
      ['unique', () => render(<TaskList items={[one, one]} label="Tasks" />)],
      [
        'title',
        () =>
          render(<TaskList items={[{ ...one, title: ' ' }]} label="Tasks" />),
      ],
      [
        'detail',
        () =>
          render(<TaskList items={[{ ...one, detail: '' }]} label="Tasks" />),
      ],
      [
        'status',
        () =>
          render(
            <TaskList
              items={[{ ...one, status: 'later' as never }]}
              label="Tasks"
            />,
          ),
      ],
    ];
    for (const [name, draw] of cases) {
      expect(draw, name).toThrow(RangeError);
      cleanup();
    }
  });

  it('exports its statuses and English words', () => {
    expect(taskListStatuses).toEqual(['done', 'next', 'todo', 'waiting']);
    expect(defaultTaskListLabels).toEqual({
      done: 'Done',
      next: 'Next step',
      todo: 'To do',
      waiting: 'Waiting',
    });
  });
});

describe('TaskList styles', () => {
  it('lists its classes in the generated catalog', () => {
    const catalog = utilityClassCatalog();
    for (const name of [
      'sw-task-list',
      'sw-task-list-item',
      ...taskListStatuses.map((status) => `sw-task-list-item-${status}`),
      'sw-task-list-marker',
      'sw-task-list-body',
      'sw-task-list-title',
      'sw-task-list-detail',
      'sw-task-list-action',
    ])
      expect(catalog).toContain(name);
  });

  it('draws each marker from the semantic colours, a shape per status', () => {
    expect(css).toContain(
      '.sw-task-list-item-done .sw-task-list-marker {\n  background: var(--sw-color-success);',
    );
    expect(css).toContain(
      '.sw-task-list-item-next .sw-task-list-marker {\n  box-shadow: inset 0 0 0 2px var(--sw-color-accent);',
    );
    expect(css).toContain(
      '.sw-task-list-item-todo .sw-task-list-marker {\n  box-shadow: inset 0 0 0 2px var(--sw-color-border);',
    );
    expect(css).toContain(
      '.sw-task-list-item-waiting .sw-task-list-marker {\n  color: var(--sw-color-muted);',
    );
    // The check, the dot and the lock are borders, which forced colours keep.
    expect(css).toMatch(
      /\.sw-task-list-item-done \.sw-task-list-marker::after \{\n {2}border-bottom: 2px solid var\(--sw-color-surface\);/,
    );
    expect(css).toContain(
      '.sw-task-list-item-waiting .sw-task-list-marker::before {\n  border: 2px solid currentColor;',
    );
    // No hex or warning colour: waiting is not work that needs the person.
    const own = css.slice(
      css.indexOf('.sw-task-list {'),
      css.indexOf(
        '.sw-task-list-item-waiting .sw-task-list-title { color: GrayText; }',
      ),
    );
    expect(own).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(own).not.toContain('--sw-color-warning');
  });

  it('keeps every marker in forced colours as borders', () => {
    expect(css).toContain(
      '.sw-task-list-item:not(.sw-task-list-item-waiting) .sw-task-list-marker {\n    border: 2px solid CanvasText;\n    box-shadow: none;\n  }',
    );
    expect(css).toContain(
      '.sw-task-list-item-next .sw-task-list-marker { border-color: Highlight; }',
    );
  });

  it('separates rows with a hairline and wraps a wide action under the words', () => {
    expect(css).toContain(
      '.sw-task-list-item + .sw-task-list-item {\n  border-top: 1px solid var(--sw-color-border);\n}',
    );
    expect(css).toMatch(/\.sw-task-list-item \{[^}]*flex-wrap: wrap;/);
    expect(css).toMatch(/\.sw-task-list-body \{[^}]*min-width: 50%;/);
    expect(css).toMatch(
      /\.sw-task-list-action \{[^}]*margin-inline-start: auto;/,
    );
  });
});
