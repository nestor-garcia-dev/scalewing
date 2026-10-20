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
  type StepHeadingLevel,
  type StepStatus,
  stepStatusWord,
  stepTakesFocus,
} from './step-status.js';
import { assertStep } from './assert-step.js';
import { StepPlaceContext } from './steps-context.js';
import { StepTitleLine } from './StepTitleLine.js';
import { StepTitleWords } from './StepTitleWords.js';

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
  /**
   * Muted words after an open step's title, on its line, such as
   * "Optional" or "Wetlands done · Woodlands empty". Drawn while the step
   * is open (current or error, or any step of an open list) and outside
   * the heading, so the heading and the region keep the title's name; an
   * open list's region is described by them.
   */
  titleDetail?: string;
  /** Overrides the list's heading level for this step's title. */
  headingLevel?: StepHeadingLevel;
  /** The step's fields, shown while it is current or in error, or always in an open list. */
  children?: ReactNode;
};

/**
 * Moves focus to the heading when the step becomes current from a folded
 * state, unless an earlier step of the list already took it in this commit
 * (effects run in list order, so the first one wins; the claim is released
 * after the flush). In an open list nothing folds or opens, so focus stays
 * where the person put it.
 */
function useFocusWhenOpened(
  status: StepStatus,
  heading: RefObject<HTMLHeadingElement | null>,
  focusClaimRef: RefObject<boolean>,
  open: boolean,
) {
  const previous = useRef<StepStatus | undefined>(undefined);
  useEffect(() => {
    if (
      !open &&
      stepTakesFocus(previous.current, status) &&
      !focusClaimRef.current
    ) {
      focusClaimRef.current = true;
      heading.current?.focus();
      // One commit's effects run in one flush: release the claim after it,
      // whichever component re-rendered.
      queueMicrotask(() => {
        focusClaimRef.current = false;
      });
    }
    previous.current = status;
  }, [status, heading, focusClaimRef, open]);
}

/**
 * One step of a `Steps` list: a numbered marker, the title as a heading,
 * and, by status, its fields (current, error) or one folded line (a done
 * step's summary and Edit; an upcoming or skipped step's title alone). In
 * an open list every step shows its fields, inside a region named by its
 * title. An open step's `titleDetail` is muted words beside its title,
 * outside the heading.
 */
export function Step(props: StepProps) {
  const place = useContext(StepPlaceContext);
  if (!place) throw new RangeError('Step must be a child of Steps');
  const level = props.headingLevel ?? place.headingLevel;
  assertStep(props, level);
  const {
    status,
    title,
    summary,
    onEdit,
    editLabel,
    skippedReason,
    titleDetail,
    children,
  } = props;
  const heading = useRef<HTMLHeadingElement>(null);
  const titleId = useId();
  const editId = useId();
  const detailId = useId();
  useFocusWhenOpened(status, heading, place.focusClaimRef, place.open);

  const Heading = `h${level}` as 'h2' | 'h3' | 'h4';
  const reason = status === 'skipped' ? skippedReason : undefined;
  const word = stepStatusWord(status, place.labels, reason !== undefined);
  const done = status === 'done';
  const shownOpen = place.open || isOpenStep(status);
  const detail = shownOpen ? titleDetail : undefined;
  const headingElement = (
    <Heading ref={heading} className="sw-steps-title" tabIndex={-1}>
      {/* Two calls so the props narrow: a word, or a reason, never both. */}
      {word === null ? (
        <StepTitleWords
          reason={reason}
          title={title}
          titleId={titleId}
          word={null}
        />
      ) : (
        <StepTitleWords title={title} titleId={titleId} word={word} />
      )}
    </Heading>
  );
  const header = (
    <div className="sw-steps-header">
      <span aria-hidden="true" className="sw-steps-marker">
        {status === 'error' ? '!' : done ? null : place.number}
      </span>
      <StepTitleLine
        detail={detail}
        detailId={detailId}
        hasDetail={titleDetail !== undefined}
      >
        {headingElement}
      </StepTitleLine>
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
  );
  const shown = shownOpen && Children.toArray(children).length > 0;
  const content = (
    <>
      {header}
      {shown ? <div className="sw-steps-body">{children}</div> : null}
    </>
  );
  return (
    <li
      aria-current={!place.open && status === 'current' ? 'step' : undefined}
      className={cx('sw-steps-item', `sw-steps-item-${status}`)}
    >
      {place.open ? (
        <section
          aria-describedby={detail ? detailId : undefined}
          aria-labelledby={titleId}
          className="sw-steps-region"
        >
          {content}
        </section>
      ) : (
        content
      )}
    </li>
  );
}
