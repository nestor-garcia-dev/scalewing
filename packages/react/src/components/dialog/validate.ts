import { type Breakpoint } from '../../css/breakpoints.js';
import {
  type DialogAppearance,
  dialogAppearances,
} from '../../css/css-dialog-banded.js';
import {
  type DialogPlacement,
  dialogPlacements,
} from '../../css/css-dialog-end.js';
import {
  type ThemeCanvas,
  themeCanvases,
} from '../../css/css-canvas-grouped.js';
import {
  type ActionBarSummary,
  assertActionBarSummary,
} from '../action-bar/ActionBarSummary.js';

export const dialogSizes = ['md', 'lg', 'xl'] as const;

/**
 * `md` is the reading width (32rem) for a message or a short form; `lg`
 * (56rem) holds a row of six fields or a data grid without folding it;
 * `xl` (65rem) holds a grid of six count columns with its labels and total.
 */
export type DialogSize = (typeof dialogSizes)[number];

/** `alertdialog` for a dialog that interrupts to warn, such as an idle sign-out. */
export type DialogRole = 'dialog' | 'alertdialog';

const dialogRoles: readonly DialogRole[] = ['dialog', 'alertdialog'];

function oneOf(values: readonly unknown[], value: unknown, prop: string) {
  if (!values.includes(value))
    throw new RangeError(`Unknown Dialog ${prop}: ${String(value)}`);
}

export type DialogChecks = {
  size: DialogSize;
  role: DialogRole | undefined;
  description: string | undefined;
  summary: ActionBarSummary | undefined;
  appearance: DialogAppearance;
  canvas: ThemeCanvas;
  sheetBelow: Breakpoint | undefined;
  sheetGrabber: boolean;
  placement: DialogPlacement;
};

export function assertDialogProps({
  appearance,
  canvas,
  description,
  placement,
  role,
  sheetBelow,
  sheetGrabber,
  size,
  summary,
}: DialogChecks): void {
  oneOf(dialogSizes, size, 'size');
  oneOf(dialogAppearances, appearance, 'appearance');
  oneOf(themeCanvases, canvas, 'canvas');
  oneOf(dialogPlacements, placement, 'placement');
  if (role !== undefined) oneOf(dialogRoles, role, 'role');
  if (
    description !== undefined &&
    (typeof description !== 'string' || !description.trim())
  )
    throw new RangeError('Dialog description must not be empty');
  if (sheetGrabber && !sheetBelow)
    throw new RangeError('Dialog sheetGrabber needs sheetBelow');
  if (summary) assertActionBarSummary(summary);
}
