import { cleanup } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { habitats, renderShell } from './app-shell.test-support.js';
import {
  type AppShellNavGroup,
  type AppShellNavItem,
} from './components/AppShell.js';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const otter: AppShellNavItem = {
  id: 'otters',
  label: 'Otters',
  href: '/otters',
  icon: <svg />,
};

function group(...items: AppShellNavItem[]): AppShellNavGroup[] {
  return [{ id: 'river', items }];
}

describe('AppShell validation', () => {
  it.each<[string, Parameters<typeof renderShell>[0], string]>([
    [
      'a blank navLabel',
      { navLabel: ' ' },
      'AppShell navLabel must be nonempty',
    ],
    [
      'a blank menu label',
      { labels: { openMenu: 'Open menu', closeMenu: '' } },
      'AppShell labels openMenu and closeMenu are nonempty',
    ],
    ['no groups', { groups: [] }, 'AppShell needs at least one group'],
    [
      'an empty group id',
      { groups: [{ id: ' ', items: [otter] }] },
      'AppShell groups need nonempty ids',
    ],
    [
      'duplicate group ids',
      {
        groups: [
          { id: 'river', items: [otter] },
          { id: 'river', items: [{ ...otter, id: 'voles' }] },
        ],
      },
      'AppShell groups need unique ids',
    ],
    [
      'a blank group label',
      { groups: [{ id: 'river', label: ' ', items: [otter] }] },
      'AppShell group labels are nonempty when given',
    ],
    [
      'a group with no items',
      { groups: [{ id: 'river', items: [] }] },
      'AppShell groups need at least one item',
    ],
    [
      'an empty item id',
      { groups: group({ ...otter, id: '' }) },
      'AppShell items need nonempty ids and labels',
    ],
    [
      'an empty item label',
      { groups: group({ ...otter, label: ' ' }) },
      'AppShell items need nonempty ids and labels',
    ],
    [
      'an item id repeated in another group',
      {
        groups: [
          { id: 'river', items: [otter] },
          { id: 'coast', items: [otter] },
        ],
      },
      'AppShell items need unique ids',
    ],
    [
      'a missing icon',
      { groups: group({ ...otter, icon: null }) },
      'AppShell items need an icon, all the rail shows',
    ],
    [
      'a fractional count',
      { groups: group({ ...otter, count: 1.5 }) },
      'AppShell item counts are whole numbers from 0',
    ],
    [
      'a negative count',
      { groups: group({ ...otter, count: -1 }) },
      'AppShell item counts are whole numbers from 0',
    ],
    [
      'a blank countLabel',
      { groups: group({ ...otter, count: 2, countLabel: ' ' }) },
      'AppShell item countLabel is nonempty and comes with a count',
    ],
    [
      'a countLabel without a count',
      { groups: group({ ...otter, countLabel: '2 to check' }) },
      'AppShell item countLabel is nonempty and comes with a count',
    ],
    [
      'an unknown countTone',
      { groups: group({ ...otter, count: 2, countTone: 'info' as never }) },
      'AppShell item countTone must be one of danger, accent, warning',
    ],
    [
      'a countTone without a count',
      { groups: group({ ...otter, countTone: 'warning' }) },
      'AppShell item countTone comes with a count',
    ],
    [
      'an empty-string icon',
      { groups: group({ ...otter, icon: '' }) },
      'AppShell items need an icon, all the rail shows',
    ],
    [
      'a 0 icon',
      { groups: group({ ...otter, icon: 0 }) },
      'AppShell items need an icon, all the rail shows',
    ],
    [
      'a boolean icon',
      { groups: group({ ...otter, icon: true }) },
      'AppShell items need an icon, all the rail shows',
    ],
  ])('refuses %s', (_, props, message) => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => renderShell(props)).toThrow(new RangeError(message));
  });

  it('accepts the fixture groups, whose counts carry valid tones', () => {
    expect(() => renderShell({ groups: habitats })).not.toThrow();
  });
});
