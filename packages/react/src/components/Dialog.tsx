'use client';

import {
  useEffect,
  useId,
  useRef,
  type DialogHTMLAttributes,
  type PointerEvent,
  type ReactNode,
} from 'react';

import { cx } from '../class-names.js';
import { spacingClassNames } from '../spacing-classes.js';
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
  open: boolean;
  onClose: () => void;
  size?: DialogSize;
  title: string;
  children: ReactNode;
};

export function Dialog({
  children,
  className,
  onClose,
  open,
  size = 'md',
  title,
  ...rest
}: DialogProps) {
  const nodeRef = useRef<HTMLDialogElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) {
      return;
    }
    if (open) {
      if (!node.open) {
        node.showModal();
      }
      return;
    }
    if (node.open) {
      node.close();
    }
  }, [open]);

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
      onClose={onClose}
      onPointerDown={(event: PointerEvent<HTMLDialogElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const inside =
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom;
        if (!inside) {
          onClose();
        }
      }}
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
