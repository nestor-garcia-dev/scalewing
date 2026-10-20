import { type ReactNode } from 'react';

export type StepTitleLineProps = {
  /** The step's heading. */
  children: ReactNode;
  /** Whether the step has `titleDetail` at all, open or folded. */
  hasDetail: boolean;
  /** The muted words to draw now (an open step's), or none. */
  detail?: string;
  /** Their id, which an open list's region is described by. */
  detailId: string;
};

/**
 * A step's heading and, after it on a line that wraps, its muted
 * `titleDetail` words, outside the heading. The line is there whenever the
 * step has words, drawn or not, so the heading keeps its element (and its
 * focus) as the step opens and folds; a step without words has the bare
 * heading, as before.
 */
export function StepTitleLine({
  children,
  hasDetail,
  detail,
  detailId,
}: StepTitleLineProps) {
  if (!hasDetail) return children;
  return (
    <div className="sw-steps-title-line">
      {children}
      {detail ? (
        <span className="sw-steps-title-detail" id={detailId}>
          {detail}
        </span>
      ) : null}
    </div>
  );
}
