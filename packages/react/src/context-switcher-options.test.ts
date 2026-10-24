import { describe, expect, it } from 'vitest';

import {
  filterSections,
  flatEntries,
  foldWords,
  optionCount,
  switcherSections,
  typeaheadIndex,
} from './components/context-switcher/options.js';
import { type ContextSwitcherGroup } from './components/context-switcher/types.js';

const groups: ContextSwitcherGroup[] = [
  { id: 'a', options: [{ id: 'all', label: 'All stations' }] },
  {
    id: 'b',
    label: 'Yours',
    options: [
      { id: 'heron', label: 'Heron Marsh', detail: 'Warden' },
      { id: 'hare', label: 'Hare Down' },
      { id: 'bay', label: 'Bayside', detail: 'Árbol team' },
      { id: 'beech', label: 'Beech Wood' },
    ],
  },
];

const sections = switcherSections('list', groups);
const entries = flatEntries(sections);

describe('ContextSwitcher options', () => {
  it('gives every option a stable id from its place in the full list', () => {
    expect(entries.map((entry) => entry.domId)).toEqual([
      'list-option-0',
      'list-option-1',
      'list-option-2',
      'list-option-3',
      'list-option-4',
    ]);
    const filtered = flatEntries(filterSections(sections, 'bay'));
    expect(filtered.map((entry) => entry.domId)).toEqual(['list-option-3']);
    expect(optionCount(groups)).toBe(5);
  });

  it('folds case and accents', () => {
    expect(foldWords('Árbol ÉTÉ')).toBe('arbol ete');
  });

  it('matches the label or the detail anywhere, dropping empty groups', () => {
    expect(filterSections(sections, '  ')).toHaveLength(2);
    const byDetail = filterSections(sections, 'arbol');
    expect(byDetail.map((section) => section.group.id)).toEqual(['b']);
    expect(byDetail[0]?.entries.map((entry) => entry.option.id)).toEqual([
      'bay',
    ]);
    expect(
      flatEntries(filterSections(sections, 'STATIONS')).map(
        (entry) => entry.option.id,
      ),
    ).toEqual(['all']);
    expect(filterSections(sections, 'otter')).toEqual([]);
  });

  it('jumps by typeahead: a word from the current row, a repeated letter onward', () => {
    expect(typeaheadIndex(entries, 'h', 0)).toBe(1);
    expect(typeaheadIndex(entries, 'h', 1)).toBe(2);
    expect(typeaheadIndex(entries, 'hh', 2)).toBe(1);
    expect(typeaheadIndex(entries, 'he', 1)).toBe(1);
    expect(typeaheadIndex(entries, 'bee', 0)).toBe(4);
    expect(typeaheadIndex(entries, 'ba', 4)).toBe(3);
    expect(typeaheadIndex(entries, 'z', 0)).toBe(-1);
    expect(typeaheadIndex([], 'a', 0)).toBe(-1);
  });
});
