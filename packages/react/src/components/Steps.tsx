'use client';

import {
  Children,
  Fragment,
  type HTMLAttributes,
  isValidElement,
  type ReactNode,
  useRef,
} from 'react';

import { cx } from '../class-names.js';
import {
  defaultStepsLabels,
  type StepHeadingLevel,
  stepHeadingLevels,
  type StepsLabels,
} from './steps/step-status.js';
import { StepPlaceContext } from './steps/steps-context.js';

export { Step, type StepProps } from './steps/Step.js';
export type {
  StepHeadingLevel,
  StepsLabels,
  StepStatus,
} from './steps/step-status.js';

export type StepsProps = Omit<HTMLAttributes<HTMLOListElement>, 'children'> & {
  /** The `Step`s, in order; each is numbered by its place. */
  children: ReactNode;
  /** Each step title's heading level; defaults to 2. */
  headingLevel?: StepHeadingLevel;
  /** The status words assistive technology hears after a folded step's title. English by default. */
  labels?: Partial<StepsLabels>;
  /**
   * Every step open: each shows its `children` whatever its status, as a
   * region named by its title, so a form's sections are all filled on one
   * page. The markers still say where each stands. No step is
   * `aria-current` and none takes focus when its status changes. A step's
   * own `headingLevel` still overrides the list's.
   */
  open?: boolean;
};

function assertSteps(labels: StepsLabels, level: StepHeadingLevel): void {
  if (
    Object.values(labels).some(
      (word: unknown) => typeof word !== 'string' || !word.trim(),
    )
  )
    throw new RangeError('Steps labels must not be empty');
  if (!stepHeadingLevels.includes(level))
    throw new RangeError('Steps headingLevel must be 2, 3 or 4');
}

/**
 * A one-page vertical stepper: a form's steps in order, the current one
 * open, the done ones folded to a line with their summary and Edit, the
 * ones ahead greyed, a line joining each marker to the next. With `open`,
 * every step stays open and only its marker follows its status.
 */
export function Steps({
  children,
  className,
  headingLevel = 2,
  labels,
  open = false,
  ...rest
}: StepsProps) {
  const words = { ...defaultStepsLabels, ...labels };
  assertSteps(words, headingLevel);
  const steps = Children.toArray(children).filter(isValidElement);
  // A Fragment would share one number among its steps: pass them directly.
  if (steps.some((step) => step.type === Fragment))
    throw new RangeError('Steps children must be Steps, not a Fragment');
  // The first step to open in a commit claims focus (see Step).
  const focusClaimRef = useRef(false);
  return (
    <ol
      className={cx('sw-steps', open && 'sw-steps-open', className)}
      {...rest}
    >
      {steps.map((step, index) => (
        <StepPlaceContext.Provider
          key={step.key}
          value={{
            number: index + 1,
            headingLevel,
            labels: words,
            focusClaimRef,
            open,
          }}
        >
          {step}
        </StepPlaceContext.Provider>
      ))}
    </ol>
  );
}
