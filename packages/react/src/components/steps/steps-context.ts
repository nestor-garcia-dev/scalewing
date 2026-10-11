import { createContext, type RefObject } from 'react';

import { type StepHeadingLevel, type StepsLabels } from './step-status.js';

/**
 * What a `Step` learns from its `Steps`: its number, its heading level, the
 * status words, and the list's focus claim for this commit (the first step
 * to open in a commit takes focus and releases the claim after that
 * commit's effects).
 */
export type StepPlace = {
  number: number;
  headingLevel: StepHeadingLevel;
  labels: StepsLabels;
  focusClaimRef: RefObject<boolean>;
};

/** Null outside `Steps`: a `Step` must be one of a list's steps. */
export const StepPlaceContext = createContext<StepPlace | null>(null);
