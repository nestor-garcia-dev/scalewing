'use client';

import { type KeyboardEvent, useMemo, useRef, useState } from 'react';

import {
  filterSections,
  flatEntries,
  type SwitcherEntry,
  switcherSections,
  typeaheadIndex,
} from './options.js';
import { type ContextSwitcherGroup } from './types.js';

/* How long typed letters build one typeahead word. */
const typeaheadPause = 500;

type SwitcherListOptions = {
  listId: string;
  groups: readonly ContextSwitcherGroup[];
  currentId: string | undefined;
  /** Whether the filter field holds focus (it keeps Home, End and letters). */
  filtering: boolean;
  onChoose: (entry: SwitcherEntry) => void;
};

/** A key that types a letter, not a shortcut or a control key. */
function isPrintable(event: KeyboardEvent): boolean {
  return (
    event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey
  );
}

/**
 * The open popup's list model: the filter's words, the sections left by
 * them, the active row (by its option id, so it stays put while the list
 * changes), and the keys. Arrows move the active row (stopping at the
 * ends), Enter chooses it; in the listbox Home and End go to the ends,
 * Space chooses and letters jump by typeahead; in the filter field those
 * keys edit the words, which make the first match active.
 */
export function useSwitcherList({
  currentId,
  filtering,
  groups,
  listId,
  onChoose,
}: SwitcherListOptions) {
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState(currentId);
  const typed = useRef({ words: '', at: 0 });
  const all = useMemo(() => switcherSections(listId, groups), [listId, groups]);
  const sections = useMemo(() => filterSections(all, query), [all, query]);
  const entries = useMemo(() => flatEntries(sections), [sections]);

  const activeIndex = Math.max(
    entries.findIndex((entry) => entry.option.id === activeId),
    entries.length > 0 ? 0 : -1,
  );
  const active = entries[activeIndex];

  function changeQuery(next: string) {
    setQuery(next);
    setActiveId(flatEntries(filterSections(all, next))[0]?.option.id);
  }

  function moveTo(index: number) {
    const entry = entries[Math.min(Math.max(index, 0), entries.length - 1)];
    if (entry) setActiveId(entry.option.id);
  }

  function typeahead(letter: string) {
    const now = Date.now();
    const words =
      now - typed.current.at > typeaheadPause
        ? letter
        : typed.current.words + letter;
    typed.current = { words, at: now };
    const index = typeaheadIndex(entries, words, activeIndex);
    if (index >= 0) moveTo(index);
  }

  /** Handles a key in the listbox or the filter field; true when it was used. */
  function onListKey(event: KeyboardEvent): boolean {
    // Keys that build a word in an input method are the method's.
    if (event.nativeEvent.isComposing || event.keyCode === 229) return false;
    const typing = Date.now() - typed.current.at <= typeaheadPause;
    switch (event.key) {
      case 'ArrowDown':
        moveTo(activeIndex + 1);
        return true;
      case 'ArrowUp':
        moveTo(activeIndex - 1);
        return true;
      case 'Enter':
        if (active) onChoose(active);
        return true;
      case 'Home':
      case 'End':
        if (filtering) return false;
        moveTo(event.key === 'Home' ? 0 : entries.length - 1);
        return true;
      case ' ':
        if (filtering) return false;
        if (typing) typeahead(' ');
        else if (active) onChoose(active);
        return true;
      default:
        if (filtering || !isPrintable(event)) return false;
        typeahead(event.key);
        return true;
    }
  }

  return {
    active,
    changeQuery,
    entries,
    onListKey,
    query,
    sections,
    setActiveId,
  };
}
