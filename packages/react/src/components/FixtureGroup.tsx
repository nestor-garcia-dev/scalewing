'use client';

import { useId } from 'react';

import { cx } from '../class-names.js';
import { fixtureGroupSides } from '../css/css-fixture-list.js';
import { isOneOf } from '../is-one-of.js';
import { FixtureListContext } from './fixture/fixture-list-context.js';
import { type FixtureGroupProps } from './fixture/types.js';

export type { FixtureGroupProps } from './fixture/types.js';
export { fixtureGroupSides };
export type { FixtureGroupSides } from '../css/css-fixture-list.js';

/**
 * A run of fixtures under a caption, such as a match day at a venue: the
 * caption names a list of FixtureRows, whose columns line up across the
 * run (one grid, each row a subgrid of it). `titleHidden` keeps the
 * caption as the list's name without drawing it. `sides="fixed"` keeps the
 * centre at one place across the runs of a page. A blank title or an unknown
 * `sides` throws a `RangeError`.
 */
export function FixtureGroup({
  children,
  sides = 'fluid',
  title,
  titleHidden = false,
}: FixtureGroupProps) {
  if (typeof title !== 'string' || !title.trim())
    throw new RangeError('FixtureGroup title must be nonempty');
  if (!isOneOf(fixtureGroupSides, sides))
    throw new RangeError(`Unknown FixtureGroup sides: ${String(sides)}`);
  const titleId = useId();
  return (
    <div className="sw-fixture-group">
      {/* Hidden, the caption leaves the layout but still names the list. */}
      <div
        className={titleHidden ? 'sw-sr-only' : 'sw-fixture-group-title'}
        id={titleId}
      >
        {title}
      </div>
      {/* role="list" keeps the list a list where list-style: none drops it (Safari). */}
      <ul
        aria-labelledby={titleId}
        className={cx(
          'sw-fixture-list',
          sides === 'fixed' && 'sw-fixture-list-sides-fixed',
        )}
        role="list"
      >
        <FixtureListContext.Provider value>
          {children}
        </FixtureListContext.Provider>
      </ul>
    </div>
  );
}
