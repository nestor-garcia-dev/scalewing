'use client';

import { useId, type DialogHTMLAttributes, type ReactNode } from 'react';

import { cx } from '../class-names.js';
import { spacingClassNames } from '../spacing-classes.js';
import { useDialogCloseRequests } from './dialog-close-requests.js';
import { Stack } from './Stack.js';
import { Text } from './Text.js';

/**
 * `md` is the reading width (32rem) for a message or a short form; `lg`
 * (56rem) holds a row of six fields or a data grid without folding it.
 */
export type DialogSize = 'md' | 'lg';

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
  children: ReactNode;
};

export function Dialog({
  children,
  className,
  onCancel,
  onClose,
  onKeyDown,
  onPointerDown,
  onSubmit,
  open,
  size = 'md',
  title,
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
        ...spacingClassNames({ padding: 5 }),
        className,
      )}
      {...handlers}
    >
      <Stack gap={4}>
        <Text id={titleId} variant="title">
          {title}
        </Text>
        {children}
      </Stack>
    </dialog>
  );
}
