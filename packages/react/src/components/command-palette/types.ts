import { type ReactNode } from 'react';

/** One result or command in the palette. */
export type CommandPaletteItem = {
  id: string;
  label: string;
  /** A muted line under the label, such as where a result lives. */
  detail?: string;
  /** A decorative mark before the label (a consumer glyph or crest). */
  icon?: ReactNode;
  /**
   * Runs once the palette has closed after it was chosen (the consumer set
   * `open` to false from `onOpenChange(false)`), so it can move focus to
   * the page; without that, focus returns to where it was.
   */
  onSelect: () => void;
};

/** A run of items under a caption, such as "Teams" or "Actions". */
export type CommandPaletteGroup = {
  id: string;
  label: string;
  items: readonly CommandPaletteItem[];
};

/** The global shortcut that opens the palette: ⌘K on Apple systems, Ctrl+K elsewhere. */
export const commandPaletteShortcuts = ['mod+k'] as const;
export type CommandPaletteShortcut = (typeof commandPaletteShortcuts)[number];

export type CommandPaletteProps = {
  /** Whether the palette is shown. */
  open: boolean;
  /**
   * Asked to open (the shortcut) or close (Escape, a press outside, the
   * shortcut again, or a chosen item).
   */
  onOpenChange: (open: boolean) => void;
  /** The palette's name and its field's, such as "Search". */
  label: string;
  placeholder?: string;
  /** The field's words; the consumer filters `groups` from them. */
  query: string;
  onQueryChange: (query: string) => void;
  /** The results in groups; a group with no items is not drawn. */
  groups: readonly CommandPaletteGroup[];
  /** Shown, and announced, when no group has an item (and not loading). */
  emptyText: string;
  /** The words announced for the number of items, such as `(n) => \`${n} results\``. */
  countText?: (count: number) => string;
  /** A muted line in the footer, such as how to use the keys. */
  hint?: string;
  /** While true, `loadingText` is shown and announced in place of the empty words. */
  loading?: boolean;
  loadingText?: string;
  /**
   * `'mod+k'` listens on the whole document for ⌘K (Apple) or Ctrl+K
   * (elsewhere) to open the palette, or close it while open; it is left
   * alone while focus is in another text field. `null` or nothing: no
   * shortcut. Give it to one palette per page: two palettes listening for
   * it would both open.
   */
  shortcut?: CommandPaletteShortcut | null;
};

export type CommandPaletteTriggerProps = {
  /** The button's name, such as "Search". Start `placeholder` with its words. */
  label: string;
  /** The words drawn in the search-looking button, such as "Search teams and games". */
  placeholder: string;
  /** The key hint drawn at the end, such as "⌘K" or "Ctrl K"; hidden from assistive technology. */
  shortcutLabel?: string;
  /** The consumer's search glyph (Scalewing has no icon catalog). */
  icon: ReactNode;
  /** An icon-only button, the glyph alone, for a narrow bar. */
  compact?: boolean;
  onPress: () => void;
};
