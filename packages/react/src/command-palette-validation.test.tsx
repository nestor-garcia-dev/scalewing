import { cleanup, render } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { results, stubDialogs } from './command-palette.test-support.js';
import {
  CommandPalette,
  type CommandPaletteProps,
} from './components/CommandPalette.js';

beforeAll(stubDialogs);

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function renderWith(props: Partial<CommandPaletteProps>) {
  return render(
    <CommandPalette
      emptyText="Nothing matches"
      groups={results}
      label="Search"
      onOpenChange={() => undefined}
      onQueryChange={() => undefined}
      open
      query=""
      {...props}
    />,
  );
}

const item = { id: 'x', label: 'Otter', onSelect: () => undefined };

describe('CommandPalette validation', () => {
  it.each<[string, Partial<CommandPaletteProps>, string]>([
    [
      'a blank label',
      { label: '' },
      'CommandPalette label and emptyText must be nonempty',
    ],
    [
      'blank empty words',
      { emptyText: ' ' },
      'CommandPalette label and emptyText must be nonempty',
    ],
    [
      'a blank placeholder',
      { placeholder: ' ' },
      'CommandPalette placeholder and hint are nonempty when given',
    ],
    [
      'a blank hint',
      { hint: '' },
      'CommandPalette placeholder and hint are nonempty when given',
    ],
    [
      'loading without words',
      { loading: true },
      'CommandPalette loading needs a nonempty loadingText',
    ],
    [
      'blank loading words',
      { loadingText: ' ' },
      'CommandPalette loading needs a nonempty loadingText',
    ],
    [
      'an unknown shortcut',
      { shortcut: 'ctrl+p' as never },
      'CommandPalette shortcut must be one of mod+k or null',
    ],
    [
      'a group without a caption',
      { groups: [{ id: 'a', label: ' ', items: [item] }] },
      'CommandPalette groups need nonempty ids and labels',
    ],
    [
      'duplicate group ids',
      {
        groups: [
          { id: 'a', label: 'A', items: [] },
          { id: 'a', label: 'B', items: [] },
        ],
      },
      'CommandPalette groups need unique ids',
    ],
    [
      'a blank item label',
      { groups: [{ id: 'a', label: 'A', items: [{ ...item, label: '' }] }] },
      'CommandPalette items need nonempty ids and labels',
    ],
    [
      'a blank detail',
      { groups: [{ id: 'a', label: 'A', items: [{ ...item, detail: ' ' }] }] },
      'CommandPalette item details are nonempty when given',
    ],
    [
      'duplicate item ids across groups',
      {
        groups: [
          { id: 'a', label: 'A', items: [item] },
          { id: 'b', label: 'B', items: [item] },
        ],
      },
      'CommandPalette items need unique ids',
    ],
  ])('refuses %s', (_, props, message) => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => renderWith(props)).toThrow(new RangeError(message));
  });

  it('takes an empty group and a null shortcut', () => {
    expect(() =>
      renderWith({
        groups: [{ id: 'a', label: 'A', items: [] }],
        shortcut: null,
      }),
    ).not.toThrow();
  });
});
