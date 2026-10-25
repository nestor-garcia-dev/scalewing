'use client';

import { useId, type DialogHTMLAttributes, type ReactNode } from 'react';

import { cx } from '../class-names.js';
import { type Breakpoint } from '../css/breakpoints.js';
import { dialogSheetClass } from '../css/css-dialog.js';
import {
  type DialogAppearance,
  dialogAppearances,
  dialogBandedClass,
} from '../css/css-dialog-banded.js';
import { type ThemeCanvas } from '../css/css-canvas-grouped.js';
import { dialogCanvasClass } from '../css/css-dialog-canvas.js';
import {
  dialogEndClass,
  type DialogPlacement,
  dialogPlacements,
} from '../css/css-dialog-end.js';
import {
  dialogGrabberClass,
  dialogHasGrabberClass,
} from '../css/css-dialog-grabber.js';
import { spacingClassNames } from '../spacing-classes.js';
import { useDialogCloseRequests } from './dialog-close-requests.js';
import { type ActionBarSummary } from './action-bar/ActionBarSummary.js';
import { DialogFooter } from './dialog/DialogFooter.js';
import { DialogTitle } from './dialog/DialogTitle.js';
import {
  assertDialogProps,
  type DialogRole,
  type DialogSize,
  dialogSizes,
} from './dialog/validate.js';
import { Stack } from './Stack.js';

export { dialogAppearances, type DialogAppearance };
export { dialogSizes, type DialogRole, type DialogSize };
export { dialogPlacements, type DialogPlacement };

/**
 * The heading level of the dialog's title. It changes only the element (and
 * so the outline a screen reader reads), never the title's look.
 */
export type DialogTitleLevel = 2 | 3;

export type DialogProps = Omit<
  DialogHTMLAttributes<HTMLDialogElement>,
  'onClose' | 'open' | 'title' | 'children' | 'role'
> & {
  /** Whether the dialog is shown. The element follows it and nothing else. */
  open: boolean;
  /**
   * Asked on every close request: Escape, a backdrop press, a platform close
   * request, or a `<form method="dialog">` submit. Each is prevented, so the
   * element does not close itself. Set `open` to false to close; keep it true
   * (for example while saving) and the dialog stays shown. It is not called
   * when `open` turns false. A consumer `onKeyDown`, `onCancel`, `onSubmit`
   * or `onPointerDown` that prevents the event vetoes that request. It is required: a dialog
   * that must not be dismissed passes a callback that keeps `open` true.
   */
  onClose: () => void;
  size?: DialogSize;
  title: string;
  /**
   * The title's heading level, 3 (an `h3`) by default. Pass 2 when the
   * dialog's own sections are `h3` headings, so they read as parts of the
   * dialog rather than as its peers. The title's style does not change.
   * Any value other than 2 (from an untyped caller) renders an `h3`.
   */
  titleLevel?: DialogTitleLevel;
  /**
   * Below this breakpoint the dialog is a bottom sheet: docked to the
   * bottom edge at the full viewport width, its top corners rounded and its
   * bottom corners square, a strip of backdrop left in view above it, and
   * its bottom padding clearing `env(safe-area-inset-bottom)`. It slides up
   * on open unless reduced motion is asked for. There is no drag: it
   * closes as any dialog does. From the breakpoint up it is the centered
   * dialog, at its `size`.
   */
  sheetBelow?: Breakpoint;
  /**
   * Draws a grabber, a short rounded bar centered at the top edge, while
   * the dialog is a bottom sheet (below `sheetBelow`, which it needs). It
   * only marks the sheet as one: it is hidden from assistive technology
   * and does not drag. It stays at the top while the content scrolls.
   * From the breakpoint up it is not drawn.
   */
  sheetGrabber?: boolean;
  /**
   * The accessible name of a close button, such as "Close". When given, an
   * icon-only ghost button ends the title row and asks `onClose`, like
   * Escape. It is the first control in the dialog, so it takes the focus on
   * open unless a control in the content has `autoFocus`. Left out, the
   * dialog has no close button and its markup is unchanged.
   */
  closeLabel?: string;
  /**
   * A muted line under the title that describes the dialog; it becomes the
   * dialog's accessible description unless `aria-describedby` is given.
   */
  description?: string;
  /** A consumer glyph or tile before the title, hidden from assistive technology. */
  icon?: ReactNode;
  /**
   * The dialog's actions, pinned to its bottom edge under a hairline while
   * the content scrolls: a secondary Cancel and one named primary.
   */
  footer?: ReactNode;
  /**
   * A labelled figure at the start of the footer, as ActionBar's, in a
   * polite live region: "Drawer +$1,000.00 vault −$1,000.00".
   */
  summary?: ActionBarSummary;
  /**
   * One short line in the footer, after the summary and before the
   * actions, in the same polite live region: plain words (muted, caption
   * size), or a `Badge` and a short line in one `span`. Nothing
   * (`undefined`, `null`, `false`, or blank words) leaves it out.
   */
  status?: ReactNode;
  /** `alertdialog` for a warning that interrupts. Default `dialog`. */
  role?: DialogRole;
  /**
   * `banded` draws the dialog on the solid surface with its title row and
   * footer as full-width bands over hairlines, and the close button on a
   * quiet round fill; `glass` (the default) is one frosted panel.
   */
  appearance?: DialogAppearance;
  /**
   * The dialog's fill. `grouped` puts its content on the grouped canvas
   * (the quieter grey `ThemeProvider canvas="grouped"` paints), solid with
   * no blur, so `Card`s inside stand apart; a banded title row and the
   * footer stay on the surface. `default` keeps the appearance's fill.
   */
  canvas?: ThemeCanvas;
  /**
   * `end` makes the dialog a side panel from md up: the window's full
   * height at the inline end (the right, the left in right-to-left), its
   * `size`'s width, square corners and a hairline on its inner edge, with
   * the same title row, close button, scrolling content and footer pinned
   * to the bottom edge. Below md it is the centred dialog, or the bottom
   * sheet with `sheetBelow="md"`. It is the same modal: focus stays inside,
   * Escape and a backdrop press ask `onClose`, and focus returns to the
   * opener on close. `center` (the default) is unchanged.
   */
  placement?: DialogPlacement;
  children: ReactNode;
};

export function Dialog({
  'aria-describedby': describedBy,
  appearance = 'glass',
  canvas = 'default',
  children,
  className,
  closeLabel,
  description,
  footer,
  icon,
  role,
  summary,
  onCancel,
  onClose,
  onKeyDown,
  onPointerDown,
  onSubmit,
  open,
  placement = 'center',
  sheetBelow,
  sheetGrabber = false,
  size = 'md',
  status,
  title,
  titleLevel = 3,
  ...rest
}: DialogProps) {
  assertDialogProps({
    appearance,
    canvas,
    description,
    placement,
    role,
    sheetBelow,
    sheetGrabber,
    size,
    summary,
  });
  const titleId = useId();
  const descriptionId = useId();
  // Nothing, or blank words, leaves the line out, as in ActionBar.
  const hasStatus =
    status !== undefined &&
    status !== null &&
    status !== false &&
    !(typeof status === 'string' && !status.trim());
  const hasFooter = Boolean(footer) || Boolean(summary) || hasStatus;
  const { nodeRef, handlers } = useDialogCloseRequests({
    open,
    onClose,
    onCancel,
    onKeyDown,
    onPointerDown,
    onSubmit,
  });

  return (
    <dialog
      {...rest}
      ref={nodeRef}
      aria-describedby={
        describedBy ?? (description ? descriptionId : undefined)
      }
      aria-labelledby={titleId}
      className={cx(
        'sw-dialog',
        size !== 'md' && `sw-dialog-${size}`,
        sheetBelow && dialogSheetClass(sheetBelow),
        appearance === 'banded' && dialogBandedClass,
        canvas === 'grouped' && dialogCanvasClass,
        sheetGrabber && dialogHasGrabberClass,
        placement === 'end' && dialogEndClass,
        ...spacingClassNames({ padding: 5 }),
        className,
      )}
      role={role === 'alertdialog' ? 'alertdialog' : undefined}
      {...handlers}
    >
      {sheetGrabber ? (
        <span aria-hidden="true" className={dialogGrabberClass} />
      ) : null}
      <Stack gap={4}>
        <DialogTitle
          banded={appearance === 'banded'}
          closeLabel={closeLabel}
          description={description}
          descriptionId={descriptionId}
          icon={icon}
          id={titleId}
          level={titleLevel === 2 ? 2 : 3}
          onClose={onClose}
          title={title}
        />
        {children}
        {hasFooter ? (
          <DialogFooter
            status={hasStatus ? status : undefined}
            summary={summary}
          >
            {footer}
          </DialogFooter>
        ) : null}
      </Stack>
    </dialog>
  );
}
