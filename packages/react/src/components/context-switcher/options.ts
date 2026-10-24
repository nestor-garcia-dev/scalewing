import {
  type ContextSwitcherGroup,
  type ContextSwitcherOption,
} from './types.js';

/** An option in list order, with the stable DOM id its row keeps while filtered. */
export type SwitcherEntry = {
  option: ContextSwitcherOption;
  groupId: string;
  /** The row's id under the listbox, from its place in the full list. */
  domId: string;
};

/** A group with the entries left after filtering (none are dropped here). */
export type SwitcherSection = {
  group: ContextSwitcherGroup;
  entries: SwitcherEntry[];
};

/** Words folded for matching: no case and no accents ("Árbol" → "arbol"). */
export function foldWords(words: string): string {
  return words.normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase();
}

/** Every option's entry, in order, each with a DOM id under `listId`. */
export function switcherSections(
  listId: string,
  groups: readonly ContextSwitcherGroup[],
): SwitcherSection[] {
  let place = 0;
  return groups.map((group) => ({
    group,
    entries: group.options.map((option) => ({
      option,
      groupId: group.id,
      domId: `${listId}-option-${place++}`,
    })),
  }));
}

/**
 * The sections whose options match `query` in their label or detail
 * (folded, anywhere in the words); a blank query keeps them all, and a
 * section left with no entries is dropped.
 */
export function filterSections(
  sections: readonly SwitcherSection[],
  query: string,
): SwitcherSection[] {
  const needle = foldWords(query.trim());
  if (!needle) return [...sections];
  return sections
    .map((section) => ({
      group: section.group,
      entries: section.entries.filter(({ option }) =>
        foldWords(`${option.label} ${option.detail ?? ''}`).includes(needle),
      ),
    }))
    .filter((section) => section.entries.length > 0);
}

/** The entries of the sections in list order: what the arrow keys move over. */
export function flatEntries(
  sections: readonly SwitcherSection[],
): SwitcherEntry[] {
  return sections.flatMap((section) => section.entries);
}

/** How many options the groups hold together. */
export function optionCount(groups: readonly ContextSwitcherGroup[]): number {
  return groups.reduce((total, group) => total + group.options.length, 0);
}

/**
 * The entry typeahead lands on: the first whose label starts with `typed`
 * (folded), searching after `from` and wrapping. Repeating one letter
 * ("b", "bb") steps through the labels starting with it. -1 when none.
 */
export function typeaheadIndex(
  entries: readonly SwitcherEntry[],
  typed: string,
  from: number,
): number {
  const folded = foldWords(typed);
  if (!folded || entries.length === 0) return -1;
  const repeated = [...folded].every((letter) => letter === folded[0]);
  const prefix = repeated ? folded[0]! : folded;
  // A fresh word may stay on the current entry; a repeated letter moves on.
  const start = repeated ? from + 1 : Math.max(from, 0);
  for (let step = 0; step < entries.length; step += 1) {
    const index = (start + step) % entries.length;
    if (foldWords(entries[index]!.option.label).startsWith(prefix))
      return index;
  }
  return -1;
}
