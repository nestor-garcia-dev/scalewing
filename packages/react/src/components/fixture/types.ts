import { type MouseEvent, type ReactNode } from 'react';

import { type VisibilityBreakpoint } from '../../css/breakpoints.js';
import { type BadgeTone } from '../../css/css-data.js';
import {
  type FixtureCenterKind,
  type FixtureFlagTone,
} from '../../css/css-fixture.js';

/** One side of a fixture: its name and an optional decorative mark (a crest). */
export type FixtureSide = {
  name: string;
  /** A mark beside the name, on the centre's side; hidden from assistive technology. */
  mark?: ReactNode;
};

/** A status after the row's details, such as "Final" or "To confirm". */
export type FixtureStatus = { label: string; tone: BadgeTone };

/**
 * An issue marker at the row's start, such as a clash: an amber (or red)
 * mark whose `label` is read before the row's name and shown as the mark's
 * tooltip.
 */
export type FixtureFlag = {
  label: string;
  /** `warning` (default) is amber, for something that needs the person; `danger` is red. */
  tone?: FixtureFlagTone;
};

/**
 * A leading checkbox that chooses the row, such as games picked to
 * postpone: its own control before the home side, outside the row's link
 * or button. `label` names it, not drawn ("Select Heron Marsh vs Otter
 * Pool").
 */
export type FixtureSelect = {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
};

export type FixtureRowProps = {
  home: FixtureSide;
  away: FixtureSide;
  /** What sits between the sides: a kickoff time ("8:00") or a score ("2–1"). */
  center: string;
  /**
   * `time` (default) draws the centre as a small grey chip; `score` as
   * bold figures. Both are tabular, so the rows' centres line up.
   */
  centerKind?: FixtureCenterKind;
  /** Details at the row's end, such as the field; under the sides below `md`. */
  meta?: ReactNode;
  /** Hides `meta` below this breakpoint (`md` or `lg`), such as a field a phone leaves out. */
  metaHideBelow?: VisibilityBreakpoint;
  status?: FixtureStatus;
  /** A named issue marker at the row's start, on the home side. */
  flag?: FixtureFlag;
  /**
   * A control after the row, such as a small neutral `Button` ("Move"):
   * outside the row's link or button, so it is its own target and Tab
   * stop. Name it in your words ("Move Heron Marsh vs Otter Pool").
   */
  action?: ReactNode;
  /**
   * A leading checkbox before the row, outside its press area: the
   * standard 24 px box, a 44 px target on a coarse pointer. Works with `flag`,
   * `action`, `href` and `onPress`.
   */
  select?: FixtureSelect;
  /** Makes the whole row a link to this address. */
  href?: string;
  /**
   * Makes the whole row a button; with `href`, a plain press on the link
   * (main button, no modifier) is handed here for a client router.
   */
  onPress?: (event: MouseEvent<HTMLElement>) => void;
  /**
   * The row's name when it is a link or a button, in the consumer's words
   * ("Heron Marsh with Otter Pool, 8:00"); without it the
   * name is what the row shows, in order. A `flag`'s label is put before
   * these words (", " between them).
   */
  'aria-label'?: string;
};

export type FixtureGroupProps = {
  /** The run's caption, such as a date and a venue; it names the list. */
  title: string;
  /** The run's FixtureRows. */
  children: ReactNode;
};
