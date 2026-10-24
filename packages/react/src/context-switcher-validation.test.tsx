import { cleanup } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { renderSwitcher, stations } from './context-switcher.test-support.js';
import { type ContextSwitcherOption } from './components/ContextSwitcher.js';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function withOption(option: Partial<ContextSwitcherOption>) {
  return {
    currentId: undefined,
    groups: [
      { id: 'one', options: [{ id: 'x', label: 'Otter Pool', ...option }] },
    ],
  };
}

describe('ContextSwitcher validation', () => {
  it.each<[string, Parameters<typeof renderSwitcher>[0], string]>([
    ['a blank label', { label: ' ' }, 'ContextSwitcher label must be nonempty'],
    [
      'no trigger',
      { trigger: null },
      'ContextSwitcher needs a trigger to draw',
    ],
    [
      'blank trigger words',
      { trigger: ' ' },
      'ContextSwitcher needs a trigger to draw',
    ],
    [
      'an unknown appearance',
      { triggerAppearance: 'chip' as never },
      'ContextSwitcher triggerAppearance must be one of framed, text, pill, icon',
    ],
    [
      'an unknown width',
      { width: 'wide' as never },
      'ContextSwitcher width must be one of content, full',
    ],
    [
      'an unknown align',
      { align: 'center' as never },
      'ContextSwitcher align must be one of start, end',
    ],
    ['no groups', { groups: [] }, 'ContextSwitcher needs at least one group'],
    [
      'a blank group id',
      {
        groups: [{ id: ' ', options: stations[0]!.options }],
        currentId: undefined,
      },
      'ContextSwitcher groups need nonempty ids',
    ],
    [
      'duplicate group ids',
      {
        groups: [
          { id: 'a', options: [{ id: 'x', label: 'X' }] },
          { id: 'a', options: [{ id: 'y', label: 'Y' }] },
        ],
        currentId: undefined,
      },
      'ContextSwitcher groups need unique ids',
    ],
    [
      'a blank group label',
      {
        groups: [{ id: 'a', label: '', options: [{ id: 'x', label: 'X' }] }],
        currentId: undefined,
      },
      'ContextSwitcher group labels are nonempty when given',
    ],
    [
      'an empty group',
      { groups: [{ id: 'a', options: [] }], currentId: undefined },
      'ContextSwitcher groups need at least one option',
    ],
    [
      'a blank option label',
      withOption({ label: ' ' }),
      'ContextSwitcher options need nonempty ids and labels',
    ],
    [
      'a blank detail',
      withOption({ detail: '' }),
      'ContextSwitcher option details are nonempty when given',
    ],
    [
      'a badge with no words',
      withOption({ badge: { label: ' ', tone: 'success' } }),
      'ContextSwitcher option badges need a label and one of neutral, accent, success, danger, warning',
    ],
    [
      'a badge with an unknown tone',
      withOption({ badge: { label: 'Live', tone: 'info' as never } }),
      'ContextSwitcher option badges need a label and one of neutral, accent, success, danger, warning',
    ],
    [
      'a fractional count',
      withOption({ count: 1.5 }),
      'ContextSwitcher option counts are whole numbers from 0',
    ],
    [
      'a countLabel without a count',
      withOption({ countLabel: '2 to check' }),
      'ContextSwitcher option countLabel is nonempty and comes with a count',
    ],
    [
      'a countTone without a count',
      withOption({ countTone: 'warning' }),
      'ContextSwitcher option countTone is one of danger, accent, warning and comes with a count',
    ],
    [
      'duplicate option ids across groups',
      {
        groups: [
          { id: 'a', options: [{ id: 'x', label: 'X' }] },
          { id: 'b', options: [{ id: 'x', label: 'Y' }] },
        ],
        currentId: undefined,
      },
      'ContextSwitcher options need unique ids',
    ],
    [
      'a currentId naming no option',
      { currentId: 'otter' },
      'ContextSwitcher currentId must name one of its options',
    ],
    [
      'a filter without empty words',
      { filter: { label: 'Find', emptyText: ' ' } },
      'ContextSwitcher filter needs a label and an emptyText',
    ],
    [
      'a blank placeholder',
      { filter: { label: 'Find', emptyText: 'None', placeholder: '' } },
      'ContextSwitcher filter placeholder is nonempty when given',
    ],
    [
      'a negative minOptions',
      { filter: { label: 'Find', emptyText: 'None', minOptions: -1 } },
      'ContextSwitcher filter minOptions is a whole number from 0',
    ],
    [
      'a blank action label',
      { actions: [{ id: 'a', label: '', onSelect: () => undefined }] },
      'ContextSwitcher actions need nonempty ids and labels',
    ],
    [
      'duplicate action ids',
      {
        actions: [
          { id: 'a', label: 'New', onSelect: () => undefined },
          { id: 'a', label: 'Join', onSelect: () => undefined },
        ],
      },
      'ContextSwitcher actions need unique ids',
    ],
  ])('refuses %s', (_, props, message) => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => renderSwitcher(props)).toThrow(new RangeError(message));
  });
});
