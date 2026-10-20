import type { StepProps } from './Step.js';
import {
  stepHeadingLevels,
  type StepHeadingLevel,
  stepStatuses,
} from './step-status.js';

/**
 * Fails closed on a step it cannot draw: a blank title, reason or title
 * detail, an unknown status or heading level, or an Edit with no words.
 */
export function assertStep(props: StepProps, level: StepHeadingLevel): void {
  if (!props.title.trim()) throw new RangeError('Step title must not be empty');
  if (!(stepStatuses as readonly unknown[]).includes(props.status))
    throw new RangeError(`Unknown Step status: ${String(props.status)}`);
  if (!stepHeadingLevels.includes(level))
    throw new RangeError('Step headingLevel must be 2, 3 or 4');
  if (props.onEdit && !props.editLabel?.trim())
    throw new RangeError('Step onEdit needs an editLabel');
  if (props.skippedReason !== undefined && !props.skippedReason.trim())
    throw new RangeError('Step skippedReason must not be empty');
  if (props.titleDetail !== undefined && !props.titleDetail.trim())
    throw new RangeError('Step titleDetail must not be empty');
}
