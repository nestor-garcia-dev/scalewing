import { render, type RenderResult } from '@testing-library/react';
import { type Mock, vi } from 'vitest';

import {
  ContextSwitcher,
  type ContextSwitcherGroup,
  type ContextSwitcherProps,
} from './components/ContextSwitcher.js';

/** Field stations: a bare group, then a labelled one with badges and counts. */
export const stations: ContextSwitcherGroup[] = [
  {
    id: 'home',
    options: [
      {
        id: 'all',
        label: 'All stations',
        icon: <svg data-glyph="all" />,
        count: 7,
        countLabel: '7 need you',
        countTone: 'warning',
      },
    ],
  },
  {
    id: 'mine',
    label: 'Stations you run',
    options: [
      {
        id: 'heron',
        label: 'Heron Marsh',
        detail: 'Warden',
        badge: { label: 'Live', tone: 'success' },
      },
      { id: 'pine', label: 'Pine Ridge', detail: 'Ranger' },
      { id: 'bittern', label: 'Bittern Fen', count: 2 },
      { id: 'bay', label: 'Bayside Dunes', detail: 'Árbol team' },
    ],
  },
];

/** The switcher with its required props, and any prop overridden. */
export function renderSwitcher(
  props: Partial<ContextSwitcherProps> = {},
): RenderResult & { onSelect: Mock } {
  const onSelect = vi.fn();
  const view = render(
    <ContextSwitcher
      currentId="heron"
      groups={stations}
      label="Station"
      onSelect={onSelect}
      trigger="Heron Marsh"
      {...props}
    />,
  );
  return { ...view, onSelect };
}
