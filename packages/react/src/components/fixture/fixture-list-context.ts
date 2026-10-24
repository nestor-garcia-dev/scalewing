'use client';

import { createContext, useContext } from 'react';

/** Set by FixtureGroup around its list, so a FixtureRow knows it is in one. */
export const FixtureListContext = createContext(false);

/** Fails closed on a FixtureRow outside a FixtureGroup (its `li` needs the list). */
export function useFixtureList(): void {
  if (!useContext(FixtureListContext))
    throw new RangeError('A FixtureRow lives in a FixtureGroup');
}
