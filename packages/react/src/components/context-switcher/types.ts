import { type ReactNode } from 'react';

import { type InlineAlign } from '../../anchored-position.js';
import { type BadgeTone } from '../../css/css-data.js';
import {
  type ContextSwitcherTriggerAppearance,
  type ContextSwitcherWidth,
} from '../../css/css-context-switcher-trigger.js';
import { type NavCountTone } from '../NavCount.js';

/** A short status after an option's words, such as a season's "Live". */
export type ContextSwitcherBadge = { label: string; tone: BadgeTone };

/** One context the person can switch to, such as a workspace or a season. */
export type ContextSwitcherOption = {
  id: string;
  label: string;
  /** A muted line under the label, such as the person's role there. */
  detail?: string;
  /** A decorative mark before the label (a consumer glyph or crest). */
  icon?: ReactNode;
  /** A status Badge after the words, read in the option's name. */
  badge?: ContextSwitcherBadge;
  /**
   * How many things wait there: the shared count pill at the row's end,
   * read in the option's name. A whole number; 0 shows no pill.
   */
  count?: number;
  /** What the count means ("7 need you"), read in place of the number. Needs `count`. */
  countLabel?: string;
  /** The pill's colour, NavCount's tones (`danger` by default). Needs `count`. */
  countTone?: NavCountTone;
};

/** A run of options, under a caption when it has a `label`. */
export type ContextSwitcherGroup = {
  id: string;
  label?: string;
  options: readonly ContextSwitcherOption[];
};

/** A command in the popup's footer, such as "Create a workspace". */
export type ContextSwitcherAction = {
  id: string;
  label: string;
  /** A decorative glyph before the label. */
  icon?: ReactNode;
  onSelect: () => void;
};

/** The filter field over the options, for a long list. */
export type ContextSwitcherFilter = {
  /** The field's name, such as "Find a workspace". */
  label: string;
  placeholder?: string;
  /** Shown, and announced, when nothing matches the typed words. */
  emptyText: string;
  /**
   * The field shows only from this many options (all groups together);
   * 0, the default, always shows it.
   */
  minOptions?: number;
};

export type ContextSwitcherProps = {
  /**
   * What is being switched, such as "Workspace": the start of the
   * trigger's name (then what the trigger shows) and the popup's name.
   */
  label: string;
  /**
   * What the trigger shows, usually the current context (its words, or a
   * mark and words). With `triggerAppearance="icon"` it is a glyph alone,
   * and the name is `label` and the current option's label.
   */
  trigger: ReactNode;
  /**
   * `framed` (default) is the outlined control with a chevron; `text` is
   * the words and a chevron with no fill until hovered or open; `pill` is
   * a rounded outlined pill at label weight with a chevron; `icon` is the
   * glyph alone in a round quiet button, no chevron (a compact rail).
   */
  triggerAppearance?: ContextSwitcherTriggerAppearance;
  /**
   * `full` makes the trigger fill its column, such as a sidebar's top,
   * its content at the start and the chevron at the end; `content` (the
   * default) sizes it to what it shows.
   */
  width?: ContextSwitcherWidth;
  groups: readonly ContextSwitcherGroup[];
  /** The option in use, marked with a check and `aria-selected`. */
  currentId?: string;
  /**
   * Called with the chosen option after the popup closes and focus is back
   * on the trigger. Choosing the current option only closes the popup.
   */
  onSelect: (option: ContextSwitcherOption) => void;
  filter?: ContextSwitcherFilter;
  /** Commands under the options, after a hairline. */
  actions?: readonly ContextSwitcherAction[];
  /** The trigger edge the popup lines up with (start by default). */
  align?: InlineAlign;
};
