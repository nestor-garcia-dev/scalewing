'use client';

import { useId, type DialogHTMLAttributes, type ReactNode } from 'react';

import { cx } from '../class-names.js';
import { type Breakpoint } from '../css/breakpoints.js';
import { dialogSheetClass } from '../css/css-dialog.js';
import { spacingClassNames } from '../spacing-classes.js';
import { useDialogCloseRequests } from './dialog-close-requests.js';
import { DialogTitle } from './dialog/DialogTitle.js';
import { Stack } from './Stack.js';

/**
 * `md` is the reading width (32rem) for a message or a short form; `lg`
 * (56rem) holds a row of six fields or a data grid without folding it.
 */
export type DialogSize = 'md' | 'lg';

/**
 * The heading level of the dialog's title. It changes only the element (and
 * so the outline a screen reader reads), never the title's look.
 */
export type DialogTitleLevel = 2 | 3;

export type DialogProps = Omit<
  DialogHTMLAttributes<HTMLDialogElement>,
  'onClose' | 'open' | 'title' | 'children'
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
   * on open unless reduced motion is asked for. There is no drag grabber
   * (and no drag): it closes as any dialog does. From the breakpoint up it
   * is the centered dialog, at its `size`.
   */
  sheetBelow?: Breakpoint;
  /**
   * The accessible name of a close button, such as "Close". When given, an
   * icon-only ghost button ends the title row and asks `onClose`, like
   * Escape. It is the first control in the dialog, so it takes the focus on
   * open unless a control in the content has `autoFocus`. Left out, the
   * dialog has no close button and its markup is unchanged.
   */
  closeLabel?: string;
  children: ReactNode;
};

export function Dialog({
  children,
  className,
  closeLabel,
  onCancel,
  onClose,
  onKeyDown,
  onPointerDown,
  onSubmit,
  open,
  sheetBelow,
  size = 'md',
  title,
  titleLevel = 3,
  ...rest
}: DialogProps) {
  const titleId = useId();
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
      aria-labelledby={titleId}
      className={cx(
        'sw-dialog',
        size === 'lg' && 'sw-dialog-lg',
        sheetBelow && dialogSheetClass(sheetBelow),
        ...spacingClassNames({ padding: 5 }),
        className,
      )}
      {...handlers}
    >
      <Stack gap={4}>
        <DialogTitle
          closeLabel={closeLabel}
          id={titleId}
          level={titleLevel === 2 ? 2 : 3}
          onClose={onClose}
          title={title}
        />
        {children}
      </Stack>
    </dialog>
  );
}
