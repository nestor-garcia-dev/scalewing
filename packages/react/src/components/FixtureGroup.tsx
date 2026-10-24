'use client';

import { useId } from 'react';

import { FixtureListContext } from './fixture/fixture-list-context.js';
import { type FixtureGroupProps } from './fixture/types.js';

export type { FixtureGroupProps } from './fixture/types.js';

/**
 * A run of fixtures under a caption, such as a match day at a venue: the
 * caption names a list of FixtureRows, whose columns line up across the
 * run (one grid, each row a subgrid of it). A blank title throws a
 * `RangeError`.
 */
export function FixtureGroup({ children, title }: FixtureGroupProps) {
  if (typeof title !== 'string' || !title.trim())
    throw new RangeError('FixtureGroup title must be nonempty');
  const titleId = useId();
  return (
    <div className="sw-fixture-group">
      <div className="sw-fixture-group-title" id={titleId}>
        {title}
      </div>
      {/* role="list" keeps the list a list where list-style: none drops it (Safari). */}
      <ul aria-labelledby={titleId} className="sw-fixture-list" role="list">
        <FixtureListContext.Provider value>
          {children}
        </FixtureListContext.Provider>
      </ul>
    </div>
  );
}
