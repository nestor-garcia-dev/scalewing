'use client';

import {
  Children,
  type ReactNode,
  type RefObject,
  useContext,
  useEffect,
  useId,
  useRef,
} from 'react';

import { cx } from '../../class-names.js';
import { Button } from '../Button.js';
import {
  isOpenStep,
  stepHeadingLevels,
  type StepHeadingLevel,
  type StepStatus,
  stepStatuses,
  stepStatusWord,
  stepTakesFocus,
} from './step-status.js';
import { StepPlaceContext } from './steps-context.js';

export type StepProps = {
  status: StepStatus;
  title: string;
  /** One line beside a done step's title, such as "Cash · $480.00"; truncated. */
  summary?: ReactNode;
  /** Reopens a done step; needs `editLabel`. */
  onEdit?: () => void;
  /** The Edit button's words; its name adds the step's title ("Edit The sale"). */
  editLabel?: string;
  /** Muted words after a skipped step's title, such as "not needed". */
  skippedReason?: string;
  /** Overrides the list's heading level for this step's title. */
  headingLevel?: StepHeadingLevel;
  /** The step's fields, shown while it is current or in error. */
  children?: ReactNode;
};

function assertStep(props: StepProps, level: StepHeadingLevel): void {
  if (!props.title.trim()) throw new RangeError('Step title must not be empty');
  if (!(stepStatuses as readonly unknown[]).includes(props.status))
    throw new RangeError(`Unknown Step status: ${String(props.status)}`);
  if (!stepHeadingLevels.includes(level))
    throw new RangeError('Step headingLevel must be 2, 3 or 4');
  if (props.onEdit && !props.editLabel?.trim())
    throw new RangeError('Step onEdit needs an editLabel');
  if (props.skippedReason !== undefined && !props.skippedReason.trim())
    throw new RangeError('Step skippedReason must not be empty');
}

/**
 * Moves focus to the heading when the step becomes current from a folded
 * state, unless an earlier step of the list already took it in this commit
 * (effects run in list order, so the first one wins; the claim is released
 * after the flush).
 */
function useFocusWhenOpened(
  status: StepStatus,
  heading: RefObject<HTMLHeadingElement | null>,
  focusClaimRef: RefObject<boolean>,
) {
  const previous = useRef<StepStatus | undefined>(undefined);
  useEffect(() => {
    if (stepTakesFocus(previous.current, status) && !focusClaimRef.current) {
      focusClaimRef.current = true;
      heading.current?.focus();
      // One commit's effects run in one flush: release the claim after it,
      // whichever component re-rendered.
      queueMicrotask(() => {
        focusClaimRef.current = false;
      });
    }
    previous.current = status;
  }, [status, heading, focusClaimRef]);
}

/**
 * One step of a `Steps` list: a numbered marker, the title as a heading,
 * and, by status, its fields (current, error) or one folded line (a done
 * step's summary and Edit; an upcoming or skipped step's title alone).
 */
export function Step(props: StepProps) {
  const place = useContext(StepPlaceContext);
  if (!place) throw new RangeError('Step must be a child of Steps');
  const level = props.headingLevel ?? place.headingLevel;
  assertStep(props, level);
  const { status, title, summary, onEdit, editLabel, skippedReason, children } =
    props;
  const heading = useRef<HTMLHeadingElement>(null);
  const titleId = useId();
  const editId = useId();
  useFocusWhenOpened(status, heading, place.focusClaimRef);

  const Heading = `h${level}` as 'h2' | 'h3' | 'h4';
  const reason = status === 'skipped' ? skippedReason : undefined;
  const word = stepStatusWord(status, place.labels, reason !== undefined);
  const done = status === 'done';
  return (
    <li
      aria-current={status === 'current' ? 'step' : undefined}
      className={cx('sw-steps-item', `sw-steps-item-${status}`)}
    >
      <div className="sw-steps-header">
        <span aria-hidden="true" className="sw-steps-marker">
          {status === 'error' ? '!' : done ? null : place.number}
        </span>
        <Heading ref={heading} className="sw-steps-title" tabIndex={-1}>
          <span id={titleId}>{title}</span>
          {reason ? (
            <>
              {' '}
              <span className="sw-steps-reason">{reason}</span>
            </>
          ) : null}
          {word ? <span className="sw-sr-only">, {word}</span> : null}
        </Heading>
        {done && summary ? (
          <span className="sw-steps-summary">{summary}</span>
        ) : null}
        {done && onEdit ? (
          <Button
            aria-labelledby={`${editId} ${titleId}`}
            className="sw-steps-edit"
            id={editId}
            onPress={onEdit}
            size="sm"
            variant="ghost"
          >
            {editLabel}
          </Button>
        ) : null}
      </div>
      {isOpenStep(status) && Children.toArray(children).length > 0 ? (
        <div className="sw-steps-body">{children}</div>
      ) : null}
    </li>
  );
}
