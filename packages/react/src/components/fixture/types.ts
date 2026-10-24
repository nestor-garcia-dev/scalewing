import { type MouseEvent, type ReactNode } from 'react';

import { type VisibilityBreakpoint } from '../../css/breakpoints.js';
import { type BadgeTone } from '../../css/css-data.js';
import { type FixtureCenterKind } from '../../css/css-fixture.js';

/** One side of a fixture: its name and an optional decorative mark (a crest). */
export type FixtureSide = {
  name: string;
  /** A mark beside the name, on the centre's side; hidden from assistive technology. */
  mark?: ReactNode;
};

/** A status after the row's details, such as "Final" or "To confirm". */
export type FixtureStatus = { label: string; tone: BadgeTone };

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
   * name is what the row shows, in order.
   */
  'aria-label'?: string;
};

export type FixtureGroupProps = {
  /** The run's caption, such as a date and a venue; it names the list. */
  title: string;
  /** The run's FixtureRows. */
  children: ReactNode;
};
