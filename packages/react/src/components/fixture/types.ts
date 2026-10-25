import { type MouseEvent, type ReactNode, type Ref } from 'react';

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

/** Which side's score box: the home side's (first) or the away side's. */
export type FixtureScoreSide = 'home' | 'away';

/** One side's score box. */
export type FixtureScoreBox = {
  /** The box's digits, as typed ("" while empty); at most two. */
  value: string;
  /** Names the box, such as the side's name ("Heron Marsh"); not drawn. */
  label: string;
  /** The box's input, such as to focus it after a save. */
  ref?: Ref<HTMLInputElement>;
  /**
   * Marks this box invalid. Without it, an `error` marks both boxes;
   * `false` keeps this one unmarked, such as the box that is filled when
   * the other is empty.
   */
  invalid?: boolean;
};

/**
 * Two score boxes in the row's middle, typed by keyboard: the home side's
 * and the away side's, digits only, in a group named by `label`.
 */
export type FixtureScore = {
  /** Names the boxes' group ("Score, Heron Marsh v Otter Pool"); not drawn. */
  label: string;
  home: FixtureScoreBox;
  away: FixtureScoreBox;
  /** A box's digits changed: non-digits are dropped before this is called. */
  onChange: (side: FixtureScoreSide, value: string) => void;
  /** Enter in either box: record the score. */
  onSubmit: () => void;
  /** Escape in either box: put the boxes back, such as to the saved score. */
  onCancel?: () => void;
  /** Both boxes shown and locked, such as a game not played yet. */
  disabled?: boolean;
  /**
   * What is wrong ("Type both scores."): said politely under the row in the
   * danger ink, describing both boxes, which are marked invalid (see
   * `FixtureScoreBox.invalid`). Empty or absent, nothing is shown.
   */
  error?: string;
};

export type FixtureRowProps = {
  home: FixtureSide;
  away: FixtureSide;
  /**
   * What sits between the sides: a kickoff time ("8:00") or a score
   * ("2–1"). Required unless `score` takes its place.
   */
  center?: string;
  /**
   * Score boxes between the sides in place of `center`, for typing a
   * score: on a row that is not a link or a button (the boxes are their
   * own controls). Works with `flag`, `select`, `action` and `detail`.
   */
  score?: FixtureScore;
  /**
   * `time` (default) draws the centre as a small grey chip; `score` as
   * bold figures. Both are tabular, so the rows' centres line up. It
   * styles `center`, so leave it out with `score`.
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
  /**
   * A full-width part under the row, such as a reason field while a score
   * is changed: in the row's list item, outside its link or button, lined
   * up with the home side's start (after `select`'s box) and reaching the
   * action's end.
   */
  detail?: ReactNode;
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
