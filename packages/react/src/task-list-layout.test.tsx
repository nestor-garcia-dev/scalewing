import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { TaskList } from './components/TaskList.js';
import { cssTaskListClasses } from './css/css-task-list.js';

afterEach(() => cleanup());

const items = [
  { id: 'season', title: 'Season', status: 'done' as const },
  { id: 'herd', title: 'Count the herd', status: 'next' as const },
  { id: 'feed', title: 'Order the feed', status: 'todo' as const },
  { id: 'vet', title: 'Book the vet', status: 'waiting' as const },
];

function markers(): string[] {
  return [...document.querySelectorAll('.sw-task-list-marker')].map(
    (marker) => marker.textContent ?? '',
  );
}

describe('TaskList numbered and actionBelow', () => {
  it('numbers the open tasks by their place, keeping the check and the lock, without changing names', () => {
    render(<TaskList items={items} label="Get ready" numbered />);
    const list = screen.getByRole('list', { name: 'Get ready' });
    expect(list.className).toBe('sw-task-list sw-task-list-numbered');
    expect(markers()).toEqual(['', '2', '3', '']);
    for (const marker of document.querySelectorAll('.sw-task-list-marker'))
      expect(marker.getAttribute('aria-hidden')).toBe('true');
    expect(screen.getAllByRole('listitem')[1]?.textContent).toContain(
      'Count the herd, Next',
    );
  });

  it('draws no numbers by default', () => {
    render(<TaskList items={items} label="Get ready" />);
    expect(markers()).toEqual(['', '', '', '']);
  });

  it('puts the actions under the words below the breakpoint, and fails closed on an unknown one', () => {
    render(
      <TaskList
        actionBelow="md"
        items={items.map((item) => ({
          ...item,
          action: <button>Open</button>,
        }))}
        label="Get ready"
      />,
    );
    expect(screen.getByRole('list', { name: 'Get ready' }).className).toBe(
      'sw-task-list sw-task-list-action-below-md',
    );
    expect(() =>
      render(
        <TaskList
          // @ts-expect-error a breakpoint TaskList does not take
          actionBelow="xl"
          items={items}
          label="Get ready"
        />,
      ),
    ).toThrow(RangeError);
  });

  it('generates the numbered markers and the stacked actions', () => {
    const css = cssTaskListClasses();
    expect(css).toContain(
      '.sw-task-list-numbered .sw-task-list-item-next .sw-task-list-marker::after {\n  content: none;',
    );
    expect(css).toMatch(
      /@media not all and \(min-width: 48rem\) \{\s*\.sw-task-list-action-below-md \.sw-task-list-action \{\s*display: flex;\s*flex-basis: calc\(100% - calc\(var\(--sw-space-5\) \+ var\(--sw-space-3\)\)\);/,
    );
    expect(css).toContain(
      '.sw-task-list-action-below-md .sw-task-list-action > * { flex: 1 1 auto; }',
    );
  });
});
